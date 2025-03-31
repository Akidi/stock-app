# Base stage (shared setup)
FROM node:22-slim AS base
LABEL stage=base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app

# Dev stage (full setup for development)
FROM base AS dev
LABEL stage=dev
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm svelte-kit sync

# Development target (just the dev-ready image)
FROM dev AS development
LABEL stage=development

# Build stage (for production)
FROM dev AS build
LABEL stage=build
RUN pnpm run build

# Production stage (lean runtime)
FROM node:20-slim AS production
LABEL stage=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["node", "build/index.js"]