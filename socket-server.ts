import Datastore from "https://deno.land/x/dndb@0.3.3/mod.ts";
import { Server, Packet } from "https://deno.land/x/wocket@v0.6.3/mod.ts";
import { decode as decodeToken } from "https://deno.land/x/djwt@v2.2/mod.ts";

import { TWITCH_CLIENT_ID } from "./vars.ts";

interface SocketMessage {
  type: string;
  nonce: string;
  data: {
    token: string;
  };
}

interface SocketMessageInitiate extends SocketMessage {}

export function createSocketServer(db: Datastore) {
  // Create the server
  const socketServer = new Server();

  socketServer.on("initiate", async (packet: Packet) => {
    console.log("initiate fired");

    if (packet.message) {
      const message = packet?.message as SocketMessageInitiate;

      const token = message?.data?.token ?? "";

      const userDetails = await fetch("https://api.twitch.tv/helix/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Client-ID": TWITCH_CLIENT_ID,
        },
      }).then((result) => result.json());

      console.log({ userDetails });

      const tokenChannelId = (userDetails as any)?.data[0]?.id ?? "";

      // verify token and get channelId
      const channelId = tokenChannelId;

      db.insert({
        channelId,
        socketId: packet.from.id,
      });
    }
  });

  socketServer.on("redemption", (packet: Packet) => {
    console.log("redemption fired");
  });

  socketServer.on("disconnect", (packet: Packet) => {
    db.remove({
      socketId: packet.from,
    });
  });
  socketServer.on("reconnect", (_packet: Packet) => {
    console.log("Does RECONNECT even fire?");
  });

  return socketServer;
}
