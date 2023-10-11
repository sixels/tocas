# Use the official Node.js 20 image as the base image
FROM node:20-bookworm

# Set the working directory to /app
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
  apt-get install -y ffmpeg libopus-dev libtool pipx && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Install yt-dlp via pipx
RUN export PIPX_PATH=/bin && \
  pipx install yt-dlp

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies using pnpm
RUN npm install -g pnpm && \
  pnpm install

# Copy the rest of the application code to the container
COPY . .

RUN pnpm build

# Start the bot
CMD ["pnpm", "start"]
