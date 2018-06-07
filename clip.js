// window.notification
// const notification = {
//   title: '基本通知',
//   body: '短消息部分'
// }
const $=require('jquery');
const {shell,process} =require('electron').remote;
const path=require('path');


const notificationButton = document.getElementById('basic-noti')

notificationButton.addEventListener('click', function () {
  // const myNotification = new window.Notification(notification.title, notification)

  // myNotification.onclick = () => {
  //   console.log('Notification clicked')
  // }

console.log(process.platform+'1111')

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


