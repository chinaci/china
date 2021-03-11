$(function(){
  // 切换类型
  $(".member_type dl").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
  })
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

  $(".submit").click(function(){
    var t  = $(this),
        mobile = $.trim($('#mobile').val()),
        areaCode = $.trim($('#areaCode').val()),
        password = $.trim($('#password').val()),
        type = $('.member_type .active').index();

    if(t.hasClass('disabled')) return;  
    if(mobile == ''){
      showMsg.alert('请填写手机号码', 1000);
      return false;
    }
    if(password == ''){
      showMsg.alert('请填写登陆密码', 1000);
      return false;
    }
    if(password.length < 6){
      showMsg.alert('登陆密码最少6位', 1000);
      return false;
    }

    t.addClass('disabled');
    showMsg.loading('正在提交', 1000);

    var data = [];
    data.push('service=dating');
    data.push('action=addUser');
    data.push('type=1');
    data.push('mobile='+mobile);
    data.push('areaCode='+areaCode);
    data.push('password='+password);
    data.push('entrust='+$('.member_type .active').index());

    operaJson(masterDomain + '/include/ajax.php', data.join("&")  , function(data){
      if(data && data.state == 100){
        showMsg.alert(data.info, 1000, function(){
          location.reload();
        })
      }else{
        t.removeClass('disabled');
        showMsg.alert(data.info);
      }
    }, function(){
      t.removeClass('disabled');
      showMsg.alert('网络错误，请重试！');
    })

  })
})