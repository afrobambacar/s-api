import { addPath } from 'app-module-path';
import path from 'path';

addPath(path.resolve(__dirname, '../app/'));

const chai = require('chai');

// Load Chai assertions
global.expect = chai.expect;
global.assert = chai.assert;
global.should = chai.should();

// Load Sinon
// global.sinon = require('sinon');

// Initialize Chai plugins
// chai.use(require('sinon-chai'));
// chai.use(require('chai-as-promised'));
// chai.use(require('chai-things'));

// chai.config.includeStack = true;
// chai.config.showDiff = true;
