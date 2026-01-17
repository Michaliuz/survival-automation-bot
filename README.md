markdown
# 🎵 Survival Automation Bot

<div align="center">

![Discord Bot](https://img.shields.io/badge/Discord_Bot-100%25_Automated-7289DA?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/Discord.js-14.x-5865F2?style=for-the-badge&logo=discord)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

*A powerful Discord bot with auto-react features for music communities*

![Bot Demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjVmaHdsNnE4M2tvbGlseG0waWhnNnNoNnI3Z2lmY3Z1c3V3MmVneiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5t9w9bZjqyvq6ItZ5C/giphy.gif)

</div>

## ✨ **Features**

### 🤖 **Auto-React System**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHc2MDA2cHZ3ZHo1b2ExajJqNW5xOHBldHdkZTNhdjhhdGxrbWF4cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26FffyN4w0hauTbhu/giphy.gif" width="400" />
</div>

- **✨ Intro Auto-React**: Automatically reacts to introductions with sparkle effects
- **🎵 Music Auto-React**: Reacts to music file submissions with animated emojis
- **🎨 Art Auto-React**: Reacts to artwork/images with artistic flair
- **🔧 Customizable**: Set custom channels and reaction emojis
- **🌈 Visual Effects**: Smooth animations and particle effects

### ⚡ **Commands**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2hhYjZ1MjV6bTlpcG9uN2ptMHJ3dTVtbndhN3l2dXVqcW1wMXBxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif" width="400" />
</div>

- **Slash Commands**: Modern `/` commands
- **Prefix Commands**: Traditional `!` commands
- **Dual Support**: Both command systems work simultaneously
- **Mobile Optimized**: Touch-friendly interface

### 🚀 **Other Features**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTNzMGI2ZGJwcG9rdHRrODBkOXB5aGJzY21xbjRuc2QybTJ2YndjeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abldj0b3rxrZUxW/giphy.gif" width="400" />
</div>

- **Multi-Server Ready**: Built for public use
- **Status Rotation**: Customizable bot status
- **Auto Welcome**: Welcome messages in DMs
- **Command Logging**: Tracks all commands
- **Error Handling**: Graceful error recovery
- **Special Effects**: Celebration animations for milestones

## 📦 **Installation**

### **Prerequisites**
- Node.js 16.9.0 or higher
- Discord Bot Token
- Basic terminal knowledge

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm5wZGcwcDJxMWV5bHc0Y2dmMjYyOW52MmtqNGJqNm4zZW4zMjV4cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/coxQHKcGiHvQrYjtqC/giphy.gif" width="400" />
</div>

### **Step 1: Clone Repository**
```bash
git clone https://github.com/RAK-MUSIC/survival-automation-bot.git
cd survival-automation-bot
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Configure Bot**
```bash
cp .env.example .env
```

Edit `.env` file:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_server_id_here
OWNER_ID=your_discord_id_here
```

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGlsZWUwY2h2eWtzdHkzcDZrcjFpM3I4dThka2Y1cmFudGhtZGh5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y4ak9Ki2GZCbJxUnJD/giphy.gif" width="400" />
</div>

### **Step 4: Deploy Commands**
```bash
npm run deploy
```

### **Step 5: Start Bot**
```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

## 📖 **Commands**

### **Administrator Commands**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnJzNXZrbDZyN2hlNmJ2aHNyNnJjYmJ2MGFmczF3eDh1bDd4bWVsZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYNox7hK2vZkzP2/giphy.gif" width="400" />
</div>

| Command | Description | Example |
|---------|-------------|---------|
| `/intro-react set` | Set introduction channel | `/intro-react set #welcome` |
| `/music-react set` | Set music submission channel | `/music-react set #music` |
| `/art-react set` | Set artwork channel | `/art-react set #artwork` |
| `/bot-status add` | Add bot status rotation | `/bot-status add "🎵 Playing Music"` |

### **User Commands**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FqdnRlZGt5YWM1YmFscjk3ZXE0dnY0Z3RrZWx6MHYzZ2twOTNoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiN0L7EW5trfOvEk0/giphy.gif" width="400" />
</div>

| Command | Description | Effect |
|---------|-------------|--------|
| `/ping` | Check bot latency | ⚡ Speed display |
| `/help` | Show all commands | 📖 Interactive guide |
| `!ping` | Prefix version of ping | ⚡ Same as slash |

## 🏗️ **Project Structure**

```
survival-automation-bot/
├── bot.js                 # Main launcher
├── index.js              # Bot core
├── deploy-commands.js    # Command deployer
├── config.json           # Bot configuration
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
└── commands/            # Command files
    ├── intro-react.js
    ├── music-react.js
    ├── art-react.js
    ├── ping.js
    ├── help.js
    └── autobotstatusupdate.js
```

## 🎨 **Customization**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGI5NDJzajltb3YycnI4bWNvcWR5NWU0eW5lMHN0Y3MxN3Z5aGd5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKsQ8gTp3WqXqjq/giphy.gif" width="400" />
</div>

### **Channel Setup**
Configure auto-react channels using these commands:
- `/intro-react set #channel-name` - Set introduction channel
- `/music-react set #channel-name` - Set music channel
- `/art-react set #channel-name` - Set art channel

### **Reaction Emojis**
Default emojis used:
- **Introductions**: 👋, 🤝, ✨
- **Music**: 🎵, 🎶, 🔊
- **Artwork**: 🎨, 🖼️, 👏

## 🤝 **Contributing**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHk5aGJwdWUyZmM0dXBkYjA1aHZtN3J0eGRqYjBsZ3F2Nzc5eW42OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/duNowzaVjeBK/giphy.gif" width="400" />
</div>

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📞 **Support**

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN21hbm50cjl3NjBlNDk3OXZmbG5nbTR3MmJzcXVxYmhsa2o2amx0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L8K62iTDkzGX6/giphy.gif" width="400" />
</div>

- **Create an Issue**: [GitHub Issues](https://github.com/RAK-MUSIC/survival-automation-bot/issues)
- **Join our Discord Server**: [Discord Invite Link]
- **Email Support**: your-email@example.com

## 👤 **Developer**

**RAK** - Music Producer & Developer  
- **GitHub**: [@codesbySurvive](https://github.com/codesbySurvive)
- **Discord**: RAK#0000

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3N2bWNvNHhtcmZ5ODJ3aDlpcGNsZzlwNTJtdjNsc2VuYjUzc3JxcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abGQa0eQfgdXkKk/giphy.gif" width="400" />
</div>

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ **Star this repository if you found it useful!** ⭐

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGE1ZjJqem5sOG5yMHVpM2J1azQ5M2w5dzRhZXBtN3I4bWR5NGU1ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMHxhOfscxPfIfm/giphy.gif" width="300" />
</div>

**Experience the cool effects and smooth automation!** ✨🎵🎨

</div>
