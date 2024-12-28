const fs = require('fs/promises');
const path = require('path');

const source_dir = path.join(__dirname, 'files');
const destination_dir = path.join(__dirname, 'files-copy');

const copy_directory = async (source, destination) => {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const source_path = path.join(source, entry.name);
    const destination_path = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copy_directory(source_path, destination_path);
    } else {
      await fs.copyFile(source_path, destination_path);
    }
  }
};

copy_directory(source_dir, destination_dir);
