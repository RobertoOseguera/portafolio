# Portafolio Personal 🚀

## ✨ Características
- Diseño responsive y moderno inspirado en portafolios de YouTubers hispanohablantes (Fazt, Freddier, etc.)
- Modo oscuro/claro con persistencia
- Animaciones suaves, typing effect, parallax
- Formulario de contacto (simulado - ver abajo)
- Fácil de personalizar

## 📱 Vista previa
Abre `index.html` en tu navegador.

## 🛠️ Personalización
1. **Foto**: Reemplaza `https://via.placeholder.com/...` en index.html con tu foto.
2. **Datos**: Edita nombre, bio, skills, email, links en index.html.
3. **Proyectos AUTO**: En script.js cambia `GITHUB_USERNAME = 'tuusuario'` y `GITHUB_REPOS = ['repo1', 'repo2']`. ¡Detecta descripción, stars, lang automáticamente!
4. **Colores**: Modifica variables CSS en styles.css (e.g., #4A90E2).

## 🌐 Deploy en GitHub Pages
1. Crea repo en GitHub: `tuusuario/portafolio-personal`
2. `git init`, `git add .`, `git commit -m "Initial"`, `git branch -M main`, `git remote add origin https://github.com/tuusuario/portafolio-personal.git`, `git push -u origin main`
3. Settings > Pages > Source: Deploy from branch main / / (root)
4. Live: https://tuusuario.github.io/portafolio-personal/

## 📧 Formulario Real
Integra EmailJS:
1. Regístrate en emailjs.com, obtén serviceID, templateID, publicKey.
2. Agrega `<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>` antes de script.js.
3. Reemplaza en script.js el alert por:
```js
emailjs.init('TU_PUBLIC_KEY');
emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
  from_name: document.getElementById('name').value,
  from_email: document.getElementById('email').value,
  message: document.getElementById('message').value
}).then(() => alert('Enviado!'));
```

## 🛠️ Backend Certificados
Ejecuta el server Python para DB certificados:
```
pip install flask flask-cors werkzeug
cd portafolio-personal
python cert-server.py
```
- Sube certificados en localhost:5000/upload
- Integra JS para fetch /certs y mostrar.

## 🎨 Mejoras
- Agrega proyectos reales (GitHub auto).
- Reemplaza placeholder fotos certs.
- Deploy backend PythonAnywhere.

¡Listo para impresionar! ⭐

