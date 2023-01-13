---
order: 1
nav:
  title: 文章
  order: 8
---

### V8Parser的惰性解析&提前解析
V8生成字节码过程

然后在V8解析JS代码到AST到Scope，生成字节码过程中，并不会一次性解析，为了提高性能，主要基于两点：

1、如果一次解析和编译所有的Javascript代码，过多的代码会增加时间，会影响首次执行Javascript的速度，让用户感受到代码慢。

2、解析完成的字节码需要存放在内存中，如果一次性解析，那就要一直占用内存，浪费宝贵的内存资源。

基于以上的原因，所有主流的JavaScript虚拟机都实现了惰性解析。惰性解析表示解析器在解析的过程中，如果遇到函数声明，那么会跳过函数内部的代码，并不会为其生成AST和字节码，而仅仅生成顶层代码的AST和字节码。

### 举例：惰性解析的过程
以代码为例：

```javascript
function hello(){
   var a = 'hello';
   var b = 'world';
   return a + b;
}
```
相当于直接有个函数，内部先不解析。

看代码的时候要了解几个东西：

peek()去拿token
consume，当peek()后，其实还没消费掉，只有当调用这个后才进行移动位置。
然后我们继续介绍hello的解析过程：

ParseStatementList
ParseStatementListItem
Token::FUNCTION---->ParseHoistableDeclaration
ParseHoistableDeclaration
此处由于我们有hello，简称token不等于TOKEN::LPAREN，所以执行后面的流程
ParseIdentifier：存放在了name上面
ParseFunctionLiteral
然后到达函数 ParseFunctionLiteral 惰性解析的地方了：

代码中有这样的注释：

```c
// Determine if the function can be parsed lazily. Lazy parsing is
// different from lazy compilation; we need to parse more eagerly than we
// compile.

// We can only parse lazily if we also compile lazily. The heuristics for lazy
// compilation are:
// - It must not have been prohibited by the caller to Parse (some callers
//   need a full AST).
// - The outer scope must allow lazy compilation of inner functions.
// - The function mustn't be a function expression with an open parenthesis
//   before; we consider that a hint that the function will be called
//   immediately, and it would be a waste of time to make it lazily
//   compiled.
// These are all things we can know at this point, without looking at the
// function itself.

// We separate between lazy parsing top level functions and lazy parsing inner
// functions, because the latter needs to do more work. In particular, we need
// to track unresolved variables to distinguish between these cases:
// (function foo() {
//   bar = function() { return 1; }
//  })();
// and
// (function foo() {
//   var a = 1;
//   bar = function() { return a; }
//  })();

// Now foo will be parsed eagerly and compiled eagerly (optimization: assume
// parenthesis before the function means that it will be called
// immediately). bar can be parsed lazily, but we need to parse it in a mode
// that tracks unresolved variables.
```
谷歌翻译一下：
```c
/* 确定是否可以延迟解析函数。惰性解析是与惰性编译不同；我们对于惰性解析来说需要比惰性编译更如饥似渴。
 如果我们也懒惰地编译，我们只能懒惰地解析。惰性的启发式
 汇编:
 - 解析器不应该被禁止调用者去解析（一些调用者需要一个完整的 AST）
 - 外部作用域必须允许内部函数的延迟编译。
 - 函数不能是带开括号的函数表达式前;我们认为该函数将被调用的提示.如果采用惰性Parser就是浪费时间
    编译。
 这些都是我们在这一点上可以知道的事情，无需查看功能本身

 我们将延迟解析顶级函数和延迟解析内部函数分开功能，因为后者需要做更多的工作。特别是，我们需要
  跟踪未解析的变量以区分这些情况：
  (函数 foo() {
    bar = function() { 返回 1; }
   })();
  和
  (函数 foo() {
    变量 a = 1;
    bar = function() { 返回一个； }
   })();

  现在 foo 将被急切地解析并急切地编译（优化：假设函数前的括号表示将被调用立即地）。 
  bar 可以被惰性解析，但是我们需要以一种模式解析它跟踪未解析的变量。
*/
```

代码里面首先:

```c
const bool is_lazy =
      eager_compile_hint == FunctionLiteral::kShouldLazyCompile;
```
然后接着又来了一段注释：

