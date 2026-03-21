# Backend build stage
FROM node:24.2.0-alpine AS backend-build

LABEL maintainer="Anna Sokol <anna04sokol@gmail.com>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false
ENV NODE_ENV=production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd
CMD ["npm", "start"]
EXPOSE 8080

# Backend production stage
FROM node:24.2.0-alpine AS backend-production
WORKDIR /app
#copy node modules 
COPY --from=backend-build /app/node_modules ./node_modules
#copy json
COPY --from=backend-build /app/package.json ./package.json
#copy htpasswd
COPY --from=backend-build /app/tests/.htpasswd ./tests/.htpasswd
#copy source code
COPY --from=backend-build /app/src ./src
CMD ["npm", "start"]
EXPOSE 8080
