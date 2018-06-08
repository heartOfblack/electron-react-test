// window.notification
// const notification = {
//   title: '基本通知',
//   body: '短消息部分'
// }
const $=require('jquery');
const {shell,process,Tray,Menu} =require('electron').remote;
const path=require('path');


const notificationButton = document.getElementById('basic-noti')
let tray=null;
notificationButton.addEventListener('click', function () {
  // const myNotification = new window.Notification(notification.title, notification)

  // myNotification.onclick = () => {
  //   console.log('Notification clicked')
  // }


  const Notification=require('electron').remote.Notification;

  Notification.isSupported()&&(function(){
  
    new Notification({
    title:'OS通知',
    body:'您有N条未读消息'
    }).show()
    
     })()
})

console.log(__dirname);
$('#openUrl').on('click',()=>{
console.log('open');
 //shell.openExternal('http://www.baidu.com')

 shell.openItem(path.join(__dirname,'/直播.png'))

})


$('#clear').on('click',()=>{

  shell.moveItemToTrash(path.join(__dirname+'/test.html'))

})

$('#tray').on('click',()=>{

  tray=new Tray(__dirname+'/favicon.ico')
  
  let menuItem=Menu.buildFromTemplate([
    {label:'heheh',role:'copy',sublabel:'lalal'},
    {label:'paste',role:'paste'},
    {label:'raio',type:'radio'}
  ])
tray.setToolTip('61PC直播');
  tray.setContextMenu(menuItem);
  
  
})

$('#destroyTray').on('click',()=>{

tray.destroy();

})





