/**
 * Created by Leo on 3/3/2018.
 */

const dateFormat = require('dateformat');
const http = require('http');
const delay = require('delay');
const yargs = require('yargs');

const args = yargs.usage('node index.js [options]')
  .help('h')
  .alias('h', 'help')
  .option('idms', {
    alias: 'intervalDelay',
    demand: false,
    describe: 'Interval delay in Ms',
    type: 'number'
  })
  .option('ccd', {
    alias: 'closeConnectionAfterDelay',
    demand: false,
    describe: 'Сlose client connection after delay in N Ms',
    type: 'number'
  })
  .epilog('Ms - milliseconds')
  .argv;

const port = 3000;
const useUTCDateTime = true;

const intervalDelay = args.intervalDelay || 1000;
const closeConnectionDelayMs = args.closeConnectionAfterDelay || 5000;
let clientId = 0;

const getUTCDateTime = () => dateFormat(new Date(), 'yyyy-mm-dd H:MM:ss', useUTCDateTime);
const printUTCDateTime = (clientId) => console.log('Client %s: %s', clientId, getUTCDateTime());

async function serveClient (clientId) {
  const startTime = Date.now();
  let timeElapsed = 0.0;
  printUTCDateTime(clientId);

  while (timeElapsed < closeConnectionDelayMs) {
    await delay(intervalDelay);
    printUTCDateTime(clientId);
    timeElapsed = Date.now() - startTime;
  }
  return getUTCDateTime();
}

async function handleClient (request, response) {
  let res;
  if (request.method === 'GET' && request.url !== '/favicon.ico') {
    try {
      res = await serveClient(++clientId);
      console.log('Served client successfully', res);
    } catch (error) {
      console.error(error);
    }
  }
  response.end(res);
}

console.log('Server started...');
http.createServer(handleClient).listen(port);
