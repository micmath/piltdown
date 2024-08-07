import opts from './opts.js';
import Model from '../mvc/model.js';
import loadData from './data.js';
import loadPages from './pages.js';
import transformPages from './transform.js';
import writePages from './write.js';
import { EventEmitter } from 'node:events';
class Progress extends EventEmitter {
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
}
export default function runTasks(userOptions) {
    const progress = new Progress();
    setImmediate(async () => {
        try {
            const options = await opts(userOptions);
            progress.emit('opts:loaded', options);
            const model = new Model(['data', 'pages']);
            const [dataResult, pagesResult] = await Promise.all([
                loadData(model, options),
                loadPages(model, options)
            ]);
            progress.emit('data:loaded', model);
            progress.emit('pages:loaded', model);
            await transformPages(model, options);
            progress.emit('pages:transformed', model);
            await writePages(model, options);
            progress.emit('pages:written', model);
            progress.emit('done');
        }
        catch (error) {
            progress.emit('error', error instanceof Error ? error : new Error(String(error)));
        }
    });
    return progress;
}
