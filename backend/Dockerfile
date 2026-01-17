FROM node:20-slim

# Install ClamAV
RUN apt-get update && \
    apt-get install -y clamav clamav-daemon && \
    rm -rf /var/lib/apt/lists/*

# Update virus definitions
RUN freshclam || true

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/server.js"]
