FROM denoland/deno:alpine

WORKDIR /app

COPY . .

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--unstable", "index.ts"]
