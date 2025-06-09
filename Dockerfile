# --- Step 1: 빌드 스테이지 ---
FROM node:18 AS builder

WORKDIR /app
COPY . .

# 의존성 설치
RUN npm install --legacy-peer-deps

# 빌드 실행
RUN npm run build

# --- Step 2: 경량화된 런타임 이미지 ---
FROM node:18-alpine

WORKDIR /app

# 빌드 산출물만 복사
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules node_modules

# 포트 설정
EXPOSE 3001

# 서버 실행
CMD ["npx", "next", "start", "-p", "3001", "-H", "0.0.0.0"]
