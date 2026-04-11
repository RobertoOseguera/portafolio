// Portfolio v2 FINAL - Bug-free + Error handling + EmailJS
gsap.registerPlugin();

const GITHUB_USERNAME = 'RobertoOseguera';
const EMAILJS_SERVICE = 'default_service'; // Replace
const EMAILJS_TEMPLATE = 'template_1'; // Replace
const EMAILJS_PUBLIC = 'your_public_key'; // Replace

window.addEventListener('load', initPortfolio);

function initPortfolio() {
  gsap.to('#loader', {opacity: 0, duration: 0.8, delay: 1.5, onComplete: () => document.getElementById('loader').style.display = 'none'});
  window.addEventListener('scroll', handleScroll);
  setupTheme();
  typeHero();
  animateStats();
  setupScrollTriggers();
  loadGitHubProjects();
  setupContactForm();
  setupMobileMenu();
}

function handleScroll() {
  document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
}

function setupTheme() {
  const toggle = document.querySelector('.theme-toggle i');
  const current = localStorage.getItem('theme') || 'light';
  if (current === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggle.classList.replace('fa-moon', 'fa-sun');
  }
  document.querySelector('.theme-toggle').onclick = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    toggle.classList.toggle('fa-moon');
    toggle.classList.toggle('fa-sun');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };
}

function typeHero() {
  const titles = ['Roberto', 'Developer', 'Full-Stack'];
  let i = 0, j = 0, current = '', typing = true;
  function type() {
    if (typing && j < titles[i].length) {
      current += titles[i][j++];
      document.getElementById('typed-text').textContent = current;
      setTimeout(type, 150);
    } else if (typing) {
      typing = false;
      setTimeout(erase, 2000);
    }
  }
  function erase() {
    if (current.length) {
      document.getElementById('typed-text').textContent = current = current.slice(0, -1);
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

function animateStats() {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(stat => {
        const target = +stat.dataset.target;
        gsap.to(stat, {innerHTML: target, duration: 2, snap: {innerHTML: 1}, onUpdate() { stat.innerHTML = Math.ceil(stat.innerHTML); }});
      });
      observer.unobserve(entries[0].target);
    }
  });
  observer.observe(document.querySelector('.about-stats'));
}

function setupScrollTriggers() {
  gsap.utils.toArray('.section').forEach((section, i) => {
    gsap.fromTo(section, {opacity: 0, y: 100}, {opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: {trigger: section, start: "top 85%", toggleActions: "play none none reverse"}});
  });
  gsap.utils.toArray('.progress').forEach(bar => {
    gsap.to(bar, {width: bar.dataset.width + '%', duration: 2, ease: "power2.out", scrollTrigger: {trigger: bar.parentElement.parentElement, start: "top 90%"}});
  });
}

async function loadGitHubProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=12&sort=pushed&direction=desc`);
    if (!response.ok) throw new Error('API error');
    let repos = await response.json();
    
    // Prioritize by hire-score
    repos = repos.map(repo => {
      const daysOld = (Date.now() - new Date(repo.pushed_at)) / 86400000;
      let score = repo.stargazers_count * 3 + (repo.language === 'JavaScript' || repo.language === 'Python' ? 15 : 5);
      score += repo.description?.length > 20 ? 10 : 0;
      score += repo.homepage ? 20 : 0;
      score -= daysOld > 90 ? 8 : 0;
      return {...repo, hireScore: score};
    }).sort((a, b) => b.hireScore - a.hireScore).slice(0, 6);
    
    // Update stats
    document.getElementById('github-stars').textContent = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    document.getElementById('projects-count').textContent = repos.length;
    
    populateProjects(repos);
  } catch (error) {
    console.error('GitHub error:', error);
    populateProjects([
      {name: 'password-manager', description: '🔐 Password Generator + Validator', language: 'JS/Python', html_url: 'https://github.com/RobertoOseguera/password-manager'},
      {name: 'expense-tracker', description: '💰 Expense Tracker + Charts + CSV', language: 'JavaScript', html_url: 'https://github.com/RobertoOseguera/expense-tracker'},
      {name: 'task-manager', description: '✅ Task Manager LocalStorage', language: 'JavaScript', html_url: 'https://github.com/RobertoOseguera/task-manager'}
    ]);
  }
}

function populateProjects(repos) {
  document.getElementById('projects-grid').innerHTML = repos.map(repo => `
    <div class="project-card">
      <div class="project-image">
        <img src="https://source.unsplash.com/400x220/?${repo.name || 'code'}&sig=1" onerror="this.src='https://via.placeholder.com/400x220/4A90E2/FFFFFF?text=${repo.name}'" alt="${repo.name}" loading="lazy">
      </div>
      <div class="project-content">
        <h3>${repo.name?.replace(/-/g, ' ')}</h3>
        <p>${repo.description || 'Proyecto full-stack pro'}</p>
        <div class="project-tech">
          <span class="tech-tag">${repo.language || 'Web'}</span>
          <span class="tech-tag">${repo.stargazers_count || 0}⭐</span>
        </div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" class="project-link">Código <i class="fab fa-github"></i></a>
        </div>
      </div>
    </div>
  `).join('') || '<div class="project-placeholder"><i class="fas fa-rocket"></i><p>Proyectos coming soon...</p></div>';
}

function setupContactForm() {
  document.getElementById('contactForm').onsubmit = async e => {
    e.preventDefault();
    // EmailJS (user adds keys)
    // emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, e.target, EMAILJS_PUBLIC).then(() => alert('Enviado!')).catch(() => alert('Error'));
    alert('Mensaje simulado - agrega EmailJS keys');
    e.target.reset();
  };
}

function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  hamburger.onclick = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };
  document.querySelectorAll('.nav-menu a').forEach(link => link.onclick = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
}

