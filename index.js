const {app,webContents,Notification, BrowserWindow,globalShortcut,dialog,clipboard,crashReporter,ipcMain} = require('electron')

  
  function createWindow () { 
    
    


    // 创建浏览器窗口
    win = new BrowserWindow({images:'favicon.ico' ,width: 800, height: 600})
//子窗口永远在父窗口之前
    //  let child = new BrowserWindow({parent: win,modal:true})
    //  child.loadURL('http://www.baidu.com')
    //  child.show()
 

  	/*快捷键*/
  	globalShortcut.register('CommandOrControl+T',()=>{  		
      console.log('control+T');
    })

// 通知
//  Notification.isSupported()&&(function(){

// new Notification({
// title:'OS通知',
// body:'您有N条未读消息'

// }).show()

//  })()

//new Notification({'title':'title',body:'message'}).show()


    

    ipcMain.on('showDialog',(e)=>{
      dialog.showMessageBox({title:'IPC通信弹窗',message:'IPC通信弹窗'})
    })








  	// 窗口关闭前提示
   win.on('close', (e) => {
       e.preventDefault();
      // dialog.showMessageBox({type:'question',title:'结束直播',message:'是否结束课程or暂时离开or取消',buttons:['结束','暂停','取消'],cancelId:2},
      // (response)=>{
      //   // 点击X按钮默认是选择第一个按钮
      //     switch(response)
      //     {
      //       case 0:console.log('结束1');app.exit();break;
      //       case 1:console.log('暂停1');break;
      //       case 2:console.log('取消1');break;
      //     }
      // })
    win=null;
    app.exit();

   


     })
  
// dialog.showSaveDialog({title:'保存对话框',defaultPath:'D:/path/',message:'保存对话框内容'})

    
    //  app.on('browser-window-blur',(e)=>{
    //     e.preventDefault();
    //     // dialog.showMessageBox({title:'失去焦点',message:'失去焦点判断'})
    //     //关闭窗口的操作也会触发这个事件

    //  })


    //  app.on("gpu-process-crashed",(e,killed)=>{
    //  // e.preventDefault();
    //   dialog.showMessageBox({message:'进程被杀'})
    //  })

    // 然后加载应用的 index.html。
      win.loadFile('index.html');


 
     

    win.webContents.openDevTools()//调试工具
   


    
  }

app.on('ready', createWindow);
//启动崩溃报告
app.setPath('temp', 'D:/temp/');//设置临时日志报告路径
// 以下可以部署日志服务
// crashReporter.start({
//   productName: 'siyuanApp',
//   companyName: '61PC-alive',
//   submitURL: 'xxx',
//   uploadToServer: true
// })





