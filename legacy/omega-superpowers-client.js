/**
 * MCP Client Superpowers - Omega Galaxies
 * Conecta con el servidor belentani-hub (24 herramientas en 4 grupos)
 * Inyectable en cualquier HTML estático
 */
(function() {
  const MCP_SERVER = 'C:\\Users\\USER\\workspace\\agent-mcp-hub\\server.mjs';
  
  const SUPERPOWERS = {
    google: ['gcloud_projects','google_drive_list','google_drive_read','google_gmail_list','google_gmail_read','google_gmail_send','google_gemini_generate','google_colab_notebooks','google_colab_execute'],
    github: ['github_codespaces','github_repositories','github_issues','github_pull_requests'],
    ai: ['openai_chat','google_gemini_generate','suno_generate'],
    social: ['linkedin_profile','linkedin_post','distrokid_artist','distrokid_release']
  };

  let mcpBuf = '';
  let mcpPending = new Map();
  let mcpCounter = 0;
  let mcpProc = null;

  function mcpSpawn() {
    if (typeof require === 'undefined') return null;
    const { spawn } = require('child_process');
    mcpProc = spawn('node', [MCP_SERVER], { stdio: ['pipe','pipe','pipe'] });
    mcpProc.stdout.on('data', chunk => {
      mcpBuf += chunk.toString();
      while (true) {
        const i = mcpBuf.indexOf('\r\n\r\n');
        if (i < 0) break;
        const match = /content-length:\s*(\d+)/i.exec(mcpBuf.substring(0, i));
        if (!match) { mcpBuf = mcpBuf.substring(i + 4); continue; }
        const n = Number(match[1]);
        if (mcpBuf.length < i + 4 + n) break;
        const data = mcpBuf.substring(i + 4, i + 4 + n);
        mcpBuf = mcpBuf.substring(i + 4 + n);
        try {
          const msg = JSON.parse(data);
          const p = mcpPending.get(msg.id);
          if (p) {
            mcpPending.delete(msg.id);
            if (msg.error) p.reject(new Error(msg.error.message || 'MCP error'));
            else p.resolve(msg.result);
          }
        } catch {}
      }
    });
    return mcpProc;
  }

  async function mcpCall(name, args = {}, timeout = 15000) {
    return new Promise((resolve, reject) => {
      if (!mcpProc) mcpSpawn();
      const id = ++mcpCounter;
      mcpPending.set(id, { resolve, reject });
      const req = JSON.stringify({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });
      const header = 'Content-Length: ' + Buffer.byteLength(req) + '\r\n\r\n';
      if (mcpProc && mcpProc.stdin) mcpProc.stdin.write(header + req);
      setTimeout(() => { if (mcpPending.has(id)) { mcpPending.delete(id); reject(new Error('MCP timeout: ' + name)); } }, timeout);
    });
  }

  async function mcpInit() {
    try {
      await mcpCall('hub_status', {});
    } catch (e) {
      console.warn('[Superpowers] MCP hub no disponible:', e.message);
    }
  }

  window.__omegaSuperpowers = {
    async call(name, args) { return mcpCall(name, args); },
    async init() { await mcpInit(); },
    groups: SUPERPOWERS,
    async listTools() { return mcpCall('hub_status', {}); }
  };

  if (typeof window !== 'undefined') {
    setTimeout(() => mcpInit(), 500);
  }
})();
