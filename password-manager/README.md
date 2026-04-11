# Password Manager Pro 🔐

## ✨ Demo Live
[![Password Manager](screenshots/demo.png)](https://tuusuario.github.io/password-manager/)

## 🚀 Features
- **Generador seguro**: Crypto API, custom charset, longitud 8-64
- **Validador avanzado**: Score 0-100, barra visual, tiempo crack, sugerencias
- **UX moderna**: Copy 1-click, responsive, animaciones, dark-ready
- **Backend Python**: Flask + bcrypt + SQLite (guarda hashes)

## 📱 Uso
```bash
# Frontend
open index.html

# Backend (opcional)
pip install flask flask-cors bcrypt
python password_server.py
```

## 🛠️ Deploy GitHub Pages
1. `git init && git add . && git commit -m "Init"`
2. `gh repo create password-manager --public`
3. `git push -u origin main`
4. Settings > Pages > main/root → https://user.github.io/password-manager

## 💼 Para Portafolio
Agrega a `script.js` de portafolio:
```js
GITHUB_REPOS: ['password-manager']
```

## Tech Stack
```
Frontend: HTML5/CSS3/Vanilla JS (Crypto API)
Backend: Python/Flask + bcrypt/SQLite
Security: OWASP best practices
```

⭐ ¡Proyecto junior full-stack security! Perfecto para entrevistas.
