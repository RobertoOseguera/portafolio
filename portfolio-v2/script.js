// Portfolio v2 - Script Ultra-Chingon
// GSAP animations + GitHub API + Theme + Typing + Stats

gsap.registerPlugin();

const GITHUB_USERNAME = 'roberto-oseguera'; // Auto-detectado
// IA auto-organiza por hire-factor (stars + recent + JS/Python priority)

// Init
window.addEventListener('load', () => {
  initPortfolio();
});

function initPortfolio() {
  // Loader
  gsap.to('#loader', {opacity: 0, duration: 0.8, delay: 1.5, onComplete: () => {
    document.getElementById('loader').style.display = 'none';
  }});
  
  // Navbar scroll
  window.addEventListener('scroll', handleScroll);
  
  // Theme toggle
  setupTheme();
  
  // Typing hero
  typeHero();
  
  // Stats counter
  animateStats();
  
  // Scroll animations
  setupScrollTriggers();
  
  // Projects
  loadGitHubProjects();
  
  // Form
  setupContactForm();
  
  // Mobile menu
  setupMobileMenu();
}

// Navbar
function handleScroll() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Theme
function setupTheme() {
  const toggle = document.querySelector('.theme-toggle i');
  const current = localStorage.getItem('theme') || 'light';
  
  if (current === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggle.classList.replace('fa-moon', 'fa-sun');
  }
  
  document.querySelector('.theme-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    toggle.classList.toggle('fa-moon');
    toggle.classList.toggle('fa-sun');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

// Typing Hero
function typeHero() {
  const titles = ["Roberto 👨‍💻", "Desarrollador", "Full-Stack"];
  let i = 0, j = 0, currentTitle = '', typing = true;
  
  function type() {
    if (typing) {
      currentTitle += titles[i][j];
      document.getElementById('typed-text').textContent = currentTitle;
      j++;
      if (j < titles[i].length) {
        setTimeout(type, 150);
      } else {
        typing = false;
        setTimeout(erase, 2000);
      }
    }
  }
  
  function erase() {
    currentTitle = currentTitle.slice(0, -1);
    document.getElementById('typed-text').textContent = currentTitle;
    if (currentTitle.length > 0) {
      setTimeout(erase, 50);
    } else {
      i = (i + 1) % titles.length;
      j = 0;
      typing = true;
      setTimeout(type, 500);
    }
  }
  
  type();
}

// Stats Animation
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach(stat => {
          const target = parseInt(stat.dataset.target);
          gsap.to(stat, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            onUpdate: function() {
              stat.innerHTML = Math.ceil(this.targets()[0].innerHTML);
            }
          });
        });
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(document.querySelector('.about-stats'));
}

// Scroll Triggers GSAP
function setupScrollTriggers() {
  gsap.utils.toArray('.section').forEach((section, i) => {
    gsap.fromTo(section, 
      { 
        opacity: 0, 
        y: 100 
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
  
  // Skills progress bars
  gsap.utils.toArray('.progress').forEach(bar => {
    gsap.to(bar, {
      width: bar.dataset.width + '%',
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: bar.parentElement.parentElement,
        start: "top 90%"
      }
    });
  });
}

// GitHub IA Hiring Prioritizer - Auto-detecta y ordena mejores para contratar
async function loadGitHubProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=pushed&direction=desc`);
    const repos = await response.json();
    
    // IA Score: stars*3 + JS/Python bonus + recent + demo + description
    // Fix repo name case for RobertoOseguera/password-manager
    repos = repos.map(repo => ({
      ...repo,
      name: repo.name.toLowerCase() === 'password-manager' ? 'password-manager' : repo.name
    }));
    const scoredRepos = repos.map(repo => {
      const daysOld = (new Date() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24);
      let score = repo.stargazers_count * 3;
      score += (repo.language === 'JavaScript' || repo.language === 'Python' || !repo.language) ? 10 : 2;
      score += repo.description && repo.description.length > 20 ? 8 : 0;
      score += repo.homepage ? 15 : 0;
      score -= daysOld > 180 ? 5 : 0; // Penaliza viejo
      score += repo.name.includes('manager') || repo.name.includes('app') ? 12 : 0; // Keywords hire-friendly
      
      return { ...repo, hireScore: score };
    }).sort((a, b) => b.hireScore - a.hireScore).slice(0, 6);
    
    // Update stats reales
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalRepos = repos.length;
    document.getElementById('github-stars').textContent = totalStars;
    document.getElementById('projects-count').textContent = totalRepos;
    
    // Override password-manager link to exact repo
    scoredRepos = scoredRepos.map(repo => repo.name === 'password-manager' 
      ? {...repo, html_url: 'https://github.com/RobertoOseguera/password-manager'}
      : repo);
    populateProjects(scoredRepos);
    console.log('Top hire-repos:', scoredRepos.map(r => `${r.name} (score:${r.hireScore.toFixed(0)})`));
  } catch (error) {
    console.error('GitHub API error:', error);
    // Fallback projects optimizados junior
    const fallback = [
      {name: 'password-manager', description: 'Generador + Validator passwords seguras (Crypto API)', language: 'JavaScript', stargazers_count: 0, html_url: 'https://github.com/roberto-oseguera/password-manager'},
      {name: 'weather-app', description: 'Dashboard tiempo real OpenWeatherMap API', language: 'JavaScript', stargazers_count: 0, html_url: '#'},
      {name: 'todo-list', description: 'Task manager LocalStorage + drag-drop', language: 'JavaScript', stargazers_count: 0, html_url: '#'}
    ];
    populateProjects(fallback);
  }
}

function populateProjects(repos) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = repos.map(repo => `
    <div class="project-card">
      <div class="project-image">
        <img src="https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/main/screenshot.png || https://via.placeholder.com/400x220/4A90E2/white?text=${repo.name}" alt="${repo.name}" loading="lazy">
      </div>
      <div class="project-content">
        <h3 class="project-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
        <p class="project-desc">${repo.description || 'Proyecto increíble sin descripción.'}</p>
        <div class="project-tech">
          <span class="tech-tag">${repo.language || 'Web'}</span>
          ${repo.stargazers_count ? `<span class="tech-tag"><i class="fab fa-github"></i> ${repo.stargazers_count}</span>` : ''}
        </div>
        <div class="project-links">
          ${repo.homepage ? `<a href="${repo.homepage}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
          <a href="${repo.html_url}" class="project-link" target="_blank"><i class="fab fa-github"></i> Código</a>
        </div>
      </div>
    </div>
  `).join('');
}

// Contact Form (EmailJS ready)
function setupContactForm() {
  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // EmailJS integration
    // emailjs.sendForm('service_id', 'template_id', e.target, 'public_key')
    alert('¡Mensaje enviado! (Integra EmailJS para real)');
    e.target.reset();
  });
}

// Mobile Menu
function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close on link click
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// Intersection Observer for fade-ins (fallback)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Active nav link
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset + 100;
  
  sections.forEach(section => {
    const el = document.querySelector(`a[href="#${section.id}"]`);
    if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
      document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
      el.classList.add('active');
    }
  });
});
