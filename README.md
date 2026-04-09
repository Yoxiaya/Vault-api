### wrangler 命令

> 使用本地数据库开发

```bash
npx wrangler dev --local
```

> 运行 SQL 语句

```bash
npx wrangler d1 execute 数据库名称 --local --command "SQL 语句"
```

> 运行 SQL 脚本

```bash
npx wrangler d1 execute 数据库名称 --local --file "SQL 脚本路径"
```

### 数据库初始化

> 创建数据库

```bash
wrangler d1 create todo-db
```

> 创建表结构

```bash
npx wrangler d1 execute todo-db --local --file "script/create-todo.sql"
```

>
