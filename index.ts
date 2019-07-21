import path from 'path';
import http from "http";
import express from "express";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { BattleRoom } from "./BattleRoom";

var cors = require('cors')
const words = require('./words').words;

const port = Number(process.env.PORT || 2567);
const app = express()

const server = http.createServer(app);
const gameServer = new Server({ server });
const addedRooms = <any>[];

app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// register your room handlers
gameServer.register('room', BattleRoom);

app.get('/:id', function (req: any, res: any) {
  console.log('making new handler for room?: ', !addedRooms.find((room: any) => room === req.params.id));
  if (req.params.id && !addedRooms.find((room: any) => room === req.params.id)) {
    addedRooms.push(req.params.id);
    gameServer.register(req.params.id, BattleRoom);
    return res.sendStatus(200);
  }
  return res.sendStatus(200);
});

app.post('/word', function(req: any, res: any) {
  const word = req.body && req.body.word.trim().toUpperCase();

  res.send({ data: words.indexOf(word) });
});

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
