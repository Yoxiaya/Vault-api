-- check-schema.sql
-- 数据库诊断查询（只读）
SELECT '=== All Tables ===' as "";
SELECT name FROM sqlite_master
WHERE type='table' AND name NOT LIKE 'sqlite_%'
ORDER BY name;

-- 查看 users 表结构
SELECT '=== users Table Structure ===' as "";
SELECT * FROM pragma_table_info('users');

-- 查看 accounts 表结构
SELECT '=== accounts Table Structure ===' as "";
SELECT * FROM pragma_table_info('accounts');

-- 查看各表数据量
SELECT '=== Table Data Count ===' as "";
SELECT 'users' as table_name, COUNT(*) as total_rows FROM users
UNION ALL
SELECT 'accounts', COUNT(*) FROM accounts
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'email_verifications', COUNT(*) FROM email_verifications;