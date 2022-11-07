const fs = require('fs');
const path = require('path');

async function buildPage() {
    const bundleDirPath = path.join(__dirname, 'project-dist');
    const assetsDirPath = path.join(__dirname, 'assets');

    try {
        await fs.promises.rm(bundleDirPath, { recursive: true, force: true });
        await fs.promises.mkdir(bundleDirPath, { recursive: true });
        await createTemplate(bundleDirPath)
        await mergeStyles();
        await copyAssets(path.join(bundleDirPath, 'assets'), assetsDirPath);
    } catch (err) {
        console.error(err);
    }
}

async function createTemplate(bundlePath) {
    const htmlPath = path.join(__dirname, 'template.html');
    const componentsDirPath = path.join(__dirname, 'components');

    try {
        let template = await fs.promises.readFile(htmlPath, 'utf-8');
        const components = await fs.promises.readdir(componentsDirPath, { withFileTypes: true });
        components.forEach(async component => {
            const tag = `{{${path.parse(component.name).name}}}`;
            if (template.includes(tag)) {
                const content = await fs.promises.readFile(path.join(componentsDirPath, component.name), 'utf-8');
                template = template.replaceAll(tag, content);
            }
            await fs.promises.writeFile(path.join(bundlePath, 'index.html'), template, 'utf-8');
        })
    } catch (err) {
        console.error(err);
    }
}

async function mergeStyles() {
    const stylesDirPath = path.join(__dirname, 'styles');
    try {
        const files = await fs.promises.readdir(stylesDirPath, { withFileTypes: true });
        files.forEach(async file => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const content = await fs.promises.readFile(path.join(stylesDirPath, file.name), 'utf-8');
                await fs.promises.appendFile(path.join(stylesDirPath, '..', 'project-dist', 'style.css'), `${content}\n`);
            }
        })
    } catch (err) {
        console.error(err);
    }
}

async function copyAssets(dest, src) {
    try {
        await fs.promises.mkdir(dest, { recursive: true });
        const files = await fs.promises.readdir(src, { withFileTypes: true });
        files.forEach(async file => {
            if (file.isFile()) {
                await fs.promises.copyFile(path.join(src, file.name), path.join(dest, file.name));
            } else {
                copyAssets(path.join(dest, file.name), path.join(src, file.name));
            }
        })
    } catch (err) {
        console.error(err);
    }
}

buildPage();