 const electron= require('electron')
 const  {clipboard,dialog}=electron.remote
const $=require('jquery')
const path=require('path')
const ipcRenderer=electron.ipcRenderer
//  除了主进程，所有的页面都是渲染进程的内容，渲染进程内容不允许调用主进程的涉及GUI的API，所以需要通过remote作为中间件
// 可以当它是一个引用。dialog，menu等都是主进程的API


document.querySelector('#copy').addEventListener('click',function(){
clipboard.writeText('成功复制链接');

 // dialog.showMessageBox({title:'复制提醒',message:'复制成功'})

ipcRenderer.send('showDialog')


})


$('#save').on('click',()=>{
 // dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
// dialog.showSaveDialog({title:'保存对话框',defaultPath:'D:/path/',message:'保存对话框内容'})
  
// const modalPath = path.join('file://', __dirname, '../../sections/windows/modal.html')
// console.log(modalPath);
const notification = {
  title: '基本通知',
  body: '短消息部分'
}
  const myNotification = new window.Notification(notification.title, notification)

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }

})


