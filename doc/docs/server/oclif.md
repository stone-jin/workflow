---
order: 3
nav:
  title: 服务端
  order: 3
---

## oclif

oclif是一个用来编写CLI工具的一个框架。

官网地址：[官网地址](https://oclif.io/)

```bash
npx oclif multi mynewcli
cd mynewcli
```

使用方法:

```bash
$ ./bin/run hello
hello world from ./src/commands/hello.ts!
$ ./bin/run help
USAGE
  $ mynewcli [COMMAND]

COMMANDS
  hello  describe the command here
  help   display help for mynewcli
$ ./bin/run help hello
describe the command here

USAGE
  $ mynewcli hello [FILE]

OPTIONS
  -f, --force
  -n, --name=name  name to print

EXAMPLES
  $ mynewcli hello
  hello world from ./src/hello.ts!
```

测试方法:

```
$ npm link
$ mynewcli
USAGE
...
```