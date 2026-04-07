FROM node:20

WORKDIR /app

# Copy backend package files
COPY SocialMedia_platform-main/package*.json ./

RUN npm install

# Copy backend files
COPY SocialMedia_platform-main/ ./

# Copy frontend (public is at ROOT, not inside SocialMedia_platform-main)
COPY public/ ./public/

EXPOSE 4000

CMD ["node", "server.js"]