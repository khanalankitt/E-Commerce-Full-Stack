FROM node:22-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source
COPY tsconfig.json ./
COPY src ./src

EXPOSE 5000

CMD ["npm", "run", "dev"]
