require('babel-polyfill');

const pify = require('pify');
const got = require('got');
const path = require('path');
const fs = pify(require('fs-extra'));
const config = require('./../config');

let destinationPath = __dirname + '/../';

// fetch :: [Repo] -> [Link] -> FolderPath -> Promise(IO, [FilePath])
module.exports = async function fetch(repoList = [], destinationDir = destinationPath) {
  destinationPath = destinationDir;
  return Promise.all(repoList.map(fetchRepo));
};

// fetchRepo :: Repo -> Promise(IO, [FilePath])
async function fetchRepo(repo) {
  let commitInfoUrl = getCommitInfoUrl(repo);
  let {body: commitInfoBody} = await got(commitInfoUrl);
  let commitInfo = JSON.parse(commitInfoBody)[0];
  let commitTreeUrl = getCommitTreeUrl(commitInfo);

  let {body: commitTreeBody} = await got(commitTreeUrl);
  let commitTree = JSON.parse(commitTreeBody).tree;
  let commitFileList = getCommitFileList(commitTree, repo);
  return Promise.all(commitFileList.map(fetchFile));
}

// fetchFile :: File -> Promise(IO, FilePath)
async function fetchFile(file) {
  let fileUrl = getFileUrl(file);
  let {body: fileRequestBody} = await got(fileUrl);
  let fileBody = JSON.parse(fileRequestBody).content.toString();
  let fileBodyBuffer = new Buffer(fileBody, 'base64');
  let destinationFilePath = getDestinationFilePath(file);
  let destinationDir = destinationFilePath.substring(0, destinationFilePath.lastIndexOf('/'));
  return fs.ensureDir(destinationDir)
    .then(() => fs.writeFile(destinationFilePath, fileBodyBuffer))
    .then(() => destinationFilePath);
}

// getCommitInfoUrl :: Repo -> URL
function getCommitInfoUrl(repo) {
  const GITHUB_API_URL = 'https://api.github.com';
  const ACCESS_TOKEN = config.githubToken; // Will probably have to change how this is obtained

  return GITHUB_API_URL + '/repos/' + repo.owner + '/' + repo.name + '/commits?access_token=' + ACCESS_TOKEN;
}

//getCommitTreeUrl :: Commit -> URL
function getCommitTreeUrl(commit) {
  const ACCESS_TOKEN = config.githubToken; // Will probably have to change how this is obtained

  return commit.commit.tree.url + '?recursive=1&access_token=' + ACCESS_TOKEN;
}

// getCommitFileList :: [File] -> Repo -> [File]
function getCommitFileList(commitTree, {language, owner, name, extensions}) {
  return commitTree.filter(file => extensions.indexOf(path.extname(file.path)) !== -1)
                   .map(file => Object.assign(file, {language, owner, name}));
}

// getFileUrl :: File -> URL
function getFileUrl(file) {
  const ACCESS_TOKEN = config.githubToken; // Will probably have to change how this is obtained

  return file.url + '?access_token=' + ACCESS_TOKEN;
}

// getDestinationFilePath :: File -> FilePath
function getDestinationFilePath(file) {
  return destinationPath + 'samples/' + file.language + '/' + file.owner + '.' + file.name + '.' + file.path.replace('/', '.');
}
