#!/usr/bin/env python3
"""
Portfolio Visitor Counter - Flask + SQLite
Cuenta visitas únicas + IP + timestamp
python visitor-server.py → localhost:5000/count
Frontend fetch /count → muestra total
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime
from collections import defaultdict

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('visitors.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS visitors
                 (id TEXT PRIMARY KEY, ip TEXT, user_agent TEXT, created TEXT)''')
    c.execute('CREATE INDEX IF NOT EXISTS idx_ip ON visitors(ip)')
    conn.commit()
    conn.close()

@app.route('/count', methods=['GET'])
def get_count():
    conn = sqlite3.connect('visitors.db')
    c = conn.cursor()
    total = c.execute('SELECT COUNT(*) FROM visitors').fetchone()[0]
    
    # Hoy
    today = c.execute("SELECT COUNT(*) FROM visitors WHERE date(created) = date('now')").fetchone()[0]
    
    # Unique hoy
    unique_today = c.execute("SELECT COUNT(DISTINCT ip) FROM visitors WHERE date(created) = date('now')").fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'total': total,
        'today': today,
        'unique_today': unique_today,
        'message': f'¡{total} visitantes totales!'
    })

@app.route('/visitor', methods=['POST'])
def add_visitor():
    visitor_id = str(uuid.uuid4())[:8]
    ip = request.remote_addr or 'unknown'
    user_agent = request.headers.get('User-Agent', 'unknown')
    
    conn = sqlite3.connect('visitors.db')
    c = conn.cursor()
    c.execute("INSERT OR IGNORE INTO visitors (id, ip, user_agent, created) VALUES (?, ?, ?, ?)",
              (visitor_id, ip, user_agent, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'id': visitor_id})

if __name__ == '__main__':
    init_db()
    print("🌐 Visitor Server en http://localhost:5000")
    print("Frontend: fetch('/visitor') + fetch('/count')")
    print("DB: visitors.db")
    app.run(debug=True, host='0.0.0.0', port=5000)

