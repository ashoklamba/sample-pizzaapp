FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
ARG INSTALL_DEV=false
RUN if [ "$INSTALL_DEV" = "true" ]; then npm ci; else npm ci --omit=dev; fi

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
