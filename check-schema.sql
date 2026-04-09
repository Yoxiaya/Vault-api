-- check-schema.sql
-- 查看所有表
SELECT '=== All Tables ===' as "";
SELECT name FROM sqlite_master 
WHERE type='table' AND name NOT LIKE 'sqlite_%' 
ORDER BY name;

-- 查看 todos 表结构（如果存在）
SELECT '=== Todos Table Structure ===' as "";
SELECT * FROM pragma_table_info('todos');

-- 查看 todos 表数据量
SELECT '=== Todos Table Data Count ===' as "";
SELECT COUNT(*) as total_rows FROM todos;