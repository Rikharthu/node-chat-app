const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {
    isRealString
} = require('./utils/validation');
const {
    Users
} = require('./utils/users');

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

// create http server from express app
var app = express();
var server = http.createServer(app);
// make socket.io use our server
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// register an event listener
// io.on - server-wide events
io.on('connection', (socket) => {
    console.log('New user connected!');

    socket.on('join', (params, callback) => {
        var {
            name,
            room
        } = params;

        if (!isRealString(name) || !isRealString(room)) {
            return callback('Name and room name are required.');
        }

        socket.join(room);
        // socket.leave('THe Office Fans')
        // io.emit -> io.to('The Office Fans').emit
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
        // socket.emit -> as is, since it's already socket-specific

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // Greet the new user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        // Notify others about new user
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('Creating message', message);

        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            // notify all sockets about new message
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            // acknowledge that we got the request
        }

        callback('Message created');

        // Will send event to everybody but this particular socket
        // We will not see the message we send, but everyone else will
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (location, callback) => {
        console.log('Creating location message');

        var user = users.getUser(socket.id);
        if (user) {
            io.emit('newLocationMessage', generateLocationMessage(user.name, location.latitude, location.longitude));
        }

        callback('Location message created');
    });

    // socket.on - events for the individual socket
    socket.on('disconnect', () => {
        console.log('User was disconnected');
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});