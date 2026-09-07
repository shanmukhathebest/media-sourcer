# Media Sourcer

Starter Next.js application + simple server API to fetch metadata for YouTube and TikTok using yt-dlp.

Features included in this commit:
- Next.js frontend with a YouTube-style listing and video page
- API route /api/fetch-metadata that runs yt-dlp --skip-download --dump-json and returns normalized metadata
- Simple persistence to data/videos.json via /api/save and /api/list
- Dockerfile and README with setup instructions

Important notes (read before running):
- This project fetches metadata only and embeds original platform players. It does not download or rehost videos.
- You must install yt-dlp on the machine where the Next.js server runs. See installation instructions below.

Quick start (local):

1) Clone and install:

   git clone https://github.com/shanmukhathebest/media-sourcer.git
   cd media-sourcer
   npm install

2) Install yt-dlp:

   # pip (recommended)
   pip install yt-dlp

   # or Homebrew on macOS
   brew install yt-dlp

3) Run the dev server:

   npm run dev

4) Open http://localhost:3000 and paste a YouTube or TikTok video URL into the form.

Docker (optional):
- A Dockerfile is included which installs node and yt-dlp. Build with:

   docker build -t media-sourcer .
   docker run -p 3000:3000 media-sourcer

Security & Terms of Service:
- This starter intentionally avoids downloading or rehosting content. It uses the platform players (embeds) so playback happens on the original sites' terms.
- Make sure your deployment follows YouTube and TikTok Terms of Service regarding embeds and attribution.

Next steps I can do for you (optional):
- Add better TikTok embeds (script-based) and provider-specific players
- Add a database (SQLite + Prisma) for more robust persistence
- Add authentication, channels, playlists, and a nicer UI

License: MIT
