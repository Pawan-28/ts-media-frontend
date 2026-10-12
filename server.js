/**
 * Production entry file for Node.js hosting (Hostinger "Node.js Web App", Passenger, or plain `node server.js`).
 *
 * Set the app's "Entry file / Startup file" to server.js in hPanel. It starts Next.js in production mode on
 * the port the host provides (process.env.PORT) and falls back to 3000. Run `npm run build` first - this file
 * only serves an existing .next build, it never compiles anything.
 */
const http = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, () => {
        console.log(`> Truth & Social frontend ready on port ${port}`);
      });
  })
  .catch((err) => {
    console.error("Failed to start Next.js:", err);
    process.exit(1);
  });
