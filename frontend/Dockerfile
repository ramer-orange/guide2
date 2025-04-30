# ベースイメージとして Node.js の最新の軽量版を利用
FROM node:20-alpine

# Node.jsの環境変数を設定
ENV NODE_OPTIONS="--no-experimental-fetch --experimental-global-webcrypto"

# 作業ディレクトリの作成
WORKDIR /app

# package.json と package-lock.json を先にコピーして依存関係をキャッシュ
COPY package*.json ./

# 依存パッケージのインストール
RUN npm install

# プロジェクトのソースコードを全てコピー
COPY . .

# Docker コンテナ内のポートを開放 (Vite のデフォルトポート)
EXPOSE 5173

# Vite の開発サーバーを起動（--host オプションで外部からのアクセスを可能にする）
CMD ["npm", "run", "dev", "--", "--host"]
