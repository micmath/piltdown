import fs from 'fs/promises';
import path from 'node:path';
const writePages = async (model, opts) => {
    const pages = model.get('pages');
    try {
        const { site: outdir } = opts.dir;
        await fs.mkdir(outdir, { recursive: true });
        const writePromises = pages.map(async (page) => {
            const outputFilePath = page.destpath;
            const outputDir = path.dirname(outputFilePath);
            await fs.mkdir(outputDir, { recursive: true });
            return fs.writeFile(outputFilePath, page.body, 'utf-8');
        });
        await Promise.all(writePromises);
    }
    catch (err) {
        console.error('Error in writePages:', err);
    }
    return Promise.resolve();
};
export default writePages;
