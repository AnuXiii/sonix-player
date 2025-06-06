# 🎧 Sonix Player

**Sonix Player** is a modern, customizable audio player built as a Web Component.  
It’s designed to be lightweight, framework-agnostic, and flexible — ready to work with **React**, **Vue**, **Vite**, or even plain **HTML/CSS/JS**.

> ✨ Easily add playback controls, thumbnails, volume, speed, repeat options and more to your web apps.

---

## 🚀 Installation

### With NPM (for frameworks like Vite, React, Vue, etc.)

```bash
npm install sonix-player
```

# 📦 Usage

# Vite / React / Vue

// main.js or App.js
import 'sonix-player/dist/sonix-player.css';
import 'sonix-player'; // Automatically registers the <c-audio> custom element

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sonix Player</title>
  <link rel="stylesheet" href="https://unpkg.com/sonix-player@1.0.4/dist/sonix-player.css" />
</head>
<body>
    <c-audio
                    data-src="/phonk.mp4"
                    data-thumbnail="/phonk.jpg"
                    data-figure="/phonk.jpg"
                    data-artist="phonk"
                    data-name="phonk music"
                    data-auto="false"
                    data-volume="true"
                    data-repeat="true"
                    data-speed="true"
                    data-max="3"
                    data-download="true"
                    data-accent="oklch(58.6% 0.253 17.585)"
                    data-primary="oklch(21% 0.006 285.885)"
                    data-secondary="oklch(96.9% 0.016 293.756)">
    </c-audio>

  <script type="module" src="https://unpkg.com/sonix-player@1.0.4/dist/sonix-player.es.js"></script>
</body>
</html>

# ⚙️ Features

✅ Lightweight & fast

🎨 Fully styled with Tailwind CSS

🖼️ Supports thumbnails

🔁 Repeat mode

⏩ Playback speed control

🔉 Volume slider

💾 Download button

🌙 Dark mode–friendly

💡 Web Component – works anywhere!

# 📂 Attributes

| Attribute        | Description                        | Example                 |
| ---------------- | ---------------------------------- | ----------------------- |
| `data-src`       | Audio file source                  | `/music.mp3"`           |
| `data-thumbnail` | Thumbnail Image on player top      | `/cover.png"`           |
| `data-figure`    | Figure of track Image              | `"/img.png"`            |
| `data-artist`    | Track Artist name                  | `Linkin Park`           |
| `data-name`      | Track name                         | `Let the end`           |
| `data-auto`      | Auto Play audio then loaded        | `true or false`         |
| `data-volume`    | Show Volume Control Button         | `true or false`         |
| `data-repeat`    | Show Repeat Control Button         | `true or false`         |
| `data-speed`     | Show Speed Button                  | `true or false`         |
| `data-max`       | Max Speed for Speed Control Button | `number`                |
| `data-download`  | Show Download Track Button         | `true & false`          |
| `data-accent`    | Player accent color                | `#fff - oklch(0 0 0 0)` |
| `data-primary`   | Player primary color               | `#fff - oklch(0 0 0 0)` |
| `data-seconadry` | Player seconadry color             | `#fff - oklch(0 0 0 0)` |

# 🛠️ Development

To clone and run locally:

git clone https://github.com/AnuXiii/sonix-player
cd sonix-player
npm install
npm run dev

# To build for production:

npm run build

# 📦 CDN & UNPKG

ES Module: https://unpkg.com/sonix-player@1.0.4/dist/sonix-player.es.js
CSS File: https://unpkg.com/sonix-player@1.0.4/dist/sonix-player.css

# 📄 License

MIT © <a href="https://github.com/AnuXiii" target="_blakn">AnuXiii<a/>

🌟 Star the Repo
If you find this package useful, please consider starring the repo!
Your support helps improve and grow this project ❤️
