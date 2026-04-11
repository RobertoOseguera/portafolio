#!/bin/bash
# 🔧 Linux Tools Auto-Install - Ubuntu Mint Arch
# Roberto Oseguera - Junior DevOps

echo "🛠️  INSTALANDO HERRAMIENTAS LINUX PRO..."
echo "Compatible: Ubuntu Mint Debian Arch Fedora"

# Detect distro
if [ -f /etc/os-release ]; then
  . /etc/os-release
  DISTRO=$ID
  echo "✅ Distro: $DISTRO $VERSION"
else
  DISTRO="unknown"
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Common tools
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
sudo apt update && sudo apt install -y htop neofetch glances bc 2>/dev/null || sudo pacman -Syu --noconfirm htop neofetch glances bc 2>/dev/null || echo "Usa tu package manager"

# Make all scripts executable
chmod +x *.sh

echo -e "${GREEN}✅ INSTALACIÓN COMPLETA!${NC}"
echo ""
echo "🚀 ÚSUALAS:"
echo "  ./monitor.sh     → CPU RAM DISK real-time"
echo "  ./netscan.sh     → Network scan puertos"
echo "  ./clean.sh       → Clean cache/temp"
echo "  ./backup.sh      → Backup inteligente"
echo "  ./kill.sh        → Kill processes smart"
echo ""
echo "🌐 Web Dashboard:"
echo "  cd dashboard && python -m http.server 8501"
echo "  Abre http://localhost:8501"
echo ""
echo -e "${GREEN}⭐ Star el repo si te sirvió!${NC}"

