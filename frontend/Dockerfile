# ベースイメージとして Node.js の軽量版を利用
FROM node:16-alpine

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
