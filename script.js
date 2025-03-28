// 预留交互逻辑
console.log("小游戏导航页面已加载");

function navigateTo(url) {
    window.location.href = url;
}

function filterGames() {
    const searchValue = document.getElementById('searchBox').value.toLowerCase();
    const games = document.querySelectorAll('.game-item');
    games.forEach(game => {
        const gameName = game.querySelector('a').textContent.toLowerCase();
        game.style.display = gameName.includes(searchValue) ? 'block' : 'none';
    });
}

function filterCategory(category) {
    const games = document.querySelectorAll('.game-item');
    games.forEach(game => {
        if (category === 'all' || game.dataset.category === category) {
            game.style.display = 'block';
        } else {
            game.style.display = 'none';
        }
    });
}

function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.style.getPropertyValue('--background-color') === '#333';
    if (isDark) {
        root.style.setProperty('--background-color', '#f9f9f9');
        root.style.setProperty('--text-color', '#333');
        root.style.setProperty('--header-background', '#4CAF50');
        root.style.setProperty('--header-text', 'white');
        root.style.setProperty('--button-background', '#4CAF50');
        root.style.setProperty('--button-text', 'white');
        root.style.setProperty('--button-hover', '#45a049');
        root.style.setProperty('--nav-background', '#333');
        root.style.setProperty('--about-background', '#f4f4f4');
    } else {
        root.style.setProperty('--background-color', '#333');
        root.style.setProperty('--text-color', '#f9f9f9');
        root.style.setProperty('--header-background', '#222');
        root.style.setProperty('--header-text', '#f9f9f9');
        root.style.setProperty('--button-background', '#555');
        root.style.setProperty('--button-text', '#f9f9f9');
        root.style.setProperty('--button-hover', '#777');
        root.style.setProperty('--nav-background', '#222');
        root.style.setProperty('--about-background', '#444');
    }
}

async function login() {
    const username = prompt("请输入用户名：");
    const password = prompt("请输入密码：");
    if (username && password) {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            alert(result.message);
            if (response.ok) {
                document.getElementById('welcomeMessage').textContent = `欢迎回来，${username}！`;
            }
        } catch (error) {
            alert('登录失败，请稍后再试');
        }
    } else {
        alert("登录取消");
    }
}

async function register() {
    const username = prompt("请输入注册用户名：");
    const password = prompt("请输入注册密码：");
    if (username && password) {
        const avatar = prompt("请输入头像图片的URL（可选）：", "IMG/default-avatar.png");
        try {
            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            }).then(response => response.json())
              .then(result => {
                  alert(result.message);
                  if (result.message === '注册成功') {
                      document.getElementById('welcomeMessage').textContent = `欢迎，${username}！`;
                      document.getElementById('userAvatar').src = avatar || "IMG/default-avatar.png";
                  }
              });
        } catch (error) {
            alert('注册失败，请稍后再试');
        }
    } else {
        alert("注册取消");
    }
}

function updateLeaderboard(player, score) {
    const leaderboard = document.getElementById('leaderboardList');
    const newEntry = document.createElement('li');
    newEntry.textContent = `${player} - ${score}分`;
    leaderboard.appendChild(newEntry);
}
