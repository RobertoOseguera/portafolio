from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'certs_uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Init DB
def init_db():
    conn = sqlite3.connect('certs.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS certificates
                 (id INTEGER PRIMARY KEY, name TEXT, desc TEXT, file_path TEXT, date TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/upload', methods=['POST'])
def upload_cert():
    if 'file' not in request.files:
        return jsonify({'error': 'No file'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        conn = sqlite3.connect('certs.db')
        c = conn.cursor()
        c.execute("INSERT INTO certificates (name, desc, file_path, date) VALUES (?, ?, ?, ?)",
                  (request.form['name'], request.form['desc'], filename, datetime.now().strftime('%Y-%m-%d')))
        conn.commit()
        conn.close()
        return jsonify({'success': 'Certificado agregado'})
    return jsonify({'error': 'File not allowed'}), 400

@app.route('/certs', methods=['GET'])
def get_certs():
    conn = sqlite3.connect('certs.db')
    c = conn.cursor()
    c.execute("SELECT * FROM certificates")
    certs = [{'id': row[0], 'name': row[1], 'desc': row[2], 'file_path': row[3], 'date': row[4]} for row in c.fetchall()]
    conn.close()
    return jsonify(certs)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

