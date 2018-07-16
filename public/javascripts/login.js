
$(document).ready(function(){

	var login = $('#loginform');
	var recover = $('#recoverform');
    var signup = $('#signupform');
	var speed = 400;

	$('#to-recover').click(function(){
		$("#loginform").hide();
        $("#signupform").hide();
        $("#recoverform").fadeIn();        
	});

    $('#to-signup').click(function(){
        $("#loginform").hide();
        $("#recoverform").hide();
        $("#signupform").fadeIn();
    });

	$('.to-login').click(function(){
		$("#recoverform").hide();
        $("#signupform").hide();
		$("#loginform").fadeIn();
	});
    
    if($.browser.msie == true && $.browser.version.slice(0,3) < 10) {
        $('input[placeholder]').each(function(){ 
       
        var input = $(this);       
       
        $(input).val(input.attr('placeholder'));
               
        $(input).focus(function(){
             if (input.val() == input.attr('placeholder')) {
                 input.val('');
             }
        });
       
        $(input).blur(function(){
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.val(input.attr('placeholder'));
            }
        });
    });
        
    }

// leancloud初始化
var APP_ID = 'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz';
var APP_KEY = 'w8TTlyjgG30TCq5jpqWaQPg8';
    AV.init({
      appId: APP_ID,
      appKey: APP_KEY
    });

// 点击注册按钮时，触发注册流程：

    $("#signup-btn").click(function(){
        // 创建用户模型
            var user = new AV.User();
        // 获取注册资料
            var signupEmail= $('#signup-email').val();
            var signupPass = $('#signup-pass').val();
            var signupRePass = $('#signup-repass').val();            
        // 若密码验证相等，长度不小于6字符，且不为空
        if (signupPass == signupRePass && signupPass!="" && signupPass.length>=6) {
            // 则创建用户

            user.set("username", signupEmail);
            user.set("password", signupPass);
            user.set("email", signupEmail);

            // other fields can be set just like with AV.Object
            user.set("phone", "");

            user.signUp(null, {
              success: function(user) {
                // 注册成功，可以使用了.
                alert("signup!");
              },
              error: function(user, error) {
                // 失败了
                alert("Error: " + error.code + " " + error.message);
              }
            });       
        };        
    });

// 点击登陆按钮时，触发登陆流程;
    $("#login-btn").click(function(){

        var loginEmail= $('#login-email').val();
        var loginPass = $('#login-pass').val();

        AV.User.logIn(loginEmail, loginPass, {
            success: function(user) {
            // 成功了，将user缓存：
                var currentUser = AV.User.current();
                location.href = "/";
            },
            error: function(user, error) {
            // 失败了.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });

// 重置密码
    $("#recover-btn").click(function(){

        var recoverEmail = $('#recover-email').val();

        if (recoverEmail != "") {
            AV.User.requestPasswordReset(recoverEmail, {
                success: function() {
                // Password reset request was sent successfully
                    alert("已将发送重置密码的邮件到："+recoverEmail+"，请查收！");
                },
                error: function(error) {
                // Show the error message somewhere
                    alert("Error: " + error.code + " " + error.message);
                }
            });            
        };
    });

});