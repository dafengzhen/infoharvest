FROM node:18-alpine As deps
WORKDIR /infoharvest
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:18-alpine As builder
WORKDIR /infoharvest
COPY --chown=node:node package-lock.json ./
COPY --chown=node:node --from=deps /infoharvest/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --omit=dev
USER node

FROM node:18-alpine As runner
WORKDIR /infoharvest
COPY --chown=node:node --from=builder /infoharvest/.env ./.env
COPY --chown=node:node --from=builder /infoharvest/node_modules ./node_modules
COPY --chown=node:node --from=builder /infoharvest/dist ./dist
ENV NODE_ENV production
ENV PORT 8080
EXPOSE $PORT
CMD [ "node", "dist/main.js" ]
