FROM node:23-alpine AS development
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
# USER node
CMD ["npm", "run", "start"]

FROM node:23-alpine AS build
WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN ls -al
RUN npm --version && \
    npm pkg delete scripts.prepare && \
    npm run build
RUN ls -al
ENV NODE_ENV production
RUN pwd
RUN ls -al ./dist 
RUN npm ci --only=production && npm cache clean --force
# RUN rm -rf ./static
# WORKDIR ./dash
# RUN npm ci && rm -rf ../static && npm run build && cp -r ./dist/dash ../static
# USER node

# CMD [ "/bin/sh",  ]

FROM node:23-alpine As production
WORKDIR /app
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/static ./dist/static
RUN ls -al ./dist 
COPY --chown=node:node --from=build /app/dist ./dist
RUN ls -al ./dist 
ARG BUILD_NUM
ARG APP_ENV=production
ENV APP_ENV=$APP_ENV
ENV APP_BUILD_NUMBER=$BUILD_NUM
ENV NODE_ENV production
EXPOSE 3000
CMD [ "node", "dist/src/entry-points/public-api/index.js" ]
