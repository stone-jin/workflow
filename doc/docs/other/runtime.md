---
order: 4
nav:
  title: 其他
  order: 7
---

## 基础底层库

### Just-js 

a very small v8 javascript runtime for linux only。

[Github地址](https://github.com/just-js/just)

创建一个应用
```
# initialise a new application in the hello directory
just init hello
cd hello
# build hello app
just build hello.js --clean --static
./hello
```

主要收藏是为了学习V8相关内容。

### chokidar

Minimal and efficient cross-platform file watching library

[Github地址](https://github.com/paulmillr/chokidar)

```javascript
const chokidar = require('chokidar');

// One-liner for current directory
chokidar.watch('.').on('all', (event, path) => {
  console.log(event, path);
});
```

### dockerode

用来连接Docker Remote API module.

[NPM地址](https://www.npmjs.com/package/dockerode)

```javascript
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var docker1 = new Docker(); //defaults to above if env variables are not used
var docker2 = new Docker({host: 'http://192.168.1.10', port: 3000});
var docker3 = new Docker({protocol:'http', host: '127.0.0.1', port: 3000});
var docker4 = new Docker({host: '127.0.0.1', port: 3000}); //defaults to http

//protocol http vs https is automatically detected
var docker5 = new Docker({
  host: '192.168.1.10',
  port: process.env.DOCKER_PORT || 2375,
  ca: fs.readFileSync('ca.pem'),
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
  version: 'v1.25' // required when Docker >= v1.13, https://docs.docker.com/engine/api/version-history/
});

var docker6 = new Docker({
  protocol: 'https', //you can enforce a protocol
  host: '192.168.1.10',
  port: process.env.DOCKER_PORT || 2375,
  ca: fs.readFileSync('ca.pem'),
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
});

//using a different promise library (default is the native one)
var docker7 = new Docker({
  Promise: require('bluebird')
  //...
});
//...
```