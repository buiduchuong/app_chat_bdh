const express = require('express');
const mongoose = require('mongoose')
const app = express();
const http = require('http');
require('dotenv').config();
const { emit } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const Message = require('./message');
const Room = require('./room');
const io = new Server(server);
const messages = [];


app.use(express.json());

// io.sockets.on
io.on('connection', (socket) => {
  const username = socket.handshake.query.username;
  console.log(username + ' connected');
  socket.on('message', async (data) => {
    try {
      const id = data['idRoom'];
      socket.join(id);
      // console.log(id);
      const room = await Room.findOne({ '_id': id })
      if (!room) { return console.log('error'); }
      if (data['sender']) {
        room.messages = room.messages.concat({
          'sender': data['sender'],
          'receiver': data['receiver'],
          'content': data['content'],
          'sentAt': Date.now()
        })
        room.save()
      }

      io.in(id).emit('message1', data)
    } catch (error) {
      console.log('error2')
    }

  })
  // socket.to('game').emit('nice game', "let's play a game");
});
app.post('/create', async (req, res) => {
  try {
    const id1 = req.body.id1;
    const id2 = req.body.id2;
    const room = await Room.findOne({ 'user1': id1, 'user2': id2 })
    if (!room) {
      const room1 = await Room.findOne({ 'user1': id2, 'user2': id1 })
      if (!room1) {
        const newRoom = new Room({ 'user1': id1, 'user2': id2 });
        await newRoom.save();

        return res.status(200).json({ 'id': newRoom._id })
      }
      console.log(room1['_id'])
      return res.status(201).json({ 'id': room1._id })
    }
    // // acc.tokens = acc.tokens.concat({ token });

    console.log(room._id)
    return res.status(201).json({ 'id': room._id })

  } catch (error) {
    res.status(500).send(error)
  }
})

app.post('/get', async (req, res) => {

  try {
    const id = req.body.id;
    const room = await Room.findOne({ '_id': id })
    if (!room) return res.send('khum thay')
    var room1 = room.messages.concat()
    room.save()
    // console.log(room);
    res.status(200).send(room1)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post('/getUserChat', async (req, res) => {

  try {
    const id = req.body.id;
    const room = await Room.find({
      "$or": [{
        "user1": id
      }, {
        "user2": id
      }]
    })

    if (!room) return res.send('khum thay')

    console.log(room);
    res.status(200).send(room)

  } catch (error) {
    res.status(500).send(error)
  }
})
mongoose.connect(process.env.URL, (err) => {
  if (err) return console.log('Ket noi voi database loi');
  console.log("Ket noi thanh cong");
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});