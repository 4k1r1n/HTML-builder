const fs = require('fs');
const path = require('path');

async function mergeStyles() {
    const dirPath = path.join(__dirname, 'styles');
    try {
        await fs.promises.rm(path.join(__dirname, 'project-dist', 'bundle.css'), { recursive: true, force: true });

        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
        files.forEach(async file => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const content = await fs.promises.readFile(path.join(dirPath, file.name), 'utf-8');
                await fs.promises.appendFile(path.join(dirPath, '..', 'project-dist', 'bundle.css'), content);
            }
        })
    } catch (err) {
        console.error(err);
    }
}

mergeStyles();