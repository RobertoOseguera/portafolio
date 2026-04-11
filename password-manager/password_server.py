#!/usr/bin/env python3
"""
Password Manager Backend - Flask + bcrypt
Guarda passwords hasheadas de forma segura
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permite frontend localhost

# DB simple
def init_db():
    conn = sqlite3.connect('passwords.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS passwords
                 (id INTEGER PRIMARY KEY, hash TEXT, created TEXT)''')
    conn.commit()
    conn.close()

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Python backend activo! 🔒'})

@app.route('/save', methods=['POST'])
def save_password():
    data = request.json
    password = data.get('password', '')
    
    if not password:
        return jsonify({'error': 'No password'}), 400
    
    # Hash bcrypt seguro
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    conn = sqlite3.connect('passwords.db')
    c = conn.cursor()
    c.execute("INSERT INTO passwords (hash, created) VALUES (?, ?)",
              (hashed.decode('utf-8'), datetime.now().isoformat()))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'hash': hashed.decode('ascii')[:20] + '...'})


@app.route('/stats', methods=['GET'])
def stats():
    conn = sqlite3.connect('passwords.db')
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM passwords")
    count = c.fetchone()[0]
    conn.close()
    return jsonify({'total_saved': count})

if __name__ == '__main__':
    init_db()
    print("🚀 Password Server en http://localhost:5000")
    print("Frontend: open password-manager/index.html")
    app.run(debug=True, port=5000)
