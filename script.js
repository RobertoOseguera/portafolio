/**
 * Portafolio Personal - Script Principal
 * Inspirado en portafolios de YouTubers como Fazt, Freddier, HolaMundo
 */

// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navToggle = document.getElementById('nav-toggle'); // No existe, usar toggle

mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    navLinks.classList.remove('active');
  });
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const icon = themeToggle.querySelector('i');
  if (body.classList.contains('dark')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    localStorage.setItem('theme', 'light');
  }
});

// Load theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  body.classList.add('dark');
  themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

// Typing effect for hero
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Init typing (ejecutar después de load)
window.addEventListener('load', () => {
  const subtitle = document.querySelector('.hero-subtitle');
  typeWriter(subtitle, subtitle.dataset.text || subtitle.textContent, 80);
});

// Form handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Simular envío (reemplaza con EmailJS o Formspree)
  alert('¡Mensaje enviado! (Simulado - integra EmailJS para real)');
  contactForm.reset();
});

// Intersection Observer para animaciones
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar project cards y sections
document.querySelectorAll('.project-card, .about-content, .contact-content').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    body.dark && (header.style.background = 'rgba(26, 26, 26, 0.98)');
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    body.dark && (header.style.background = 'rgba(26, 26, 26, 0.95)');
  }
});

// Parallax effect for hero image
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// === GitHub Projects Auto-Fetch ===
const GITHUB_USERNAME = 'roberto-oseguera'; // ¡Cambia por tu username de GitHub!
const GITHUB_REPOS = [ // Agrega URLs o nombres de tus repos aquí
  'password-manager'
];

async function fetchGitHubRepos() {
  try {
    const reposData = [];
    for (const repo of GITHUB_REPOS) {
      const repoName = repo.includes('/') ? repo.split('/')[1] : repo;
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
      const repos = await response.json();
      const targetRepo = repos.find(r => r.name.toLowerCase() === repoName.toLowerCase());
      if (targetRepo) {
        reposData.push({
          name: targetRepo.name,
          description: targetRepo.description || 'Sin descripción',
          html_url: targetRepo.html_url,
          homepage: targetRepo.homepage || null,
          stars: targetRepo.stargazers_count,
          language: targetRepo.language
        });
      }
    }
    populateProjects(reposData);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    // Fallback to static projects
  }
}

function populateProjects(repos) {
  const grid = document.querySelector('.projects-grid');
  grid.innerHTML = '';
  repos.slice(0, 4).forEach(repo => { // Max 4
    const card = `
      <div class="project-card">
        <img src="https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=${repo.name}" alt="${repo.name}" loading="lazy">
        <div class="project-info">
          <h3>${repo.name}</h3>
          <p>${repo.description}</p>
          <div class="project-meta">
            <span><i class="fab fa-github"></i> ${repo.stars} stars</span>
            <span>${repo.language || 'Web'}</span>
          </div>
          <div class="project-links">
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
            <a href="${repo.html_url}" target="_blank"><i class="fab fa-github"></i> Código</a>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += card;
  });
}

// Load GitHub projects on init
window.addEventListener('load', fetchGitHubRepos);


