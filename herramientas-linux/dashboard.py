#!/usr/bin/env python3
# 🌐 Linux Dashboard Web - Flask + Charts
# Monitor CPU RAM Disk Network real-time

from flask import Flask, render_template_string
import psutil
import time
from collections import deque
import threading
import os

app = Flask(__name__)

# Live data
cpu_data = deque(maxlen=60)
ram_data = deque(maxlen=60)
disk_data = deque(maxlen=60)

def update_data():
    while True:
        cpu_data.append(psutil.cpu_percent(interval=1))
        ram_data.append(psutil.virtual_memory().percent)
        disk_data.append(psutil.disk_usage('/').percent)
        time.sleep(2)

threading.Thread(target=update_data, daemon=True).start()

HTML = '''
<!DOCTYPE html>
<html>
<head>
  <title>Linux Dashboard Pro</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {font-family:Arial;background:linear-gradient(135deg,#667eea,#764ba2);color:white;margin:0;padding:20px;}
    .container {max-width:1200px;margin:auto;background:rgba(255,255,255,0.1);border-radius:20px;padding:30px;backdrop-filter:blur(20px);}
    .stats {display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:30px;}
    .stat {background:rgba(255,255,255,0.2);padding:20px;border-radius:15px;text-align:center;}
    .stat h2 {margin:0;font-size:2.5rem;}
    .chart-container {background:rgba(255,255,255,0.2);border-radius:15px;padding:20px;margin:20px 0;height:400px;}
    button {padding:10px 20px;background:#28a745;color:white;border:none;border-radius:10px;cursor:pointer;font-size:1rem;}
  </style>
</head>
<body>
  <div class="container">
    <h1>🖥️ Linux Dashboard Pro - {{ time }}</h1>
    
    <div class="stats">
      <div class="stat">
        <h2 id="cpu">{{ cpu }}%</h2>
        <p>CPU</p>
      </div>
      <div class="stat">
        <h2 id="ram">{{ ram }}%</h2>
        <p>RAM</p>
      </div>
      <div class="stat">
        <h2 id="disk">{{ disk }}%</h2>
        <p>Disk</p>
      </div>
    </div>
    
    <div class="chart-container">
      <canvas id="chart"></canvas>
    </div>
    
    <button onclick="location.reload()">🔄 Refresh</button>
    <button onclick="exportData()">📊 Export JSON</button>
  </div>

  <script>
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [
        {label: 'CPU', borderColor: '#ff6384', data: []},
        {label: 'RAM', borderColor: '#36a2eb', data: []},
        {label: 'Disk', borderColor: '#ffcd56', data: []}
      ]},
      options: {responsive: true, maintainAspectRatio: false, scales: {y: {beginAtZero: true, max: 100}}}
    });

    setInterval(async () => {
      const res = await fetch('/data');
      const data = await res.json();
      document.getElementById('cpu').textContent = data.cpu + '%';
      document.getElementById('ram').textContent = data.ram + '%';
      document.getElementById('disk').textContent = data.disk + '%';
      
      chart.data.labels.push(new Date().toLocaleTimeString());
      chart.data.datasets[0].data.push(data.cpu);
      chart.data.datasets[1].data.push(data.ram);
      chart.data.datasets[2].data.push(data.disk);
      chart.update('none');
    }, 3000);

    async function exportData() {
      const res = await fetch('/data');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'linux-stats.json';
      a.click();
    }
  </script>
</body>
</html>
'''

@app.route('/')
def dashboard():
  return render_template_string(HTML, 
    time=time.strftime('%H:%M:%S'),
    cpu=cpu_data[-1] if cpu_data else 0,
    ram=ram_data[-1] if ram_data else 0,
    disk=disk_data[-1] if disk_data else 0
  )

@app.route('/data')
def data():
  return {'cpu': cpu_data[-1] if cpu_data else 0, 'ram': ram_data[-1] if ram_data else 0, 'disk': disk_data[-1] if disk_data else 0}

if __name__ == '__main__':
  print("🌐 Dashboard en http://localhost:8501")
  print("Ctrl+C para parar")
  app.run(host='0.0.0.0', port=8501, debug=False)

