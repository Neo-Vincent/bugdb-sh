// JavaScript Document
//支持Enter键登录
document.onkeydown = function (e) {
    if ($(".bac").length == 0) {
        if (!e) e = window.event;
        if ((e.keyCode || e.which) == 13) {
            var obtnLogin = document.getElementById("submit_btn")
            obtnLogin.focus();
        }
    }
};
function checkPassWd(email, passwd) {
    $('.msg_bg').html('');
    clearTimeout(msgdsq);
    $('body').append('<div class="sub_err" style="position:absolute;top:60px;left:0;width:500px;z-index:999999;"></div>');
    var htmltop='<div class="bac" style="padding:8px 0px;border:1px solid #090;width:100%;margin:0 auto;background-color:#FFF2F8;color:#090;border:3px #090 solid;;text-align:center;font-size:16px;">';
    var htmlfoot='</div>';
    $('.msg_bg').height($(document).height());
    var left=($(document).width()-500)/2;
    $('.sub_err').css({'left':left+'px'});
    $('.sub_err').html(htmltop+"Login ..."+htmlfoot);
    var scroll_height=$(document).scrollTop();
    $('.sub_err').animate({'top': scroll_height+120},500);
    $.ajax(
        {
            type: "GET",
            url: "http://10.191.8.25:7101/userinfo/userLogin?email="+email+"&passwd="+passwd,
            success: function (jsonResponse) {
                if(jsonResponse=="true"){
                    show_msg('Login ing ....', './index.html');
                }
                else{
                    show_err_msg('Email or Password Error');
                    $('#password').focus()
                }

            },
            error: function(jsonResponse){
                show_err_msg('Connection Error');
                $('#password').focus()
            }

        })
}

$(function () {
    //提交表单
    $('#submit_btn').click(function () {
        show_loading();
        var myReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //邮件正则
        if ($('#email').val() == '') {
            show_err_msg('Email Error');
            $('#email').focus();
        } else if (!myReg.test($('#email').val())) {
            show_err_msg('Email Format Error');
            $('#email').focus();
        } else if ($('#password').val() == '') {
            show_err_msg('Password Error');
            $('#password').focus();
        } else {
            checkPassWd($('#email').val(),$('#password').val());
            //ajax提交表单，#login_form为表单的ID。 如：$('#login_form').ajaxSubmit(function(data) { ... });
            //
        }
    });
});