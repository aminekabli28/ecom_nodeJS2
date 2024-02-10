const path = require("path");
const globalError = require("./middlewares/errorMiddleware");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConect = require("./config/database");
const ApiError = require("./api/ApiErrors");
const routersRun = require("./routers/router");
const compression = require("compression");

const App = express();

App.use(cors());
App.options("*", cors());
App.use(compression());

dotenv.config({ path: "config.env" });
App.use(express.json());
App.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "devolopement") {
  App.use(morgan("dev"));
}

dbConect();
routersRun(App);

App.all("*", (req, res, next) => {
  next(new ApiError("the router dosn't exists", 400));
});

App.use(globalError);

const { port } = process.env;
const server = App.listen(port, () => {
  console.log(`im lestenning on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
