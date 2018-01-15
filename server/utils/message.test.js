var expect = require('expect');

var {
    generateMessage,
    generateLocationMessage
} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Vasja';
        var text = 'Afternoon in flat';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        var from = 'Vasja';
        var lat = 56;
        var lng = 23;
        var message = generateLocationMessage(from, lat, lng);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            url: `https://www.google.com/maps?q=${lat},${lng}`
        });
    });
});