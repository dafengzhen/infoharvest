FROM node:18-alpine As deps
RUN apk add --no-cache libc6-compat
WORKDIR /infoharvest-web
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:18-alpine As builder
WORKDIR /infoharvest-web
COPY --chown=node:node package-lock.json ./
COPY --chown=node:node --from=deps /infoharvest-web/node_modules ./node_modules
COPY --chown=node:node . .
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
USER node

FROM node:18-alpine As runner
WORKDIR /infoharvest-web
RUN mkdir .next
RUN chown node:node .next
COPY --chown=node:node --from=builder /infoharvest-web/public ./public
COPY --chown=node:node --from=builder /infoharvest-web/.next/standalone ./
COPY --chown=node:node --from=builder /infoharvest-web/.next/static ./.next/static
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "server.js"]
