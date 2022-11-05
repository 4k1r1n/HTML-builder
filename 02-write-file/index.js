const fs = require('fs');
const path = require('path');
const { stdin } = process;

const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(filePath, 'utf-8');

console.log('Write something...');

const showMessage = () => {
    console.log('Saved :)');
    process.exit();
}

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') showMessage();
    stream.write(data);
});

process.on('SIGINT', () => showMessage());