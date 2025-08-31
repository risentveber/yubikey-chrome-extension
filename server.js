const http = require("http");
const url = require("url");
const { exec } = require("child_process");

const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 9999;

function sendJSON(res, data) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function logInfo(msg) {
  console.log(`[${new Date().toISOString()}][INFO] ${msg}`);
}

function logError(msg) {
  console.error(`[${new Date().toISOString()}][ERROR] ${msg}`);
}

const server = http.createServer(
  { keepAlive: false, keepAliveTimeout: 0 },
  (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.end();
      return;
    }
    res.setHeader("Connection", "close");

    const reqURL = url.parse(req.url, true);
    const totpId = reqURL.query.totpId;
    if (!totpId) {
      res.statusCode = 500;
      logError(`no totpId provided`);
      sendJSON(res, { error: "no totpId provided" });
      return;
    }

    exec(`ykman oath accounts code -s ${totpId}`, (error, stdout) => {
      if (error) {
        res.statusCode = 500;
        if (error.message.includes("Touch account timed out")) {
          res.statusCode = 408;
        }
        logError(`${totpId} ${error}`);
        sendJSON(res, { error: error.message });
        return;
      }
      logInfo(`success: ${totpId} ${stdout}`);
      sendJSON(res, { code: stdout.trim() });
    });
  },
);

server.listen(port, hostname, () => {
  logInfo(`server started at http://${hostname}:${port}`);
});
