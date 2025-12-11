🧠 SYSTEM INTELLIGENCE QUESTIONS

These tap into CPU, memory, disk, network, uptime, and backend heartbeat.

You can ask:

    “What’s the system load right now”

    “How is CPU usage”

    “How much memory is being used”

    “Is the backend responding”

    “How long has the dashboard been running”

    “Any system anomalies”

    “Report system health”

    “Show me the last heartbeat”

    “Is the machine under stress”

🤖 MODEL INTELLIGENCE QUESTIONS

These relate to the active model, model switching, and Ollama status.

Ask:

    “Which model is active”

    “Did the model load correctly”

    “Report the last model error”

    “How long has the model been running”

    “List available models”

    “List running models”

    “Switch to a different model” (if you wired that in)

    “Is the model responding”

🧬 LINEAGE STREAM QUESTIONS

These ask Overseer about system events and capsule history.

Ask:

    “What was the last lineage event”

    “Show me recent system events”

    “What happened at boot”

    “Report the last dashboard initialization”

    “Any warnings in the lineage stream”

🧠 MEMORY WINDOW QUESTIONS

These relate to session memory and stored embeddings.

Ask:

    “Do I have memory for this session”

    “Load my memory”

    “What was the last saved context”

    “Did memory save correctly”

    “Show me the last memory entry”

🔗 DAEMON LINK QUESTIONS

These relate to background tasks, sync loops, and daemon heartbeat.

Ask:

    “Is the daemon online”

    “What is the next task”

    “When was the last sync”

    “Report daemon status”

    “Did any tasks fail”

    “Show me the last daemon heartbeat”

(Once you add /api/task, this becomes extremely powerful.)
🌌 CAPSULE ECOSYSTEM QUESTIONS

These relate to the modules in your constellation.

Ask:

    “Is the Vision module online”

    “Is the Neocities sync channel idle”

    “Is the backup volume mounted”

    “Is the Agent Council active”

    “Are SSH targets online”

    “Report capsule ecosystem status”

🔭 CONSTELLATION SYNC QUESTIONS

These relate to Neocities deployment and index state.

Ask:

    “When was the last deployment”

    “How many files changed”

    “What is the index state”

    “Sync now”

    “Rebuild indexes”

    “Report constellation sync status”

🧰 BACKEND HEALTH QUESTIONS

These relate to DB, API, and backend errors.

Ask:

    “Did the DB open correctly”

    “Report the last backend error”

    “Any API failures”

    “Did vision requests fail”

    “Did SSH commands error”

    “Is the backend healthy”

🔍 SEARCH / UTILITY QUESTIONS

These relate to the /api/search endpoint.

Ask:

    “Search for X”

    “Find references to Y”

    “Show me search results for Z”

🧪 FINE‑TUNE JOB QUESTIONS

These relate to the mock fine‑tuning system.

Ask:

    “Start a fine‑tune job”

    “What is the status of job <id>”

    “Cancel fine‑tune job <id>”

    “List fine‑tune jobs”

    “Report fine‑tune progress”

🧩 REINFORCEMENT / FEEDBACK QUESTIONS

These relate to reinforcement scores and feedback loops.

Ask:

    “Give positive feedback for message <id>”

    “Give negative feedback”

    “Show reinforcement scores”

    “Report model performance”

    “List feedback stats”

🔥 CRASH / ERROR REPORT QUESTIONS

These are the ones you were asking about.

