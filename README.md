# 🧮 Minimalist iOS-Style Dark Calculator

A modern, responsive, and accessible dark-mode calculator built with pure **HTML5**, **CSS Grid**, and vanilla **JavaScript**. Designed with an iOS-inspired aesthetic and accurate arithmetic calculations without using `eval()`.

---

## ✨ Features

- **Minimalist Dark UI**: Inspired by the clean, ergonomic iOS calculator design.
- **CSS Grid Layout**: Responsive 4-column grid layout with smooth micro-interactions.
- **Accurate Math Engine**: Pure vanilla JavaScript calculation logic with floating-point precision correction (`0.1 + 0.2 = 0.3`).
- **Core Operations**:
  - Addition (`+`), Subtraction (`−`), Multiplication (`×`), Division (`÷`)
  - Chained operations (e.g., `5 + 3 + 2 = 10`)
  - All Clear (`AC`), Toggle sign (`±`), and Percentage (`%`)
  - Division by zero error handling
- **Hardware Keyboard Support**: Use standard number keys, operators, `Enter`, and `Escape`.
- **Zero Dependencies**: Lightweight, fast, and 100% vanilla web standards.

---

## 🚀 Live Demo

You can enable **GitHub Pages** in your repository settings to host this live for free:
> `https://<your-username>.github.io/<your-repo-name>/`

---

## 📁 Project Structure

```text
├── index.html        # Main HTML structure & semantic markup
├── style.css         # Modern styling, CSS variables & CSS Grid layout
├── script.js         # Modular JavaScript logic and event listeners
├── calculator.html   # Standalone all-in-one single-file version
└── README.md         # Documentation & guide
```

---

## 🛠️ How to Run Locally

No build tools, bundlers, or Node.js required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   ```
2. **Navigate into the project directory:**
   ```bash
   cd <your-repo-name>
   ```
3. **Open the project:**
   - Double-click `index.html` to open directly in your favorite web browser.
   - Or run a local server with VS Code's **Live Server** extension.

---

## 💻 Tech Stack

- **HTML5**: Semantic tags, accessibility attributes (`aria-*`), and `data-*` attributes.
- **CSS3**: CSS Grid, Flexbox, CSS Custom Properties (Variables), and subtle transitions.
- **JavaScript (ES6+)**: Event listeners, DOM manipulation, state machine pattern.

---

## 📝 License

Distributed under the MIT License. Feel free to use, modify, and build upon this project!
