FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Build TypeScript (skipped for JavaScript projects), then drop dev dependencies
RUN npm run build --if-present && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE {{PORT}}
USER node
CMD ["npm", "start"]
