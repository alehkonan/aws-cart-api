FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder ./app/node_modules ./node_modules
COPY --from=builder ./app/dist ./
EXPOSE 4000
CMD ["node", "main.js"]