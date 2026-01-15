FROM node:18-slim

# Install ClamAV
RUN apt-get update && \
    apt-get install -y clamav clamav-daemon && \
    freshclam

# App directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install --production

# Copy app code
COPY . .

# Create uploads folder
RUN mkdir uploads

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/server.js"]
