const express = require('express');
const app = express();
const path = require('path');

const server = require('http').createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket)=> {
 socket.on("user-location", (location) => {
    io.emit('received-location', {id: socket.id, ...location});
 });

 socket.on('disconnect', () => {
    io.emit('disconnected', socket.id);
 });
})

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
})

server.listen(3000)