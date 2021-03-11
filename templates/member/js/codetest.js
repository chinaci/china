$('#contact').bind('change',function(){
  checkContact();
});
function checkContact(){
  $('.test_code').hide();
  var v = $('#contact').val();
  if(v != ''){
    //修改
    if(id){
      if(v != detail.contact && ((userinfo.phoneCheck && v != userinfo.phone) || !userinfo.phoneCheck) ){
        $('.test_code').show();
      }
    //新增
    }else{
      if(userinfo.phone == '' || !userinfo.phoneCheck || v != userinfo.phone){
        $('.test_code .tip').hide();
        $('.test_code').show();
      }
    }
  }
}
checkContact();

var dataGeetest = "";
  var ftype = "phone";
    
    //发送验证码
 function sendPhoneVerCode(){
    var btn = $('.test_btn button');
    if(btn.filter(":visible").hasClass("disabled")) return;

    var vericode = $("#vdimgck").val();  //图形验证码
    if(vericode == '' && !geetest){
      alert(langData['siteConfig'][20][170]);
      return false;
    }

    var number = $('#contact').val();
    if (number == '') {
      alert(langData['siteConfig'][20][27]);
      return false;
    }

   if(isNaN(number)){
      alert(langData['siteConfig'][20][179]);
      return false;
    }else{
      ftype = "phone";
    }

    btn.addClass("disabled");

    if(ftype == "phone"){

      var action = "getPhoneVerify";
      var dataName = "phone";
      $.ajax({
        url: masterDomain+"/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=verify",
        data: "vericode="+vericode+"&areaCode=86&phone="+number+dataGeetest,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          //获取成功
          if(data && data.state == 100){
           alert(langData['siteConfig'][38][101]);//验证码已发送
           countDown(60, $('.getCodes'));

          //获取失败
          }else{
            btn.removeClass("disabled");
            alert(data.info);
          }
        },
        error: function(){
          btn.removeClass("disabled");
          alert(langData['siteConfig'][20][173]);
        }
      });
    }
  }

//倒计时
function countDown(time, obj){
     obj.html(langData['siteConfig'][44][1].replace('1',time)).addClass('disabled');//1秒后重发
    mtimer = setInterval(function(){
        obj.html(langData['siteConfig'][44][1].replace('1',(--time))).addClass('disabled');////1秒后重发
        if(time <= 0) {
            clearInterval(mtimer);
            obj.html(langData['siteConfig'][6][55]).removeClass('disabled');//重新发送
        }
    }, 1000);
}

  if(!geetest){
    $('.test_btn button').click(function(){
      if(!$(this).hasClass("disabled")){
        sendPhoneVerCode();
      }
    });
  }else{
    //极验验证
    var handlerPopupFpwd = function (captchaObjFpwd) {
      // captchaObjFpwd.appendTo("#popupFpwd-captcha-mobile");

      // 成功的回调
      captchaObjFpwd.onSuccess(function () {

        var validate = captchaObjFpwd.getValidate();
        dataGeetest = "&terminal=mobile&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;

        //邮箱找回
        if(ftype == "phone"){
      //获取短信验证码
          var number   = $('#contact').val();
          if (number == '') {
            alert(langData['siteConfig'][20][27]);
            return false;
          } else {
            sendPhoneVerCode();
          }

        }
      });

      window.captchaObjFpwd = captchaObjFpwd;
    };

   
    //获取验证码
    $('.test_btn button').click(function(){
      if($(this).hasClass("disabled")) return;
      var number   = $('#contact').val();
      if (number == '') {
        alert(langData['siteConfig'][20][27]);
        return false;
      } else {
        if(isNaN(number)){
          alert(langData['siteConfig'][20][179]);
          return false;
        }else{
          ftype = "phone";
        }
    
        if (captchaObjFpwd) {
            captchaObjFpwd.verify();
        }
      
      }
    });


   

    $.ajax({
        url: "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
        type: "get",
        dataType: "json",
        success: function (data) {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: "bind",
                width: '312px'
            }, handlerPopupFpwd);
        }
    });
  }