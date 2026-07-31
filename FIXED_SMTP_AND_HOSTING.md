# iFeX SMTP Fix + Hosting Setup

## What was fixed

1. Removed backend SMTP verification during startup.
   - This was causing Render logs like `ETIMEDOUT` on `smtp.gmail.com:587` and `smtp.gmail.com:465`.
   - On Render Free, SMTP ports can timeout, so the server should not depend on Gmail SMTP at startup.

2. Moved Web3Forms access key away from the frontend.
   - The frontend no longer exposes the access key.
   - The contact form now posts to your backend endpoint: `/api/contact`.
   - The backend sends the form using Web3Forms by default.

3. Added optional SMTP support.
   - If you later use a paid Render instance or another VPS where SMTP is allowed, set `EMAIL_PROVIDER=smtp`.
   - For Gmail SMTP 587, use `SMTP_SECURE=false`.
   - For Gmail SMTP 465, use `SMTP_SECURE=true`.

## Recommended Render environment variables

Use these on the Render backend service:

```env
NODE_ENV=production
STANDALONE=true
PORT=10000
CLIENT_ORIGIN=https://yourdomain.com
ADMIN_PASSWORD=your_strong_admin_password
EMAIL_PROVIDER=web3forms
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

Optional only if you are not on Render Free:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=your_email@gmail.com
CONTACT_SENDER_EMAIL=your_email@gmail.com
```

## Backend on Render

Create a Render Web Service:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

## Frontend on Render

Create a Render Static Site:

- Root Directory: project root
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Frontend environment variable:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

## Domain setup

Add your custom domain to the Render Static Site. Then copy the DNS records Render gives you and add them in your domain DNS manager.

Usually:

```txt
A record     @      Render IP shown in dashboard
CNAME        www    your-static-site.onrender.com
```

## Important security note

Your uploaded project contained real Gmail/Web3Forms/admin secrets. Rotate/change them before deploying publicly.
