const yargs = require('yargs');
const args = yargs.usage('node server.js [options]')
  .help('h')
  .alias('h', 'help')
  .option('env', {
    alias: 'environment',
    demand: false,
    describe: 'Can be "production" or "development". Default is "development".',
    type: 'string'
  })
  .argv;

args.env = ['production', 'development'].includes(args.environment) ? args.environment : 'development';

module.exports = args;
