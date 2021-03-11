$(function(){

  var submitSwitch = true, submitDisabInfo = '';
  if(storeUid == id){
    submitDisabInfo = '当前店铺是您自己的店铺！';
    showMsg.alert('当前店铺是您自己的店铺！', 2000);
    submitSwitch = false;
  }else if(hnUid && hn_company == id){
    submitDisabInfo = '当前店铺是您所在的店铺！';
    showMsg.alert(submitDisabInfo, 2000);
    submitSwitch = false;
  }

  // 收入
  var mobileSelect_money = new MobileSelect({
    trigger: '#money_select',
    title: '收入',
    connector: '-',
    name: '',
    skin: 'skin_fix_option',
    wheels: [
        {data : money_data},
    ],
    keyMap: {
      id: 'id',
      value: 'typename',
    },
    transitionEnd:function(indexArr, data){
        
    },
    optionClick: function (theLi, index, sliderIndex) {
      $(theLi).addClass("active").siblings().removeClass("active");
    },
    callback:function(indexArr, data){
    }
  });

  // 选择性别
  $('.sex span').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  })

  $('.sendCode').click(function(){
    if(!submitSwitch){
      showMsg.alert(submitDisabInfo, 2000);
      return;
    }
    var t = $(this);
    if(t.hasClass("disabled")) return;
    sendVerCode();
  });
  //国际手机号获取
    getNationalPhone();
    function getNationalPhone(){
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li><span>'+list[i].name+'</span><em class="fn-right">+'+list[i].code+'</em></li>');
                   }
                   $('.layer_list ul').append(phoneList.join(''));
                }else{
                   $('.layer_list ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                    $('.layer_list ul').html('<div class="loading">加载失败！</div>');
                }

        })
    }
    // 打开手机号地区弹出层
    $(".areacode_span").click(function(){
        $('.layer_code').show();
        $('.mask-code').addClass('show');
    })
    // 选中区域
    $('.layer_list').delegate('li','click',function(){
        var t = $(this), txt = t.find('em').text();
        $(".areacode_span em").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

  $('.submit').click(function(){
    if(!submitSwitch){
      showMsg.alert(submitDisabInfo, 2000);
      return;
    }
    var t = $(this),
        realname = $('#realname').val(),
        sex = $('.sex .active').index() == 0 ? 1 : 0,
        areaCode = $('#areaCode').val(),
        mobile = $('#mobile').val(),
        code = $('#code').val(),
        money = $('#money').val(),
        city = $('#addr').val();
    if(t.hasClass('disabled')) return;

    if(realname == ''){
      showMsg.alert('请填写您的真实姓名', 1000);
      return false;
    }
    if(mobile == ''){
      showMsg.alert('请填写您的电话号码', 1000);
      return false;
    }
    if(!phoneCheck  && code == ''){
      showMsg.alert('请填写验证码', 1000);
      return false;
    }
    if(money == 0 || money == ''){
      showMsg.alert('请选择您的月薪范围', 1000);
      return false;
    }
    if(city == 0 || city == ''){
      showMsg.alert('请选择您的工作城市', 1000);
      return false;
    }

    t.addClass('disabled');
    showMsg.loading('正在提交，请稍后');

    var data = [];
    data.push('realname='+realname);
    data.push('mobile='+mobile);
    data.push('areaCode='+areaCode);
    data.push('code='+code);
    data.push('money='+money);
    data.push('city='+city);
    data.push('uto='+id);
    data.push('type=2');
    data = data.join("&");

    operaJson(masterDomain + '/include/ajax.php?service=dating&action=putApply', data, function(data){
      if(data && data.state == 100){
        showMsg.alert(data.info, 1000, function(){
          history.go(-1);
        })
      }else{
        t.removeClass('disabled');
        showMsg.alert(data.info, 1000);
      }
    })

  })

})

//倒计时（开始时间、结束时间、显示容器）
var countDown = function(time, obj, func){
  times = obj;
  obj.addClass("disabled").text(time+'s');
  mtimer = setInterval(function(){
    obj.text((--time)+'s');
    if(time <= 0) {
      clearInterval(mtimer);
      obj.removeClass('disabled').text(langData['siteConfig'][4][2]);
    }
  }, 1000);
}

function registerCheck(callback){
  var rtype = 3,
      account = $('#mobile').val(),
      areaCode = $("#areaCode").val(),
      data = '&areaCode=' + areaCode;
  if(account == ''){
    showMsg.alert('请填写您的电话号码', 1000);
    return false;
  }
  // else if(areaCode == "86"){
  //   var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;  
  //   if(!phoneReg.test(account)){
  //     showMsg.alert('电话号码不正确', 1000);
  //     return false;
  //   }
  // }

  $.ajax({
    url: '/include/ajax.php?service=member&action=registAccountCheck&rtype='+rtype+'&account='+account+data,
    type: 'get',
    dataType: 'json',
    success: function(data){
      if(data && data.state == 100){
        callback();
      }else{
        showMsg.alert(data.info, 1500, false);
      }
    },
    error: function(){
      showMsg.alert(langData['siteConfig'][20][173], 1500)
    }
  })
}

//发送验证码
function sendVerCode(){
  
  var btn = $('.sendCode'),
      areaCode = $('#areaCode').val(),
      phone = $("#mobile").val();
  if(btn.hasClass("disabled")) return;

  btn.addClass("disabled");

  $.ajax({
    url: masterDomain+"/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=verify",
    data: "areaCode="+areaCode+"&phone="+phone,
    type: "GET",
    dataType: "jsonp",
    success: function (data) {

      //获取成功
      if(data && data.state == 100){
        countDown(60, btn);
      //获取失败
      }else{
        btn.removeClass("disabled").text(langData['siteConfig'][4][1]);
        showMsg.alert(data.info, 1000);
      }
    },
    error: function(){
      btn.removeClass("disabled").text(langData['siteConfig'][4][1]);
      showMsg.alert(langData['siteConfig'][20][173], 1000);
    }
  });

}
