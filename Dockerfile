FROM denoland/deno:alpine

WORKDIR /app

COPY . .

EXPOSE 1777

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--unstable", "index.ts"]
