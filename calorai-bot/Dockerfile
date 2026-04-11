# syntax=docker/dockerfile:1
# Build from monorepo root: docker build -f calorai-bot/Dockerfile .
FROM node:20-bookworm-slim

WORKDIR /app
COPY docker/dev-entrypoint.sh /usr/local/bin/dev-entrypoint
RUN chmod +x /usr/local/bin/dev-entrypoint

ENTRYPOINT ["/usr/local/bin/dev-entrypoint"]
CMD ["npm", "run", "dev"]
