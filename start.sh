#!/usr/bin/env bash
# ============================================
# Vault API - 开发服务器启动脚本
# 用法:
#   bash start.sh              # 自动检测 IP，默认端口 8787，远程数据库
#   bash start.sh -i 0.0.0.0   # 手动指定 IP
#   bash start.sh -p 3000      # 手动指定端口
#   bash start.sh -m local     # 本地模拟模式
#   bash start.sh -i 10.0.0.26 -p 3000 -m dev
# ============================================

set -e

# ---- 默认值 ----
IP=""
PORT=8787
MODE="dev"

# ---- 解析参数 ----
while [[ $# -gt 0 ]]; do
  case $1 in
    -i|--ip)   IP="$2"; shift 2 ;;
    -p|--port) PORT="$2"; shift 2 ;;
    -m|--mode) MODE="$2"; shift 2 ;;
    -h|--help)
      echo "用法: bash start.sh [选项]"
      echo ""
      echo "选项:"
      echo "  -i, --ip    IP      绑定的 IP 地址 (默认自动检测)"
      echo "  -p, --port  PORT    监听端口 (默认 8787)"
      echo "  -m, --mode  MODE    运行模式: dev | local (默认 dev)"
      echo "  -h, --help          显示帮助"
      exit 0
      ;;
    *) echo "[错误] 未知参数: $1"; exit 1 ;;
  esac
done

# ---- 自动检测本机局域网 IPv4 ----
detect_ip() {
  # Linux (ip route)
  if command -v ip &>/dev/null; then
    local detected
    detected=$(ip -4 route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')
    if [[ -n "$detected" ]]; then
      echo "$detected"
      return
    fi
  fi

  # macOS
  if command -v ifconfig &>/dev/null; then
    local detected
    detected=$(ifconfig 2>/dev/null | grep -Eo 'inet (addr:)?([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)' | grep -Eo '([0-9]+\.){3}[0-9]+' | grep -v '127.0.0.1' | head -1)
    if [[ -n "$detected" ]]; then
      echo "$detected"
      return
    fi
  fi

  # Windows Git Bash / WSL — 调用 ipconfig.exe
  if command -v ipconfig.exe &>/dev/null; then
    local detected
    detected=$(ipconfig.exe 2>/dev/null | grep -Eo 'IPv4[^:]*: ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)' | grep -Eo '([0-9]+\.){3}[0-9]+' | grep -v '127.0.0.1' | head -1)
    if [[ -n "$detected" ]]; then
      echo "$detected"
      return
    fi
  fi

  # 兜底
  echo "0.0.0.0"
}

if [[ -z "$IP" ]]; then
  IP=$(detect_ip)
fi

# ---- 检查 .dev.vars ----
if [[ ! -f ".dev.vars" ]]; then
  echo -e "\033[31m[警告] 未找到 .dev.vars 文件！\033[0m"
  echo -e "\033[33m请复制 .dev.vars.example 为 .dev.vars 并填入密钥：\033[0m"
  echo "  cp .dev.vars.example .dev.vars"
  echo ""
fi

# ---- 显示启动信息 ----
LAN_IP="$IP"
if [[ "$IP" == "0.0.0.0" ]]; then
  LAN_IP=$(detect_ip)
fi

echo ""
echo -e "\033[36m╔════════════════════════════════════════╗\033[0m"
echo -e "\033[36m║     Vault API - 开发服务器             ║\033[0m"
echo -e "\033[36m╚════════════════════════════════════════╝\033[0m"
echo ""
echo -e "  模式      : \033[33m$MODE\033[0m"
echo -e "  监听 IP   : \033[33m$IP\033[0m"
echo -e "  监听端口  : \033[33m$PORT\033[0m"
echo ""
echo -e "  \033[32m访问地址:\033[0m"
echo -e "    本地:   http://localhost:$PORT"
if [[ "$IP" != "127.0.0.1" ]]; then
  echo -e "    局域网: http://${LAN_IP}:$PORT"
fi
echo ""
echo -e "\033[90m  按 Ctrl+C 停止服务器\033[0m"
echo ""

# ---- 启动 Wrangler ----
WRANGLER_ARGS=("dev")

if [[ "$MODE" == "local" ]]; then
  WRANGLER_ARGS+=("--local")
fi

WRANGLER_ARGS+=("--ip" "$IP" "--port" "$PORT")

exec npx wrangler "${WRANGLER_ARGS[@]}"
