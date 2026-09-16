
FROM node:20-bullseye

WORKDIR /app

COPY package.json .


RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

RUN npm install pm2@latest -g
RUN npm install --legacy-peer-deps

RUN npm install --include=optional --os=linux --cpu=x64 sharp || npm rebuild sharp

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
