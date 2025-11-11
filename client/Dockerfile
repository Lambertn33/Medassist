FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
