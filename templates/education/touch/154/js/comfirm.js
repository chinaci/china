$(function(){
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
        console.log(txt)
        $(".areacode_span em").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code, #popupReg-captcha-mobile').hide();
        $('.mask-code').removeClass('show');
    })

    //提交
    $('#right_btn').click(function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
            return false;
        }

        var t = $(this);
        var people  = $('#people').val();
        var contact = $('#contact').val();

        var tel_d = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        var id_d = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if(people==''){
            alert(langData['travel'][8][63]);  //请输入联系人
            return 0;
        }else if(contact==''){
            alert(langData['travel'][7][60]);//请输入手机号
            return 0;
        }
        // else if(!contact.match(tel_d)){
        //     alert(langData['travel'][7][61]);   //请输入正确的手机号
        //     return 0;
        // }

        var data = [];
        data.push('proid=' + pageData.id);
        data.push('procount=1');
        data.push('people=' + $("#people").val());
        data.push('contact=' + $("#contact").val());
        data.push('areaCode=' + $("#areaCode").val());

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=education&action=deal',
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    if(device.indexOf('huoniao_Android') > -1) {
                        setupWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('pageClose', {}, function (responseData) {
                            });
                        });
                        location.href = data.info;
                    }else{
                        location.href = data.info + (data.info.indexOf('?') > -1 ? '&' : '?') + 'currentPageOpen=1';
                    }
                }else{
                    alert(data.info);
                }
            },
            error: function(){
                alert(langData['siteConfig'][20][183]);
                t.removeClass("disabled").html(langData['shop'][1][8]);
            }
        });

    });
});
