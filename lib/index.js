const os = require('os');
const uuid = require('node-uuid');
const fetch = require('./fetch');

var repos = [
  {
    name: 'pageres-cli',
    owner: 'portgasd666',
    language: 'JavaScript',
    extensions: ['js']
  }
  /*{
    name: 'redis',
    owner: 'antirez',
    language: 'C',
    extensions: ['c', 'h']
  }*/
];

fetch(repos, os.tmpdir() + '/' + uuid.v1() + '/')
  .then(function() {
    console.log('Done'); //eslint-disable-line no-console
  })
  .catch(err => console.log(err)); //eslint-disable-line no-console
