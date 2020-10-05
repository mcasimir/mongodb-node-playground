const yargsParser = require('yargs-parser');

function usage() {
  console.info('USAGE: mongodb-node-playground [url] [options]');
  process.exit(1);
}

export function parseArgs(argv) {
  const args = yargsParser(argv);

  if (args._.length > 1) {
    usage();
  }

  const connectionStringUrl = new URL(args._[0] || 'mongodb://localhost:27017');

  const queryStringOptions = Object.entries(args)
    .filter(([name]) => name != '_')
    .map(([name, value]) => [name, value.toString()]);

  for (const [name, value] of queryStringOptions) {
    connectionStringUrl.searchParams.append(name, value);
  }

  return {
    connectionString: connectionStringUrl.toString()
  };
}

