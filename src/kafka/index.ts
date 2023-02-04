import fs from 'fs';
import path from 'path';

const exported = {};

const readDirectory = (dir: string) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      readDirectory(filePath);
    } else {
      if(file === 'index.ts') {
        continue;
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require(path.resolve(__dirname, file));
      Object.assign(exported, module);
    }
  }
};

readDirectory(__dirname);

export default exported;