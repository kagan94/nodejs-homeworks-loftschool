/**
 * Created by Leo on 3/26/2018.
 */

let clients = {};

module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', function (client) {
    const clientData = {
      id: client.id,
      username: client.handshake.headers.username
    };
    console.log('Client %s connected, id: %s. Total users: %s', client.handshake.headers.username, client.id, clients.length + 1);

    // Notify other users about new user
    client.broadcast.emit('new user', clientData);

    // Send "all users" to current client
    clients[client.id] = clientData;
    client.emit('all users', clients);

    // Handle sent message
    client.on('chat message', function (msg, targetClientId) {
      console.log('received msg', msg, 'targetClientID', targetClientId);
      console.log('curr client id %s', client.id);
      client.broadcast
        .to(targetClientId)
        .emit('chat message', msg, client.id);
    });

    // Handle disconnection
    client.on('disconnect', function () {
      delete clients[client.id];

      // Notify other users that user left
      client.broadcast.emit('delete user', client.id);

      console.log('client %s disconnected. Total remaining users: %s', client.id, Object.keys(clients).length);
    });
  });
};
