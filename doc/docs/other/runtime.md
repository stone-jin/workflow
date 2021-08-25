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