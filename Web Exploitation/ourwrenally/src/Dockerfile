FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN addgroup -S archive && adduser -S archive -G archive && chown -R archive:archive /app
USER archive
EXPOSE 4949
CMD ["npm", "start"]
