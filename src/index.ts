import { Hono } from "hono";
import { renderer } from "./renderer";
import { Index } from "./routes/index";
import { Config } from "./routes/api/config";

type Bindings = {
  ANAM_API_KEY: string;
  ANAM_AVATAR_ID: string;
  ELEVENLABS_AGENT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Allow iframe embedding by removing X-Frame-Options restrictions
app.use("*", async (c, next) => {
  await next();
  // Remove X-Frame-Options to allow iframe embedding
  c.header("X-Frame-Options", "ALLOWALL");
  // Set permissive Content Security Policy for iframe embedding
  c.header("Content-Security-Policy", "frame-ancestors *");
  // Allow microphone access in iframes
  c.header("Permissions-Policy", "microphone=*");
});

app.use(renderer);

// API route to get config (Anam session token + ElevenLabs agent ID)
app.get("/api/config", Config);
// Main page
app.get("/", Index);

export default app;
