import express from 'express';
const app = express();
app.use(express.json());

// 本地/线上通用数据库逻辑
let DB: any;
const isCloudflare = typeof (globalThis as any).DB !== 'undefined';

if (isCloudflare) {
	DB = (globalThis as any).DB;
} else {
	const sqlite3 = require('sqlite3').verbose();
	DB = new sqlite3.Database('./local.db');
}

// 测试接口
app.get('/', (req, res) => {
	res.send('✅ Express 运行成功！');
});

// 列表接口
app.get('/api/items', async (req, res) => {
	try {
		if (isCloudflare) {
			const { results } = await DB.prepare('SELECT * FROM items').all();
			res.json(results);
		} else {
			DB.all('SELECT * FROM items', [], (err, rows) => {
				if (err) return res.status(500).json({ error: err.message });
				res.json(rows);
			});
		}
	} catch (e) {
		res.status(500).json({ error: '数据库错误' });
	}
});

// 👇 只保留这一段导出，不要 app.listen！
export default app;
