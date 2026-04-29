-- check-schema.sql
-- 查看所有表
SELECT '=== All Tables ===' as "";
SELECT name FROM sqlite_master 
WHERE type='table' AND name NOT LIKE 'sqlite_%' 
ORDER BY name;

-- 查看表结构（如果存在）
SELECT '===  Table Structure ===' as "";
SELECT * FROM pragma_table_info('users');

-- 查看表数据量
SELECT '=== Table Data Count ===' as "";
SELECT COUNT(*) as total_rows FROM users;
-- 查看表数据
SELECT '=== Table Data ===' as "";
SELECT * FROM users;