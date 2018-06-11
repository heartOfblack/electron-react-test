## electron学习路程 

### 注明* 里面的文件均为测试用，并没有每个功能单独创建一个文件来处理，所以只看README.md文件即可

- ### 文件功能

在主目录下,index.js为package.json中指定的main参数【主进程】，该文件中需要写相关app和browserWindow对象的事件监听和启动事件，并加载一个主页面。

所以最好再新建一个目录专门存放各个页面模块，至于index.html的业务逻辑可以放在根目录下


- ### 线程分类

electron的线程分为主线程和渲染进程，除了package.json中配置的main参数所指定的程序为主线程，其他页面等均为渲染进程。
在渲染进程中是无法调用主进程的GUI相关模块的，比如（dialog,menu等），为了使用这些模块，需要通过remote这个中间件来处理主进程和渲染进程之间的通信
**需要注意每个模块所属的进程**

>remote 模块为渲染进程（web页面）和主进程通信（IPC）提供了一种简单方法。

在Electron中, GUI 相关的模块 (如 dialog、menu 等) 仅在主进程中可用, 在渲染进程中不可用。 为了在渲染进程中使用它们, ipc 模块是向主进程发送进程间消息所必需的。 使用 remote 模块, 你可以调用 main 进程对象的方法, 而不必显式发送进程间消息, 类似于 Java 的 RMI 。
例如：从渲染进程创建浏览器窗口
```
const {BrowserWindow} = require('electron').remote
  let win = new BrowserWindow({width: 800, height: 600})
  win.loadURL('https://github.com')
Copy
Note: 相反 (从主进程访问渲染进程), 你可以使用 webContents. executeJavascript 。

```
- ### 应用分发打包

为了分发应用，我们需要借助一个工具将已经写好的应用程序打包- ### electron-packager
npm i -D electron-packager 
安装完成后，需要在package.json中配置相关的打包参数【直接执行命令也可以，只是每次都要写很长的命令会很不方便】,配置如下：

> "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "electron .",
    "packager": "electron-packager ./ siyuan --x64 --out ./siyuanApp --overwrite --icon=./favicon.ico"
  }

  将packager配置在scripts里面，里面相关的参数可以看
  [https://github.com/electron-userland/electron-packager](https://github.com/electron-userland/electron-packager)

简单参数：
  electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]


  个人项目目录:
  ```
  electron-react-test
               |--package.json
               |--index.js
               |--index.html
```
    所以打包的配置文件中是以当前目录打包 ./   ,打包的应用名(exe)为 siyuan ，输出目录为当前目录的siyuanApp文件夹 并重写了应用的icon

    最终打包后的目录为
```
      electron-react-test
               |--package.json
               |--index.js
               |--index.html
               |--siyuanApp
                    |--siyuan-win32-x64(因为配置中只打包x64所以有这个文件夹，至于它是否32.64都可用还是只能用于64位暂时没有去测试，在学习阶段中，打包成各平台的文件时间太长了)【exe文件就在这个目录下，我的为siyuan.exe】
                             |--locales
                             |--resources
                                    |--app文件夹【这个就是自己应用目录】
                                    |--electron asar
                             |--各种dll文件

```
- ### 应用程序打包

为了防止用户直接看到源码，需要将应用分发后生成的  app目录【上述electron-packager打包后生成的目录中，在resources文件夹下存放了一个名为app的文件夹，里面就是我们的源代码】

为了防止用户直接看到源码，我们需要把这个文件夹通过工具 asar 打包成一个 .asar文件，这个文件并不会影响electron对源代码的读取。生成完成后，删除app文件夹，只留下  .asar文件即可，该.asar文件名必须为app.asar

安装工具  npm i asar -g

打包命令：asar pack your-app app.asar    =》我的： asar pack app app.asar 
最终app文件夹打包成了 app.asar文件，把这个文件放在与app文件夹同一个目录，并删除app文件夹即可


- ### 制作安装包

下载 NSIS 将已经打包好的应用生成安装包即可，具体教程自行google


- ### remote、ipcMain、ipcRenderer模块之间的区别

ipcMain/ipcRenderer 都是属于IPC(主进程通信)功能，主要目的是让主进程和渲染进程进行通信。
remote模块则是为了让渲染进程能直接调用主进程的模块而不是为了通信。
所以ipc同样能做remote模块的事，反过来则不一定

