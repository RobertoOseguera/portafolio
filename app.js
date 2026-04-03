// NEXTMOVIE by BytePhantom - Main App Logic
// Carruseles, Search, Hacker Mode - GitHub Ready

class NextMovieApp {
  constructor() {
    this.init();
  }

  init() {
    this.attachEvents();
    this.populateContent();
    this.setupHackerMode();
    document.body.classList.remove('loading');
  }

  attachEvents() {
    // Search
    document.getElementById('searchBtn').onclick = () => this.search();
    document.getElementById('searchInput').onkeypress = (e) => {
      if (e.key === 'Enter') this.search();
    };

    // Buttons
    document.getElementById('playBtn').onclick = () => this.playTrailer();
    document.getElementById('moreBtn').onclick = () => this.showMoreInfo();

    // Modal
    document.getElementById('loginModal').onclick = (e) => {
      if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    };

    // Profile switch
    document.getElementById('profileSelector').onclick = () => {
      document.querySelector('.profile-dropdown').classList.toggle('show');
    };

    // Row scroll
    document.querySelectorAll('.row-content').forEach(row => {
      row.onwheel = (e) => {
        e.preventDefault();
        row.scrollLeft += e.deltaY;
      };
    });
  }

  populateContent() {
    const categories = {
      trending: ['Stranger Things', 'Wednesday', 'The Crown', 'Bridgerton', 'The Witcher'],
      top10: ['1. Top Película', '2. Top Serie', '3. Trending', '4. Nuevo'],
      action: ['John Wick', 'Extraction', 'The Gray Man', '6 Underground', 'Triple Frontier'],
      hacks: ['Matrix Code', 'Mr. Robot', 'Black Mirror', 'Hacker Tools', 'BytePhantom Exclusive']
    };

    Object.entries(categories).forEach(([cat, titles]) => {
      const row = document.getElementById(`${cat}-row`) || document.querySelector(`[data-category="${cat}"] .row-content`);
      titles.forEach(title => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-image"></div>
          <div class="card-title">${title}</div>
          <div class="card-year">2024 • HD</div>
        `;
        card.onclick = () => this.openMovie(title);
        row.appendChild(card);
      });
    });
  }

  search() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  }

  playTrailer() {
    if (!window.auth.isAuthenticated()) {
      document.getElementById('loginModal').style.display = 'flex';
      return;
    }
    this.showNotification('🎬 Reproduciendo trailer en modo BytePhantom...');
  }

  showMoreInfo() {
    this.showNotification('ℹ️ Más info disponible en modo premium');
  }

  openMovie(title) {
    if (!window.auth.isAuthenticated()) {
      document.getElementById('loginModal').style.display = 'flex';
      return;
    }
    this.showNotification(`🎥 Abriendo ${title} - Full HD por BytePhantom`);
  }

  setupHackerMode() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        this.toggleHackerMode();
      }
    });
  }

  toggleHackerMode() {
    document.body.classList.toggle('hacker-mode');
    const matrix = document.querySelector('.matrix-bg') || this.createMatrix();
    matrix.classList.toggle('active');
    this.showNotification('💀 HACKER MODE ACTIVATED - BytePhantom');
  }

  createMatrix() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-bg';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,255,0,0.05)';
    const chars = '01ハックバイトファントム';
    let time = 0;

    const animate = () => {
      ctx.fillRect(0,0,canvas.width,canvas.height);
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(0,255,0,${Math.random()*0.5})`;
        ctx.fillText(chars[Math.floor(Math.random()*chars.length)], 
                     Math.random()*canvas.width, time + Math.random()*canvas.height);
      }
      time -= 5;
      if (canvas.classList.contains('active')) requestAnimationFrame(animate);
    };
    animate();

    return canvas;
  }

  showNotification(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#e50914',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      zIndex: '3000',
      boxShadow: '0 8px 24px rgba(229,9,20,0.4)',
      transform: 'translateX(400px)',
      transition: 'all 0.3s ease'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.style.transform = 'translateX(0)');
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  new NextMovieApp();
});

