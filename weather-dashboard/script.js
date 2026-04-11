// Weather Dashboard - OpenWeatherMap API
// API Key gratuita: https://openweathermap.org/api

const API_KEY = 'c4d0c0e3f1e67d3c78b0e0e8f7c9d4a2b'; // Reemplaza con tu key gratis
const API_BASE = 'https://api.openweathermap.org/data/2.5';

class WeatherApp {
  constructor() {
    this.city = 'Mexico City';
    this.currentData = null;
    this.forecastData = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadWeather(this.city);
    this.getUserLocation();
  }

  bindEvents() {
    document.getElementById('search-btn').addEventListener('click', () => this.searchWeather());
    document.getElementById('city-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchWeather();
    });
  }

  async searchWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;
    
    this.showLoading();
    this.hideError();
    
    try {
      await this.loadWeather(city);
    } catch (error) {
      this.showError('Ciudad no encontrada. Intenta otra.');
    }
    
    document.getElementById('city-input').value = '';
  }

  async loadWeather(city) {
    // Current weather
    const currentUrl = `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`;
    const forecastUrl = `${API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`;
    
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);
    
    if (!currentRes.ok || !forecastRes.ok) throw new Error('API Error');
    
    this.currentData = await currentRes.json();
    this.forecastData = await forecastRes.json();
    
    this.renderCurrent();
    this.renderForecast();
    this.hideLoading();
    this.showWeather();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
        const res = await fetch(url);
        const data = await res.json();
        this.city = data.name;
        await this.loadWeather(this.city);
      });
    }
  }

  renderCurrent() {
    const data = this.currentData;
    document.getElementById('current-city').textContent = data.name;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-ES', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
    document.getElementById('current-temp-value').textContent = Math.round(data.main.temp);
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    
    // Icon
    const icon = this.getWeatherIcon(data.weather[0].icon);
    document.getElementById('current-icon').className = `fas ${icon}`;
    
    // UV index (extra API call)
    this.loadUVIndex(data.coord.lat, data.coord.lon);
  }

  async loadUVIndex(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    try {
      const res = await fetch(url);
      const uv = await res.json();
      document.getElementById('uv-index').textContent = uv.value.toFixed(1);
    } catch {
      document.getElementById('uv-index').textContent = 'N/A';
    }
  }

  renderForecast() {
    const daily = this.groupForecastByDay();
    const grid = document.getElementById('forecast-grid');
    
    grid.innerHTML = daily.map(day => {
      const temp = Math.round(day.temp);
      const icon = this.getWeatherIcon(day.icon);
      
      return `
        <div class="forecast-day">
          <div class="forecast-icon">
            <i class="fas ${icon}"></i>
          </div>
          <div class="day-name">${day.date}</div>
          <div class="forecast-temp">${temp}°</div>
          <div class="forecast-details">
            ${day.humidity}% | ${day.wind}m/s
          </div>
        </div>
      `;
    }).join('');
  }

  groupForecastByDay() {
    const daily = {};
    this.forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) {
        daily[date] = {
          temp: item.main.temp,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          wind: item.wind.speed,
          date: new Date(item.dt_txt).toLocaleDateString('es-ES', {weekday: 'short'})
        };
      }
    });
    
    return Object.values(daily).slice(0, 7);
  }

  getWeatherIcon(iconCode) {
    const code = iconCode[iconCode.length - 1];
    const isDay = iconCode[2] === 'd';
    
    const icons = {
      '01': isDay ? 'fa-sun' : 'fa-moon-stars',
      '02': 'fa-cloud-sun',
      '03': 'fa-cloud',
      '04': 'fa-clouds',
      '09': 'fa-cloud-rain',
      '10': 'fa-cloud-sun-rain',
      '11': 'fa-bolt',
      '13': 'fa-snowflake',
      '50': 'fa-smog'
    };
    
    return icons[iconCode.slice(0,2)] || 'fa-cloud';
  }

  showLoading() {
    document.getElementById('loading').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loading').classList.add('hidden');
  }

  showWeather() {
    document.getElementById('current-weather').classList.remove('hidden');
    document.getElementById('forecast').classList.remove('hidden');
  }

  showError(message) {
    const errorEl = document.getElementById('location-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    this.hideWeather();
  }

  hideError() {
    document.getElementById('location-error').style.display = 'none';
  }

  hideWeather() {
    document.getElementById('current-weather').classList.add('hidden');
    document.getElementById('forecast').classList.add('hidden');
  }
}

// Init app
const weatherApp = new WeatherApp();

// Free API key needed - get at openweathermap.org (3 calls/min free)

