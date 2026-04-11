// QR Generator Pro - Professional
// qrcode.js CDN + Canvas + SVG + Color + Size

let qrCanvas = document.getElementById('qr-canvas');
let qrCtx = qrCanvas.getContext('2d');

function generateQR() {
  const text = document.getElementById('qr-text').value.trim();
  if (!text) {
    alert('Ingresa texto/URL');
    return;
  }

  const color = document.getElementById('qr-color').value;
  const size = parseInt(document.getElementById('qr-size').value);
  const errorCorrection = parseInt(document.getElementById('qr-error').value);
  
  // Update canvas size
  qrCanvas.width = size;
  qrCanvas.height = size;
  
  // Generate QR
  QRCode.toCanvas(qrCanvas, text, {
    width: size,
    margin: 2,
    color: {
      dark: color,
      light: '#FFFFFF'
    },
    errorCorrectionLevel: ['L','M','Q','H'][errorCorrection - 1]
  }, (error) => {
    if (error) console.error(error);
    else {
      qrCanvas.classList.add('generated');
      document.getElementById('download-qr').disabled = false;
      document.getElementById('download-svg').disabled = false;
    }
  });
}

function downloadPNG() {
  const link = document.createElement('a');
  link.download = `qr-${Date.now()}.png`;
  link.href = qrCanvas.toDataURL();
  link.click();
}

function downloadSVG() {
  QRCode.toString(document.getElementById('qr-text').value, {
    type: 'svg',
    margin: 2,
    color: {
      dark: document.getElementById('qr-color').value,
      light: '#FFFFFF'
    },
    errorCorrectionLevel: ['L','M','Q','H'][parseInt(document.getElementById('qr-error').value) - 1]
  }, (error, svg) => {
    if (error) return console.error(error);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qr-${Date.now()}.svg`;
    link.href = url;
    link.click();
  });
}

function setExample(text) {
  document.getElementById('qr-text').value = text;
  generateQR();
}

// Events
document.getElementById('generate-qr').addEventListener('click', generateQR);
document.getElementById('download-qr').addEventListener('click', downloadPNG);
document.getElementById('download-svg').addEventListener('click', downloadSVG);
document.getElementById('qr-size').addEventListener('input', (e) => {
  document.getElementById('size-value').textContent = e.target.value + 'px';
});
document.getElementById('qr-text').addEventListener('input', () => {
  qrCanvas.classList.remove('generated');
  document.getElementById('download-qr').disabled = true;
  document.getElementById('download-svg').disabled = true;
});

// Generate initial
generateQR();

// Auto-generate on enter
document.getElementById('qr-text').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') generateQR();
});
