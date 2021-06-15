FROM denoland/deno:alpine

WORKDIR /app

COPY . .

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--unstable", "index.ts"]
