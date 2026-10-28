# Deploying STILLFORM

Both kinds of site are static: the build output can go on any static host. Single-page routing is already configured: `public/_redirects` for Netlify and Cloudflare Pages, `vercel.json` for Vercel.

| | Your store | The showroom (live demo) |
| --- | --- | --- |
| **What it is** | A real shop: your catalogue in Supabase, checkout, the Studio at `/admin` | The full storefront, rail, lookbook, product pages and bag on the built-in collection. Checkout shows "This is a preview of the store." and there is no Studio |
| **Build command** | `npm run build` | `npm run build:demo` |
| **Output directory** | `dist` | `dist` |
| **Environment variables** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY` | None |
| **Needs** | A Supabase project, a Cloudflare Turnstile widget, a domain | Only a domain (or the host's free subdomain) |
| **Check first** | `npm run preflight` | `npm run preflight -- --demo` |

## The showroom

`npm run build:demo` builds the store on its built-in 8-piece collection and the images in `public/media`.

It's backend-free by construction: it reads no `.env` files and blanks every Supabase and Turnstile setting. So it can't connect to a database or take an order, even if such values are on the host by mistake. It also leaves the Studio out entirely, with no dashboard code in the bundle; `/admin` shows "not found". The bag works and is kept in the visitor's browser.

1. Run `npm run preflight -- --demo`. It builds the showroom and checks that the build contains:
   - no Supabase project, key or Turnstile key
   - no Studio
   - every image
   - routing for the host
2. On the host, create a site from the repository with build command `npm run build:demo` and output directory `dist`. Add no environment variables.
3. After deploying, open a product page directly, refresh it, and open `/checkout` and `/admin`. You should see a preview message on `/checkout` and "not found" on `/admin`.

`npm run test:showroom` runs the same checks in a browser against the production demo build.

## Your store

A Cloudflare account is free, and your domain doesn't have to be on Cloudflare to use Turnstile. Each Turnstile widget gives you two keys:
- a **site key**, which is public and goes in the host's environment variables
- a **secret key**, which goes only into Supabase with `npx supabase secrets set`

### 1. Check before you deploy

```bash
npm run preflight                      # your store: .env.production.local, or .env.local
```

Preflight fails, and you shouldn't deploy, if any of these is true:
- the site key is a test key
- the function accepts a fake token
- `TURNSTILE_ALLOW_TEST_KEYS` is still set
- sign-ups are on
- orders can reach the database without the function

A production build also refuses to compile with a Cloudflare test site key.

### 2. Host settings

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 20 or newer |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY` |

Never add the Turnstile secret key, the Supabase secret key or the `service_role` key to the host. The site needs none of them.

### 3. Supabase settings for the domain

- **Authentication → URL Configuration:** set **Site URL** to `https://your-domain`, and add it to **Redirect URLs**.
- **Authentication → Sign In / Providers:** "Allow new users to sign up" stays **off**.
- **Edge Functions secrets:** `TURNSTILE_SECRET_KEY` set to your widget's secret, and no `TURNSTILE_ALLOW_TEST_KEYS`.

### 4. After the first deploy

1. Open the site, put a piece in the bag and open checkout. The Turnstile check should be invisible, or show a single tick box.
2. If checkout is open, place one order with your own details, then cancel it in the dashboard.
3. Sign in at `/admin` on your store (not the demo).
