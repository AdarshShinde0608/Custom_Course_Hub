# 🎓 Custom Course Hub for Moodle

> A lightning-fast, ultra-modern external course dashboard designed for seamless embedding inside **Moodle Text / HTML blocks** via iframe.

[![Deployment Status](https://img.shields.io/badge/Deploy-Cloudflare%20Pages%20%7C%20GitHub%20Pages%20%7C%20Vercel-blue.svg)](#deployment-options)
[![Zero API Token](https://img.shields.io/badge/Security-Zero%20API%20Token%20Exposure-emerald.svg)](#security-architecture)
[![Iframe Ready](https://img.shields.io/badge/Iframe-CSP%20%26%20X--Frame--Options%20Configured-indigo.svg)](#iframe-configuration)

---

## 🌟 Why This Architecture?

Traditionally, adding custom HTML/CSS dashboards directly inside Moodle's block editor causes severe pain:
- Hard to maintain and update semester courses.
- Moodle's WYSIWYG editor can strip `<style>` tags, scripts, and responsive classes.
- Every small change requires logging in, editing blocks, and touching raw HTML.

### The Modern Solution:
1. **Maintain your courses cleanly in Git** in `data/courses.json`.
2. **Deploy to any free static host** (Cloudflare Pages, GitHub Pages, or Vercel).
3. **Embed once into Moodle** with a single `<iframe ...>` line.
4. **All updates automatically reflect in Moodle** whenever you push to GitHub!

```text
                     ┌──────────────────────────┐
                     │       GitHub Repo        │
                     │    data/courses.json     │
                     └────────────┬─────────────┘
                                  │ git push
                                  ▼
                     ┌──────────────────────────┐
                     │ Cloudflare Pages / Vercel│
                     │  (HTTPS Static Web App)  │
                     └────────────┬─────────────┘
                                  │
                                  │ <iframe>
                                  ▼
       ┌──────────────────────────────────────────────────────┐
       │                   Moodle Dashboard                   │
       │  ┌────────────────────────────────────────────────┐  │
       │  │             HTML / Text Block                  │  │
       │  │  ┌──────────────────────────────────────────┐  │  │
       │  │  │       Custom Course Hub (Iframe)         │  │  │
       │  │  │  • DBMS (Theory / Lab)                   │  │  │
       │  │  │  • OOP Java (Lab)                        │  │  │
       │  │  │  • ADS (Theory / Lab)                    │  │  │
       │  │  │  • EI (Theory / Lab)                     │  │  │
       │  │  │  • TOC (Theory)                          │  │  │
       │  │  │  • SY Project (Course Portal)            │  │  │
       │  │  └──────────────────────────────────────────┘  │  │
       │  └────────────────────────────────────────────────┘  │
       └──────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start: How to Embed in Moodle

### Step 1: Deploy the Repo
Deploy this repository to **Cloudflare Pages**, **GitHub Pages**, or **Vercel** (see [Deployment Options](#deployment-options) below).

### Step 2: Add Block in Moodle
1. Open your **Moodle Dashboard** (`moodle.mitaoe.ac.in`).
2. Click **"Edit mode"** / **"Customise this page"** at the top-right.
3. Click **"Add a block"** and select **"Text"** (or **"HTML"**).
4. Click the gear icon on the new block and choose **"Configure (new block)"**.
5. In the content editor, click the **"Show more buttons"** icon, then click the **HTML (`</>`)** button.
6. Paste the following snippet:

```html
<div style="width:100%; overflow:hidden; border-radius:14px;">
  <iframe
    src="https://YOUR-SUBDOMAIN.pages.dev/?embed=true"
    width="100%"
    height="750"
    style="border:0; width:100%; display:block;"
    loading="lazy"
    title="Custom Course Hub">
  </iframe>
</div>
```

7. Click **"Save changes"** and turn off Edit mode.

---

## ✨ Features

- **⚡ Instant Navigation**: Direct one-click access to Theory, Lab, and Project portals for every course.
- **🎯 `target="_top"` Links**: Clicking any Theory/Lab button navigates the top-level browser directly into Moodle instead of trapping the page inside the iframe.
- **🔍 Instant Search & Filter**: Search by course title, code (e.g. `ET2101`, `CS202`), topic keywords, or filter by course type (Theory, Lab, Project).
- **📌 Pin Favorites**: Star your most accessed courses to keep them pinned at the top.
- **🎨 Glassmorphism & Animated Stripes**: Dark/Light mode, subtle glowing ambient radial backdrops, and active hover stripe indicators.
- **📱 Responsive Layout**: Seamlessly adapts from desktop wide-screens to narrow mobile widgets and Moodle sidebar columns.
- **🔄 Iframe Auto-Height Communicator**: Uses `window.parent.postMessage({ type: 'COURSE_HUB_RESIZE', height: ... })` for dynamic height reporting.
- **🛠️ Built-in Course Manager**: Add new courses directly in the UI and click **"Download courses.json"** to sync back to your repository.

---

## 📁 Repository Structure

```text
Custom_Course_Hub/
├── index.html                  # Accessible dashboard UI shell
├── _headers                    # Cloudflare Pages security headers for iframe embedding
├── vercel.json                 # Vercel deployment header configuration
├── netlify.toml                # Netlify deployment header configuration
├── css/
│   ├── reset.css               # CSS Reset
│   ├── variables.css           # Design tokens, color palettes, dark/light variables
│   └── dashboard.css           # Glassmorphism, animations, grid/list layouts, modals
├── js/
│   ├── config.js               # Application configuration & default dataset fallback
│   ├── renderer.js             # Course card DOM generation & interactive rendering
│   ├── filters.js              # Real-time search, semester & type filtering, sorting
│   ├── navigation.js           # Target handling (_top), iframe auto-height postMessage
│   ├── modal.js                # Embed code generator & Course Editor/Export modal
│   └── app.js                  # Main controller, theme management & initialization
├── data/
│   └── courses.json            # Master JSON database of courses
├── assets/
│   ├── favicon.svg             # Modern SVG icon
└── README.md                   # Complete documentation
```

---

## 📊 Course Data Schema (`data/courses.json`)

To add, update, or remove courses, simply edit `data/courses.json`:

```json
[
  {
    "id": "dbms-a",
    "code": "ET2101",
    "title": "Database Management System-A",
    "semester": "SEM-IV",
    "academicYear": "2025-26",
    "type": "Theory + Lab",
    "theme": "indigo",
    "icon": "database",
    "instructor": "Dept. of Computer Engineering",
    "description": "Relational database concepts, SQL queries, normalization, and transaction management.",
    "links": [
      {
        "name": "Theory",
        "url": "https://moodle.mitaoe.ac.in/course/view.php?id=5909",
        "badge": "Lecture",
        "type": "theory"
      },
      {
        "name": "Lab",
        "url": "https://moodle.mitaoe.ac.in/course/view.php?id=5910",
        "badge": "Practical",
        "type": "lab"
      }
    ],
    "isFavorite": true
  }
]
```

### Supported Theme Colors:
- `indigo` (Indigo Blue)
- `emerald` (Emerald Green)
- `purple` (Violet Purple)
- `amber` (Amber Orange)
- `cyan` (Sky Cyan)
- `rose` (Rose Pink)

---

## 🌐 Deployment Options

### Option 1: Cloudflare Pages (Recommended)
1. Push this repository to GitHub.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select this repository.
4. Set **Build command** to blank (none) and **Build output directory** to `.`.
5. Click **"Save and Deploy"**.
6. Cloudflare automatically uses `_headers` to allow iframe embedding across all origins.

### Option 2: GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Select `main` branch and `/ (root)` folder, then click **Save**.
5. Your dashboard will be live at `https://<username>.github.io/<repo-name>/`.

### Option 3: Vercel
1. Import the repository into [Vercel](https://vercel.com/).
2. Select **Other** as the framework preset and deploy.
3. The included `vercel.json` automatically configures `frame-ancestors *` headers.

---

## 🔒 Security & Privacy Architecture
- **Zero Credentials / Tokens**: This application is strictly frontend and does not store or require any user passwords or Moodle web-service tokens.
- **Direct Auth Delegation**: Clicking any Theory/Lab link navigates the student directly to Moodle's native authenticated URL (`course/view.php?id=...`). Moodle handles standard session authentication securely.
- **CSP Compliant**: Properly sets `Content-Security-Policy: frame-ancestors *` and `X-Frame-Options: ALLOWALL` so browsers allow Moodle to frame the application safely.

---

## 📄 License
MIT License. Built for students and educators seeking a seamless Moodle navigation experience.
