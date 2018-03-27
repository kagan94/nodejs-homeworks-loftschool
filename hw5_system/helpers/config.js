const path = require('path');
const fs = require('fs');
const args = require('./script-args');

// Load config
const configPath = path.join(process.cwd(), (args.env + '.config.json'));
if (!fs.existsSync(configPath)) {
  throw new Error('Config for environment ' + args.env + ' does not exist');
}

const config = require(configPath);
config.env = args.env;

module.exports = config;
