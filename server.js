const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// 使用 body-parser 解析 JSON 请求体
app.use(bodyParser.json());

// 模拟数据库文件
const DB_FILE = './users.json';

// 初始化数据库文件
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// 注册接口
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const users = JSON.parse(fs.readFileSync(DB_FILE));
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: '用户名已存在' });
    }

    users.push({ username, password });
    fs.writeFileSync(DB_FILE, JSON.stringify(users));
    res.status(201).json({ message: '注册成功' });
});

// 登录接口
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    const users = JSON.parse(fs.readFileSync(DB_FILE));
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
    }

    res.status(200).json({ message: `欢迎回来，${username}` });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，监听端口 ${PORT}`);
});
