import opts from './opts.js';
import Model from '../mvc/model.js';
import loadData from './data.js';
import loadPages from './pages.js';
import transformPages from './transform.js';
import writePages from './write.js';
import { EventEmitter } from 'node:events';
import type { Opts } from '../../../types/opts.js';

// all possible events that could be emitted
interface ProgressEvents {
  'opts:loaded': (options: Opts) => void;
  'data:loaded': (model: Model) => void;
  'pages:loaded': (model: Model) => void;
  'pages:transformed': (model: Model) => void;
  'pages:written': (model: Model) => void;
  'done': () => void;
  'error': (error: Error) => void;
}

// listen for progress as the tasks run
class Progress extends EventEmitter {
  emit<K extends keyof ProgressEvents>(event: K, ...args: Parameters<ProgressEvents[K]>): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof ProgressEvents>(event: K, listener: ProgressEvents[K]): this {
    return super.on(event, listener);
  }
}

export default function runTasks(userOptions: Partial<Opts>): Progress {
  const progress = new Progress();

  // defer async until next event loop to allow immediate return of progress
  setImmediate(async () => {
    try {
      const options: Opts = await opts(userOptions);
      progress.emit('opts:loaded', options);

      const model = new Model(['data', 'pages']);

      // concurrently
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
    } catch (error) {
      progress.emit('error', error instanceof Error ? error : new Error(String(error)));
    }
  });

  return progress;
}
