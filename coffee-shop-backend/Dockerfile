FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client for Linux
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
