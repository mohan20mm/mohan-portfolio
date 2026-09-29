# Mohan M — Portfolio (static site)

Plain HTML + CSS + JS. No build step, no dependencies.

## Pages
| File | What it is |
|---|---|
| `index.html` | **One-page scroller** — Hero, About, Skills, Experience, Services, Results, Work, Contact. Nav icons smooth-scroll between sections, active icon highlights as you scroll, progress bar on top. |
| `about.html` `skills.html` `experience.html` `contact.html` | Separate pages (Experience page = Experience + Services + Results + Selected Work). |
| `privacy-policy.html` `terms-of-use.html` | Placeholders — replace text before launch. |

## 1. Run in VS Code
1. Install VS Code + the **Live Server** extension.
2. `File > Open Folder` → this folder.
3. Right-click `index.html` → **Open with Live Server**.

## 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 3. Deploy on Cloudflare Pages (free)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repo. Framework preset: **None**. Build command: *(leave empty)*. Output directory: `/` (root).
3. Deploy — you get a `*.pages.dev` URL immediately. Every `git push` redeploys automatically.

## 4. Add your domain later
- Buy the domain (Cloudflare Registrar is easiest), then Pages project → **Custom domains → Set up a custom domain**. DNS + HTTPS are configured automatically if the domain is on Cloudflare.
- Then find/replace `YOURDOMAIN.com` with the real domain in all `.html` files, `robots.txt` and `sitemap.xml`.

## 5. Analytics / tracking tags
Every page has a commented **ANALYTICS & TRACKING** block in `<head>`. Uncomment the GA4 snippet and replace `G-XXXXXXXXXX` (or paste a GTM / Meta Pixel snippet). Do it on each page (or find/replace across the folder in VS Code with Ctrl+Shift+H).

## Editing content
Text is plain HTML — search for the text in VS Code and edit. Colors/fonts are CSS variables at the top of `assets/css/style.css`.
