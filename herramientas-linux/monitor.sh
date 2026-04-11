#!/bin/bash
# 🖥️ System Monitor Pro - Multi-Distro
# CPU RAM DISK SWAP + Colors + Updates cada 2s

echo "🖥️  SYSTEM MONITOR PRO - $(date)"
echo "=========================================="

while true; do
  clear
  echo "📊 MONITOR $(date '+%H:%M:%S')"
  echo "=========================================="

  # CPU %
  cpu=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | cut -d',' -f1)
  cpu_color="\033[32m"  # green
  [ $(echo "$cpu > 80" | bc) -eq 1 ] && cpu_color="\033[31m"  # red
  echo -e "CPU:  ${cpu_color}${cpu}%\033[0m"

  # RAM %
  ram=$(free | grep Mem | awk '{printf("%.1f"), $3/$2 * 100.0}')
  ram_color="\033[32m"
  [ $(echo "$ram > 80" | bc) -eq 1 ] && ram_color="\033[31m"
  echo -e "RAM:  ${ram_color}${ram}%\033[0m"

  # DISK %
  disk=$(df / | awk 'NR==2{printf "%.1f", $5}')
  disk_color="\033[32m"
  [ $(echo "$disk > 85" | bc) -eq 1 ] && disk_color="\033[31m"
  echo -e "DISK: ${disk_color}${disk}%\033[0m"

  # SWAP %
  swap=$(free | grep Swap | awk '{printf "%.1f", $3/$2 * 100.0}')
  echo "SWAP: $swap%"

  # TOP 5 PROCESSES
  echo ""
  echo "🔥 TOP PROCESSES:"
  ps aux --sort=-%cpu | head -6 | awk '{printf "%-10s %-10s %s\n", $4"%", $11, $12}'

  sleep 2
done

