$(function(){

  var depositPrice = 0;
  var timer = null;

  $('.paybox li').click(function(){
    var t = $(this), type = t.data('type');
    if(t.hasClass('on')) return;
    t.addClass('on').siblings('li').removeClass('on');
    $("#paytype").val(type);
  })


	// 遮罩层
	$('.bg').on('click',function(){
    $('.bg').hide().animate({"opacity":"0"},200);
    $('.paybox').animate({"bottom":"-100%"},300)
    setTimeout(function(){
      $('.paybox').removeClass('show');
    }, 300);
		$('body').unbind('touchmove')
	})
  var pointNum =0;
  //选择数量
  $('.mainWrap li').off('click').click(function(){

    if(!$(this).hasClass('active')){
      $(this).addClass('active').siblings('li').removeClass('active');
      var tnum = $(this).attr('data-id');
      pointNum = tnum;
      jsPrice();//计算所需金额
    }else{
      $(this).removeClass('active');
      pointNum = 0;
      jsPrice();//计算所需金额
    }
    $("#selfNum").val('');

  })

  //自定义数量
  $("#selfNum").bind("input", function(){
    var t = $(this), val = t.val();
    if(val > 0){
      $('.mainWrap li').removeClass('active');
      pointNum = val;
      jsPrice();
    }else{
      if($('.mainWrap li.active').length == 0){
        pointNum = 0;
        jsPrice();
      }
    }

  })

  //金额验证
  function jsPrice(){
	if(type=='deposit'){
		depositPrice = pointNum;
		$("#allPrice").html(depositPrice);
	}else{
		depositPrice = pointNum/pointRatio;
		$("#allPrice").html(depositPrice);
	}

  }


  // 选择支付方式
  $('#tj').click(function(){

    if (depositPrice == 0) {
      showMsg(langData['siteConfig'][54][123]);//请输入充值数量！

    }else{

      $('#amount').val(depositPrice);
      $('#submit').click();

        if(device.indexOf('huoniao') > -1) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('pageClose', {}, function (responseData) {
                });
            });
        }

      //验证是否支付成功，如果成功跳转到指定页面
      // if(timer != null){
      //   clearInterval(timer);
      // }
      // timer = setInterval(function(){
	  //
      //   $.ajax({
      //     type: 'POST',
      //     async: false,
      //     url: '/include/ajax.php?service=member&action=tradePayResult&type=2',
      //     dataType: 'json',
      //     success: function(str){
      //       if(str.state == 100 && str.info != ""){
      //         //如果已经支付成功，则跳转到指定页面
      //         location.href = str.info;
      //       }
      //     }
      //   });
	  //
      // }, 2000);

      return;

      //如果不在客户端中访问，根据设备类型删除不支持的支付方式
      if(appInfo.device == ""){
          // 赏
          if(navigator.userAgent.toLowerCase().match(/micromessenger/)) {
              $("#alipay, #globalalipay").remove();

              //小程序
              if (wx_miniprogram) {
                  $("#paypal").remove();
              }
          }

      }else{
          $("#payform").append('<input type="hidden" name="app" value="1" />');
      }
      $(".paybox li").removeClass("on");
      $(".paybox li:eq(0)").addClass("on");
      $("#paytype").val($(".paybox li:eq(0)").data("type"));

        //小程序
        if(navigator.userAgent.toLowerCase().match(/micromessenger/) && wx_miniprogram){
            $(".paybtn").click();
        }else{
            $('.bg').show().animate({"opacity":"1"},200);
            $('.paybox').addClass('show').animate({"bottom":"0"},300);
        }

    }
  })

  //提交支付
  $(".paybtn").bind("click", function(event){
    var t = $(this);

    if($("#paytype").val() == ""){
      alert(langData['siteConfig'][20][203]);
      return false;
    }
    if(depositPrice == 0){
      alert(langData['siteConfig'][20][64]);
      $('.bg').click();
      $("#price").focus();
      return false;
    }


    $('#amount').val(depositPrice);

    $("#payform").submit();

	setTimeout(function(){

		if(device.indexOf('huoniao') > -1) {
			setupWebViewJavascriptBridge(function (bridge) {
				bridge.callHandler('pageClose', {}, function (responseData) {
				});
			});
		}

	}, 3000);

  });


})

// 错误提示
function showMsg(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}
