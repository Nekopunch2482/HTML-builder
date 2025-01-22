const fs = require('fs/promises');
const path = require('path');

const SECRET_FOLDER = path.join(__dirname, 'secret-folder');

const list_files = async () => {
  const file_list = (
    await fs.readdir(SECRET_FOLDER, { withFileTypes: true })
  ).filter((e) => !e.isDirectory());

  for (const file of file_list) {
    const stats = await fs.stat(path.join(file.path, file.name));

    const { name, ext } = path.parse(file.name);
    const file_size = Math.round(stats.size / 1024) + 'kb';

    console.log(`${name} - ${ext.slice(1)} - ${file_size}`);
  }
};

list_files();
