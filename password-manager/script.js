// Password Manager Pro - Frontend Completo
// Crypto API para seguridad + Validator avanzado

let currentPassword = '';

function generatePassword() {
  const length = parseInt(document.getElementById('length').value);
  document.getElementById('lenVal').textContent = length;
  
  const checkboxes = ['uppercase', 'lowercase', 'numbers', 'symbols'];
  let charset = '';
  
  checkboxes.forEach(id => {
    if (document.getElementById(id).checked) {
      if (id === 'uppercase') charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (id === 'lowercase') charset += 'abcdefghijklmnopqrstuvwxyz';
      if (id === 'numbers') charset += '0123456789';
      if (id === 'symbols') charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
  });
  
  if (charset.length === 0) {
    alert('Selecciona al menos un tipo de carácter');
    return;
  }
  
  // Crypto seguro
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += charset.charAt(array[i] % charset.length);
  }
  
  currentPassword = password;
  const display = document.getElementById('generated');
  display.innerHTML = `<i class="fas fa-check-circle"></i> ${password}`;
  display.classList.add('has-pass');
  document.getElementById('copyBtn').style.display = 'block';
  
  // Auto-valida
  validatePassword(password);
}

function copyPassword() {
  navigator.clipboard.writeText(currentPassword).then(() => {
    const btn = document.getElementById('copyBtn');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.innerHTML = oldText;
      btn.style.background = '';
    }, 2000);
  });
}

function validatePassword(password) {
  if (!password) {
    resetValidation();
    return;
  }
  
  let score = 0;
  const elements = {
    score: document.getElementById('scoreLabel'),
    time: document.getElementById('timeLabel'),
    sugg: document.getElementById('suggestions'),
    bar: document.querySelector('.bar-fill')
  };
  
  // Criterios detallados
  if (password.length >= 16) score += 25;
  else if (password.length >= 12) score += 15;
  else if (password.length >= 8) score += 5;
  
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;
  
  // Penalizaciones comunes
  if (password.toLowerCase().includes('password')) score -= 30;
  if (/123|111|000/.test(password)) score -= 15;
  if (password.length < 8) score -= 20;
  
  score = Math.max(0, Math.min(100, score));
  
  // Barra de fuerza
  let color = score < 40 ? '#e74c3c' : score < 70 ? '#f39c12' : '#27ae60';
  elements.bar.style.width = score + '%';
  elements.bar.style.background = color;
  
  // Score
  const strength = score < 40 ? 'Débil' : score < 70 ? 'Media' : 'Fuerte';
  elements.score.textContent = `Fuerza: ${strength} (${score}/100)`;
  
  // Tiempo estimado crack (aprox)
  const times = [
    'instantáneo', 'segundos', 'minutos', 'horas', 
    'días', 'semanas', 'meses', 'años', 'décadas', 'siglos'
  ];
  const timeIndex = Math.floor(score / 11);
  elements.time.textContent = `Tiempo crack: ~${times[timeIndex]}`;
  
  // Sugerencias inteligentes
  let suggestions = [];
  if (password.length < 12) suggestions.push('Usa 12+ caracteres');
  if (!/[a-z]/.test(password)) suggestions.push('Agrega minúsculas');
  if (!/[A-Z]/.test(password)) suggestions.push('Agrega mayúsculas');
  if (!/[0-9]/.test(password)) suggestions.push('Incluye números');
  if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push('Agrega símbolos');
  if (password.toLowerCase().includes('password')) suggestions.push('Evita "password"');
  
  elements.sugg.textContent = suggestions.length ? 
    `💡 Mejora: ${suggestions.slice(0,3).join(', ')}` : 
    '✅ ¡Password excelente!';
  
  elements.sugg.style.color = score >= 70 ? '#27ae60' : '#e67e22';
}

function resetValidation() {
  document.getElementById('scoreLabel').textContent = 'Fuerza: 0/100';
  document.getElementById('timeLabel').textContent = 'Tiempo crack: instantáneo';
  document.getElementById('suggestions').textContent = '';
  document.querySelector('.bar-fill').style.width = '0%';
}

// Python backend test (fetch local server)
async function testPythonBackend() {
  const result = document.getElementById('backendResult');
  try {
    const response = await fetch('http://localhost:5000/test', {mode: 'cors'});
    const data = await response.json();
    result.textContent = `✅ Backend OK: ${data.message}`;
    result.className = 'success';
  } catch (e) {
    result.textContent = '❌ Backend no activo (ejecuta python password_server.py)';
    result.className = 'error';
  }
}

// Listeners
document.getElementById('length').addEventListener('input', (e) => {
  document.getElementById('lenVal').textContent = e.target.value;
});

document.addEventListener('DOMContentLoaded', () => {
  // Pre-generate demo
  generatePassword();
  document.getElementById('validateInput').focus();
});
