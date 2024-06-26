const fs = require('fs');

const outputFileFunc = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('users.txt', 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                reject(err);
                return;
            }
            const users = data ? JSON.parse(data) : [];
            console.log('Users data read from file:', users);
            resolve(users);
        });
    });
};

const inputFileFunc = (obj) => {
    return new Promise((resolve, reject) => {
        fs.writeFile('users.txt', JSON.stringify(obj), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                reject(err);
                return;
            }
            console.log('Users data written to users.txt');
            resolve();
        });
    });
};

module.exports = { inputFileFunc, outputFileFunc };
