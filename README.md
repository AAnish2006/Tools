# DevToolBox — Free Online Developer & Productivity Tools

> ⚡ High-performance, 100% browser-based developer utilities with zero backend, local privacy guarantees, and complete SEO optimization.

**Live Domain**: [https://tools.trendbit.lol](https://tools.trendbit.lol)

---

## 🛠️ Built-in Tools

1. **Online Notepad (`/tools/notepad`)**:
   - Client-side auto-saving via `localStorage`
   - Default eye-comfort dark mode with light theme option
   - Edge-to-edge **Full Page** expansion mode
   - Font size scaling (14px–32px)
   - One-click `.txt` file export and clipboard copy

2. **Word & Character Counter (`/tools/word-counter`)**:
   - Real-time word, character (with and without space), sentence, and paragraph counters
   - Estimated reading and speaking durations
   - **Platform Character Limit Checker**:
     - **General**: 20,000 characters (default)
     - **X (Twitter)**: Standard (280), Premium (25,000), DMs (10,000), Bio (160)
     - **Instagram**: Caption (2,200), Bio (150)
     - **LinkedIn**: Post (3,000), Headline (220)
     - **YouTube**, **Facebook**, **TikTok**, **SEO Titles & Descriptions**, **SMS**
   - **Overflow Highlighter**: Real-time visual red highlighting for all extra characters exceeding limits with one-click automatic trim

3. **JSON Formatter & Validator (`/tools/json-formatter`)**:
   - Syntax validation with real-time error locating
   - Pretty-print with 2-space, 4-space, 8-space, or tab indentation
   - Minification engine for production payloads
   - One-click copy, sample data loader, and `.json` file download

4. **Image Resizer (`/tools/image-resizer`)**:
   - 100% in-browser HTML5 Canvas image resizing (zero upload delay)
   - Custom pixel dimensions with aspect ratio lock
   - Presets for Instagram Square, Story/Reels, YouTube Thumbnails, X Post, Facebook
   - Convert & compress between JPG, PNG, and WEBP with quality slider controls

---

## 🚀 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Pure Mobile-First Responsive CSS (Times New Roman typography)
- **Routing**: `react-router-dom` v7
- **SEO & Meta**: `react-helmet-async` with dynamic Open Graph, Twitter Cards, and Schema.org JSON-LD
- **Monetization**: Google AdSense / AdMob Web integration ready

---

## 📦 Project Setup

```bash
# Clone the repository
git clone https://github.com/AAnish2006/Tools.git
cd Tools

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 🔐 Environment Configuration

Copy `.env.example` to `.env` and provide your production variables:

```env
VITE_SITE_URL=https://tools.trendbit.lol
VITE_ADSENSE_CLIENT=ca-pub-3950161950238885
VITE_ADMOB_CLIENT_ID=ca-pub-3950161950238885
```

---

## 📄 License

MIT License. Free for personal and commercial use.
