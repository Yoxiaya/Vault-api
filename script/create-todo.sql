-- 创建 todo-db 表结构


CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
)