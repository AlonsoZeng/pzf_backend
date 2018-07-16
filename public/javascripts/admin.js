var APP_ID = 'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz';
var APP_KEY = 'w8TTlyjgG30TCq5jpqWaQPg8';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

// 新建一个角色，并把为当前用户赋予该角色
function creatRole(canRead,canWrite,roleName){
  var roleAcl = new AV.ACL();
  var administratorRole = new AV.Role('administrator');
  roleAcl.setPublicReadAccess(canRead);
  roleAcl.setPublicWriteAccess(canWrite);
  roleAcl.setRoleWriteAccess(administratorRole, true);
  roleAcl.setRoleReadAccess(administratorRole, true);
  // 当前用户是该角色的创建者，因此具备对该角色的写权限
  roleAcl.setWriteAccess(AV.User.current(), true);

  //新建角色
  var Role = new AV.Role(roleName, roleAcl);
  Role.save().then(function(role) {
    // 创建成功
    console.log(role);
  }).catch(function(error) {
    console.log(error);
  });  
}

function returnBool (str) {
   if(str=="true"){
    return true;
   }else if (str=="false") {
     return false;
   }
}

$('#submitCreateRole').click(function() {
  var canRead = returnBool($('#canRead').val());
  var canWrite = returnBool($('#canWrite').val());
  var roleName = $('#roleName').val();

  if((canRead==true || canRead==false) && (canWrite==true||canWrite==false) && roleName!=""){
    creatRole(canRead,canWrite,roleName);
    alert("创建成功");
  }else{
    alert("没填全");
  }
});