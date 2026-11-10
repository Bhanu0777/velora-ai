# VELORA — Deployment & Custom Domain Guide

This document details the production deployment process on **Vercel** and the configuration required to connect your custom domain (e.g. `velora.ai` or `app.velora.ai`).

---

## 1. Quick Deploy to Vercel

### Option A: Using the Vercel CLI (Fastest)
1. Install the Vercel CLI if you haven't already:
   ```bash
   npm i -g vercel
   ```
2. Log in and deploy from the project root (`d:\apps`):
   ```bash
   vercel
   ```
3. For the production build:
   ```bash
   vercel --prod
   ```

### Option B: Deploying via GitHub / Git Repository
1. Push your local Git repository to GitHub, GitLab, or Bitbucket:
   ```bash
   git remote add origin https://github.com/<your-username>/velora.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep the default build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Click **Deploy**.

---

## 2. Connecting a Custom Domain

As specified in the launch requirements, follow these steps to connect your custom domain to VELORA:

1. In your **Vercel Dashboard**, open the **VELORA** project.
2. Navigate to **Settings** → **Domains**.
3. Enter your custom domain (e.g., `velora.ai` or `app.velora.ai`) and click **Add**.
4. Configure DNS records at your domain registrar (Namecheap, Cloudflare, Google Domains, etc.):

   ### For Apex Domains (e.g., `velora.ai`):
   | Type | Name | Value | TTL |
   | :--- | :--- | :--- | :--- |
   | **A** | `@` | `76.76.21.21` | Auto / 3600 |

   ### For Subdomains (e.g., `app.velora.ai`):
   | Type | Name | Value | TTL |
   | :--- | :--- | :--- | :--- |
   | **CNAME** | `app` | `cname.vercel-dns.com.` | Auto / 3600 |

5. Wait 2–5 minutes for DNS propagation. Vercel will automatically provision a free, auto-renewing Let's Encrypt SSL/TLS certificate.
6. Verify your domain is active and showing **Valid Configuration** with a green checkmark.

---

## 3. Post-Deployment Verification Checklist

- [x] Custom Favicon and Apple Touch Icons loading correctly (`/favicon.svg`, `/icon.png`, `/apple-icon.png`).
- [x] Zero third-party telemetry, ads, or "Made with AI" badges.
- [x] Privacy Policy accessible at `/privacy`.
- [x] Terms & Conditions accessible at `/terms`.
- [x] Mobile responsiveness and safe area insets tested.
- [x] PWA installability confirmed (`/manifest.webmanifest`, `/sw.js`).
- [x] Puter.js client initialized and ready for user authentication & cloud KV sync.
