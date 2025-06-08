# 🎧 Sonix Player

<br>

**Sonix Player** is a modern, customizable audio player built as a Web Component.  
It’s designed to be lightweight, framework-agnostic, and flexible — ready to work with **React**, **Vue**, **Vite**, or even plain **HTML/CSS/JS**.

<br>

> ✨ Easily add playback controls, thumbnails, volume, speed, repeat options and more to your web apps.

<br>

## 🚀 Installation

<br>

### With NPM (for frameworks like Vite, React, Vue, etc.)

<br>

```bash
npm install sonix-player
```

<br>

# 🧩 Framework Integration Guide (Vite, React, Vue)

<br>

Sonix Player is built as a Web Component, which makes it super easy to use in any modern JavaScript framework like React, Vue, or apps powered by Vite.

<br>

## 📦 1. Installation

<br>

Install the package via npm:

<br>

```bash
    npm install sonix-player
```

<br>

## 🧠 2. Usage in Vite

<br>

In your main.js or main.ts file:

<br>

```bash
    import 'sonix-player';
    import 'sonix-player/dist/sonix-player.css';
```

<br>

Use the component anywhere in your app (HTML syntax):

<br>

```bash
    <sonix-player
        data-src="/audio/song.mp3"
        data-thumbnail="/images/cover.jpg"
        data-figure="/images/figure.jpg"
        data-artist="Let The End"
        data-name="Linkin Park"
    ></sonix-player>
```

<br>

## 🧪 e.g

<br>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sonix Player</title>
  <link rel="stylesheet" href="https://unpkg.com/sonix-player@1.5.0/dist/sonix-player.css" />
</head>
<body>
    <sonix-player
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
                    data-black="#121212"
                    data-accent="oklch(58.6% 0.253 17.585)"
                    data-primary="oklch(21% 0.006 285.885)"
                    data-secondary="oklch(96.9% 0.016 293.756)">
    </sonix-player>

  <script type="module" src="https://unpkg.com/sonix-player@1.5.0/dist/sonix-player.es.js"></script>
</body>
</html>

<br>

## ⚙️ Features

<br>

✅ Lightweight & fast

🎨 Fully styled with Tailwind CSS

🖼️ Supports thumbnails

🔁 Repeat mode

⏩ Playback speed control

🔉 Volume slider

💾 Download button

🌙 Dark mode–friendly

💡 Web Component – works anywhere!

<br>

# 📂 Attributes

| Attribute        | Description                        | Example and Default Value |
| ---------------- | ---------------------------------- | ------------------------- |
| `data-src`       | Audio file source                  | `/music.mp3" - hidden`    |
| `data-thumbnail` | Thumbnail Image on player top      | `/cover.png" - hidden`    |
| `data-figure`    | Figure of track Image              | `"/img.png" - hidden`     |
| `data-artist`    | Track Artist name                  | `Linkin Park - hidden`    |
| `data-name`      | Track name                         | `Let the end - hidden`    |
| `data-auto`      | Auto Play audio then loaded        | `true or false - false`   |
| `data-volume`    | Show Volume Control Button         | `true or false - true`    |
| `data-repeat`    | Show Repeat Control Button         | `true or false - true`    |
| `data-speed`     | Show Speed Button                  | `true or false - true`    |
| `data-max`       | Max Speed for Speed Control Button | `number - 2`              |
| `data-download`  | Show Download Track Button         | `true or false - true`    |
| `data-black`     | Player black color                 | `color - #121212`         |
| `data-accent`    | Player accent color                | `color - #fff`            |
| `data-primary`   | Player primary color               | `color - #303030`         |
| `data-seconadry` | Player seconadry color             | `color - #ff4600`         |

<br>

# 🛠️ Development

<br>

To clone and run locally:

git clone https://github.com/AnuXiii/sonix-player
cd sonix-player
npm install
npm run dev

<br>

# To build for production:

<br>

npm run build

<br>

# 📦 CDN & UNPKG

<br>

Get the Last Version : https://app.unpkg.com/sonix-player

<br>

# 📄 License

<br>

MIT © <a href="https://github.com/AnuXiii" target="_blank">AnuXiii<a/>

<br>

🌟 Star the Repo
If you find this package useful, please consider starring the repo!
Your support helps improve and grow this project ❤️

<br>

<br>

### sonix-player website will be coming up soon 🔜

<br>
