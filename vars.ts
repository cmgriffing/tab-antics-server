import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const { TWITCH_CLIENT_ID, PORT, HOSTNAME } = config();
console.log({ TWITCH_CLIENT_ID, PORT, HOSTNAME });
export { TWITCH_CLIENT_ID, PORT, HOSTNAME };
