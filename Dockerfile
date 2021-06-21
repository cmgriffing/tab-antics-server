FROM denoland/deno:alpine

WORKDIR /app

COPY . .

EXPOSE 8088
EXPOSE 8089

ENTRYPOINT ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--unstable", "index.ts"]
