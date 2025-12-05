FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install || true
COPY . .
RUN npm run build || true
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