Ask:

    “Did anything crash”

    “Show me the last error”

    “Report system failures”

    “Any model crashes”

    “Any backend crashes”

    “Any DB errors”

    “Any task failures”

    “Generate a crash report” (if we add the endpoint)

    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Overseer Control Center</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    :root {
      --bg-main: #050814;
      --bg-panel: rgba(10, 18, 40, 0.92);
      --bg-panel-soft: rgba(10, 18, 40, 0.8);
      --accent-cyan: #27e5ff;
      --accent-magenta: #ff4fb3;
      --accent-yellow: #ffe066;
      --accent-green: #4dff88;
      --text-primary: #e7f2ff;
      --text-secondary: #9bb0d4;
      --border-glass: rgba(88, 189, 255, 0.35);
      --shadow-glow: 0 0 20px rgba(34, 211, 238, 0.45);
      --shadow-danger: 0 0 20px rgba(255, 76, 96, 0.6);
      --danger: #ff4c60;
      --muted: #6b7a9b;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
      "Segoe UI", sans-serif;
      background: radial-gradient(circle at top, #101734 0, #050814 55%, #02030a 100%);
      color: var(--text-primary);
      height: 100vh;
      overflow: hidden;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(39, 229, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(39, 229, 255, 0.06) 1px, transparent 1px);
      background-size: 40px 40px;
      mix-blend-mode: screen;
      opacity: 0.4;
      pointer-events: none;
      animation: gridMove 60s linear infinite;
    }

    @keyframes gridMove {
      from {
        transform: translate3d(0, 0, 0);
      }
      to {
        transform: translate3d(-40px, -40px, 0);
      }
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 10px 14px;
      gap: 10px;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 12px;
      background: linear-gradient(
        135deg,
        rgba(15, 30, 64, 0.96),
        rgba(7, 14, 34, 0.96)
      );
      border: 1px solid var(--border-glass);
      box-shadow: var(--shadow-glow);
      backdrop-filter: blur(14px);
      position: relative;
      overflow: hidden;
    }

    .top-bar::after {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right,
      rgba(39, 229, 255, 0.25),
      transparent 55%);
      opacity: 0.8;
      pointer-events: none;
    }

    .top-left,
    .top-center,
    .top-right {
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
      z-index: 1;
    }

    .top-left {
      min-width: 260px;
    }

    .overseer-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 20%, #ffffff 0, #27e5ff 20%, #3b1b61 55%, #050814 100%);
      box-shadow: 0 0 25px rgba(39, 229, 255, 0.7);
      position: relative;
      overflow: hidden;
    }

    .overseer-avatar::after {
      content: "";
      position: absolute;
      inset: 5px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 15px rgba(255, 79, 179, 0.6) inset;
      opacity: 0.9;
    }

    .overseer-title-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .overseer-name {
      font-size: 1.2rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-cyan);
    }

    .overseer-subtitle {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-secondary);
      letter-spacing: 0.17em;
    }

    .top-center {
      flex: 1;
      justify-content: center;
      gap: 24px;
      font-size: 0.8rem;
      color: var(--text-secondary);
      flex-wrap: wrap;
    }

    .stat-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 130px;
    }

    .stat-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--muted);
    }

    .stat-value {
      font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .stat-value strong {
      color: var(--accent-cyan);
    }

    .top-right {
      justify-content: flex-end;
      gap: 14px;
      min-width: 280px;
    }

    .pill {
      border-radius: 999px;
      padding: 6px 12px;
      background: rgba(5, 11, 32, 0.9);
      border: 1px solid rgba(88, 189, 255, 0.55);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.73rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--text-secondary);
    }

    .heartbeat {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .heartbeat-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--accent-green);
      box-shadow: 0 0 15px rgba(77, 255, 136, 0.9);
      position: relative;
      overflow: visible;
    }

    .heartbeat-dot::after {
      content: "";
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid rgba(77, 255, 136, 0.5);
      animation: pulse 1.7s infinite;
    }

    .heartbeat-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }

    .heartbeat.offline .heartbeat-dot {
      background: var(--danger);
      box-shadow: var(--shadow-danger);
    }

    .heartbeat.offline .heartbeat-dot::after {
      border-color: rgba(255, 76, 96, 0.6);
      animation: none;
      opacity: 0.7;
    }

    .heartbeat.offline .heartbeat-label {
      color: var(--danger);
    }

    @keyframes pulse {
      0% {
        transform: scale(0.9);
        opacity: 0.9;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.2;
      }
      100% {
        transform: scale(1.0);
        opacity: 0;
      }
    }

    .main-grid {
      display: grid;
      grid-template-columns: 3fr 4fr 3fr;
      grid-template-rows: 1fr;
      gap: 10px;
      flex: 1;
      min-height: 0;
    }

    .panel {
      background: var(--bg-panel);
      border-radius: 12px;
      border: 1px solid var(--border-glass);
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(18px);
      display: flex;
      flex-direction: column;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    .panel-header {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(88, 189, 255, 0.25);
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--muted);
      background: radial-gradient(circle at top left,
        rgba(39, 229, 255, 0.15),
        transparent 60%);
      z-index: 1;
    }

    .panel-header span.title {
      color: var(--accent-cyan);
    }

    .panel-header span.subtitle {
      color: var(--muted);
    }

    .panel-body {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      min-height: 0;
      position: relative;
    }

    .console-log {
      flex: 1;
      background: radial-gradient(circle at top,
        rgba(11, 26, 58, 0.95),
        rgba(3, 8, 19, 0.98));
      border-radius: 8px;
      border: 1px solid rgba(61, 147, 217, 0.6);
      padding: 10px;
      overflow-y: auto;
      font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
      font-size: 0.8rem;
      color: var(--text-secondary);
      box-shadow: 0 0 14px rgba(0, 0, 0, 0.7);
      position: relative;
    }

    .console-log::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: linear-gradient(
        rgba(255, 255, 255, 0.03) 1px,
        transparent 1px
      );
      background-size: 100% 22px;
      opacity: 0.35;
      pointer-events: none;
    }

    .console-entry {
      margin-bottom: 6px;
      position: relative;
      z-index: 1;
    }

    .console-entry.system {
      color: var(--accent-cyan);
    }

    .console-entry.overseer {
      color: var(--accent-magenta);
    }

    .console-timestamp {
      color: var(--muted);
      margin-right: 6px;
      opacity: 0.8;
    }

    .console-role {
      text-transform: uppercase;
      color: var(--accent-cyan);
      margin-right: 6px;
      font-weight: 600;
    }

    .console-input-row {
      display: flex;
      margin-top: 8px;
      gap: 6px;
    }

    .console-input {
      flex: 1;
      border-radius: 999px;
      border: 1px solid rgba(88, 189, 255, 0.85);
      background: radial-gradient(circle at top left,
        rgba(14, 36, 82, 0.9),
        rgba(2, 7, 19, 0.98));
      padding: 8px 12px;
      color: var(--text-primary);
      font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
      font-size: 0.8rem;
      outline: none;
      box-shadow: 0 0 12px rgba(39, 229, 255, 0.3);
    }

    .console-input::placeholder {
      color: var(--muted);
    }

    .btn {
      border-radius: 999px;
      border: 1px solid rgba(39, 229, 255, 0.9);
      padding: 8px 14px;
      background: radial-gradient(circle at top,
        rgba(39, 229, 255, 0.2),
        rgba(6, 16, 36, 0.96));
      color: var(--accent-cyan);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease-out;
    }

    .btn:hover {
      box-shadow: 0 0 18px rgba(39, 229, 255, 0.75);
      transform: translateY(-1px);
    }

    .btn:active {
      transform: translateY(1px) scale(0.98);
      box-shadow: 0 0 10px rgba(39, 229, 255, 0.5);
    }

    .btn.secondary {
      border-color: rgba(155, 176, 212, 0.6);
      color: var(--text-secondary);
      background: radial-gradient(circle at top,
        rgba(155, 176, 212, 0.15),
        rgba(3, 10, 25, 0.98));
    }

    .btn.danger {
      border-color: rgba(255, 76, 96, 0.9);
      color: var(--danger);
      background: radial-gradient(circle at top,
        rgba(255, 76, 96, 0.2),
        rgba(20, 5, 18, 0.98));
      box-shadow: var(--shadow-danger);
    }

    .center-panels {
      display: grid;
      grid-template-rows: 1.2fr 1fr 1fr;
      gap: 8px;
      min-height: 0;
      flex: 1;
    }

    .subpanel {
      border-radius: 8px;
      background: var(--bg-panel-soft);
      border: 1px solid rgba(58, 139, 208, 0.5);
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 0;
      position: relative;
    }

    .subpanel-header {
      font-size: 0.73rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--muted);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .subpanel-header span.label {
      color: var(--accent-cyan);
    }

    .subpanel-header span.hint {
      color: var(--muted);
    }

    .subpanel-body {
      flex: 1;
      min-height: 0;
      overflow: auto;
      font-size: 0.78rem;
    }

    .lineage-entry {
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-secondary);
      font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
    }

    .lineage-entry span.tag {
      display: inline-block;
      min-width: 62px;
      text-align: center;
      border-radius: 999px;
      padding: 1px 6px;
      font-size: 0.67rem;
      text-transform: uppercase;
      letter-spacing: 0.11em;
      color: var(--accent-cyan);
      border: 1px solid rgba(39, 229, 255, 0.7);
      margin-right: 6px;
    }

    .lineage-entry span.time {
      color: var(--muted);
      margin-right: 6px;
    }

    .system-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-top: 4px;
    }

    .system-stat {
      border-radius: 6px;
      background: radial-gradient(circle at top,
        rgba(12, 34, 78, 0.95),
        rgba(3, 8, 19, 0.98));
      border: 1px solid rgba(64, 155, 213, 0.7);
      padding: 5px 7px;
      font-size: 0.72rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .system-stat-label {
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--muted);
    }

    .system-stat-value {
      font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
      color: var(--accent-cyan);
    }

    .ecosystem-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
      margin-top: 4px;
    }

    .ecosystem-tile {
      border-radius: 6px;
      padding: 5px 7px;
      background: radial-gradient(circle at top,
        rgba(39, 229, 255, 0.13),
        rgba(5, 11, 32, 0.98));
      border: 1px solid rgba(52, 157, 219, 0.7);
      font-size: 0.7rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
      position: relative;
      overflow: hidden;
    }

    .ecosystem-tile::before {
      content: "";
      position: absolute;
      top: -40%;
      left: -40%;
      width: 160%;
      height: 90%;
      background: radial-gradient(circle,
        rgba(39, 229, 255, 0.3),
        transparent 60%);
      opacity: 0;
      transition: opacity 0.25s ease-out;
    }

    .ecosystem-tile.active::before {
      opacity: 0.45;
    }

    .ecosystem-title {
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--accent-cyan);
    }

    .ecosystem-status {
      color: var(--muted);
    }

    .right-panels {
      display: grid;
      grid-template-rows: 1.4fr 1fr 1fr;
      gap: 8px;
      min-height: 0;
      flex: 1;
    }

    .memory-list {
      font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: pre-wrap;
    }

    .info-row {
      font-size: 0.76rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }

    .info-row span.label {
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .info-row span.value {
      color: var(--accent-cyan);
      font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
    }

    .bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 12px;
      background: linear-gradient(
        135deg,
        rgba(8, 16, 38, 0.96),
        rgba(3, 7, 19, 0.96)
      );
      border: 1px solid rgba(65, 150, 216, 0.75);
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(14px);
    }

    .bottom-left,
    .bottom-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hint {
      font-size: 0.7rem;
      color: var(--muted);
    }

    @media (max-width: 1200px) {
      .main-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        overflow-y: auto;
      }

      .panel {
        min-height: 260px;
      }

      body {
        overflow: auto;
      }
    }
  </style>
