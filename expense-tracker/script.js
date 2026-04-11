// Expense Tracker Pro - Charts + Categories + Export CSV
// LocalStorage + Chart.js

class ExpenseTracker {
  constructor() {
    this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
    this.updateBalance();
    this.updateChart();
  }

  bindEvents() {
    document.getElementById('add-transaction').addEventListener('click', () => this.addTransaction());
    
    // Enter on amount or description
    ['amount', 'description'].forEach(id => {
      document.getElementById(id).addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addTransaction();
      });
    });
    
    document.getElementById('export-csv').addEventListener('click', () => this.exportCSV());
    document.getElementById('reset-all').addEventListener('click', () => {
      if (confirm('¿Resetear TODO?')) {
        localStorage.removeItem('transactions');
        this.transactions = [];
        this.render();
        this.updateBalance();
        this.updateChart();
      }
    });
  }

  addTransaction() {
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;

    if (isNaN(amount) || amount <= 0 || !description) {
      alert('Monto válido y descripción requeridos');
      return;
    }

    const transaction = {
      id: Date.now(),
      amount,
      description,
      category,
      type,
      date: new Date().toLocaleDateString('es-ES')
    };

    this.transactions.push(transaction);
    this.clearForm();
    this.save();
    this.render();
    this.updateBalance();
    this.updateChart();
  }

  clearForm() {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('type').selectedIndex = 0;
  }

  deleteTransaction(id) {
    if (confirm('¿Eliminar transacción?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.save();
      this.render();
      this.updateBalance();
      this.updateChart();
    }
  }

  updateBalance() {
    const income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

    document.getElementById('total-balance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('income').textContent = `$${income.toFixed(0)}`;
    document.getElementById('expenses').textContent = `$${expenses.toFixed(0)}`;
    
    // Color balance
    const balanceEl = document.getElementById('total-balance');
    balanceEl.className = balance >= 0 ? 'balance-amount' : 'balance-amount negative';
  }

  updateChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    const categoryData = this.transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    // Destroy previous chart
    if (window.expenseChart) {
      window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          data: Object.values(categoryData),
          backgroundColor: [
            '#e74c3c', '#f39c12', '#9b59b6', '#3498db', 
            '#27ae60', '#95a5a6'
          ],
          borderWidth: 0,
          borderColor: '#fff',
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  render() {
    const recent = this.transactions.slice(-5).reverse();
    const list = document.getElementById('transactions-list');
    
    list.innerHTML = recent.map(t => `
      <div class="transaction-item">
        <div style="display: flex; align-items: center;">
          <i class="fas fa-${t.category === 'salary' ? 'dollar-sign' : t.type === 'income' ? 'arrow-up' : 'arrow-down'} transaction-icon category-${t.category}"></i>
          <div class="transaction-desc">${t.description}</div>
        </div>
        <div class="transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}">
          ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
        </div>
        <button onclick="expenseTracker.deleteTransaction(${t.id})" style="background:none;border:none;color:#999;font-size:1.2rem;cursor:pointer;">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('') || '<p style="text-align:center;color:#999;padding:20px;">Sin transacciones</p>';
  }

  save() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  exportCSV() {
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto'];
    const csvContent = [
      headers.join(','),
      ...this.transactions.map(t => [
        t.date,
        `"${t.description}"`,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
}

// Global instance
const expenseTracker = new ExpenseTracker();
