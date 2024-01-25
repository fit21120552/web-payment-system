require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const path = require("path");
const app = express();
const https = require('https');
const session = require('express-session');
const cookieparser = require('cookie-parser');
const exphbs = require("express-handlebars");
const port = process.env.PORT_PAYMENT;
const authRouter = require('./routers/auth.r');
const morgan = require("morgan");
const db = require('./db/initDB');
const credentials = {
    key: process.env.PRIVATE_KEY,
    cert: process.env.CERTIFICATE,
};
app.use(morgan("dev"));
app.engine(
    "hbs",
    exphbs.engine({
        extname: "hbs",
        defaultLayout: "container.hbs",
        layoutsDir: __dirname + "/views/_layouts",
        partialsDir: __dirname + "/views/_layouts",
    }),
);

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
// Connect to database
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
  
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  mongoose.connect(DB, {
//       useNewUrlParser: true,
   //useCreateIndex: true,
//     //   useFindAndModify: false,
//       useUnifiedTopology: true,
  })
    .then(() => {
      console.log('connect to database successfully');
    });
//init database
db.Init();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
//use session
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
app.use(
    cors({
        origin: `http://localhost:3001`,
        credentials: true,
    }),
);


app.use("/pay", authRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode | 500;
    res.status(statusCode).send(err.message);
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () =>
    console.log(`Auth server listening on port ${port}`),
);