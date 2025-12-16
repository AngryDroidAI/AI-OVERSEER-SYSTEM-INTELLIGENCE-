// overseer-backend.js — Overseer Control Backend (ESM-safe, dual-node cluster)
// Runs on port 3042 and connects to Ollama on 11434

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Client } from "ssh2";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3042;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

// -------------------- Cluster Nodes --------------------
// Dual-node cluster: Mythic-Machine (old PC) + Skybox (new PC)
const CLUSTER_NODES = {
  mythic: {
    id: "mythic",
    name: "Mythic-Machine",
    host: process.env.MYTHIC_HOST || "192.168.10.1",
    username: process.env.MYTHIC_USER || "angrydroid",
    password: process.env.MYTHIC_PASS || "",
  },
  skybox: {
    id: "skybox",
    name: "Skybox",
    host: process.env.SKYBOX_HOST || "192.168.10.2",
    username: process.env.SKYBOX_USER || "angrydroid",
    password: process.env.SKYBOX_PASS || "",
  },
};

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// SQLite DB
const DB_PATH =
  process.env.DB_PATH ||
  path.join(__dirname, "database.db");

const db = new sqlite3.Database(`file:${DB_PATH}`, (err) => {
  if (err) console.error("❌ DB open error:", err);
  else console.log(`✅ Memory DB ready at ${DB_PATH}`);
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS memory (
    id TEXT PRIMARY KEY,
    userId TEXT,
    sessionId TEXT,
    context TEXT,
    embeddings TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    messageId TEXT,
    rating INTEGER,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Updated: add nodeId column if not exists (best done via migration in real setup)
  db.run(`CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    agentId TEXT,
    modelId TEXT,
    latencyMs INTEGER,
    tokens INTEGER,
    cost REAL,
    errors INTEGER,
    nodeId TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS fine_tune_jobs (
    id TEXT PRIMARY KEY,
    modelId TEXT,
    dataSource TEXT,
    epochs INTEGER,
    learningRate REAL,
    status TEXT,
    progress REAL,
    error TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reinforcement_scores (
    modelId TEXT PRIMARY KEY,
    score REAL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// -------------------- Health --------------------
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", port: PORT, nodes: Object.keys(CLUSTER_NODES) })
);

// -------------------- Cluster: Node Listing --------------------
app.get("/api/cluster/nodes", (req, res) => {
  res.json(CLUSTER_NODES);
});

// -------------------- Cluster: SSH Exec by Node --------------------
function sshExecOnNode(nodeKey, command) {
  return new Promise((resolve, reject) => {
    const target = CLUSTER_NODES[nodeKey];
    if (!target) return reject(new Error("Node not found"));

    const conn = new Client();

    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          let output = "";

          stream
            .on("data", (data) => (output += data.toString()))
            .stderr.on("data", (data) => (output += data.toString()))
            .on("close", () => {
              conn.end();
              resolve({ node: target.name, output: output.trim() });
            });
        });
      })
      .on("error", (err) => {
        reject(err);
      })
      .connect({
        host: target.host,
        username: target.username,
        password: target.password,
      });
  });
}

app.post("/api/cluster/exec", async (req, res) => {
  const { node, command } = req.body;

  if (!node || !command) {
    return res
      .status(400)
      .json({ error: "node and command are required fields" });
  }

  if (!CLUSTER_NODES[node]) {
    return res.status(404).json({ error: `Unknown node: ${node}` });
  }

  try {
    const result = await sshExecOnNode(node, command);
    res.json(result);
  } catch (err) {
    console.error("Cluster exec error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Cluster: Health Check --------------------
app.get("/api/cluster/health", async (req, res) => {
  const results = {};

  const entries = Object.entries(CLUSTER_NODES);

  await Promise.all(
    entries.map(async ([key, node]) => {
      try {
        const result = await sshExecOnNode(key, "uptime");
        results[key] = {
          status: "online",
          uptime: result.output,
        };
      } catch (err) {
        results[key] = {
          status: "offline",
          error: err.message,
        };
      }
    })
  );

  res.json(results);
});

// -------------------- Memory --------------------
app.post("/api/memory", (req, res) => {
  const { userId, sessionId, context, embeddings } = req.body;
  const id = uuidv4();

  db.run(
    "INSERT INTO memory (id, userId, sessionId, context, embeddings) VALUES (?, ?, ?, ?, ?)",
    [id, userId, sessionId, JSON.stringify(context), JSON.stringify(embeddings)],
    (err) => {
      if (err) {
        console.error("Memory insert error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id });
    }
  );
});

app.get("/api/memory", (req, res) => {
  const { userId, sessionId } = req.query;

  db.get(
    "SELECT * FROM memory WHERE userId = ? AND sessionId = ? ORDER BY timestamp DESC LIMIT 1",
    [userId, sessionId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.json(null);

      res.json({
        ...row,
        context: row.context ? JSON.parse(row.context) : null,
        embeddings: row.embeddings ? JSON.parse(row.embeddings) : null,
      });
    }
  );
});

// -------------------- Feedback --------------------
app.post("/api/feedback", (req, res) => {
  const { messageId, rating, comment } = req.body;
  const id = uuidv4();

  db.run(
    "INSERT INTO feedback (id, messageId, rating, comment) VALUES (?, ?, ?, ?)",
    [id, messageId, rating, comment],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id });
    }
  );
});

app.get("/api/feedback/stats", (req, res) => {
  db.all(
    `SELECT m.modelId,
            SUM(CASE WHEN f.rating > 0 THEN 1 ELSE 0 END) as positive,
            SUM(CASE WHEN f.rating < 0 THEN 1 ELSE 0 END) as negative
     FROM feedback f
     LEFT JOIN metrics m ON f.messageId = m.id
     GROUP BY m.modelId`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// -------------------- Reinforcement --------------------
app.post("/api/reinforce", (req, res) => {
  const { modelId, score } = req.body;

  db.run(
    `INSERT INTO reinforcement_scores (modelId, score)
     VALUES (?, ?)
     ON CONFLICT(modelId)
     DO UPDATE SET score = score + ?, updatedAt = CURRENT_TIMESTAMP`,
    [modelId, score, score],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get("/api/reinforce/scores", (req, res) => {
  db.all(
    "SELECT modelId, score FROM reinforcement_scores ORDER BY score DESC",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const scores = {};
      rows.forEach((row) => (scores[row.modelId] = row.score));

      res.json(scores);
    }
  );
});

// -------------------- Fine-tune (mock) --------------------
app.post("/api/fine-tune", (req, res) => {
  const { modelId, dataSource, epochs, learningRate } = req.body;
  const id = uuidv4();

  const job = {
    id,
    modelId,
    dataSource,
    epochs,
    learningRate,
    status: "queued",
    progress: 0,
    error: null,
  };

  db.run(
    "INSERT INTO fine_tune_jobs (id, modelId, dataSource, epochs, learningRate, status, progress) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, modelId, dataSource, epochs, learningRate, "queued", 0],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      simulateFineTuning(job);
      res.json(job);
    }
  );
});

app.get("/api/fine-tune/status", (req, res) => {
  const { jobId } = req.query;

  db.get("SELECT * FROM fine_tune_jobs WHERE id = ?", [jobId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Job not found" });

    res.json(row);
  });
});

app.post("/api/fine-tune/cancel", (req, res) => {
  const { jobId } = req.body;

  db.run(
    "UPDATE fine_tune_jobs SET status = ?, error = ? WHERE id = ?",
    ["cancelled", "Cancelled by user", jobId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ success: true });
    }
  );
});

function simulateFineTuning(job) {
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    db.run(
      "UPDATE fine_tune_jobs SET status = ?, progress = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [progress < 100 ? "training" : "completed", progress, job.id]
    );

    if (progress >= 100) clearInterval(interval);
  }, 3000);
}

// -------------------- Chat Proxy --------------------
app.post("/api/chat", async (req, res) => {
  const { model, prompt, stream } = req.body;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream }),
    });

    if (!response.ok)
      throw new Error(`Ollama error: ${response.statusText}`);

    res.setHeader("Content-Type", "application/json");

    // node-fetch v3 streams are web streams, no .pipe() directly to res
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error("Chat proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Models --------------------
app.get("/api/models", async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    res.json(data.models || []);
  } catch (err) {
    console.error("Models error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Running models
app.get("/api/models/running", async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/ps`);
    const data = await response.json();
    res.json(data.models || []);
  } catch (err) {
    console.error("Models running error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Vision --------------------
const upload = multer({ dest: UPLOADS_DIR });

app.post("/api/vision", upload.single("file"), async (req, res) => {
  const { prompt } = req.body;
  const filePath = req.file.path;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2-vision:11b",
        prompt: `${prompt}\n[Image: ${filePath}]`,
        stream: false,
      }),
    });

    const data = await response.json();

    fs.unlink(filePath, () => {});
    res.json({ reply: data.response });
  } catch (err) {
    fs.unlink(filePath, () => {});
    console.error("Vision error:", err);
    res.status(500).json({ error: "Vision model not reachable" });
  }
});

