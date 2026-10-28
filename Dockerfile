FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# SSR 请求直连后端，构建时写入产物，改地址需重新构建
ARG NEXT_PUBLIC_API_URL=http://backend:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
# 类型检查已在本地提交前执行，容器内跳过以缩短部署构建
ENV SKIP_TYPECHECK=1
RUN npm run build

FROM node:22-alpine AS run

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# 容器内必须监听全部网卡，否则 Caddy 连不上
ENV HOSTNAME=0.0.0.0

# standalone 已含运行所需依赖子集与 server.js
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# 文档索引与分节页是 force-dynamic，运行期从磁盘读 Markdown
COPY --from=build /app/src/content ./src/content

EXPOSE 3000
CMD ["node", "server.js"]
