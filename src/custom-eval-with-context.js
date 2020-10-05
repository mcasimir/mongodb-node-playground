import vm from 'vm';
import repl from 'repl';

export function customEvalWithContext(context) {
  vm.createContext(context);

  function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
      return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
  }

  return async function myEval(cmd, _context, filename, callback) {
    let result;
    try {
      const script = new vm.Script(cmd);
      result = await script.runInContext(context);
    } catch (e) {
      if (isRecoverableError(e)) {
        return callback(new repl.Recoverable(e));
      }

      return callback(e);
    }

    callback(null, result);
  }
}