</head>
<body>
<div class="app-shell">
  <header class="top-bar">
    <div class="top-left">
      <div class="overseer-avatar"></div>
      <div class="overseer-title-block">
        <div class="overseer-name">Continuum Overseer</div>
        <div class="overseer-subtitle">
          24/7 system guardian · local daemon intelligence
        </div>
      </div>
    </div>

    <div class="top-center">
      <div class="stat-block">
        <div class="stat-label">Model</div>
        <div class="stat-value">
          <strong id="modelName">ishumilin/deepseek-r1-coder-tools:14b</strong>
        </div>
      </div>

      <!-- Active Model Selector -->
      <div class="stat-block">
        <div class="stat-label">Active Model</div>
        <select id="modelSelector" class="console-input" style="padding:4px 8px; font-size:0.75rem;">
          <option>Loading…</option>
        </select>
      </div>

      <div class="stat-block">
        <div class="stat-label">Uptime</div>
        <div class="stat-value" id="uptimeDisplay">00:00:00</div>
      </div>
      <div class="stat-block">
        <div class="stat-label">Backend</div>
        <div class="stat-value" id="backendStatus">Connecting…</div>
      </div>
    </div>

    <div class="top-right">
      <div class="pill">
        <span>Heartbeat</span>
        <span class="heartbeat" id="heartbeatIndicator">
          <span class="heartbeat-dot"></span>
          <span class="heartbeat-label">online</span>
        </span>
      </div>
      <div class="pill">
        <span>Host</span>
        <span class="value">localhost:3042</span>
      </div>
    </div>
  </header>

  <main class="main-grid">
    <section class="panel">
      <div class="panel-header">
        <span class="title">Overseer console</span>
        <span class="subtitle">dialogue · commands · alerts</span>
      </div>
      <div class="panel-body">
        <div class="console-log" id="consoleLog"></div>
        <div class="console-input-row">
          <input
            type="text"
            class="console-input"
            id="consoleInput"
            placeholder="Type a question, command, or system request for the Overseer…"
          />
          <button class="btn" id="sendButton">Send</button>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <span class="title">System intelligence</span>
        <span class="subtitle">lineage · metrics · capsules</span>
      </div>
      <div class="panel-body">
        <div class="center-panels">
          <div class="subpanel">
            <div class="subpanel-header">
              <span class="label">Lineage stream</span>
              <span class="hint">latest events</span>
            </div>
            <div class="subpanel-body" id="lineageStream">
              <div class="lineage-entry">
                <span class="tag">BOOT</span>
                <span class="time">now</span>
                Overseer dashboard initialized.
              </div>
            </div>
          </div>

          <div class="subpanel">
            <div class="subpanel-header">
              <span class="label">System monitor</span>
              <span class="hint">heartbeat from backend</span>
            </div>
            <div class="subpanel-body">
              <div class="system-stats-grid">
                <div class="system-stat">
                  <div class="system-stat-label">CPU</div>
                  <div class="system-stat-value" id="cpuUsage">–</div>
                </div>
                <div class="system-stat">
                  <div class="system-stat-label">Memory</div>
                  <div class="system-stat-value" id="memoryUsage">–</div>
                </div>
                <div class="system-stat">
                  <div class="system-stat-label">GPU</div>
                  <div class="system-stat-value" id="gpuUsage">–</div>
                </div>
                <div class="system-stat">
                  <div class="system-stat-label">Disk</div>
                  <div class="system-stat-value" id="diskUsage">–</div>
                </div>
                <div class="system-stat">
                  <div class="system-stat-label">Network</div>
                  <div class="system-stat-value" id="netUsage">–</div>
                </div>
                <div class="system-stat">
                  <div class="system-stat-label">Status</div>
                  <div class="system-stat-value" id="systemStatus">Awaiting health check…</div>
                </div>
              </div>
            </div>
          </div>

          <div class="subpanel">
            <div class="subpanel-header">
              <span class="label">Capsule ecosystem</span>
              <span class="hint">shrines · tools · agents</span>
            </div>
            <div class="subpanel-body">
              <div class="ecosystem-grid" id="ecosystemGrid">
                <div class="ecosystem-tile active">
                  <div class="ecosystem-title">AI Lab</div>
                  <div class="ecosystem-status">Overseer dashboard · online</div>
                </div>
                <div class="ecosystem-tile">
                  <div class="ecosystem-title">Neocities</div>
                  <div class="ecosystem-status">Sync channel · idle</div>
                </div>
                <div class="ecosystem-tile">
                  <div class="ecosystem-title">Agent Council</div>
                  <div class="ecosystem-status">Multi-agent UI · pending link</div>
                </div>
                <div class="ecosystem-tile">
                  <div class="ecosystem-title">Vision</div>
                  <div class="ecosystem-status">llama3.2-vision:11b · on demand</div>
                </div>
                <div class="ecosystem-tile">
                  <div class="ecosystem-title">Backups</div>
                  <div class="ecosystem-status">SQLite on 2TB volume</div>
                </div>
                <div class="ecosystem-tile">
                  <div class="ecosystem-title">SSH Targets</div>
                  <div class="ecosystem-status">Remote hosts · offline</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <span class="title">Overseer mind</span>
        <span class="subtitle">memory · daemon · sync</span>
      </div>
      <div class="panel-body">
        <div class="right-panels">

          <div class="subpanel">
            <div class="subpanel-header">
              <span class="label">Memory window</span>
              <span class="hint">last saved session</span>
            </div>
            <div class="subpanel-body">
              <div class="memory-list" id="memoryView">
                No memory loaded yet. Send a message to start a session and then pull memory.
              </div>
            </div>
          </div>

          <div class="subpanel">
            <div class="subpanel-header">
              <span class="label">Daemon link</span>
              <span class="hint">local 24/7 process</span>
            </div>
            <div class="subpanel-body">
              <div class="info-row">
                <span class="label">Status</span>
                <span class="value" id="daemonStatus">Unknown</span>
              </div>
              <div class="info-row">
                <span class="label">Last heartbeat</span>
                <span class="value" id="daemonLastHeartbeat">–</span>
              </div>
              <div class="info-row">
                <span class="label">Last sync</span>
                <span class="value" id="daemonLastSync">–</span>
              </div>
              <div class="info-row">
                <span class="label">Next task</span>
                <span class="value" id="daemonNextTask">–</span>
              </div>
              <div style="margin-top:8px; display:flex; gap:6px;">
                <button class="btn secondary" id="refreshDaemonBtn">Refresh</button>
                <button class="btn danger" id="restartDaemonBtn">Restart</button>
              </div>
            </div>
          </div>

          <div class="subpanel">
            <div class="subpanel-header">
              <span class="label">Constellation sync</span>
              <span class="hint">Neocities · indexes · assets</span>
            </div>
            <div class="subpanel-body">
              <div class="info-row">
                <span class="label">Last deployment</span>
                <span class="value" id="lastDeploy">–</span>
              </div>
              <div class="info-row">
                <span class="label">Files changed</span>
                <span class="value" id="filesChanged">–</span>
              </div>
              <div class="info-row">
                <span class="label">Index state</span>
                <span class="value" id="indexState">–</span>
              </div>
              <div style="margin-top:8px; display:flex; gap:6px;">
                <button class="btn" id="syncNowBtn">Sync now</button>
                <button class="btn secondary" id="rebuildIndexBtn">Rebuild indexes</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>

  <footer class="bottom-bar">
    <div class="bottom-left">
      <button class="btn secondary" id="cleanupBtn">Cleanup uploads</button>
      <button class="btn secondary" id="modelsBtn">List models</button>
      <button class="btn secondary" id="pullMemoryBtn">Pull memory</button>
    </div>
    <div class="bottom-right">
      <span class="hint">Overseer backend at http://localhost:3042 · SQLite on external 2TB volume</span>
    </div>
  </footer>
