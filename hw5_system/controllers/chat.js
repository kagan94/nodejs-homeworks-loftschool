/**
 * Created by Leo on 3/26/2018.
 */

let clients = [];

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', function (client) {
    const clientData = {
      id: client.id,
      username: client.handshake.headers.username
    };
    console.log('Client connected...', client.handshake.headers.username);

    // Notify other users about new user
    client.broadcast.json.emit('new user', clientData);

    // Send "all users" to current client
    clients.push(clientData);
    client.emit('all users', clients);

    // Handle sent message
    client.on('chat message', function (msg, targetClientId) {
      client.broadcast
        .to(targetClientId)
        .json.emit('chat message', [msg, client.id]);
    });

    // Handle disconnection
    client.on('disconnect', function () {
      clients = clients.splice(clients.findIndex(function(el){
        return el.id === client.id;
      }), 1);
      // delete clients[client.id];

      // Notify other users that user left
      client.broadcast.json.emit('delete user', client.id);
    });
  });
};
