## 学习eletrons

- 文件功能

在主目录下,index.js为package.json中指定的main参数【主进程】，该文件中需要写相关app和browserWindow对象的事件监听和启动事件，并加载一个主页面。

所以最好再新建一个目录专门存放各个页面模块，至于index.html的业务逻辑可以放在根目录下


- 线程分类

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
- 应用分发打包

为了分发应用，我们需要借助一个工具将已经写好的应用程序打包- electron-packager
npm i -D electron-packager 
安装完成后，需要在package.json中配置相关的打包参数【直接执行命令也可以，只是每次都要写很长的命令会很不方便】,配置如下：

> "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "electron .",
    "packager": "electron-packager ./ siyuan --x64 --out ./siyuanApp --overwrite --icon=./favicon.ico"
  }

  将packager配置在scripts里面，里面相关的参数可以看
  ![https://github.com/electron-userland/electron-packager]

简单参数：
  electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]


  个人项目目录:
  electron-react-test
               |--package.json
               |--index.js
               |--index.html

    所以打包的配置文件中是以当前目录打包 ./   ,打包的应用名(exe)为 siyuan ，输出目录为当前目录的siyuanApp文件夹 并重写了应用的icon

    最终打包后的目录为

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


- 应用程序打包

为了防止用户直接看到源码，需要将应用分发后生成的  app目录【上述electron-packager打包后生成的目录中，在resources文件夹下存放了一个名为app的文件夹，里面就是我们的源代码】

为了防止用户直接看到源码，我们需要把这个文件夹通过工具 asar 打包成一个 .asar文件，这个文件并不会影响electron对源代码的读取。生成完成后，删除app文件夹，只留下  .asar文件即可，该.asar文件名必须为app.asar

安装工具  npm i asar -g

打包命令：asar pack your-app app.asar    =》我的： asar pack app app.asar 
最终app文件夹打包成了 app.asar文件，把这个文件放在与app文件夹同一个目录，并删除app文件夹即可


- 制作安装包

下载 NSIS 将已经打包好的应用生成安装包即可，具体教程自行google


- remote、ipcMain、ipcRenderer模块之间的区别

ipcMain/ipcRenderer 都是属于IPC(主进程通信)功能，主要目的是让主进程和渲染进程进行通信。
remote模块则是为了让渲染进程能直接调用主进程的模块而不是为了通信。
所以ipc同样能做remote模块的事，反过来则不一定