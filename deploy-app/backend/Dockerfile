FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/src ./src
COPY backend/scripts ./scripts
RUN npm run build

ENV NODE_ENV=production
EXPOSE 10000
CMD ["npm", "run", "start"]
