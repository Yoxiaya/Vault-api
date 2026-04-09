import express from 'express';
const app = express();

// 解析 JSON
app.use(express.json());

// 测试接口（本地一定能访问）
app.get('/', (req, res) => {
	res.send('✅ Express 运行成功！');
});

// API 列表
app.get('/api/items', async (req, res) => {
	try {
		// @ts-ignore
		const { results } = await DB.prepare(`SELECT * FROM items`).all();
		res.json(results);
	} catch (err) {
		res.status(500).json({ error: '数据库错误' });
	}
});

// 新增
app.post('/api/items', async (req, res) => {
	const { title } = req.body;
	if (!title) return res.status(400).json({ error: 'title 不能为空' });

	try {
		// @ts-ignore
		await DB.prepare(`INSERT INTO items (title) VALUES (?)`).bind(title).run();
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ error: '保存失败' });
	}
});

// 本地启动
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`✅ 本地服务已启动：http://localhost:${PORT}`);
});

export default app;
