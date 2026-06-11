#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# 将远程 D1 数据同步到本地
###############################################################################

DB_NAME="vault"
DUMP_FILE="./.wrangler/remote-dump.sql"

echo ">>> 导出远程数据..."
npx wrangler d1 export "$DB_NAME" --remote --output="$DUMP_FILE"

echo ""
echo ">>> 清理本地表..."
npx wrangler d1 execute "$DB_NAME" --local --file="$SCRIPT_DIR/clean-local-db.sql"

echo ""
echo ">>> 同步到本地数据库..."
npx wrangler d1 execute "$DB_NAME" --local --file="$DUMP_FILE"

echo ""
echo ">>> 清理临时文件..."
rm -f "$DUMP_FILE"

echo ""
echo "✅ 同步完成，运行 bash script/db-inspect.sh 查看本地数据"
