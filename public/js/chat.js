// Open up a web socket
var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = $("#messages");
    var newMessage = messages.children('li:last-child');
    // Heights
    // More info: https://stackoverflow.com/questions/22675126/what-is-offsetheight-clientheight-scrollheight
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight(); // height + padding
    var lastMessageHeight = newMessage
        .prev() // go to second-to-last list item
        .innerHeight();

    // Determine whether user is scrolled close to last message and we should apply auto-scroll
    // (whether last message, before adding new message is visible)
    if (scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

// Listen for an event
socket.on('connect', function () {
    console.log('Connected to server!');
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server!');
});

socket.on('updateUserList', function (users) {
    var userList=$('#users');
    userList.empty();

    var ol = $('<ol></ol>');

    users.forEach(function (user) {
        ol.append($('<li></li>').text(user));
    });

    userList.append(ol);
});

function getFormattedTime(timestamp) {
    return moment(timestamp).format('h:mm a');
}

// New message arrived
socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${getFormattedTime(message.createdAt)}: ${message.text}`);
    // jQuery('#messages').append(li);

    // Using Mustache.js
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: getFormattedTime(message.createdAt)
    });

    $('#messages').append(html);

    scrollToBottom();
});

// New location message arrived
socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message);
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank"></a>'); // _blank - open in new tab
    // a.text('My current location');
    // li.text(`${message.from} ${getFormattedTime(message.createdAt)}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);

    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: getFormattedTime(message.createdAt)
    });

    $('#messages').append(html);

    scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
    // disable default page refresh on form submit
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function () {
        // fire when the aknowledgment arrives
        console.log('Got it');
        // When message is received by the server, clean the message form
        messageTextBox.val('');
    });
});

var locationButton = jQuery('#send-location')
locationButton.on('click', function () {
    console.log('Sharing location');
    // Check if geolocation api is enabled
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser!');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function (msg) {
            console.log(msg);
        });
    }, function () {
        alert('Unable to fetch location');
        console.log('Unable to fetch location');
        locationButton.removeAttr('disabled').text('Send location');
    });
});