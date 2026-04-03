// NEXTMOVIE by BytePhantom - Auth System
// Funcional con localStorage - Listo para GitHub

class AuthManager {
  constructor() {
    this.profiles = JSON.parse(localStorage.getItem('nextmovie_profiles')) || [
      { id: 'guest', name: 'Invitado', email: 'guest@nextmovie.com' },
      { id: 'bytephantom', name: 'BytePhantom', email: 'bytephantom@hack.com', password: 'hacker' }
    ];
    this.currentProfile = localStorage.getItem('nextmovie_currentProfile') || 'guest';
    this.init();
  }

  init() {
    this.updateProfileUI();
    this.attachEvents();
  }

  attachEvents() {
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'loginForm') {
        e.preventDefault();
        this.handleLogin(e.target);
      }
    });

    document.querySelectorAll('.profile-item[data-profile]').forEach(item => {
      item.addEventListener('click', (e) => {
        this.switchProfile(e.target.dataset.profile);
      });
    });

    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('loginModal').style.display = 'none';
    });
  }

  handleLogin(form) {
    const email = form.email.value;
    const password = form.password.value;

    const profile = this.profiles.find(p => p.email === email && p.password === password);

    if (profile) {
      this.switchProfile(profile.id);
      document.getElementById('loginModal').style.display = 'none';
      form.reset();
      this.showNotification('¡Bienvenido a NEXTMOVIE Hacker Mode!');
    } else {
      this.showError('Credenciales inválidas');
    }
  }

  switchProfile(profileId) {
    this.currentProfile = profileId;
    localStorage.setItem('nextmovie_currentProfile', profileId);
    this.updateProfileUI();
    document.getElementById('profileSelector').classList.remove('loading');
    
    // Unlock secret content
    if (profileId === 'bytephantom' || profileId === 'hacker') {
      document.getElementById('hacks-row').classList.add('unlocked');
    }
  }

  updateProfileUI() {
    const profile = this.profiles.find(p => p.id === this.currentProfile);
    const icon = document.querySelector('.profile-icon');
    icon.textContent = profile.name.charAt(0).toUpperCase();
    
    document.querySelectorAll('.profile-item').forEach(item => {
      item.classList.toggle('active', item.dataset.profile === this.currentProfile);
    });
    
    const profileName = document.querySelector('.profile-item.active');
    if (profileName) profileName.textContent = profile.name;
  }

  showNotification(message) {
    // Simple toast
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#e50914;color:white;padding:1rem;border-radius:4px;z-index:3000;transform:translateX(400px);transition:all 0.3s;';
    document.body.appendChild(toast);
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  showError(message) {
    const input = document.querySelector('#loginForm input:focus') || document.querySelector('#loginForm input');
    input.style.borderColor = '#e50914';
    input.style.boxShadow = '0 0 0 2px rgba(229,9,20,0.3)';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }, 2000);
  }

  logout() {
    this.switchProfile('guest');
  }

  isAuthenticated() {
    return this.currentProfile !== 'guest';
  }
}

// Global instance
const auth = new AuthManager();

// Export for app.js
window.auth = auth;

