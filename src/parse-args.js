export function parseArgs(args) {
  const connectionString = args[0] || 'mongodb://localhost:27017';
  return { connectionString };
}
