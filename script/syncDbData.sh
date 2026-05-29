#!/bin/bash
# 列出所有 D1 数据库
npx wrangler d1 list

# 导出线上数据
npx wrangler d1 export vault --output=./online-dump.sql --remote

# 同步本地数据
npx wrangler d1 execute vault_db --local --file=./online-dump.sql

# 删除临时文件
rm -rf ./online-dump.sql
