FROM node:20-alpine
WORKDIR /app

# Dependência requerida para funcionamento estável de Prisma em Alpine.
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 3000
CMD ["sh", "-c", "if [ \"$PRISMA_MIGRATE_ON_START\" = \"true\" ]; then npx prisma migrate deploy || (echo 'migrate deploy falhou; a aplicar prisma db push como fallback para ambiente local'; npx prisma db push); fi && npm run seed && node dist/src/main.js"]
