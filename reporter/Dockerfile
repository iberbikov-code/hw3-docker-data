FROM node:20-alpine

WORKDIR /app

# СНАЧАЛА копируем только package.json и ставим зависимости
# Этот слой будет закэширован, если package.json не менялся
COPY package.json .
RUN npm install

# ПОТОМ копируем код
COPY report.js .

CMD ["node", "report.js"]