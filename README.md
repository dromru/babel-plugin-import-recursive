# babel-import-recursive

A babel plugin that unrolls wildcard imports.

## Installation

```sh
$ npm install --save-dev babel-import-recursive
```
or with `yarn`
```sh
$ yarn add --dev babel-import-recursive
```

## Example

With the following folder structure:

```
|- index.js
|- actions
    |- action.a.js
    |- action_b.js
    |- sub_dir
        |- actionC.js
```

and with the following JS:

```javascript
import actions from './actions';
```

will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
_dirImport.actionA = _actionA;
_dirImport.actionB = _actionB;
const actions = _dirImport;
```

---

You can also import files recursively using double `asterisk` like this:
```javascript
import actions from './actions/**';
```
will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
import * as _actionC from "./actions/sub_dir/actionC";
_dirImport.actionA = _actionA;
_dirImport.actionB = _actionB;
_dirImport.actionC = _actionC;
const actions = _dirImport;
```

---

And import without specifiers

```javascript
import './actions/**';
```

will be compiled to:

```javascript
import "./actions/action.a";
import "./actions/action_b";
import "./actions/sub_dir/actionC";
```

---

You can also import all the methods directly, using a single `asterisk`.

the following JS:

```javascript
import actions from './actions/*';
```

will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
for (let key in _actionA) {
  _dirImport[key === 'default' ? 'actionA' : key] = _actionA[key];
}

for (let key in _actionB) {
  _dirImport[key === 'default' ? 'actionB' : key] = _actionB[key];
}
const actions = _dirImport;
```

---

And you can use both, double and single `asterisk`, like this:
```javascript
import actions from './actions/**/*';
```

will be compiled to:

```javascript
const _dirImport = {};
import * as _actionA from "./actions/action.a";
import * as _actionB from "./actions/action_b";
import * as _actionC from "./actions/sub_dir/actionC";
for (let key in _actionA) {
  _dirImport[key === 'default' ? 'actionA' : key] = _actionA[key];
}

for (let key in _actionB) {
  _dirImport[key === 'default' ? 'actionB' : key] = _actionB[key];
}

for (let key in _actionC) {
  _dirImport[key === 'default' ? 'actionC' : key] = _actionC[key];
}
const actions = _dirImport;
```

## Usage

Just add it to your **.babelrc** file

```json
{
  "plugins": ["import-recursive"]
}
```

### Options

### `exts`
By default, the files with the following extensions: `["js", "es6", "es", "jsx"]`, will be imported. You can change this using:

```json
{
    "plugins": [
        ["import-recursive", {
            "exts": ["js", "es6", "es", "jsx", "javascript"]
        }]
    ]
}
```

### `snakeCase`
By default, the variables name would be in camelCase. You can change this using:

```json
{
    "plugins": [
        ["import-recursive", {
            "snakeCase": true
        }]
    ]
}
```
** result: `action_a`, `action_b` and `action_c` **

### `nostrip`
By default, the file extension will be removed in the generated import statements, you can change this using:

```json
{
    "plugins": [
        ["import-recursive", {
            "nostrip": true
        }]
    ]
}
```

### `listTransform`
Callback to transform the resolved file list. You should use `.babelrc.js` or `babel.config.js` to define the function.
You can sort imported modules by depth, for example:

```javascript
module.exports = {
    plugins: [
        ['import-recursive', {
            listTransform: function (a, b) {
                return a.length - b.length;
            },
        }]
    ]
};
```

---

Forked from [babel-plugin-import-directory](https://github.com/Anmo/babel-plugin-import-directory) that was forked from [babel-plugin-wildcard](https://github.com/vihanb/babel-plugin-wildcard) 🦔
