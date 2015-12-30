import test from 'ava';
import fileTokens from '../../../dist/fileTokens';

test('should fail on attempt to read tokens for invalid file', t => {
  t.throws(fileTokens(__dirname + '/doesNotExist', 'c'));
})

test('should properly read tokens for .c files', t => {
  return fileTokens(__dirname + '/hello.c', 'c')
    .then(function({keywords, identifiers}) {
      t.true(identifiers.has('main'));
      t.is(keywords.get('return'), 1);
      t.is(keywords.get('int'), 2);
      t.true(identifiers.has('argc'));
    });
});

test('should properly read tokens for .cpp files', t => {
  return fileTokens(__dirname + '/hello.cpp', 'cpp')
    .then(function({keywords, identifiers}) {
      t.true(identifiers.has('main'));
      t.is(keywords.get('return'), 1);
      t.is(keywords.get('int'), 2);
      t.true(identifiers.has('iostream'));
      t.true(identifiers.has('std'));
      t.is(keywords.get('using'), 2);
      t.is(keywords.get('namespace'), 2);
    });
});

test('should properly read tokens for .java files', t => {
  return fileTokens(__dirname + '/Hello.java', 'java')
    .then(function({keywords, identifiers}) {
      t.true(identifiers.has('main'));
      t.true(identifiers.has('args'));
      t.true(identifiers.has('System'));
      t.is(keywords.get('class'), 1);
      t.is(keywords.get('void'), 1);
      t.is(keywords.get('static'), 1);
      t.is(keywords.get('import'), 2);
    });
});

test('should properly read tokens for .js files', t => {
  return fileTokens(__dirname + '/hello.js', 'javascript')
    .then(function({keywords, identifiers}) {
      t.false(identifiers.has('main'));
      t.false(identifiers.has('args'));
      t.true(identifiers.has('console'));
      t.is(keywords.get('class'), 0);
      t.is(keywords.get('require'), 1);
      t.is(keywords.get('const'), 1);
    });
});
