import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v7.5.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import Datastore from "https://deno.land/x/dndb@0.3.3/mod.ts";
import { createSocketServer } from "./socket-server.ts";
import { decode as decodeToken } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { HOSTNAME, HTTP_PORT, WS_PORT } from "./vars.ts";

interface DatabaseEntry {
  socketId: number;
  channelId: string;
}

const db = new Datastore({
  filename: "./database.db",
  autoload: true,
});

const socketServer = createSocketServer(db);

const router = new Router();
router
  .get("/hello", (context: Context) => {
    context.response.body = "Hello world!";
  })
  .post("/redemption/:channelId", async (context) => {
    const body = await context.request.body();

    if (!body) {
      console.log("Body not defined");
      return context.throw(400);
    }

    // TODO Pull out token to middleware when a new auth endpoint is made

    const token =
      context.request.headers.get("Authorization")?.substr("Bearer ".length) ??
      "";

    let tokenChannelId = "";

    try {
      const [_header, payload, _signature] = decodeToken(token);
      console.log({ payload });
      tokenChannelId = (payload as any).channel_id;
    } catch (e: unknown) {
      context.throw(401);
    }

    // END Token shenanigans

    console.log("inside redemption");
    console.log("params", context.params);

    const { channelId } = context.params;

    if (channelId !== tokenChannelId) {
      context.throw(403);
    }

    if (channelId) {
      const socketClientEntries = await db.findOne({ channelId: channelId });

      console.log({ socketClientEntries });

      if (!socketClientEntries) {
        context.throw(404);
      }

      try {
        const regex = new RegExp("[\\D]+");
        const action = ((await body?.value)?.action ?? "")
          .substr(2)
          .match(regex)[0];

        console.log("Action being performed: ", action);

        const socketClientEntry =
          socketClientEntries as unknown as DatabaseEntry;

        socketServer.to(
          "redemption",
          {
            data: {
              type: "redemption",
              action,
            },
          },
          socketClientEntry?.socketId
        );

        context.response.body = {
          success: true,
        };
      } catch (e) {
        console.log("Error sending request to extension: ", e);
      }
    } else {
      context.throw(400);
    }
  });

// Run the server
socketServer.run({
  hostname: HOSTNAME,
  port: +WS_PORT,
});

console.log(
  `Socket Server started on ws://${socketServer.hostname}:${socketServer.port}`
);

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Web Server starting on http://${HOSTNAME}:${HTTP_PORT}`);

app.listen(`${HOSTNAME}:${HTTP_PORT}`);