```c
/*
 Determine whether we can still lazy parse the inner function.
 The preconditions are:
 - Lazy compilation has to be enabled.
 - Neither V8 natives nor native function declarations can be allowed,
   since parsing one would retroactively force the function to be
   eagerly compiled.
 - The invoker of this parser can't depend on the AST being eagerly
   built (either because the function is about to be compiled, or
   because the AST is going to be inspected for some reason).
 - Because of the above, we can't be attempting to parse a
   FunctionExpression; even without enclosing parentheses it might be
   immediately invoked.
 - The function literal shouldn't be hinted to eagerly compile.

 Inner functions will be parsed using a temporary Zone. After parsing, we
 will migrate unresolved variable into a Scope in the main Zone.
 */
```
谷歌翻译一下：

```
确定我们是否仍然可以延迟解析内部函数。
  前提条件是：
  - 必须启用延迟编译。
  - 不允许使用 V8 本地程序和本地函数声明，
    因为解析一个会追溯地强制函数是
    急切地编译。
  - 这个解析器的调用者不能依赖于急切的 AST
    构建（因为函数即将被编译，或者
    因为由于某种原因将检查 AST）。
  - 由于上述原因，我们不能尝试解析
    函数表达式；即使没有括号它也可能是
    立即调用。
  - 不应暗示函数文字急切地编译。

  内部函数将使用临时区域进行解析。解析后，我们
  会将未解析的变量迁移到主区域中的 Scope 中。
这边就做了一些判断最后得到一个变量是否需要preparse。
```

然后demo例子代码中：hello函数是：is_lazy_top_level_function：1

然后判断出来是惰性加载的方式。

然后又来了一大段英文注释：

```c
// Eager or lazy parse? If is_lazy_top_level_function, we'll parse
// lazily. We'll call SkipFunction, which may decide to
// abort lazy parsing if it suspects that wasn't a good idea. If so (in
// which case the parser is expected to have backtracked), or if we didn't
// try to lazy parse in the first place, we'll have to parse eagerly.
```
那我们此处就是parse lazily了。所以就调用SkipFunction。

如果是非parse lazily就会执行下面的代码：

```c
if (!did_preparse_successfully) {
    // If skipping aborted, it rewound the scanner until before the LPAREN.
    // Consume it in that case.
    if (should_preparse) Consume(Token::LPAREN);
    should_post_parallel_task = false;
    ParseFunction(&body, function_name, pos, kind, function_syntax_kind, scope,
                  &num_parameters, &function_length, &has_duplicate_parameters,
                  &expected_property_count, &suspend_count,
                  arguments_for_wrapped_function);
  }
```
比如Consume(Token::LPAREN);我们前面讲过就是要消费掉这个左括号了，所以惰性加载。

### 提前解析的例子
前面我们看注释中有讲到例子，那我们试验一下下面的代码：
```javascript
(function hello(){
   var a = 'hello';
   var b = 'world';
   return a + b;
})()
```
嗯，打印结果确实触发了提前解析，也就是触发了前面的ParseFunction的逻辑，验证成功。

### 测试乱写代码
```javascript
function hello(){
   xxx a = 'hello';
   var b = 'world';
   return a + b;
}
```
我们把a前面的var换成了xxx，然后执行后，发现其无法通过，并且触发了ParseFunction的逻辑，也就是提前去Parse了。

原因执行SkipFunction的时候，返回了需要继续去ParseFunction
```c
bool Parser::SkipFunction(const AstRawString* function_name, FunctionKind kind,
                          FunctionSyntaxKind function_syntax_kind,
                          DeclarationScope* function_scope, int* num_parameters,
                          int* function_length,
                          ProducedPreparseData** produced_preparse_data) {
   ...
   PreParser::PreParseResult result = reusable_preparser()->PreParseFunction(
      function_name, kind, function_syntax_kind, function_scope, use_counts_,
      produced_preparse_data);
   if(result == PreParser::kPreParseStackOverflow){...}
   else if(pending_error_handler()->has_error_unidentifiable_by_preparser()){...}
   ...
}
```
嗯，此处执行到pending_error_handler()->has_error_unidentifiable_by_preparser()了。导致SkipFunction返回false，导致无法跳过了。

然后也就导致ParseFunction解析报错：
```javascript
Uncaught SyntaxError: Unexpected identifier
```