**那么重点是，能用IPC和remote模块完成的事，应该怎样选择？**

主进程对于本地实用程序的处理效率更高，换句话说，凡是涉及到操作系统资源的操作，在主进程中处理更加有效。

比如dialog模块允许打开一个文件目录对话框，而这个操作就是对本地实用程序的调用，因此这种情况下我们调用IPC模块会比remote模块要好。同时它也不阻塞渲染进程对页面的处理。

- ### IPC模块之间的同步或异步通信

一般情况下我们都会选择 异步通信，如果需要同步通信，则调用ipc.sendSync方法。
同时，接收通信的进程返回方式为event.returnValue=xxx而不是通过 event.sender.send 

```javascript
//============异步=============
//渲染进程
const ipc = require('electron').ipcRenderer

const asyncMsgBtn = document.getElementById('async-msg')

asyncMsgBtn.addEventListener('click', function () {
  ipc.send('asynchronous-message', 'ping')
})

ipc.on('asynchronous-reply', function (event, arg) {
  const message = `异步消息回复: ${arg}`
  document.getElementById('async-reply').innerHTML = message
})
//主进程

const ipc = require('electron').ipcMain

ipc.on('asynchronous-message', function (event, arg) {
  event.sender.send('asynchronous-reply', 'pong')
})
```



```javascript
//================同步=============
//渲染进程
const ipc = require('electron').ipcRenderer

const syncMsgBtn = document.getElementById('sync-msg')

syncMsgBtn.addEventListener('click', function () {
  const reply = ipc.sendSync('synchronous-message', 'ping')
  const message = `同步消息回复: ${reply}`
  document.getElementById('sync-reply').innerHTML = message
})

//主进程

const ipc = require('electron').ipcMain

ipc.on('synchronous-message', function (event, arg) {
  event.returnValue = 'pong'
})
```

>关于主进程和渲染进程内容的区分，我个人认为index.js的之外都属于渲染进程的内容，包括所有的页面，所以除了index.js之外，所有的js文件中只能通过remote模块调用主进程内容或者通过IPC通信方式，让主进程去处理任务


- ### notification 关于操作系统级别的通知

目前，Notification模块只能在主进程中运行，如果要在渲染进程中通知，可以使用H5的原生API或者通过remote模块调用，不过该调用方式仍然在主进程处理，两种区别如下

```javascript
//H5 API
const notification = {
  title: '基本通知',
  body: '短消息部分'
}
  const myNotification = new window.Notification(notification.title, notification)

//Notification模块
//Notification.isSuported可以判断当前系统是否支持系统通知 
 Notification.isSupported()&&(function(){

new Notification({
title:'OS通知',
body:'您有N条未读消息'

}).show()

 })()

```


- ### remote模块
**重点：remote模块调用远程对象，是在主进程创建然后返回引用给渲染进程，而不是在渲染进程创建这个对象，所以从始至终，只能在主进程调用的模块一直都在主进程工作而不是渲染进程**

>远程对象（Remote Objects）
remote 模块返回的每个对象 (包括函数) 表示主进程中的一个对象 (我们称它为远程对象或远程函数)。 当调用远程对象的方法时, 调用远程函数, 或者使用远程构造函数 (函数) 创建新对象时, 实际上是在发送同步进程消息。

In the example above, both BrowserWindow and win were remote objects and new BrowserWindow didn't create a BrowserWindow object in the renderer process. 取而代之的是，它在主进程中创建了一个 BrowserWindow对象，并且在渲染进程中返回相应的远程对象，即` win </ 0>对象。

注意： 当远程对象被第一次引用时，只有可枚举的属性可以通过远程访问。

注意： 当通过 remote `模块访问时，数组和缓冲区在IPC上复制。 在渲染进程中修改它们不会在主进程中修改它们，反之亦然。 


- ### shell模块

>使用默认应用程序管理文件和 url。[渲染进程、主进程]
对于能够直接识别的文件，会用相应的桌面程序打开，相当于桌面操作，双击打开的默认行为

```javascript
shell.openExternal('http://www.baidu.com')
//默认程序打开文件
shell.openItem(path.join(__dirname,'/直播.png'))

//把文件放入回收站
 shell.moveItemToTrash(path.join(__dirname+'/test.html'))


```


