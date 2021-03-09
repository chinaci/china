$(function () {

    var atpage = 1,
        pageSize = 20,
        totalCount = 0,
        container = $('.high-box');
    var activeUid = 0,
        activeNickname = '';
    var timer = null;

    // 判断浏览器是否是ie8
    if ($.browser.msie && parseInt($.browser.version) >= 8) {
        $('.app-con .down .con-box:last-child').css('margin-right', '0');
        $('.wx-con .c-box:last-child').css('margin-right', '0');
        $('.footer .foot-bottom .wechat .wechat-pub:last-child').css('margin-right', '0');
        $('.high-member .high-box .high-list:nth-child(3n)').css('margin-right', '0');
        $('.buy-strings-popup .month ul li:nth-child(3n)').css('margin-right', '0');
        $('.high-member .high-box .high-list:nth-child(3n)').css('margin-right', '0');
    }

    $('.use-money .select-btn').click(function () {
        $(this).toggleClass('active');
        calculationAmount();
    })
    //购买红娘牵线
    $('.buy-strings-popup .month ul li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        calculationAmount();
    })
    //牵线弹窗（未购买）
    $('.high-list .high-info .strings').click(function () {
        $('.desk').show();
        $('.buy-strings-popup').fadeIn(600);
    })
    $('#close').click(function () {
        $('.desk').hide();
        $('.buy-strings-popup').fadeOut(600);
    })
    // 切换支付方式
    $('#payType a').click(function () {
        var t = $(this),
            type = t.data('type');
        t.addClass('active').siblings().removeClass('active');
        $('#paytype').val(type);
    })

    // 牵线弹窗
    container.delegate('.lead', 'click', function () {

        if(hnid == hnUid){
            $.dialog.alert('该会员是您的下属会员');
            return;
        }
        clearTimeout(timer);
        var t = $(this),
            p = t.closest('.high-list'),
            uid = p.attr('data-uid'),
            name = p.attr('data-nickname'),
            company = p.attr('data-company');
        if (t.hasClass('active')) return;
        activeUid = uid;
        activeNickname = name;
        if (leadCount) {
            if (company != "0") {
                $('.pull-strings-popup .sure span').text(activeNickname);
                $('.pull-strings-popup, .desk').show();

                // $.ajax({
                //     url: masterDomain + '/include/ajax.php?service=dating&action=hnInfo',
                //     type: 'get',
                //     data: 'id='+company,
                //     dataType: 'jsonp',
                //     success: function(data){
                //         if (data && data.state == 100) {
                //             var info = data.info;
                //             if (info.phototurl) {
                //             }
                //         } else {
                //             alert('获取红娘信息错误', 1000);
                //         }
                //     }
                // })
            } else {
                // leadSure();
                $.dialog.alert('用户信息错误');
            }
        } else {
            $('.desk').show();
            $('.buy-strings-popup').fadeIn(600);
            calculationAmount();
        }

    })

    $('.pull-strings-popup .yes').click(function(){
        if($(this).hasClass('active')) return;
        
        $('#close').click();

        $.ajax({
            url: masterDomain+'/include/ajax.php?service=dating&action=putLead&id='+activeUid,
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    leadCount--;
                    $('.high-list[data-uid='+activeUid+'] .lead').addClass('active').text('已牵线');
                    $.dialog({
                        title: '信息',
                        icon: 'success.png',
                        content: data.info,
                        close: false,
                        ok: function(){
                        },
                        cancel: function(){
                        }
                    });
                }else{
                    $.dialog.alert(data.info);
                }
            },
            error: function(){

            }

        })
    })

    // 购买牵线
    $('.buy-now').click(function () {
        var paytype = $('.morepaytype .active').data('type');
        $('#paytype').val(paytype);
        $('#id').val($('.month li.active').index());
        var data = $('#payform').serialize(),
            action = $('#payform').attr('action');

        $.ajax({
            type: 'POST',
            url: action,
            data: data,
            dataType: 'jsonp',
            success: function (str) {
                console.log(str)
                if (str.state == 100) {
                    $('#action').val('pay');
                    $('#ordernum').val(str.info);
                    $('#payform').submit();
                }
            },
            error: function () {

            }
        })
    })

    $('#close, .pull-strings-popup .no').click(function () {
        $('.desk').hide();
        $('.pull-strings-popup').fadeOut(600);
    })

    // 购买牵线红娘导航条
    $(".buy-strings-popup .buy-strings-title ul li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var i = $(this).index();
        $(this).closest('.buy-strings-popup').find('.buy-box').eq(i).addClass("show").siblings().removeClass("show");
    });



    //关闭购买红娘牵线弹窗
    $('#buy-strings').click(function () {
        $('.buy-strings-popup').hide();
        $('.desk').hide();
        $('.error p').text('').hide();
    })

    // 红娘简介导航条
    $(".maker-brief .brief-title ul li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var i = $(this).index();
        $(this).closest('.maker-brief').find('.brief-text').eq(i).addClass("show").siblings().removeClass("show");
    });

    // 牵线弹窗-联系方式表单验证
    var hasLoadGt = false;
    var getYzmBtn = null;
    var getYzmType = '';

    // 监听手机号
    $('#phone-num').on("input propertychange", function(){
        var t = $(this), val = t.val(),old = t.data("phone");
        if(val != old){

            $('.sendvdimgck, .yzmObj').show();
        }else{
            $('.sendvdimgck, .yzmObj').hide();
        }
        
    })
    //国际手机号获取
    getNationalPhone();
    function getNationalPhone(){
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'JSONP',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li data-cn="'+list[i].name+'" data-code="'+list[i].code+'">'+list[i].name+' +'+list[i].code+'</li>');
                   }
                   $('.areaCode_wrap ul').append(phoneList.join(''));
                }else{
                   $('.areaCode_wrap ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                        $('.areaCode_wrap ul').html('<div class="loading">加载失败！</div>');
                    }

        })
    }
    //显示区号
    $('.areaCode').bind('click', function(){
        var areaWrap =$(this).closest("dd").find('.areaCode_wrap');
        if(areaWrap.is(':visible')){
            areaWrap.fadeOut(300)
        }else{
            areaWrap.fadeIn(300);
            return false;
        }
    });

    //选择区号
    $('.areaCode_wrap').delegate('li', 'click', function(){
        var t = $(this), code = t.attr('data-code');
        var par = t.closest("dd");
        var areaIcode = par.find(".areaCode");
        areaIcode.find('i').html('+' + code);
        $('#areaCode').val(code);
    });

    $('body').bind('click', function(){
        $('.areaCode_wrap').fadeOut(300);
    });

    // 提交联系方式
    $("#leave-tel").submit(function (e) {
        e.preventDefault();
        var f = $(this),
            phone = f.find("#phone-num"),
            vcode = f.find("#number"),
            nickname = f.find('.nickname'),
            code = $('#number');
            t = $('#sub-apply'),
            r = true;

        $('.error p').text('').hide();
        if (nickname.val() == "") {
            r = false;
            nickname.focus();
            $('.error p').text('请输入您的姓名').show();
        } else if (phone.val() == "") {
            r = false;
            phone.focus();
            $('.error p').text('请输入您的电话号码').show();
        } else {
            if(!userinfo.phoneCheck){
                if(code.val() == ''){
                    r = false;
                    code.focus();
                    $('.error p').text('请输入验证码').show();
                }
            }
        }

        if (!r) return;

        t.attr('disabled', true).val('正在提交...');

        var data = [];
        data.push('realname='+nickname.val());
        data.push('mobile='+phone.val());
        data.push('areaCode='+$('#areaCode').val());
        data.push('code='+code.val());
        // data.push('money='+);
        // data.push('city='+city);areaCode
        data.push('uto='+hnid);
        data.push('ufor='+activeUid);
        data.push('type=1');
        data = data.join("&");

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=dating&action=putApply',
            type: 'get',
            data: data,
            dataType: 'jsonp',
            success: function(data){
                $('.error p').text(data.info).show();
                if(data && data.state == 100){
                    setTimeout(function(){
                        $('#buy-strings').click();
                    }, 1000)
                }
                t.attr('disabled', false).val('提交申请');
            },
            error: function(){
                $('.error p').text('网络错误，请重试').show();
                t.attr('disabled', false).val('提交申请');
            }
        })

    })
    // $(document).on('click', '.sendvdimgck', function () {
    //     var a = $(this);
    //     getYzmBtn = a;
    //     if (!returnCheckPhone(a)) return;
    //     returnDJS(getYzmBtn, 60);
    // });

    var sendSmsData = [];

  if(geetest){
    //极验验证
    var handlerPopupFpwd = function (captchaObjFpwd){
      captchaObjFpwd.onSuccess(function (){
        var validate = captchaObjFpwd.getValidate();
        sendSmsData.push('geetest_challenge='+validate.geetest_challenge);
        sendSmsData.push('geetest_validate='+validate.geetest_validate);
        sendSmsData.push('geetest_seccode='+validate.geetest_seccode);
        $("#number").focus();
        sendSmsFunc();
      });

      $('.sendvdimgck').bind("click", function (){
        if($(this).hasClass('disabled')) return false;
        var tel = $("#phone-num").val();
        if (!returnCheckPhone($(this))) return;

        //弹出验证码
        captchaObjFpwd.verify();
      })
    };

    $.ajax({
      url: "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
      type: "get",
      dataType: "json",
      success: function(data) {
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
  }else{
    $(".sendvdimgck").bind("click", function (){
      if($(this).hasClass('disabled')) return false;
      var tel = $("#phone-num").val();

      if (!returnCheckPhone($(this))) return;

      $("#number").focus();
      sendSmsFunc();
    })
  }

  //发送验证码
  function sendSmsFunc(){
    var tel = $("#phone-num").val();
    var areaCode = $("#areaCode").val().replace('+', '');
    var sendSmsUrl = "/include/ajax.php?service=siteConfig&action=getPhoneVerify";

    sendSmsData.push('type=verify');
    sendSmsData.push('areaCode=' + areaCode);
    sendSmsData.push('phone=' + tel);

    $('.senderror').text('');
    $.ajax({
      url: sendSmsUrl,
      data: sendSmsData.join('&'),
      type: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.state == 101) {
          $('.senderror').text(res.info);
        }else{
          returnDJS($('.sendvdimgck'), 60);
        }
      }
    })
  }


    // 用户名验证

    function returnCheckPhone(o) {
        var t = o,
            form = $('#sub-apply'),
            oaccount = form.closest('#leave-tel').find('#phone-num'),
            account = $.trim(oaccount.val());
        var r = true;
        if (account == '') {
            r = false;
            $('.error p').text('请输入您的电话号码').show();
            oaccount.focus();
        } else {
            var reg, h = '';
            reg = !! account.match(/^1[34578](\d){9}$/);
            if (!reg) {
                $('.error p').text('您的电话号码输入错误').show();
                oaccount.focus();
                r = false;
            } else {
                oaccount.attr('placeholder', '');
            }
        }
        return r;
    }
    //倒计时
    var ct;

    function returnDJS(obj, time) {
        obj.attr('disabled', true);
        obj.css('background', '#eee');
        ct = setInterval(function () {
            obj.text(--time + 's');
            if (time <= 0) {
                clearInterval(ct);
                obj.text('获取验证码').removeClass('loading');
                obj.attr('disabled', false);
                obj.css('background', '##ff295b');
            }
        }, 1000)
    }

    //计算费用

    function calculationAmount() {
        //总价
        var totalAmount = parseFloat($('.month li.active').data('price'));
        var payAmount = totalAmount;

        //余额
        $('#useBalance').val(0);
        $('#balance').val(0);
        if ($('.balance').size() > 0 && $('.balance .select-btn').hasClass('active')) {
            $('#useBalance').val(1);
            payAmount = totalBalance > totalAmount ? 0 : totalAmount - totalBalance;
            var balance = (totalBalance > totalAmount ? totalAmount : totalBalance).toFixed(2);
            $('.balance .use').html(balance);
            $('#balance').val(balance);
        } else {
            $('.balance .use').html('0.00');
        }

        payAmount = payAmount.toFixed(2);

        $('.onlinepay .actual-money font').html(payAmount);

        $('.buy-strings-popup .buy-now').show();
        if (payAmount > 0) {
            $('.onlinepay').show();
            if ($('.onlinepay').length == 0) {
                $('#payType').show();
            } else {
                getQrCode();
                $('.buy-strings-popup .buy-now').hide();
            }
        } else {
            $('.onlinepay').hide();
            if ($('.onlinepay').length == 0) {
                $('#payType').hide();
            }
        }
    }


    //获取付款二维码

    function getQrCode() {
        var paytype = $('.morepaytype .active').data('type');
        $('#paytype').val(paytype);
        $('#id').val($('.month li.active').index());
        var data = $('#payform').serialize(),
            action = $('#payform').attr('action');

        $.ajax({
            type: 'POST',
            url: action,
            data: data + '&qr=1',
            dataType: 'jsonp',
            success: function (str) {
                if (str.state == 100) {
                    var data = [],
                        info = str.info;
                    for (var k in info) {
                        data.push(k + '=' + info[k]);
                    }
                    var src = masterDomain + '/include/qrPay.php?' + data.join('&');
                    $('#qrimg').attr('src', masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(src));

                    //验证是否支付成功，如果成功跳转到指定页面
                    if (timer != null) {
                        clearInterval(timer);
                    }

                    timer = setInterval(function () {

                        $.ajax({
                            type: 'POST',
                            async: false,
                            url: '/include/ajax.php?service=member&action=tradePayResult&type=3&order=' + info[
                                'ordernum'],
                            dataType: 'json',
                            success: function (str) {
                                if (str.state == 100 && str.info != "") {
                                    //如果已经支付成功，则跳转到会员中心页面
                                    clearInterval(timer);
                                    $('.code p').html('支付成功！').css('color', '#00CC33');
                                    setTimeout(function () {
                                        location.reload();
                                    }, 1000)
                                } else if (str.state == 101 && str.info == '订单不存在！') {
                                    getQrCode();
                                }
                            }
                        });

                    }, 2000);


                }
            }
        });

    }

    function getList(tr) {
        if (tr) {
            atpage = 1;
        }
        container.html('<div class="loading">正在获取，请稍后</div>');
        $(".pagination").hide();

        var data = [];
        data.push('company=' + hnid);
        data.push('page=' + atpage);
        data.push('pageSize=' + pageSize);

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=dating&action=memberList',
            type: 'get',
            data: data.join('&'),
            dataType: 'jsonp',
            success: function (data) {
                if (data && data.state == 100) {
                    var html = [];
                    totalCount = data.info.pageInfo.totalCount;
                    $('.personal .member span').text(totalCount);

                    for (var i = 0; i < data.info.list.length; i++) {
                        var d = data.info.list[i];
                        var photo = d.photo ? d.photo : staticPath + 'images/blank.gif';
                        html.push('<div class="high-list fn-left" data-uid="' + d.id + '" data-nickname="' + d.nickname +
                            '" data-company="' + d.company + '">');
                        html.push('    <a href="' + d.url + '" target="_blank"><img src="' + photo + '" alt=""></a>');
                        html.push('    <div class="high-info fn-left">');
                        html.push('        <p class="name"><a href="' + d.url + '" target="_blank">' + d.nickname +
                            '</a></p>');
                        html.push('        <p class="years">');
                        var has = 0;
                        if (d.age) {
                            has = 1;
                            html.push('            <span class="font18">28</span>岁&nbsp;  ');
                        }
                        if (d.heightName) {
                            has = 1;
                            html.push('            <span class="font18">160</span><span class="font16">cm</span>&nbsp;');
                        }
                        if (d.marriageName) {
                            has = 1;
                            html.push('            ' + d.marriageName);
                        }
                        if (!has) {
                            html.push('            竟然都没填~');
                        }
                        html.push('        </p>');

                        
                        html.push('        <p class="pull">');
                        if(d.leadHas){
                            html.push('        <a class="strings lead active" href="javascript:;">已牵线</a>');
                        }else{
                            html.push('        <a class="strings lead" href="javascript:;">牵线</a>');
                        }
                        html.push('        <a href="' + d.url + '" target="_blank">主页</a>');
                        html.push('        </p>');

                        html.push('        <p class="loc"><a href="javascript:;">' + d.addrName.join(' ') + '</a></p>');
                        html.push('    </div>');
                        html.push('</div>');
                    }

                    container.html(html.join(""));

                    showPageInfo();

                } else {
                    container.html('<div class="loading">暂无会员</div>');
                }
            },
            error: function () {
                container.html('<div class="loading">网络错误，请重试</div>');
            }
        })
    }

    getList();


    // 打印分类

    function showPageInfo() {
        var info = $(".pagination");
        var nowPageNum = atpage;
        var allPageNum = Math.ceil(totalCount / pageSize);
        var pageArr = [];

        info.html("").hide();

        //输入跳转
        // var redirect = document.createElement("div");
        // redirect.className = "pagination-gotopage";
        // redirect.innerHTML =
        //     '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
        // info.append(redirect);

        // //分页跳转
        // info.find(".btn").bind("click", function () {
        //     var pageNum = info.find(".inp").val();
        //     if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
        //         atpage = pageNum;
        //         getList();
        //     } else {
        //         info.find(".inp").focus();
        //     }
        // });

        var pages = document.createElement("div");
        pages.className = "page pagination-pages fn-clear";
        info.append(pages);

        //拼接所有分页
        if (allPageNum > 1) {

            //上一页
            if (nowPageNum > 1) {
                var prev = document.createElement("a");
                prev.className = "prev";
                prev.innerHTML = '上一页';
                prev.onclick = function () {
                    atpage = nowPageNum - 1;
                    getList();
                }
            } else {
                var prev = document.createElement("span");
                prev.className = "prev disabled";
                prev.innerHTML = '上一页';
            }
            info.find(".pagination-pages").append(prev);

            //分页列表
            if (allPageNum - 2 < 1) {
                for (var i = 1; i <= allPageNum; i++) {
                    if (nowPageNum == i) {
                        var page = document.createElement("span");
                        page.className = "curr";
                        page.innerHTML = i;
                    } else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            getList();
                        }
                    }
                    info.find(".pagination-pages").append(page);
                }
            } else {
                for (var i = 1; i <= 2; i++) {
                    if (nowPageNum == i) {
                        var page = document.createElement("span");
                        page.className = "curr";
                        page.innerHTML = i;
                    } else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            getList();
                        }
                    }
                    info.find(".pagination-pages").append(page);
                }
                var addNum = nowPageNum - 4;
                if (addNum > 0) {
                    var em = document.createElement("span");
                    em.className = "interim";
                    em.innerHTML = "...";
                    info.find(".pagination-pages").append(em);
                }
                for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
                    if (i > allPageNum) {
                        break;
                    } else {
                        if (i <= 2) {
                            continue;
                        } else {
                            if (nowPageNum == i) {
                                var page = document.createElement("span");
                                page.className = "curr";
                                page.innerHTML = i;
                            } else {
                                var page = document.createElement("a");
                                page.innerHTML = i;
                                page.onclick = function () {
                                    atpage = Number($(this).text());
                                    getList();
                                }
                            }
                            info.find(".pagination-pages").append(page);
                        }
                    }
                }
                var addNum = nowPageNum + 2;
                if (addNum < allPageNum - 1) {
                    var em = document.createElement("span");
                    em.className = "interim";
                    em.innerHTML = "...";
                    info.find(".pagination-pages").append(em);
                }
                for (var i = allPageNum - 1; i <= allPageNum; i++) {
                    if (i <= nowPageNum + 1) {
                        continue;
                    } else {
                        var page = document.createElement("a");
                        page.innerHTML = i;
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            getList();
                        }
                        info.find(".pagination-pages").append(page);
                    }
                }
            }

            //下一页
            if (nowPageNum < allPageNum) {
                var next = document.createElement("a");
                next.className = "next";
                next.innerHTML = '下一页';
                next.onclick = function () {
                    atpage = nowPageNum + 1;
                    getList();
                }
            } else {
                var next = document.createElement("span");
                next.className = "next disabled";
                next.innerHTML = '下一页';
            }
            info.find(".pagination-pages").append(next);

            info.show();

        } else {
            info.hide();
        }
    }

})