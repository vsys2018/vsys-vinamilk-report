const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const configs = require("./configs");
const { Server } = require("http");
const { MongoClient } = require("mongodb");

// APP
const app = express();

app.use("/report", express.static(path.join(__dirname + "/src")));
app.use(bodyParser.json());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/src");

app.get("/report/:code", (req, res) => {
  //console.log(req.params.code);
  res.render("index.html", { data: req.params.code });
});

app.post("/api/naptien01", (req, res) => {
  MongoClient.connect(configs.mongouri, { useNewUrlParser: true }, (cnnError, client) => {
    if (cnnError) {
      res.json({ error: cnnError.message, type: "Connection Error" });
      return;
    }
    let db = client.db();

    db.collection(configs.collection1, (colError, col) => {
      if (colError) {
        res.json({ error: cnnError.message, type: "Collection Error" });
        return;
      }
      col.find(
        {
          t: {
            $gte: new Date(req.body.fromdate),
            $lt: new Date(req.body.todate)
          },
          $or: req.body.filter
        },
        { projection: { _id: 0, cnt: 0, id: 0, c8: 0 } },
        (resError, cursor) => {
          if (resError) {
            res.json({ error: cnnError.message, type: "Find Error" });
            return;
          }
          cursor.toArray((curError, docs) => {
            if (curError) {
              res.json({ error: cnnError.message, type: "Data Error" });
              return;
            }

            res.json(docs);
          });
        }
      );
    });
  });
});

app.post("/api/ruttien01", (req, res) => {
  MongoClient.connect(configs.mongouri, { useNewUrlParser: true }, (cnnError, client) => {
    if (cnnError) {
      res.json({ error: cnnError.message, type: "Connection Error" });
      return;
    }
    let db = client.db();

    db.collection(configs.collection2, (colError, col) => {
      if (colError) {
        res.json({ error: cnnError.message, type: "Collection Error" });
        return;
      }
      col.find(
        {
          t: {
            $gte: new Date(req.body.fromdate),
            $lt: new Date(req.body.todate)
          },
          $or: req.body.filter
        },
        { projection: { _id: 0, cnt: 0, id: 0, c8: 0 } },
        (resError, cursor) => {
          if (resError) {
            res.json({ error: cnnError.message, type: "Find Error" });
            return;
          }
          cursor.toArray((curError, docs) => {
            if (curError) {
              res.json({ error: cnnError.message, type: "Data Error" });
              return;
            }

            res.json(docs);
          });
        }
      );
    });
  });
});

// SERVER
const server = Server(app);
server.listen(configs.appport, () => {
  console.log("Server init on port: " + configs.appport);
});
