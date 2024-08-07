# Piltdown

## Usage

Run the converter from the command line:

`node ./src/run.js -p _pages -s _site && echo 'OK'`:

Run the converter as an imported module:

```js
import piltdown from 'piltdown';

const opts = {
    dir: {
      data: './_data',
      pages: './_pages',
      site: './_site'
    },
    filters: {
      usdate: (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      ucwords: (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    }
  };

  const run = piltdown(opts);
  run.on('pages:written', () => {
    console.log(`> all pages written`);
  });

  run.on('done', () => {
    console.log(`> finished buildHtml`);
    cb();
  });
  
  run.on('error', (error) => {
    console.error('> error', error);
    process.exit(1);
  });
```

## Development

- `npm run watch:ts`: Compile `ts` file on change.