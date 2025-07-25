FROM docker.io/oven/bun:1 AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/build build
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/static static

EXPOSE 5173

CMD ["bun", "run", "preview", "--host", "0.0.0.0"] 
