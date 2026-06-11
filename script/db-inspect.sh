#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# 查看本地 / 远程 D1 数据库
#
# 用法:
#   bash script/db-inspect.sh                  # 本地数据库概览
#   bash script/db-inspect.sh --remote          # 远程数据库概览
#   bash script/db-inspect.sh --table users     # 查看指定表全部数据
#   bash script/db-inspect.sh --remote --table accounts
###############################################################################

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB_NAME="vault"
REMOTE=false
TABLE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --remote) REMOTE=true ;;
    --table)  TABLE="$2"; shift ;;
    *)        echo "未知参数: $1"; exit 1 ;;
  esac
  shift
done

MODE=$($REMOTE && echo "远程" || echo "本地")

echo ""
echo "========================================"
echo "  ${MODE}数据库概览 — ${DB_NAME}"
echo "========================================"

# 概览（使用预定义 SQL 文件）
FLAGS=(d1 execute "$DB_NAME")
$REMOTE && FLAGS+=(--remote) || FLAGS+=(--local)
FLAGS+=(--file="$SCRIPT_DIR/db-inspect.sql")

npx wrangler "${FLAGS[@]}" 2>&1

# 指定表数据导出
if [[ -n "$TABLE" ]]; then
  case "$TABLE" in
    users|accounts|sessions|profiles|email_verifications) ;;
    *)
      echo "无效表名，可选: users accounts sessions profiles email_verifications"
      exit 1
      ;;
  esac

  echo ""
  echo "========================================"
  echo "  ${MODE} ${TABLE} 表数据"
  echo "========================================"

  FLAGS=(d1 execute "$DB_NAME")
  $REMOTE && FLAGS+=(--remote) || FLAGS+=(--local)
  FLAGS+=(--command="SELECT * FROM $TABLE;")

  npx wrangler "${FLAGS[@]}" 2>&1
fi

echo ""
