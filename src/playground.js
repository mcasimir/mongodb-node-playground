import { MongoClient } from 'mongodb';
import repl from 'repl';
import vm from 'vm';
import path from 'path';
import os from 'os';
import cliColor from 'cli-color';

import { Context } from './context';
import { customEvalWithContext } from './custom-eval-with-context';
import { parseArgs } from './parse-args';

function welcome(connectionString) {
  const connectionStringUrl = new URL(connectionString);

  if (connectionStringUrl.password) {
    connectionStringUrl.password = 'xxxxx';
  }

  require('mongodb/package.json').version;
  console.info('Driver version:\t', require('mongodb/package.json').version);
  console.info('Kerberos version:\t', require('kerberos/package.json').version);
  console.info('Connecting to:\t', cliColor.green(connectionStringUrl.toString()));
}

async function main() {
  const {
    connectionString
  } = parseArgs(process.argv.slice(2));

  welcome(connectionString);

  const client = await MongoClient.connect(
    connectionString,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  );

  console.info('\nconnected.\n');

  const context = new Context(client);
  vm.createContext(context);

  const replServer = repl.start({
    prompt: 'mongodb-node-playground > ',
    eval: customEvalWithContext(context)
  });

  replServer.setupHistory(path.join(os.homedir(), '.mongodb_node_playground_history'), (err) => {
    if (err) {
      throw err;
    }
  });

  replServer.on('exit', async () => {
    await client.close();
    process.exit();
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
