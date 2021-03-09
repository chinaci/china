$(function(){

  var albumSmallHTML = $('.womanPic .smallImg ul').html();
  var albumBigHTML = $('.womanPic .bigImg').html();

  $("img").scrollLoading();

	// 判断浏览器是否是ie8
  if($.browser.msie && parseInt($.browser.version) >= 8){
  	$('.album .photo-album .album-list:nth-child(5n)').css('margin-right','0');
  	$('.person .person-list:nth-child(5n)').css('margin-right','0');
  	$('.like .like-list .like-con .like-img:nth-child(4n)').css('margin-right','0');
    $('.slideBox2 .gift-box .gift-list:nth-child(4n)').css('margin-right','0');
  	$('.footer .foot-bottom .wechat .wechat-pub:last-child').css('margin-right','0');
  }

  // 关注
  $('.womanData .name .follow').click(function(){
    var t = $(this);
    if(t.hasClass('active')){
      $.post('/include/ajax.php?service=dating&action=cancelFollow&id='+master.id);
      t.removeClass('active').text('关注');
    }else{
      $.post('/include/ajax.php?service=dating&action=visitOper&type=2&id='+master.id);
      t.addClass('active').text('已关注');
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
    $('.areaCode').bind('click', function(e){
      console.log('codeclick')
        e.stopPropagation();
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

  // 会员左侧轮播
  //大图切换
  var aa = $(".womanPic").slide({ titCell:".smallImg li", mainCell:".bigImg", effect:"fold", autoPlay:true,delayTime:200,prevCell:".Prev",nextCell:".Next",
    startFun:function(i,p){
      //控制小图自动翻页
      if(i==0){ $(".womanPic .sPrev").click() } else if( i%5==0 ){ $(".womanPic .sNext").click()}
      var img = $('.womanPic .bigImg li:eq('+i+') img'), src = img.data('src'), lock = img.data('lock');
      if(lock){
        img.attr('src', albumLock);
      }else{
        img.attr('src', src);
      }
    }
  });
  
  //小图左滚动切换
  $(".womanPic .smallScroll").slide({ mainCell:"ul",delayTime:100,vis:5,scroll:5,effect:"left",autoPage:true,prevCell:".sPrev",nextCell:".sNext",pnLoop:false });

  // 轮播弹窗
  var bigImgHTML = $('.woman-popup').html();
  $('.womanPic .big ul li').click(function(){
    var number = $('.womanPic .smallImg li.on').index();
    if($('.womanPic .smallImg li.on img').data('lock')){
      showMsg('您当前的会员等级可查看照片数量已达上限，查看更多照片请升级会员');
      return;
    }

    $('.album-popup').show();
    $(".woman-popup .smallImg ul").html(albumSmallHTML);
    $(".woman-popup .bigImg").html(albumBigHTML);
    var aa = $(".woman-popup").slide({ titCell:".smallImg li", defaultIndex:number, mainCell:".bigImg", effect:"fold", autoPlay:true,delayTime:200,prevCell:".album-prev",nextCell:".album-next",
      startFun:function(i,p){
        //控制小图自动翻页
        if(i==0){ $(".woman-popup .small-prev").click() } else if( i%5==0 ){ $(".woman-popup .small-next").click()}
        var img = $('.woman-popup .bigImg li:eq('+i+') img'), src = img.data('src'), lock = img.data('lock');
        if(lock){
          img.attr('src', albumLock);
        }else{
          img.attr('src', src);
        }
      }
    });
    //小图左滚动切换
    $(".woman-popup .smallScroll").slide({ mainCell:"ul",delayTime:100,vis:5,scroll:5,effect:"left",autoPage:true,prevCell:".small-prev",nextCell:".small-next",pnLoop:false });
    
  })

  //关闭轮播弹窗
  $("body").delegate('.album-close img', 'click', function(){
    $('.album-popup').hide();
  })
  //点击个人介绍更多
	$('#more').click(function(){
    return b = $('.personal-info .intro-more'), b.is(':visible') ? b.slideUp() : b.show();
	});
	$('.pack-up').click(function(){
		$('.personal-info .intro-more').slideUp();
	})
	
	// 收到的礼物-轮播
  $('.slideBox1 .gift-list').each(function(i){
    $('.slideBox1 .gift-list').slice(i*6, i*6 + 6).wrapAll('<li><div class="gift-box fn-clear"></div></li>');
  })
  $(".slideBox1").slide({mainCell:".bd ul",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
  // 基本资料-导航切换
  $(".data .data-title li").click(function(){
      $(this).addClass("active").siblings().removeClass("active");
      var i = $(this).index();
      var type = $(this).data('type');
      var box = $(this).closest('.data').find(".tab-content").eq(i);
      box.addClass("show").siblings().removeClass("show");
      if(box.html() == ''){
        window['get'+type]();
      }
  });
  // 二维码登陆
	$('.womanData .code-btn').click(function(){
		$('.womanData .scan-code').toggleClass('show');
	})
	
  //送礼物------------------------------
  var timer2 = null;
  $('.slideBox2 .gift-list').each(function(i){
    $('.slideBox2 .gift-list').slice(i*8, i*8+8).wrapAll('<li class="fn-clear"></li>');
  })
  var sendGiftPopup = $('.send-gift-popup').html();

  // 计算价格
  function getGiftPrice(){
    var active = $('.gift-list.active'), price = active.data('price'), count = 1;
    var total = price * count;
    return total;
    // return {total: total, balance: total > visitor.money ? false : true};
  }
  // 充值金额计算
  function getDeposit(){
    //总价
    var totalAmount = parseFloat($('.select-money .active').data('price'));
    var payAmount = totalAmount;
    var count = parseInt($('.select-money .active').text());

    $('#count').val(count);

    //余额
    $('#useBalance2').val(0);
    $('#balance2').val(0);
    if ($('.balance2').size() > 0 && $('.balance2 .select-btn').hasClass('active')) {
        $('#useBalance2').val(1);
        payAmount = totalBalance > totalAmount ? 0 : totalAmount - totalBalance;
        var balance = (totalBalance > totalAmount ? totalAmount : totalBalance).toFixed(2);
        $('.balance2 .use').val(balance);
        $('#balance2').val(balance);
    } else {
        $('.balance2 .use').val('0.00');
    }

    $('.up-money-con .gain span').html(totalAmount);

    payAmount = payAmount.toFixed(2);

    $('.onlinepay2 .actual-money font').html(payAmount);
    if (payAmount > 0) {
        $('.onlinepay2').show();
        if ($('.onlinepay2').length == 0) {
            $('#payType2').show();
            $('.up-money-con .buy-now').show();
        } else {
            $('.up-money-con .buy-now').hide();
            getQrCode2();
        }
    } else {
        $('.onlinepay2').hide();
        if ($('.onlinepay2').length == 0) {
            $('#payType2').hide();
        }
        $('.up-money-con .buy-now').show();
    }
  }
  //送礼物弹窗
  $('#send-gift').click(function(){
    $('.desk').show();
    $('.send-gift-popup').html(sendGiftPopup);
    $('.send-gift-popup').show();
    $('.my_money').text(visitor.money);
    $(".slideBox2").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop",autoPage:"<li></li>"});
  })
  
  // 关闭送礼物弹出
  $('body').delegate('.send-gift-close','click',function(){
    $('.desk').hide();
    $('.send-gift-popup').hide();
  })
  // 切换礼物
  $('.send-gift-popup').delegate('.gift-list', 'click', function(){
    $('.gift-list').removeClass('active');
    $(this).addClass('active');
  })

  // 发送按钮
  $('.send-gift-popup').delegate('.send a', 'click', function(){
    var active = $('.gift-list.active'), img = active.find('img').attr('src'), name = active.find('.gift-text').text(), price = active.attr('data-price');

    var obj = $('.recharge-popup');
    obj.find('.recharge-img img').attr('src', img);
    obj.find('.name').text(name);
    obj.find('.price').text(price);

    var total = getGiftPrice();
    var type = visitor.money >= total ? 'send' : 'deposit';

    $('.recharge-popup .yes').hide();
    $('.recharge-popup .yes_'+type).show();

    $('.send-gift-popup').hide();
    $('.recharge-popup').show();
  })
  // 确认送出
  $('.yes_send').click(function(){
    var t = $(this);
    if(t.hasClass('disabled')) return;
    var gid = $('.gift-list.active').attr('data-id');
    var price = $('.gift-list.active').attr('data-price');
    t.addClass('disabled');
    $.ajax({
      url: '/include/ajax.php?service=dating&action=putGift&id='+uid+'&gid='+gid,
      type: 'get',
      dataType: 'json',
      success: function(data){
        if(data && data.state == 100){
          visitor.money -= price;
          $('.recharge-popup').addClass('suc').find('.sendafter p').text(data.info);
        }else{
          $('.recharge-popup').addClass('fail').find('.sendafter p').text(data.info);
        }
        setTimeout(function(){
          $('.recharge-popup').removeClass('suc fail');
          $('.recharge-close').click();
          t.removeClass('disabled');
        }, 2000)
      },
      error: function(){

      }
    })
  })

  // 充值按钮
  $('body').delegate('.blance-charge, .yes_deposit','click',function(){
    $('.send-gift-popup').hide();
    $('.recharge-popup').hide();
    $('.desk').show();
    getDeposit();
    $('.up-money-popup').show();
  })
  $('.up-money-close').click(function(){
    $('.desk').hide();
    $('.up-money-popup').hide();
  })
  // 取消充值/取消送礼物
  $('.recharge-popup .recharge-close, .charge .no').click(function(){
    $('.desk').hide();
    $('.recharge-popup').hide();
  })

  // 切换充值金额
  $('.up-money-popup .select-money a').click(function(){
  	$(this).addClass('active').siblings().removeClass('active');
    getDeposit();
  })
  // 是否使用余额
  $('.up-money-popup .select-btn').click(function(){
  	$(this).toggleClass('active');
    getDeposit();
  })
  // 切换支付方式
  $('#payType2 a').click(function () {
      var t = $(this),
          type = t.data('type');
      t.addClass('active').siblings().removeClass('active');
      $('#paytype2').val(type);
  })

  // 购买金币-非扫码支付
  $('.up-money-popup .buy-now').click(function () {
      var paytype = $('.morepaytype2 .active').data('type');
      var count = $('.select-money.active').text();
      $('#paytype2').val(paytype);
      $('#count2').val(count);
      var data = $('#payform2').serialize(),
          action = $('#payform2').attr('action');

      $.ajax({
          type: 'POST',
          url: action,
          data: data,
          dataType: 'jsonp',
          success: function (str) {
              if (str.state == 100) {
                  $('#action2').val('pay');
                  $('#ordernum2').val(str.info);
                  $('#payform2').submit();
              }
          },
          error: function () {

          }
      })
  })

  //获取付款二维码
    function getQrCode2() {
      var paytype = $('.morepaytype2 .active').data('type');
      $('#paytype2').val(paytype);
      var data = $('#payform2').serialize(),
          action = $('#payform2').attr('action');
          console.log(data);
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
                  $('#qrimg2').attr('src', masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(src));

                  //验证是否支付成功，如果成功跳转到指定页面
                  if (timer2 != null) {
                      clearInterval(timer2);
                  }

                  timer2 = setInterval(function () {

                      $.ajax({
                          type: 'POST',
                          async: false,
                          url: '/include/ajax.php?service=member&action=tradePayResult&type=3&order=' + info[
                              'ordernum'],
                          dataType: 'json',
                          success: function (str) {
                              if (str.state == 100 && str.info != "") {
                                  //如果已经支付成功，则跳转到会员中心页面
                                  clearInterval(timer2);
                                  $('.up-money-popup .code-left p').html('支付成功！').css('color', '#00CC33');
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


  // 送礼物e--------------------------------------


  //发消息弹框
  $('.womanData .mes').click(function(){
    $('.desk').show();
    $('.send-popup').show();
  })
  $('.send-popup .close').click(function(){
    $('.desk').hide();
    $('.send-popup').hide();
  })
  // 打招呼弹窗
  $('.message .hi').click(function(){
    if(master.id == visitor.id){
      $('.hi-popup').text("每天跟自己打个招呼^_^");
    }else{
      $(this).hide().siblings().removeClass('fn-hide');
      $.post('/include/ajax.php?service=dating&action=visitOper&type=3&id='+uid);
    }
    $('.hi-popup').show();
    setTimeout(function(){
      $('.hi-popup').hide();
    },1000);

  })
  //我的相册显示更多
  var albumLen = $('.photo-album .album-list').length;
  if(albumLen>10){
    $('.album .more').show();
  }
  $('#show-more').click(function(){
    var index = $('.album .album-list.fn-hide:eq(0)').index();
    console.log(index)
    $('.album .album-list').slice(index, index+10).removeClass('fn-hide');
    if(!$('.album .album-list.fn-hide').length){
      $(this).hide();
    }
  })
  //我的相册弹窗
  $('#total_album').text($('.album .album-list').length);
  $('.photo-album a').click(function(e){
    e.preventDefault();
    var t = $(this);
    if(!t.hasClass('ok')){
      showMsg('您当前的会员等级可查看照片数量已达上限，查看更多照片请升级会员');
      return;
    }
    // $(this).closest('.album-list').find('.album-pop').show();
  })
  $('.photo-album .album-list a.ok').abigimage();
  // $('.album-list-close').click(function(){
  //   $('.album-pop').hide();
  // })
  // 获取联系方式
  $('.contact-popup').click(function(){
    var t = $(this), type = t.data('type'), em = t.find('em');
    if(t.hasClass('disabled')) return;

    if(t.hasClass('loaded')){
      if(t.hasClass('disab')){
        $('.desk').show();
        $('.hello-popup').show();
      }
    }else{
      t.addClass('loaded');
      em.data('show', em.text());
      em.text('获取中.....');
      getMemberSpecInfo(type, function(data){
        if(data && data.state == 100){
          t.find('em').text(data.info);
        }else{
          em.text(em.data('show'));
          $('.desk').show();
          $('.hello-popup').show();
          t.addClass('disab');
        }
      })
    }
    
  })
  // 关闭
  $('.hello-popup-delete, .hello-btn .cancel').click(function(){
    $('.desk').hide();
    $('.hello-popup').hide();
  })

  // 语音播放
  var audio = null;
  $('#audio_area').click(function(){
    var t = $(this), tit = t.find('.audio_title');
    if(t.hasClass('disabled')) return;

    if(audio && t.hasClass('loaded')){
      if(t.hasClass("playing")){
        audio.pause();
        t.removeClass("playing");
      }else{
        audio.play();
        t.addClass("playing");
      }
      return;
    }

    tit.text('获取中...');
    t.addClass('disabled');
    getMemberSpecInfo('my_voice', function(data){
      tit.text('语音介绍');
      t.removeClass('disabled').addClass('loaded');
      if(!data){
        showMsg('网络错误，请重试');
        // $.dialog.alert('网络错误，请重试');
        return;
      }
      if(data.state == 100){
        audio = new Audio();
        audio.src = data.info;
        audio.onloadedmetadata = function(){
          $("#audio_length").text(parseInt(audio.duration)+'″').show();
        }
        audio.onpause = function(){
          t.removeClass("playing");
        }
        audio.play();
        t.addClass("playing");
      }else{
        showMsg(data.info);
        // $.dialog.alert(data.info);
      }
    })
  })


  // 基本资料会员弹窗
  $('.data-list .look').click(function(){
    $('.desk').show();
    $('.hello-popup').show();
    $('.hello-popup-delete').click(function(){
      $('.desk').hide();
      $('.hello-popup').hide();
    })
    $('.hello-btn .cancel').click(function(){
      $('.desk').hide();
      $('.hello-popup').hide();
    })
  })
  // 最近访客-打招呼
  $('.tab-content .hello-right .hello-icon .say').click(function(){
    var t = $(this), uid_ = t.closest('.hello-list').data('uid');
    t.hide().next('.say-ed').show();
    $.post('/include/ajax.php?service=dating&action=visitOper', 'type=3&id='+uid_);
  })

  function getMemberSpecInfo(name, callback){
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=getMemberSpecInfo&name='+name+'&id='+id,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        callback(data);
      },
      error: function(){
        callback();
      }
    })
  }

  var showMsg = function(info){
    var info = info ? info : '您还不是会员，请充值会员';
    $('.delete-sure').text(info);
    $('.hello-popup, .desk').show();
  }
  $('span.see').click(function(){
    showMsg();
  })

  // 牵线-----------------
  var timer = null;
  $('.strings.state_0 a').click(function(){
    var t = $(this);
    if(hnid == hnUid){
        $.dialog.alert('该会员是您的下属会员');
        return;
    }
    if(!t.parent().hasClass('state_0')) return;
    clearTimeout(timer);
    if (t.hasClass('active')) return;
    if (leadCount) {
        if (master.company != "0") {
            $('.pull-strings-popup .sure span').text(master.nickname);
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
  //关闭购买红娘牵线弹窗
  $('#buy-strings').click(function () {
      $('.buy-strings-popup').hide();
      $('.desk').hide();
      $('.error p').text('').hide();
  })

  //切换牵线套餐
  $('.buy-strings-popup .month ul li').click(function () {
      $(this).addClass('active').siblings().removeClass('active');
      calculationAmount();
  })
  // 切换支付方式
  $('#payType a').click(function () {
      var t = $(this),
          type = t.data('type');
      t.addClass('active').siblings().removeClass('active');
      $('#paytype').val(type);
  })

  // 购买牵线
  $('.buy-strings-popup .buy-now').click(function () {
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

  // 购买牵线红娘导航条
  $(".buy-strings-popup .buy-strings-title ul li").click(function () {
      $(this).addClass("active").siblings().removeClass("active");
      var i = $(this).index();
      $(this).closest('.buy-strings-popup').find('.buy-box').eq(i).addClass("show").siblings().removeClass("show");
  });

  // 监听手机号
    $('#phone-num').bind("input", function(){
        var t = $(this), val = t.val()
        if(userinfo.phoneCheck){
            if(val != userinfo.phone){
                $('.sendvdimgck, .yzmObj').show();
            }else{
                $('.sendvdimgck, .yzmObj').hide();
            }
        }
    })

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
        data.push('ufor='+master.id);
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
                obj.text('获取验证码').removeClass('load-ing');
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
          console.log(data);
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
    



  // 确认牵线
  $('.pull-strings-popup .yes').click(function(){
    if($(this).hasClass('active')) return;
    
    $('#close').click();

    $.ajax({
        url: masterDomain+'/include/ajax.php?service=dating&action=putLead&id='+master.id,
        type: 'get',
        dataType: 'jsonp',
        success: function(data){
            if(data && data.state == 100){
              $('.strings').removeClass('state_0').addClass('state_1').children('a').attr({'href':myleadPageUrl});
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
  // 取消牵线
  $('#close, .pull-strings-popup .no').click(function () {
      $('.desk').hide();
      $('.pull-strings-popup').fadeOut(600);
  })

  // 动态-------------

  // 动态点赞
  $(".like").delegate(".good", "click", function(){
    var t = $(this), id = t.closest('.like-list').attr('data-id'), count = t.children('span').text();
    if(t.hasClass('active')){
      t.removeClass('active').children('span').text(--count);
    }else{
      t.addClass('active').children('span').text(++count);
    }
    $.post('/include/ajax.php?service=dating&action=circleOper', 'id='+id);
  })
  $(".like").delegate(".player", "click", function(){
    var t = $(this), video = t.siblings('video');
    video[0].play();
    video.prop({"controls":"controls"});
    video[0].onpause = function(){
      t.show();
    }
    video[0].onplaying = function(){
      console.log('playing')
      t.hide();
    }
  })
  // 动态视频播放按钮
  $(".like").delegate(".player", "click", function(){
    var t = $(this), video = t.siblings('video');
    video[0].play();
    t.hide();
  })
  // 我的关注-我的粉丝列表 关注/取消关注
  $('.followbox, .fansbox').delegate(".follow a", "click", function(){
    var t = $(this).parent(), uid_ = t.closest('.person-list').attr('data-id');
    if(t.hasClass('active')){
      var url = '/include/ajax.php?service=dating&action=cancelFollow';
      t.removeClass('active').find('span').text('关注');
    }else{
      var url = '/include/ajax.php?service=dating&action=visitOper';
      t.addClass('active').find('span').text('已关注');
    }
    $.post(url, 'type=2&id='+uid_);
  })
  // 查看更多 --- 动态-关注-粉丝
  $(".tab-content").delegate(".more a", "click", function(){
    var type = $(this).attr('data-type');
    window['get'+type]();
  })

  // 举报
  $(".btnJb").bind("click", function(){
    var domainUrl = masterDomain;
      $.dialog({
        fixed: false,
        title: "交友会员举报",
        content: 'url:'+domainUrl+'/complain-dating-u-'+pageData.id+'.html',
        width: 560,
        height: 300
      });
  });
})
  function getcircle(){
    var active = $('.data [data-type="circle"]');
    var page = active.data('page');
    page = page ? page : 1;
    $('.like .more, .like .load-ing').remove();
    $('.like').append('<div class="load-ing">正在获取，请稍后</div>');
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=circleList&uid='+uid+'&page='+page+'&pageSize=10',
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        $('.like .load-ing').remove();
        if(data && data.state == 100){
          var html = [];
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];

            html.push('<div class="like-list type_'+d.type+'" data-id="'+d.id+'">');
            html.push('  <div class="like-head fn-clear">');
            html.push('    <p class="head-text fn-left">'+d.content+'</p>');
            html.push('    <span class="zan fn-right">');
            if(d.zan_has){
              html.push('     <a href="javascript:;" class="good active"><img src="'+templets_skin+'images/zan.png" alt="" class="no"><img src="'+templets_skin+'images/zan_height.png" alt="" class="yes"><span>'+d.zan+'</span></a>');
            }else{
              html.push('     <a href="javascript:;" class="good"><img src="'+templets_skin+'images/zan.png" alt="" class="no"><img src="'+templets_skin+'images/zan_height.png" alt="" class="yes"><span>'+d.zan+'</span></a>');
            }
            html.push('    </span>');
            html.push('  </div>');

            if(d.file.length){
              html.push('  <div class="like-con fn-clear">');
              if(d.type == 2){
                for(var n = 0; n < d.file.length; n++){
                  html.push('    <div class="like-img pic"><a href="'+d.file[n]+'"><img src="'+d.file[n]+'" alt=""></a></div>');
                }
              }else if(d.type == 3){
                html.push('    <div class="like-img"><video src="'+d.file[0]+'" id="video_'+d.id+'"></video><a href="javascript:;" class="player"></a></div>');
              }
              html.push('  </div>');
            }
            html.push('  <div class="time">');
            html.push('    <p class="day">'+d.time_d.split('/')[1]+'</p>');
            html.push('    <p class="month">'+d.time_d.split('/')[0]+'</p>');
            html.push('  </div>');
            html.push('</div>');
          }
          if(page < data.info.pageInfo.totalPage){
            active.data('page', ++page);
            html.push('<div class="more"><a href="javascript:;" data-type="circle">查看更多</a></div>');
          }
          $('.like').append(html.join(''));
          $('.like .pic a').abigimage();
        }else{
          $('.like').append('<div class="load-ing">暂无相关信息！</div>');
        }
      },
      error: function(){
        $('.like').append('<div class="load-ing">网络错误，请重试</div>');
      }
    })
  }

  function getfollow(type, act){
    var active = $('.data [data-type="'+type+'"]');
    var page = active.data('page');
    page = page ? page : 1;

    var act = act ? act : 'out';
    var box = type == 'fans' ? $('.fansbox') : $('.followbox');
    box.find('.more').remove();
    box.find('.load-ing').remove();
    box.append('<div class="load-ing">正在获取，请稍后</div>');
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=visit&oper=follow&act='+act+'&obj='+uid+'&page='+page+'&pageSize=10',
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        box.find('.load-ing').remove();
        if(data && data.state == 100){
          var html = [];
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];
            var member = d.member;
            var photo = member.photo ? member.photo : staticPath + '/images/default_user.jpg';

            html.push('<div class="person-list" data-id="'+d.member.id+'">');
            html.push('  <div class="person-img">');
            html.push('    <a href="'+member.url+'" target="_blank"><img class="per" src="'+photo+'" alt=""></a>');
            if(d.level){
              html.push('    <img class="diamond" src="{#$templets_skin#}images/woman-02.png" alt="">');
            }
            html.push('  </div>');
            html.push('  <p class="name fn-clear"><a href="'+member.url+'" target="_blank">'+member.nickname+'</a>' + (member.certifyState ? '<span>实名</span>' : '') + '</p>');
            if(d.follow){
              html.push('  <p class="follow active"><a href="javascript:;"><img src="'+templets_skin+'images/followed.png" alt=""><span>已关注</span></a></p>');
            }else{
              html.push('  <p class="follow"><a href="javascript:;"><img src="'+templets_skin+'images/followed.png" alt=""><span>关注</span></a></p>');
            }
            html.push('</div>');
          }

          if(page == 1){
            html.unshift('<div class="person fn-clear">');
            html.push('</div>');
            box.append(html.join(''));
          }else{
            box.children('.person').append(html.join(''));
          }
          if(page < data.info.pageInfo.totalPage){
            active.data('page', ++page);
            box.append('<div class="more"><a href="javascript:;" data-type="circle">查看更多</a></div>');
          }
        }else{
          box.append('<div class="load-ing">暂无相关信息！</div>');
        }
      },
      error: function(){
        box.append('<div class="load-ing">网络错误，请重试</div>');
      }
    })
  }

  function getfans(){
    getfollow('fans', 'in');
  }