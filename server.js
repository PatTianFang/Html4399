const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors'); // 引入 CORS 中间件
const app = express();
const PORT = 3000;

// 使用 body-parser 解析 JSON 请求体
app.use(bodyParser.json());

// 允许跨域请求
app.use(cors());

// 模拟数据库文件
const DB_FILE = './users.json';

// 初始化数据库文件
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf8'); // 确保以 UTF-8 编码写入
}

// 注册接口
app.post('/register', (req, res) => {
    const { username, password, avatar } = req.body; // 添加 avatar 字段
    console.log('收到注册请求:', req.body); // 添加日志
    if (!username || !password) {
        console.error('注册失败: 用户名或密码为空');
        return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    try {
        const users = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); // 确保以 UTF-8 编码读取
        if (users.find(user => user.username === username)) {
            console.error('注册失败: 用户名已存在');
            return res.status(400).json({ message: '用户名已存在' });
        }

        users.push({ username, password, avatar: avatar || 'IMG/default-avatar.png' }); // 默认头像
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8'); // 确保以 UTF-8 编码写入
        console.log('注册成功:', { username, avatar });
        res.status(201).json({ message: '注册成功' });
    } catch (error) {
        console.error('写入文件时出错:', error);
        res.status(500).json({ message: '服务器内部错误，请稍后再试' });
    }
});

// 登录接口
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('收到登录请求:', req.body); // 添加日志
    if (!username || !password) {
        console.error('登录失败: 用户名或密码为空');
        return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    try {
        const users = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); // 确保以 UTF-8 编码读取
        const user = users.find(user => user.username === username && user.password === password);
        if (!user) {
            console.error('登录失败: 用户名或密码错误');
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        console.log('登录成功:', username);
        res.status(200).json({ message: `欢迎回来，${username}` });
    } catch (error) {
        console.error('读取文件时出错:', error);
        res.status(500).json({ message: '服务器内部错误，请稍后再试' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，监听端口 ${PORT}`);
});
