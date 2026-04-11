#!/bin/bash
# 🌐 Network Scanner Pro
# Puertos abiertos + dispositivos LAN + speed test

echo "🌐 NETWORK SCANNER PRO"
echo "======================"

# IP local
IP_LOCAL=$(hostname -I | awk '{print $1}')
echo "📡 Tu IP: $IP_LOCAL"

# Scan red local (24 hosts)
echo ""
echo "🔍 Escaneando LAN (255 hosts)..."
nmap -sn 192.168.1.0/24 2>/dev/null | grep "Nmap scan report" | awk '{print $5}' | head -10 || nmap -sn $IP_LOCAL/24 | grep "Nmap scan report" | awk '{print $5}' | head -10

# Puertos comunes abiertos local
echo ""
echo "🔓 Puertos abiertos localhost:"
nmap -F localhost 2>/dev/null | grep open || netstat -tulpn | grep LISTEN | head -5

# Speed test rápido
echo ""
echo "⚡ Speed test (5s):"
curl -o /dev/null -s -w "%{speed_download}/s\n" http://speedtest.wdc01.softlayer.com/downloads/test10.zip || echo "No internet"

echo ""
echo "✅ Scan completo. Presiona Ctrl+C para salir."

