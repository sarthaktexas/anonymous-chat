const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.set('view engine', 'pug');
app.use(express.static('public'));
var port = process.env.PORT || 3000
app.get('/', function (req, res, next) {
  res.render('chat', {
    title: 'Chat'
  });
});
io.sockets.on('connection', function(socket) {
  socket.on('username', function(username) {
      socket.username = username;
      io.emit('is_online', '<i>' + socket.username + ' joined the chat</i>');
  });
  socket.on('disconnect', function(username) {
      io.emit('is_online', '<i>' + socket.username + ' left the chat</i>');
  })
  socket.on('chat_message', function(message) {
      io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
  });
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
});
const server = http.listen(port, function() {
  console.log('listening on port 3000');
});