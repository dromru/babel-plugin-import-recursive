import '@babel/register'
import * as babel from '@babel/core'
import path from 'path'
import plugin from '../index'

const transform = (code, opts = {}) =>
  babel.transform(code, { babelrc: false, plugins: [[plugin, opts]] }).code

test('importing without specifiers', () => {
  const orig = `import './src/test/fixtures/**';`

  expect(transform(orig)).toEqual(`import "./src/test/fixtures/c/fakeModuleD";
import "./src/test/fixtures/fake-module-b";
import "./src/test/fixtures/fake.module.a";`)
})

test("importing a module shouldn't do nothing", () => {
  const orig = `import x from 'fake-module';`

  expect(transform(orig)).toEqual(orig)
})

test('importing the absolute path', () => {
  const resolvedPath = path.resolve('./src/test/fixtures')
  const orig = `import '${resolvedPath}/**';`

  expect(transform(orig)).toEqual(`import "${resolvedPath}/c/fakeModuleD";
import "${resolvedPath}/fake-module-b";
import "${resolvedPath}/fake.module.a";`)
})

test("importing a existing file shouldn't do nothing", () => {
  const orig = `import x from './src/index.js';`

  expect(transform(orig)).toEqual(orig)
})

test("importing a existing directory with an index file shouldn't do nothing", () => {
  const orig = `import x from './src';`

  expect(transform(orig)).toEqual(orig)
})

test("importing a existing directory without javascript files shouldn't do nothing", () => {
  const orig = `import x from './src/test/fixtures/d';`

  expect(transform(orig)).toEqual(orig)
})

test('importing a existing directory without index file', () => {
  const orig = `import x from './src/test/fixtures';`

  expect(transform(orig)).toEqual(`const _dirImport = {};
import * as _fakeModuleB from "./src/test/fixtures/fake-module-b";
import * as _fakeModuleA from "./src/test/fixtures/fake.module.a";
_dirImport.fakeModuleA = _fakeModuleA
_dirImport.fakeModuleB = _fakeModuleB
const x = _dirImport;`)
})

test('importing a existing directory without index file nostrip', () => {
  const orig = `import x from './src/test/fixtures';`

  expect(transform(orig, { nostrip: true })).toEqual(`const _dirImport = {};
import * as _fakeModuleBJs from "./src/test/fixtures/fake-module-b.js";
import * as _fakeModuleAJs from "./src/test/fixtures/fake.module.a.js";
_dirImport.fakeModuleAJs = _fakeModuleAJs
_dirImport.fakeModuleBJs = _fakeModuleBJs
const x = _dirImport;`)
})

test('importing a existing directory without index file listTransform, sort by depth', () => {
  const orig = `import './src/test/fixtures/**';`
  const listTransform = list => list.sort((a, b) => a.length - b.length)

  expect(transform(orig, { listTransform }))
    .toEqual(`import "./src/test/fixtures/fake-module-b";
import "./src/test/fixtures/fake.module.a";
import "./src/test/fixtures/c/fakeModuleD";`)
})

test('importing a existing directory without index file', () => {
  const orig = `import x from './src/test/fixtures';`

  expect(transform(orig, { snakeCase: true })).toEqual(`const _dirImport = {};
import * as _fakeModuleB from "./src/test/fixtures/fake-module-b";
import * as _fakeModuleA from "./src/test/fixtures/fake.module.a";
_dirImport.fake_module_a = _fakeModuleA
_dirImport.fake_module_b = _fakeModuleB
const x = _dirImport;`)
})

test('importing a existing directory without index file', () => {
  const orig = `import x from './src/test/fixtures/*';`

  expect(transform(orig)).toEqual(`const _dirImport = {};
import * as _fakeModuleB from "./src/test/fixtures/fake-module-b";
import * as _fakeModuleA from "./src/test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

const x = _dirImport;`)
})

test('importing a existing directory without index file', () => {
  const orig = `import x from './src/test/fixtures/**';`

  expect(transform(orig)).toEqual(`const _dirImport = {};
import * as _fakeModuleD from "./src/test/fixtures/c/fakeModuleD";
import * as _fakeModuleB from "./src/test/fixtures/fake-module-b";
import * as _fakeModuleA from "./src/test/fixtures/fake.module.a";
_dirImport.fakeModuleA = _fakeModuleA
_dirImport.fakeModuleB = _fakeModuleB
_dirImport.fakeModuleD = _fakeModuleD
const x = _dirImport;`)
})

test('importing a existing directory without index file', () => {
  const orig = `import x from './src/test/fixtures/**/*';`

  expect(transform(orig)).toEqual(`const _dirImport = {};
import * as _fakeModuleD from "./src/test/fixtures/c/fakeModuleD";
import * as _fakeModuleB from "./src/test/fixtures/fake-module-b";
import * as _fakeModuleA from "./src/test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

for (let key in _fakeModuleD) {
  _dirImport[key === 'default' ? "fakeModuleD" : key] = _fakeModuleD[key];
}

const x = _dirImport;`)
})

test('importing a existing directory without index file', () => {
  const orig = `import { fakeModuleA } from './src/test/fixtures/*';`

  expect(transform(orig)).toEqual(`const _dirImport = {};
import * as _fakeModuleB from "./src/test/fixtures/fake-module-b";
import * as _fakeModuleA from "./src/test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

const fakeModuleA = _dirImport.fakeModuleA;`)
})

test('importing a existing directory without index file', () => {
  const orig = `import { fakeModuleA as methodA, someMethodThatReallyDontExists } from './src/test/fixtures/*';`

  expect(transform(orig)).toEqual(`const _dirImport = {};
import * as _fakeModuleB from "./src/test/fixtures/fake-module-b";
import * as _fakeModuleA from "./src/test/fixtures/fake.module.a";

for (let key in _fakeModuleA) {
  _dirImport[key === 'default' ? "fakeModuleA" : key] = _fakeModuleA[key];
}

for (let key in _fakeModuleB) {
  _dirImport[key === 'default' ? "fakeModuleB" : key] = _fakeModuleB[key];
}

const methodA = _dirImport.fakeModuleA;
const someMethodThatReallyDontExists = _dirImport.someMethodThatReallyDontExists;`)
})
