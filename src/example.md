---
title: How to use PouchDB on React Native >= 0.73
---

Hi, it's [Takuya](https://x.com/inkdrop_app) here.

I've been updating the mobile version of [Inkdrop](https://www.inkdrop.app/), which is built with React Native.
It is a simple Markdown note-taking app, which supports syncing notes with the server and offer an offline-first viewing and editing experience.
To accomplish this, I've been using [PouchDB](https://pouchdb.com/), the JavaScript-based database that can sync with [Apache CouchDB](https://couchdb.apache.org/).

The PouchDB community was struggling to get it to work on React Native smoothly since it doesn't provide NodeJS-compatible APIs like encoding/decoding base64 or the `crypto` module out of the box.
In 2022, I shared [how to use PouchDB on React Native in this blog post](https://dev.to/craftzdog/a-performant-way-to-use-pouchdb7-on-react-native-in-2022-24ej).
The technique was adequately performant by using a JSI-based SQLite driver, and polyfilling the missing modules with the native implementations respectively.

Since then, the circumstances around the React Native ecosystem has been sifnificantly changed.
This article is an updated version of how to use PouchDB on the latest React Native.

## Mature JSI-based libraries and the NULL char problem solved

There are now JSI-based libraries that are better designed and more performant, for example:

- [op-sqlite](https://github.com/OP-Engineering/op-sqlite): Fastest SQLite library for react-native by [@ospfranco](https://github.com/ospfranco)
  - It is approximately 8~9x faster than [react-native-quick-sqlite](https://github.com/margelo/react-native-quick-sqlite), especially on Android.
- [react-native-quick-crypto](https://github.com/margelo/react-native-quick-crypto): ⚡️ A fast implementation of Node's `crypto` module written in C/C++ JSI
  - It internally uses my `@craftzdog/react-native-buffer` module, which improves encoding/decoding base64 performance.

React Native also introduced the new architecture: TurboModules and Fabric, which themselves leverage JSI to improve the communication performance between the native and JS layers.
It appears that a recent RN update, though I'm not use which commit, has solved [the `\u0000` string termination](https://github.com/facebook/react-native/issues/12731)! It means that you no longer need [a hack escaping `\u0000` chars](https://github.com/craftzdog/pouchdb-react-native/commit/228f68220fe31236f6630b71c030eef29ae6e7a8). Yay!

With these new libraries and fundamental improvements, you can use PouchDB much more smoothly and straightforwardly.

## Introducing pouchdb-adapter-react-native-sqlite@4

Previsouly, I made [pouchdb-adapter-react-native-sqlite](https://github.com/craftzdog/pouchdb-adapter-react-native-sqlite) to let PouchDB use SQLite on React Native.
I'm excited to announce v4, which now uses [op-sqlite](https://github.com/OP-Engineering/op-sqlite).
This time, I managed to make it directly call SQLite APIs and to get rid of the websql layer.

Thanks to the NULL termination issue gone, attachment support is back available now.

You can try an example project for a quick hands-on experience.

https://github.com/craftzdog/pouchdb-adapter-react-native-sqlite/tree/master/example

## How to use

Setting up the adapter is pretty easy in v4.

### Install libraries

```sh
yarn add @op-engineering/op-sqlite react-native-quick-crypto @craftzdog/react-native-buffer
npx pod-install
```

### Polyfill NodeJS APIs

Create a `shim.ts` file like so:

```ts
import { install } from 'react-native-quick-crypto'

install()
```

Configure babel to use the shim modules. First, you need to install `babel-plugin-module-resolver`.

```sh
yarn add --dev babel-plugin-module-resolver
```

Then, in your `babel.config.js`, add the plugin to swap the `crypto`, `stream` and `buffer` dependencies:

```js
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            crypto: 'react-native-quick-crypto',
            stream: 'readable-stream',
            buffer: '@craftzdog/react-native-buffer',
          },
        },
      ],
    ],
```

Then restart your bundler using `yarn start --reset-cache`.

### Install PouchDB and adapter

Now it's ready to use PouchDB!

```sh
yarn add pouchdb-core pouchdb-mapreduce pouchdb-replication pouchdb-adapter-http pouchdb-adapter-react-native-sqlite
```

Create `pouchdb.ts`:

```ts
import HttpPouch from 'pouchdb-adapter-http'
import sqliteAdapter from 'pouchdb-adapter-react-native-sqlite'
import PouchDB from 'pouchdb-core'
import mapreduce from 'pouchdb-mapreduce'
import replication from 'pouchdb-replication'

export default PouchDB.plugin(HttpPouch)
  .plugin(replication)
  .plugin(mapreduce)
  .plugin(sqliteAdapter)
```

### How to use PouchDB

```ts
import PouchDB from './pouchdb'

const pouch = new PouchDB('mydb', {
  adapter: 'react-native-sqlite'
})
```

That's it!
Hope you find it useful and helpful.

## Troubleshootings

### Fails to install crypto shim with `install()` on launch

You amy get the following error when new arch is enabled:

```
 (NOBRIDGE) ERROR  Error: Failed to install react-native-quick-crypto: React Native is not running on-device. QuickCrypto can only be used when synchronous method invocations (JSI) are possible. If you are using a remote debugger (e.g. Chrome), switch to an on-device debugger (e.g. Flipper) instead.
 (NOBRIDGE) ERROR  TypeError: Cannot read property 'install' of undefined
```

- This is a know issue: [Error: Failed to install react-native-quick-crypto: React Native is not running on-device. · Issue #333 · margelo/react-native-quick-crypto · GitHub](https://github.com/margelo/react-native-quick-crypto/issues/333)

For now, you have to edit:

- `lib/module/NativeQuickCrypto/NativeQuickCrypto.js`

And comment them out:

```
  // Check if we are running on-device (JSI)
  // if (global.nativeCallSyncHook == null || QuickCryptoModule.install == null) {
  //   throw new Error('Failed to install react-native-quick-crypto: React Native is not running on-device. QuickCrypto can only be used when synchronous method invocations (JSI) are possible. If you are using a remote debugger (e.g. Chrome), switch to an on-device debugger (e.g. Flipper) instead.');
  // }
```
