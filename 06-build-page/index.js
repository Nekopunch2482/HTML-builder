const fs = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const path = require('path');
const { pipeline } = require('node:stream/promises');

const make_index = async () => {
  const component_directory = path.join(__dirname, 'components');
  const template_path = path.join(__dirname, 'template.html');

  let template = await fs.readFile(template_path, 'utf8');

  const component_list = await Promise.all(
    (await fs.readdir(component_directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const file_path = path.join(component_directory, entry.name);
        const data = await fs.readFile(file_path, 'utf8');
        const comp_name = entry.name.split('.')[0].toLowerCase();
        return [comp_name, data];
      }),
  );

  [...template.matchAll(/\{\{(.*?)\}\}/g)].forEach(
    ([full_match, comp_name]) => {
      const component = component_list.find(
        (comp) => comp[0] === comp_name.toLowerCase(),
      );

      if (!component) return;

      template = template.replace(full_match, component[1]);
    },
  );

  const out_path = path.join(__dirname, 'project-dist/index.html');

  const out_stream = createWriteStream(out_path, {
    encoding: 'utf8',
    flags: 'w',
  });

  out_stream.write(template);
  out_stream.end();
};

const make_bundle = async () => {
  const style_directory = path.join(__dirname, 'styles');
  const destination_file = path.join(__dirname, 'project-dist/style.css');

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

const copy_assets = () => {
  const source_dir = path.join(__dirname, 'assets');
  const destination_dir = path.join(__dirname, 'project-dist/assets');

  copy_directory(source_dir, destination_dir);
};

(async () => {
  const project_dist = path.join(__dirname, 'project-dist');

  await fs.rm(project_dist, {
    recursive: true,
    force: true,
  });

  await fs.mkdir(project_dist, { recursive: true });

  make_index();

  make_bundle();

  copy_assets();
})();
