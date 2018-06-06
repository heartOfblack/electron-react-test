 const {clipboard,dialog}= require('electron').remote;
//  除了主进程，所有的页面都是渲染进程的内容，渲染进程内容不允许调用主进程的涉及GUI的API，所以需要通过remote作为中间件
// 可以当它是一个引用。dialog，menu等都是主进程的API


document.querySelector('#copy').addEventListener('click',function(){
clipboard.writeText('成功复制链接');

  dialog.showMessageBox({title:'复制提醒',message:'复制成功'})

})
