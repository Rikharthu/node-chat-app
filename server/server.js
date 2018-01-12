const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

// create http server from express app
var app = express();
var server = http.createServer(app);
// make socket.io use our server
var io = socketIO(server);

app.use(express.static(publicPath));

// register an event listener
// io.on - server-wide events
io.on('connection', (socket) => {
    console.log('New user connected!');

    // // send an event
    // socket.emit('newMessage', {
    //     from: 'John',
    //     text: 'Hey. What is going on?',
    //     createdAt: 123987
    // });

    socket.on('createMessage', (message) => {
        console.log('Creating message', message);
        // notify all sockets about new message
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    // socket.on - events for the individual socket
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});