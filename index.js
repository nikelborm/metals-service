import http from "http";
import https from "https";
import express, { response } from "express";
import compression from "compression";
import cors from "cors";

const serverPort = process.env.PORT || 3000;

const fieldsToReturnFromApi = new Set([
  "Copper",
  "Gold",
  "Palladium",
  "Platinum",
  "Rhodium",
  "Silver",
]);

const app = express();

const httpServer = http.createServer(app);

app.use(compression());
app.use(cors());
app.options('*', cors());

const metalCostsMiddleware = (request, clientResponse) => {
  console.log('asd');
  https
    .get("https://www.moneymetals.com/ajax/spot-prices", (pricesResponse) => {
      let data = "";

      // A chunk of data has been received.
      pricesResponse.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      pricesResponse.on("end", () => {
        clientResponse.header("Access-Control-Allow-Origin", "*");
        try {
          const costsDataWithUselessFields = JSON.parse(data);

          const costsWithUselessEntries = Object.entries(costsDataWithUselessFields);

          const costsWithoutUselessEntries = costsWithUselessEntries.filter(
            ([ key ]) => fieldsToReturnFromApi.has(key)
          );
          const usefulCosts = Object.fromEntries(costsWithoutUselessEntries);

          clientResponse.json({
            isOk: true,
            payload: usefulCosts
          });
        } catch (error) {
          clientResponse.status(500).json({
            isOk: false,
            message: 'Metals API unavailable',
          })
        }
      });
    })
    .on("error", (err) => {
      console.error("Error: " + err.message);
    });
};

app.get("/api/metalCosts", metalCostsMiddleware);

app.get("/", (request, response) => {
  response.send("<html><body></body></html>").status(200);
});

httpServer.listen(serverPort, function () {
  console.log("http server is listening");
});

["SIGHUP", "SIGINT", "SIGQUIT", "SIGTERM"].forEach((sig) =>
  process.on(sig, () => {
    console.log("Exiting...");
    if (!httpServer.listening) {
      console.error("Http Server is not listening.\n\n");
      return process.exit(1);
    }
    httpServer.close((err) => {
      if (err) console.error(err);
      console.log("Http server closed.");
      process.exit(~~!!err);
    });
  })
);
