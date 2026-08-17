# syntax=docker/dockerfile:1

# Four stages, so the shipped image holds no source, no dev dependencies and no
# build tools — only the two compiled outputs plus the one native dependency
# that cannot be bundled.

# --- base -------------------------------------------------------------------
# The Node runtime and pnpm. Shared by deps, prod-deps and runtime.
FROM node:24-slim AS base
RUN npm install --global pnpm@11.22.0
WORKDIR /app

# --- deps -------------------------------------------------------------------
# Every dependency, installed from the manifests alone. Because no source is
# copied here, this layer stays cached until a package.json or the lockfile
# actually changes.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json client/
COPY server/package.json server/
COPY shared/package.json shared/
RUN pnpm install --frozen-lockfile

# --- build ------------------------------------------------------------------
# Extends deps, so node_modules is already in place with pnpm's symlink layout
# intact — copying that layout between stages is what we avoid by extending.
FROM deps AS build

# Vite substitutes these into the JS bundle at compile time, so they must be
# present now. Setting them at runtime on Railway would be far too late.
ARG VITE_MAPBOX_TOKEN
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_API_KEY
ENV VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN \
    VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME \
    VITE_CLOUDINARY_API_KEY=$VITE_CLOUDINARY_API_KEY

COPY shared/ shared/
COPY server/ server/
COPY client/ client/

RUN pnpm --filter dogsplayingpoker-client build
RUN pnpm --filter dogsplayingpoker-server build

# --- prod-deps --------------------------------------------------------------
# A production-only, server-only dependency tree. Everything else is bundled
# into the server by esbuild, so in practice this carries bcrypt's native
# binding, compiled against this image's Node.
#
# `pnpm deploy` rather than a plain `pnpm install --prod`: in a workspace the
# latter resolves the client's dependencies into the same tree, which drags
# mapbox-gl and Mantine into the runtime image for nothing. deploy emits a
# self-contained tree for one package. --legacy is required because this
# workspace does not use injected dependencies (pnpm 10+).
FROM deps AS prod-deps
RUN pnpm deploy --filter=dogsplayingpoker-server --prod --legacy /app/deploy

# --- runtime ----------------------------------------------------------------
# The shipped image.
# Deliberately not FROM base: the runtime never needs pnpm.
FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Railway overrides PORT; this is the local default.
ENV PORT=8080
# Setting CLIENT_DIST is what tells the server to serve static files at all.
ENV CLIENT_DIST=./public
# Left unset on purpose: no CLIENT_ORIGIN means same-origin, which means no CORS.

COPY --from=prod-deps /app/deploy/node_modules ./node_modules
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/client/dist ./public

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
