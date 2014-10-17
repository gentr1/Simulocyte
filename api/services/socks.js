// services/socks.js
 
/**
 * We load SocketIO
 */
var http = require("http"),
    server = http.createServer().listen(8080);
 
var    io = require('socket.io').listen(server), // Don't forget to "npm install socket.io" before including this
    fs = require('fs');
 
/**
 * Connection
 */
io.sockets.on('connection', function (socket) {
 
    console.log('CONNECT');
 
    socket.on('disconnect', function (socket) {
 
        console.log('DISCONNECT');
 
    });
 
    socket.on('awesome-event', function (socket) {
 
        console.log('blablabla');
 
    });
 
});
 
/**
 * Let's export everything
 */
 module.exports = {
 
     socket: io.sockets,
 
 }