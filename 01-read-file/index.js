const fs = require('fs');
const path = require('path');

const file_path = path.join(__dirname, 'text.txt');
fs.createReadStream(file_path, { encoding: 'utf8' }).pipe(process.stdout);
