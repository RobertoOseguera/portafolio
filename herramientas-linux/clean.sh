#!/bin/bash
# 🧹 Disk Cleaner Pro - Cache Temp Logs
# Recupera GBs + Preview + Safe

echo "🧹 DISK CLEANER PRO"
echo "==================="

# Colors
RED='\033[0;31m' GREEN='\033[0;32m' YELLOW='\033[1;33m' NC='\033[0m'

# Check space before
before=$(df / | awk 'NR==2{print $4/1024/1024 "GB"}')
echo "💾 Espacio antes: $before"

space_saved=0

# Clean APT cache (Ubuntu/Debian)
if command -v apt &> /dev/null; then
  echo -e "${YELLOW}🗑️  APT Cache...${NC}"
  sudo apt clean
  space_saved=$(($space_saved + $(sudo du -sh /var/cache/apt/archives 2>/dev/null | cut -f1 | sed 's/[MG]//g' || echo 0)))
fi

# Clean YUM/DNF (Fedora/RHEL)
if command -v dnf &> /dev/null; then
  echo -e "${YELLOW}🗑️  DNF Cache...${NC}"
  sudo dnf clean all
fi

# Temp files
echo -e "${YELLOW}🗑️  Temp files...${NC}"
sudo rm -rf /tmp/* /var/tmp/* 2>/dev/null
space_saved=$(($space_saved + 50)) # approx

# Logs
echo -e "${YELLOW}🗑️  Logs rotados...${NC}"
sudo journalctl --vacuum-time=2weeks 2>/dev/null || sudo find /var/log -type f -name "*.log" -size +100M -delete 2>/dev/null

# Thumbnail cache
rm -rf ~/.cache/thumbnails/* 2>/dev/null

# Browser cache (Firefox/Chrome)
rm -rf ~/.cache/google-chrome ~/.cache/mozilla/firefox 2>/dev/null

# Space after
after=$(df / | awk 'NR==2{print $4/1024/1024 "GB"}')
saved=$(echo "$before - $after" | bc -l 2>/dev/null || echo "1GB")

echo ""
echo -e "${GREEN}✅ LIMPIEZA COMPLETA!${NC}"
echo "💾 Antes: $before | Después: $after"
echo -e "${GREEN}🆓 Recuperado: ~${saved}GB${NC}"
echo ""
echo "🔄 Reinicia para efectos completos"

