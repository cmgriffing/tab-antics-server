import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const envConfig: any = config();

const TWITCH_CLIENT_ID =
  envConfig["TWITCH_CLIENT_ID"] || Deno.env.get("TWITCH_CLIENT_ID");
const HTTP_PORT = envConfig["HTTP_PORT"] || Deno.env.get("HTTP_PORT");
const WS_PORT = envConfig["WS_PORT"] || Deno.env.get("WS_PORT");
const HOSTNAME = envConfig["HOSTNAME"] || Deno.env.get("HOSTNAME");

console.log({ TWITCH_CLIENT_ID, HTTP_PORT, WS_PORT, HOSTNAME });

export { TWITCH_CLIENT_ID, HTTP_PORT, WS_PORT, HOSTNAME };
