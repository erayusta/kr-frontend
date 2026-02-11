# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build


# Stage 2: Run
FROM node:18-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# standalone output bundles next.config.js + required node_modules + server
COPY --from=build /app/.next/standalone ./
# Static files are not included in standalone, copy separately
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
