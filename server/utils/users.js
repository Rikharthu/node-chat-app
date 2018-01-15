// [{
//     id: '/#12poiajdspfoif',
//     name: 'Andrew',
//     room: 'The Office Fans'
// }]
// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

// class Person {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     }

//     getUserDescription() {
//         return `${this.name} is ${this.age} year(s) old.`;
//     }
// }

// var me = new Person('Andrew', 25);
// console.log(me);
// console.log(me.name);
// console.log(me.age);
// console.log(me.getUserDescription());

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // return user that was removed
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room) {
        return this.users
            .filter((user) => user.room === room)
            .map((user) => user.name);
    }
}

module.exports = {
    Users
};