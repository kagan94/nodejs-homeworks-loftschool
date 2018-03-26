const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

global.chai = chai;
global.server = server;
global.expect = expect;
global.request = chai.request(server);
