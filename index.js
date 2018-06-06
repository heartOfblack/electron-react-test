const {app, BrowserWindow,globalShortcut,dialog,clipboard} = require('electron')
  
  function createWindow () {   
    // 创建浏览器窗口
    win = new BrowserWindow({width: 800, height: 600,id:10})

 

  	/*快捷键*/
  	globalShortcut.register('CommandOrControl+T',()=>{
  		
  		console.log('control+T');
  		
    })
    

  	// 窗口关闭前提示
   win.on('close', (e) => {
       e.preventDefault();
      dialog.showMessageBox({type:'question',title:'结束直播',message:'是否结束课程or暂时离开or取消',buttons:['结束','暂停','取消'],cancelId:2},
      (response)=>{
        // 点击X按钮默认是选择第一个按钮
          switch(response)
          {
            case 0:console.log('结束1');app.exit();break;
            case 1:console.log('暂停1');break;
            case 2:console.log('取消1');break;
          }
      })
     })
    
     app.on('browser-window-blur',(e)=>{
        e.preventDefault();
        // dialog.showMessageBox({title:'失去焦点',message:'失去焦点判断'})
        //关闭窗口的操作也会触发这个事件

     })


    //  app.on("gpu-process-crashed",(e,killed)=>{
    //  // e.preventDefault();
    //   dialog.showMessageBox({message:'进程被杀'})
    //  })

    // 然后加载应用的 index.html。
    win.loadFile('index.html');
    win.webContents.openDevTools()//调试工具
   
  }
  
  app.on('ready', createWindow);


