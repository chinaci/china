$(function(){

  // 上传头像
  var upPhoto = new Upload({
    btn: '#item_0',
    bindBtn: '.uploader-btn span',
    title: 'Images',
    mod: modelType,
    params: 'type=atlas',
    atlasMax: 1,
    replace: true,
    deltype: 'delAtlas',
    fileQueued: function(file){
      
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        // 未上传
        $('#item_0 img').attr('src', response.turl);
        $('#litpic').removeClass('noimg').addClass('has');
        $('.uploader-btn span').text('重新上传');

        var oldImg = $('#photo').val();
        if(oldImg){
          this.del(oldImg);
        }
        $('#photo').val(response.url);
      }
    }
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
        $(".areacode_span label").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

  // 提交
  $('#tj').click(function(){
    var t = $(this),
        nickname = $.trim($('#nickname').val()),
        phone = $.trim($('#phone').val()),
        photo = $.trim($('#photo').val()),
        profile = $.trim($('#profile').val()),
        areaCode = $.trim($('#areaCode').val());

    if(t.hasClass('disabled')) return;
    if(nickname == ''){
      showMsg.alert('请填写姓名', 1000);
      return false;
    }
    if(phone == ''){
      showMsg.alert('请填写电话号码', 1000);
      return false;
    }
    if(profile == ''){
      showMsg.alert('请填写个人简介', 1000);
      return false;
    }
    if(photo == ''){
      showMsg.alert('请上传头像', 1000);
      return false;
    }

    t.addClass('disabled');
    showMsg.loading('正在提交，请稍后', 1000);
    var data = [];
    data.push('nickname='+nickname);
    data.push('phone='+phone);
    data.push('areaCode='+areaCode);
    data.push('profile='+profile);
    data.push('photo='+photo);
    operaJson(masterDomain + '/include/ajax.php?service=dating&action=joinHongNiang', data.join("&"), function(data){
      if(data && data.state == 100){
        showMsg.alert(data.info, 1000, function(){
          location.reload();
        })
      }else{
        t.removeClass('disabled');
        showMsg.alert(data.info, 100);
      }
    }, function(){
      t.removeClass('disabled');
      showMsg.alert('网络错误，请重试！', 1000);
    });

  })

})