// JavaScript Document
//支持Enter键登录
		document.onkeydown = function(e){
			if($(".bac").length==0)
			{
				if(!e) e = window.event;
				if((e.keyCode || e.which) == 13){
					var obtnLogin=document.getElementById("submit_btn")
					obtnLogin.focus();
				}
			}
		}

    	$(function(){
			//提交表单
			$('#submit_btn').click(function(){
				show_loading();
				var myReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //邮件正则
				if($('#email').val() == ''){
					show_err_msg('Email Error');
					$('#email').focus();
				}else if(!myReg.test($('#email').val())){
					show_err_msg('Email Format Error');
					$('#email').focus();
				}else if($('#password').val() == ''){
					show_err_msg('Password Error');
					$('#password').focus();
				}else{
					//ajax提交表单，#login_form为表单的ID。 如：$('#login_form').ajaxSubmit(function(data) { ... });
					show_msg('Login ing ....','./index.html');
				}
			});
		});