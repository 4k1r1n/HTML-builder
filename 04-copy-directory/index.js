const fs = require('fs');
const path = require('path');

(async function copyDir() {
    const dirPath = path.join(__dirname, 'files');
    const copyDirPath = path.join(__dirname, 'files-copy');

    try {
        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
        await fs.promises.rm(copyDirPath, { recursive: true, force: true });
        await fs.promises.mkdir(copyDirPath, { recursive: true });
        files.forEach(async file => {
            if (file.isFile()) {
                await fs.promises.copyFile(path.join(dirPath, file.name), path.join(copyDirPath, file.name));
            }
        })
    } catch (err) {
        console.error(err);
    }
})()