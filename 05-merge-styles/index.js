const fs = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const path = require('path');
const { pipeline } = require('node:stream/promises');

const style_directory = path.join(__dirname, 'styles');
const destination_file = path.join(__dirname, 'project-dist/bundle.css');

const make_bundle = async () => {
  const bundle = createWriteStream(destination_file, {
    encoding: 'utf8',
    flags: 'w',
  });

  const style_list = (
    await fs.readdir(style_directory, { withFileTypes: true })
  )
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => path.join(style_directory, entry.name))
    .map((style) => createReadStream(style, { encoding: 'utf8' }));

  for (const style of style_list) {
    await pipeline(style, bundle, { end: false });
  }
};

make_bundle();
