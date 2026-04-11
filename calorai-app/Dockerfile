# syntax=docker/dockerfile:1
# Build from monorepo root: docker build -f calorai-app/Dockerfile .
# Metro default 8081; Expo Go scans QR / uses exp://…:8081 (set EXPO_PACKAGER_HOST in root .env).
FROM node:20-bookworm-slim

WORKDIR /app
COPY docker/dev-entrypoint.sh /usr/local/bin/dev-entrypoint
RUN chmod +x /usr/local/bin/dev-entrypoint

# Do not set CI=1 here — it hides the QR / dev URLs in logs.
ENV EXPO_NO_TELEMETRY=1 \
    EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

ENTRYPOINT ["/usr/local/bin/dev-entrypoint"]
CMD ["npx", "expo", "start", "--host", "lan", "-p", "8081"]