</div>

<script>
  const BACKEND_URL = "http://localhost:3042";

  // Default active model
  let activeModel = "ishumilin/deepseek-r1-coder-tools:14b";

  // Full model list (local + cloud + GGUF + experimental)
  const FALLBACK_MODELS = [
    "mistral-large-3:675b-cloud",
    "deepseek-v3.2:cloud",
    "qwen3-next:80b-cloud",
    "ALIENTELLIGENCE/stressmoodmentalhealthsupport:latest",
    "NeuroEquality/neuralquantum-coder:latest",
    "llama3-groq-tool-use:8b",
    "gurubot/GLM-4.6V-Flash-GGUF:Q4_K_M",
    "glm-4.6:cloud",
    "sam860/granite-4.0:7b",
    "granite4:latest",
    "granite-code:3b",
    "granite3.2-vision:2b",
    "granite3.3:8b",
    "ALIENTELLIGENCE/multiagentv2:latest",
    "nehcgs/Arch-Agent:1.5b",
    "tinydolphin:1.1b",
    "tinyllama:1.1b",
    "driaforall/tiny-agent-a:0.5b",
    "hhao/qwen2.5-coder-tools:0.5b",
    "qwen:0.5b",
    "codellama:7b",
    "dolphincoder:7b",
    "codegemma:7b",
    "starcoder:3b",
    "opencoder:8b",
    "deepseek-coder-v2:16b",
    "qwen2.5-coder:7b",
    "sylink/sylink:8b",
    "wizardlm2:7b",
    "llama3-chatqa:8b",
    "ishumilin/deepseek-r1-coder-tools:14b",
    "koesn/llama3-openbiollm-8b:q6_K",
    "gemma3:27b-cloud",
    "qwen3-vl:235b-cloud",
    "qwen3-vl:8b",
    "deepseek-ocr:3b",
    "minimax-m2:cloud",
    "cogito-2.1:671b-cloud",
    "kimi-k2-thinking:cloud",
    "alibayram/hunyuan:4b",
    "nemotron-mini:4b",
    "deepseek-r1:1.5b",
    "qwen3:8b",
    "gemma3:4b",
    "deepseek-r1:8b",
    "ministral-3:8b",
    "second_constantine/gpt-oss-u:20b",
    "gpt-oss:20b",
    "llama3.2-vision:11b",
    "gemini-3-pro-preview:latest",
    "deepseek-v3.1:671b-cloud",
    "gpt-oss:120b-cloud",
    "qwen3-coder:480b-cloud"
  ];

  const userId = "overseer-user";
  const sessionId = "overseer-session";

  const appStartTime = Date.now();
  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return h + ":" + m + ":" + s;
  }

  function updateUptime() {
    const diff = Date.now() - appStartTime;
    document.getElementById("uptimeDisplay").textContent = formatDuration(diff);
  }

  setInterval(updateUptime, 1000);
  updateUptime();

  const consoleLog = document.getElementById("consoleLog");
  const consoleInput = document.getElementById("consoleInput");
  const sendButton = document.getElementById("sendButton");

  function appendConsoleEntry(role, text) {
    const entry = document.createElement("div");
    entry.classList.add("console-entry", role);
    const ts = new Date().toLocaleTimeString();
    entry.innerHTML =
      '<span class="console-timestamp">[' + ts + ']</span>' +
      '<span class="console-role">' + role.toUpperCase() + ':</span> ' +
      text;
    consoleLog.appendChild(entry);
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }

  appendConsoleEntry(
    "system",
    "Overseer dashboard online. Backend expected at " + BACKEND_URL + "."
  );

  async function sendToOverseer() {
    const text = consoleInput.value.trim();
    if (!text) return;
    appendConsoleEntry("user", text);
    consoleInput.value = "";

    try {
      const resp = await fetch(BACKEND_URL + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: activeModel,
          prompt:
            "[ROLE: Overseer]\nYou are the 24/7 system guardian for the AngryDroid capsule ecosystem. " +
            "You can see lineage logs, system status, and user intentions. " +
            "Respond concisely and clearly, and relate answers to system state when relevant.\n\n" +
            "User: " +
            text,
          stream: false
        })
      });

      if (!resp.ok) {
        appendConsoleEntry("system", "Error: chat endpoint returned " + resp.status);
        return;
      }

      const data = await resp.json();
      const reply = data.response || JSON.stringify(data);
      appendConsoleEntry("overseer", reply);
    } catch (err) {
      appendConsoleEntry("system", "Error contacting Overseer: " + err.message);
    }
  }

  sendButton.addEventListener("click", sendToOverseer);
  consoleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendToOverseer();
    }
  });

  const heartbeatIndicator = document.getElementById("heartbeatIndicator");
  const backendStatus = document.getElementById("backendStatus");
  const systemStatus = document.getElementById("systemStatus");

  async function pingBackend() {
    try {
      const resp = await fetch(BACKEND_URL + "/api/health");
      if (!resp.ok) throw new Error("status " + resp.status);
      const data = await resp.json();
      if (data.status === "ok") {
        heartbeatIndicator.classList.remove("offline");
        heartbeatIndicator.querySelector(".heartbeat-label").textContent = "online";
        backendStatus.textContent = "Healthy";
        systemStatus.textContent = "Backend responding";
      } else {
        heartbeatIndicator.classList.add("offline");
        heartbeatIndicator.querySelector(".heartbeat-label").textContent = "degraded";
        backendStatus.textContent = "Degraded";
        systemStatus.textContent = "Health check returned non-ok status";
      }
    } catch (err) {
      heartbeatIndicator.classList.add("offline");
      heartbeatIndicator.querySelector(".heartbeat-label").textContent = "offline";
      backendStatus.textContent = "Offline";
      systemStatus.textContent = "No response from backend: " + err.message;
    }
  }

  setInterval(pingBackend, 5000);
  pingBackend();

  const modelsBtn = document.getElementById("modelsBtn");
  modelsBtn.addEventListener("click", async () => {
    try {
      const resp = await fetch(BACKEND_URL + "/api/models");
      if (!resp.ok) throw new Error("status " + resp.status);
      const data = await resp.json();
      const names = (data || []).map((m) => m.name || m.model).join(", ") || "No models returned.";
      appendConsoleEntry("system", "Available (local) models: " + names);
    } catch (err) {
      appendConsoleEntry("system", "Error fetching models: " + err.message);
    }
  });

  const modelSelector = document.getElementById("modelSelector");

  async function loadModelsIntoSelector() {
    modelSelector.innerHTML = "";

    let backendModels = [];

    try {
      const resp = await fetch(BACKEND_URL + "/api/models");
      if (resp.ok) {
        const data = await resp.json();
        backendModels = data.map(m => m.name || m.model);
      }
    } catch (err) {
      appendConsoleEntry("system", "Model load error: " + err.message);
    }

    const allModels = Array.from(new Set([...backendModels, ...FALLBACK_MODELS]));

    allModels.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      if (name === activeModel) opt.selected = true;
      modelSelector.appendChild(opt);
    });
  }

  modelSelector.addEventListener("change", () => {
    activeModel = modelSelector.value;
    document.getElementById("modelName").textContent = activeModel;
    appendConsoleEntry("system", "Active model switched to: " + activeModel);
  });

  loadModelsIntoSelector();

  const cleanupBtn = document.getElementById("cleanupBtn");
  cleanupBtn.addEventListener("click", async () => {
    try {
      const resp = await fetch(BACKEND_URL + "/api/cleanup");
      if (!resp.ok) throw new Error("status " + resp.status);
      const data = await resp.json();
      appendConsoleEntry("system", "Cleanup: " + (data.message || "completed."));
    } catch (err) {
      appendConsoleEntry("system", "Cleanup error: " + err.message);
    }
  });

  const pullMemoryBtn = document.getElementById("pullMemoryBtn");
  const memoryView = document.getElementById("memoryView");

  pullMemoryBtn.addEventListener("click", async () => {
    try {
      const url =
        BACKEND_URL +
        "/api/memory?userId=" +
        encodeURIComponent(userId) +
        "&sessionId=" +
        encodeURIComponent(sessionId);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("status " + resp.status);
      const data = await resp.json();
      if (!data) {
        memoryView.textContent = "No memory found for userId=" + userId + ", sessionId=" + sessionId + ".";
      } else {
        memoryView.textContent = JSON.stringify(data, null, 2);
      }
    } catch (err) {
      memoryView.textContent = "Memory error: " + err.message;
    }
  });

  const daemonStatus = document.getElementById("daemonStatus");
  const daemonLastHeartbeat = document.getElementById("daemonLastHeartbeat");
  const daemonLastSync = document.getElementById("daemonLastSync");
  const daemonNextTask = document.getElementById("daemonNextTask");

  const refreshDaemonBtn = document.getElementById("refreshDaemonBtn");
  const restartDaemonBtn = document.getElementById("restartDaemonBtn");

  refreshDaemonBtn.addEventListener("click", () => {
    daemonStatus.textContent = "Unknown (no daemon endpoint yet)";
    daemonLastHeartbeat.textContent = new Date().toLocaleTimeString();
    daemonLastSync.textContent = "–";
    daemonNextTask.textContent = "Define via daemon JSON/endpoint.";
    appendConsoleEntry(
      "system",
      "Daemon refresh invoked. Wire this to your actual daemon status source when ready."
    );
  });

  restartDaemonBtn.addEventListener("click", () => {
    appendConsoleEntry(
      "system",
      "Restart daemon requested. Wire this button to /api/ssh or your daemon controller."
    );
  });

  const lastDeploy = document.getElementById("lastDeploy");
  const filesChanged = document.getElementById("filesChanged");
  const indexState = document.getElementById("indexState");

  const syncNowBtn = document.getElementById("syncNowBtn");
  const rebuildIndexBtn = document.getElementById("rebuildIndexBtn");

  syncNowBtn.addEventListener("click", () => {
    lastDeploy.textContent = new Date().toLocaleTimeString();
    filesChanged.textContent = "Unknown (no sync endpoint yet)";
    indexState.textContent = "Pending";
    appendConsoleEntry(
      "system",
      "Constellation sync requested. Wire this to your Neocities sync script."
    );
  });

  rebuildIndexBtn.addEventListener("click", () => {
    indexState.textContent = "Rebuild requested (manual wiring required)";
    appendConsoleEntry(
      "system",
      "Index rebuild requested. Wire this to your index generation script."
    );
  });

  function updateFakeSystemMetrics() {
    const cpu = (15 + Math.random() * 20).toFixed(1) + "%";
    const mem = (42 + Math.random() * 15).toFixed(1) + "%";
    const gpu = (5 + Math.random() * 10).toFixed(1) + "%";
    const disk = (10 + Math.random() * 8).toFixed(1) + "%";
    const net = (0.5 + Math.random() * 1.5).toFixed(2) + " MB/s";

    document.getElementById("cpuUsage").textContent = cpu;
    document.getElementById("memoryUsage").textContent = mem;
    document.getElementById("gpuUsage").textContent = gpu;
    document.getElementById("diskUsage").textContent = disk;
    document.getElementById("netUsage").textContent = net;
  }

  setInterval(updateFakeSystemMetrics, 4000);
  updateFakeSystemMetrics();
</script>
</body>
</html>


// overseer-backend.js — Overseer Control Backend (ESM-safe)
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
  "/media/angrydroid/bea186ce-f386-42cf-be75-5338821ca311/database.db";

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

  db.run(`CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    agentId TEXT,
    modelId TEXT,
    latencyMs INTEGER,
    tokens INTEGER,
    cost REAL,
    errors INTEGER,
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
  res.json({ status: "ok", port: PORT })
);

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
    // For now, assume non-streaming or buffer the response
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

// -------------------- SSH --------------------
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
            res.json({ output });
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

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`🚀 Overseer backend running on http://localhost:${PORT}`);
  console.log(`📜 Memory DB stored at: ${DB_PATH}`);
  console.log(`🤖 Connected to Ollama at: ${OLLAMA_URL}`);
});
