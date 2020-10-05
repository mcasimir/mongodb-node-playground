import { MongoClient } from 'mongodb';
import repl from 'repl';
import vm from 'vm';
import path from 'path';
import os from 'os';

import { Context } from './context';
import { customEvalWithContext } from './custom-eval-with-context';
import { parseArgs } from './parse-args';

async function main() {
  const {
    connectionString
  } = parseArgs(process.argv.slice(2));

  const client = await MongoClient.connect(
    connectionString,
    { useUnifiedTopology: true }
  );

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
