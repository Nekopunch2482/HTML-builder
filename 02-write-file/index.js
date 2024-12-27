const fs = require('fs');
const readline = require('readline');
const path = require('path');

const file_path = path.join(__dirname, 'text.txt');
const file = fs.createWriteStream(file_path, { flags: 'a' });

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

cli.setPrompt('enter your text > ');
cli.prompt();

cli.on('line', (input) => {
  if (input === 'exit') return on_exit();

  file.write(`${input}`);
  cli.prompt();
});

const on_exit = () => {
  console.log('');
  console.log('Exiting now...');
  file.end();
  process.exit();
};

cli.on('close', () => on_exit());
cli.on('SIGINT', () => cli.close());
cli.on('SIGTERM', () => cli.close());
cli.on('SIGBREAK', () => cli.close());
