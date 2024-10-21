FROM node:22-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000


FROM base as builder
# Update npm to the latest version
#RUN npm install -g npm@latest

# Set the working directory
WORKDIR /app


# Install all dependencies including dev dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Run husky install
RUN npx husky install

# Build the Next.js application
RUN npm run build

# Remove dev dependencies
#RUN npm prune --omit=dev

FROM node:22-alpine as production

WORKDIR /app

ENV NODE_ENV=production
#RUN npm ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public


# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