// -------------------- SSH (direct, legacy) --------------------
// Still available if you want to hit arbitrary hosts directly
app.post("/api/ssh", (req, res) => {
  const { host, username, password, command } = req.body;

  const conn = new Client();

  conn
    .on("ready", () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          return res.status(500).json({ error: err.message });
        }

        let output = "";

        stream
          .on("data", (data) => (output += data.toString()))
          .stderr.on("data", (data) => (output += data.toString()))
          .on("close", () => {
            conn.end();
            res.json({ output: output.trim() });
          });
      });
    })
    .on("error", (err) => {
      console.error("SSH connection error:", err);
      res.status(500).json({ error: err.message });
    })
    .connect({ host, username, password });
});

// -------------------- Search --------------------
app.get("/api/search", (req, res) => {
  const { q } = req.query;
  res.json({ results: [`Search results for: ${q}`] });
});

// -------------------- Cleanup --------------------
app.get("/api/cleanup", (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: "Error reading uploads" });

    const now = Date.now();

    files.forEach((file) => {
      const filePath = path.join(UPLOADS_DIR, file);

      fs.stat(filePath, (err2, stats) => {
        if (err2) return;

      const ageHours = (now - stats.mtimeMs) / (1000 * 60 * 60);

        if (ageHours > 24) {
          fs.unlink(filePath, () => {});
        }
      });
    });

    res.json({ success: true, message: "Cleanup complete" });
  });
});

