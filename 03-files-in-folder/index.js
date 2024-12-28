const fs = require('fs/promises');
const path = require('path');

const SECRET_FOLDER = path.join(__dirname, 'secret-folder');

const list_files = async () => {
  const file_list = (
    await fs.readdir(SECRET_FOLDER, { withFileTypes: true })
  ).filter((e) => !e.isDirectory());

  for (const file of file_list) {
    const stats = await fs.stat(path.join(file.path, file.name));

    const [file_name, file_extension] = file.name.split('.');
    const file_size = Math.round(stats.size / 1024) + 'kb';

    console.log(`${file_name} - ${file_extension || ''} - ${file_size}`);
  }
};

list_files();
