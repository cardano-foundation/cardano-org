# syntax=docker/dockerfile:1.4

# =============================================================================
# Multi-stage Dockerfile for Cardano.org Developer Portal
# Optimized for Docusaurus 3 + Node.js 20 + Yarn
# Supports: Development (hot-reload), Production builds, Testing
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base - Common dependencies for all stages
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./

# Install system dependencies required for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Set yarn version
RUN yarn set version 1.22.19

# -----------------------------------------------------------------------------
# Stage 2: Dependencies - Install all dependencies
# -----------------------------------------------------------------------------
FROM base AS dependencies

# Install all dependencies (including devDependencies for development/build)
# Note: yarn.lock is gitignored in this project, so we don't use --frozen-lockfile
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --network-timeout 300000 || \
    yarn install --network-timeout 300000

# -----------------------------------------------------------------------------
# Stage 3: Development - Hot-reload development environment
# -----------------------------------------------------------------------------
FROM base AS development

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate authors JSON file (required for development)
RUN yarn build-authors

# Expose port for Docusaurus dev server
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command for development with hot reload
CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "3000"]

# -----------------------------------------------------------------------------
# Stage 4: Builder - Build production assets
# -----------------------------------------------------------------------------
FROM base AS builder

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the static site
RUN yarn build

# -----------------------------------------------------------------------------
# Stage 5: Production - Serve production build with minimal footprint
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

# Install dumb-init and serve for static file serving
RUN apk add --no-cache dumb-init && \
    npm install -g serve

WORKDIR /app

# Copy built static files from builder stage
COPY --from=builder /app/build ./build

# Expose port for production server
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Serve the static site
CMD ["serve", "-s", "build", "-l", "3000"]

# -----------------------------------------------------------------------------
# Stage 6: Test - Run tests and validations
# -----------------------------------------------------------------------------
FROM base AS test

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build to validate everything compiles correctly
RUN yarn build

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default test command (can be overridden)
CMD ["yarn", "build"]

# -----------------------------------------------------------------------------
# Default stage is development for ease of use
# -----------------------------------------------------------------------------
FROM development AS default
