# Use Node base image and install yt-dlp via pip

FROM node:18-bullseye

# Install python3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip --no-install-recommends \
  && pip3 install --no-cache-dir yt-dlp \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "start"]
