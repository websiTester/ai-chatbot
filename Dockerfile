# Giai đoạn 1: "builder" - Cài đặt dependencies và build project
FROM node:22-slim AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Cài đặt pnpm
RUN npm install -g pnpm

# --- THÊM DÒNG NÀY ---
# Cài đặt 'git' vì 'pnpm install' cần nó để tải các dependencies
# từ kho Git.
# Thêm "ca-certificates" để git có thể xác thực kết nối HTTPS
#RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy file package.json và pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Cài đặt dependencies bằng pnpm
RUN pnpm install

# Copy toàn bộ mã nguồn còn lại
COPY . .


# --- THÊM 2 DÒNG NÀY ---
# 1. Khai báo 1 build-time argument
ARG GOOGLE_GENERATIVE_AI_API_KEY
ARG MONGODB_DATABASE
ARG MONGODB_URI
ARG OBSIDIAN_API_KEY
ARG OBSIDIAN_BASE_URL

# 2. Gán nó vào 1 ENV var để "pnpm build" có thể dùng
ENV GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}
ENV MONGODB_DATABASE=${MONGODB_DATABASE}
ENV MONGODB_URI=${MONGODB_URI}
ENV OBSIDIAN_API_KEY=${OBSIDIAN_API_KEY}
ENV OBSIDIAN_BASE_URL=${OBSIDIAN_BASE_URL}

# Build project cho production
RUN pnpm build

# ---

# Giai đoạn 2: "runner" - Chạy ứng dụng đã build
FROM node:22-slim

WORKDIR /app

# Set môi trường là production
ENV NODE_ENV=production

# Cài đặt pnpm
RUN npm install -g pnpm

RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*


# Chỉ copy các file cần thiết từ giai đoạn "builder"
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Cài đặt CHỈ production dependencies
# "--prod" là cờ để pnpm chỉ cài đặt dependencies, bỏ qua devDependencies
RUN pnpm install --prod

# Copy thư mục build .next
COPY --from=builder /app/.next ./.next

# Copy thư mục public
COPY --from=builder /app/public ./public

# Mở port 3000
EXPOSE 3000

# Câu lệnh để chạy app production
CMD ["pnpm", "start"]


# # ==========================================
# # GIAI ĐOẠN 1: BUILDER (Giữ nguyên logic cũ)
# # ==========================================
# FROM node:22-slim AS builder

# WORKDIR /app

# # Cài đặt pnpm và các công cụ cần thiết
# RUN npm install -g pnpm
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends git ca-certificates && \
#     rm -rf /var/lib/apt/lists/*

# # Copy và cài đặt dependencies
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install

# # Copy mã nguồn
# COPY . .

# # --- KHAI BÁO BIẾN MÔI TRƯỜNG CHO LÚC BUILD ---
# # (Giữ lại đoạn này để tránh lỗi 403 AI API khi build mà bạn đã gặp)
# ARG GOOGLE_GENERATIVE_AI_API_KEY
# ARG MONGODB_DATABASE
# ARG MONGODB_URI
# ARG OBSIDIAN_API_KEY
# ARG OBSIDIAN_BASE_URL

# ENV GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}
# ENV MONGODB_DATABASE=${MONGODB_DATABASE}
# ENV MONGODB_URI=${MONGODB_URI}
# ENV OBSIDIAN_API_KEY=${OBSIDIAN_API_KEY}
# ENV OBSIDIAN_BASE_URL=${OBSIDIAN_BASE_URL}

# # Build project (Lúc này Next.js sẽ tạo ra folder .next/standalone)
# RUN pnpm build

# # ==========================================
# # GIAI ĐOẠN 2: RUNNER (Thay đổi hoàn toàn)
# # ==========================================
# FROM node:22-slim AS runner

# WORKDIR /app

# ENV NODE_ENV=production


# # --- SỬA Ở ĐÂY: Cài đặt thư viện hệ thống cần thiết cho AI (ONNX) ---
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     openssl \
#     libgomp1 \
#     ca-certificates && \
#     rm -rf /var/lib/apt/lists/*
# # --- CẢI TIẾN 1: KHÔNG CÀI PNPM & GIT ---
# # Folder standalone đã có sẵn node_modules cần thiết rồi.
# # Việc bỏ qua bước này giúp Image nhẹ đi rất nhiều và build nhanh hơn.

# # --- CẢI TIẾN 2: COPY FILE THÔNG MINH ---

# # 1. Copy folder public (chứa ảnh, favicon...)
# COPY --from=builder /app/public ./public

# # 2. Copy folder "standalone"
# # Folder này chứa: server.js + node_modules tối giản + code server
# # Copy nó ra thẳng thư mục gốc /app
# COPY --from=builder /app/.next/standalone ./

# # 3. Copy folder "static"
# # BẮT BUỘC PHẢI CÓ dòng này. Standalone không tự copy file CSS/JS client.
# # Nếu thiếu dòng này, web vào được nhưng sẽ vỡ giao diện (không load được CSS).
# COPY --from=builder /app/.next/static ./.next/static

# # Mở port
# EXPOSE 3000

# # --- CẢI TIẾN 3: CHẠY BẰNG NODE THUẦN ---
# # Không dùng "pnpm start" (nặng nề) nữa.
# # Next.js tạo sẵn file server.js siêu nhẹ để chạy production.
# CMD ["node", "server.js"]