const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

(async () => {
    try {
        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const stats = await fs.promises.stat(path.join(dirPath, file.name));
                const fileName = file.name.split('.')[0];
                const fileType = path.extname(file.name).slice(1);
                const fileSize = stats.size;
                console.log(`${fileName} - ${fileType} - ${fileSize}bytes`);
            }
        }
    } catch (err) {
        console.error(err);
    }
})()