// -------------------- Overseer Error Bridge --------------------

// In-memory error log for cockpit
let overseerErrors = [];

function logOverseerError(message) {
  overseerErrors.push({
    id: uuidv4(),
    message,
    timestamp: Date.now()
  });

  // Keep last 50 errors
  if (overseerErrors.length > 50) {
    overseerErrors.shift();
  }
}

// Endpoint for cockpit to poll errors
app.get("/api/overseer/errors", (req, res) => {
  res.json(overseerErrors);
});

// -------------------- Alias Endpoints (Fix Cockpit 404s) --------------------

// Alias for running models (cockpit expects /api/running-models)
app.get("/api/running-models", async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/ps`);
    const data = await response.json();
    res.json(data.models || []);
  } catch (err) {
    const msg = `Running-models backend error: ${err.message}`;
    console.error(msg);
    logOverseerError(msg);
    res.status(500).json({ error: err.message });
  }
});

// Alias for reinforcement scores (cockpit expects /api/reinforcement-scores)
app.get("/api/reinforcement-scores", (req, res) => {
  db.all(
    "SELECT modelId, score FROM reinforcement_scores ORDER BY score DESC",
    (err, rows) => {
      if (err) {
        const msg = `Reinforcement-scores backend error: ${err.message}`;
        console.error(msg);
        logOverseerError(msg);
        return res.status(500).json({ error: err.message });
      }

      const scores = {};
      rows.forEach((row) => (scores[row.modelId] = row.score));

      res.json(scores);
    }
  );
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`🚀 Overseer backend running on http://localhost:${PORT}`);
  console.log(`📜 Memory DB stored at: ${DB_PATH}`);
  console.log(`🤖 Connected to Ollama at: ${OLLAMA_URL}`);
  console.log(
    `🌐 Cluster nodes: ${Object.values(CLUSTER_NODES)
      .map((n) => `${n.name}@${n.host}`)
      .join(", ")}`
  );
});
