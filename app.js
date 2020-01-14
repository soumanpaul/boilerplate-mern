var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var compress = require("compression");
var cors = require("cors");
var helmet = require("helmet");
var config = require("./config/config");
var mongoose = require("mongoose");

// // modules for server side rendering
// import React from 'react'
// import ReactDOMServer from 'react-dom/server'
// import MainRouter from './../client/MainRouter'
// import StaticRouter from 'react-router-dom/StaticRouter'
// import { SheetsRegistry } from 'react-jss/lib/jss'
// import JssProvider from 'react-jss/lib/JssProvider'
// import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles'
// import { indigo, pink } from '@material-ui/core/colors'
// //end

var indexRouter = require("./routes/index.routes");
var usersRouter = require("./routes/users.routes");
const authRouter = require("./routes/auth.routes");

//
const mongoUrl = "mongodb://localhost:27017/mern-skill";
mongoose.connect(
  mongoUrl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("connected...");
  }
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);




// app.get('*', (req, res) => {
//   const sheetsRegistry = new SheetsRegistry()
//   const theme = createMuiTheme({
//     palette: {
//       primary: {
//       light: '#757de8',
//       main: '#3f51b5',
//       dark: '#002984',
//       contrastText: '#fff',
//     },
//     secondary: {
//       light: '#ff79b0',
//       main: '#ff4081',
//       dark: '#c60055',
//       contrastText: '#000',
//     },
//       openTitle: indigo['400'],
//       protectedTitle: pink['400'],
//       type: 'light'
//     },
//   })
//   const generateClassName = createGenerateClassName()
//   const context = {}
//   const markup = ReactDOMServer.renderToString(
//      <StaticRouter location={req.url} context={context}>
//         <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
//            <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
//              <MainRouter/>
//            </MuiThemeProvider>
//         </JssProvider>
//      </StaticRouter>
//     )
//    if (context.url) {
//      return res.redirect(303, context.url)
//    }
//    const css = sheetsRegistry.toString()
//    res.status(200).send(Template({
//      markup: markup,
//      css: css
//    }))
// })


app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
