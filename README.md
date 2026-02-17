# Atticus Video Page

Minimal Next.js app that serves a single investor video page and tracks real viewing engagement.

## 1) Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure analytics:
   - Copy `.env.local.example` to `.env.local`
   - Add your PostHog project key
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## 2) Add your video

Place your MP4 at:

`public/final_pitch_v2.mp4`

## 3) Tracked events

- `video_page_open`
- `video_play`
- `video_25`
- `video_50`
- `video_75`
- `video_100`

All events include any available UTM parameters from the URL query string.

## 4) Email thumbnail link format

Use a campaign URL like:

`https://video.atticustrade.com/?utm_source=email&utm_medium=investor_outreach&utm_campaign=pitch_q1`

## 5) Deploy to Vercel

1. Push this repo to GitHub.
2. Import it as a new project in Vercel.
3. Add environment variables from `.env.local`.
4. Add custom domain `video.atticustrade.com` in the project settings.
5. Add DNS `CNAME` record for `video` to your Vercel target.

## 6) Domain mapping checklist

1. In your DNS provider, create:
   - Type: `CNAME`
   - Host/Name: `video`
   - Value/Target: the Vercel-provided target shown in the project domain settings
2. Wait for DNS propagation and click Verify in Vercel.
3. Confirm HTTPS certificate is issued and status is valid.

## 7) QA checklist (email to playback)

1. Open the campaign URL directly in browser:
   - `https://video.atticustrade.com/?utm_source=email&utm_medium=investor_outreach&utm_campaign=pitch_q1`
2. Confirm:
   - page loads
   - video controls render
   - video starts when pressing Play
3. In PostHog, verify events arrive:
   - `video_page_open`
   - `video_play`
   - `video_25`, `video_50`, `video_75`, `video_100`
4. Send a test email to yourself with thumbnail link and click from:
   - Gmail web
   - Apple Mail
   - Outlook (if used)
5. Validate UTM attribution appears on captured events.
