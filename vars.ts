import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const envConfig: any = config();

const TWITCH_CLIENT_ID =
  envConfig["TWITCH_CLIENT_ID"] || Deno.env.get("TWITCH_CLIENT_ID");
const PORT = envConfig["PORT"] || Deno.env.get("PORT");
const HOSTNAME = envConfig["HOSTNAME"] || Deno.env.get("HOSTNAME");

export { TWITCH_CLIENT_ID, PORT, HOSTNAME };
