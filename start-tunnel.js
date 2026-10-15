import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 5173; // Puerto del Backend de Express

console.log('🚀 Iniciando túnel de Cloudflare...');

const tunnel = spawn('npx', ['cloudflared', 'tunnel', '--url', `http://localhost:${PORT}`], { shell: true });
let urlUpdated = false;

function processOutput(data) {
  const output = data.toString();
  console.log(output);

  const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);

  if (match && !urlUpdated) {
    const newUrl = match[0];
    urlUpdated = true;

    console.log(`\n==================================================`);
    console.log(`✨ Nueva URL detectada: ${newUrl}`);
    console.log(`==================================================\n`);

    const configPath = path.resolve('public/config.json');
    const newConfig = {
      apiUrl: `${newUrl}/api`,
      socketUrl: newUrl
    };

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    console.log('✅ public/config.json actualizado automáticamente.\n');
  }
}

tunnel.stdout.on('data', processOutput);
tunnel.stderr.on('data', processOutput);