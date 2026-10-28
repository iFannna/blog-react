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

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# docs 演示在运行期读取 src 下的源码文件，必须保留
COPY --from=build /app/src ./src
COPY --from=build /app/next.config.ts /app/tsconfig.json /app/next-env.d.ts ./

EXPOSE 3000
CMD ["npm", "start"]
