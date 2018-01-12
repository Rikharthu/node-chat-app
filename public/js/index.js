// Open up a web socket
var socket = io();

// Listen for an event
socket.on('connect', function () {
    console.log('Connected to server!');

    socket.emit('createMessage', {
        from:'Andrew',
        text:'Yup, that works for me.'
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server!');
});

socket.on('newMessage', function (message) {
    console.log('newMessage',message);
});