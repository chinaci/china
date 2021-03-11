$(function(){

  var reduceyue = $('.reduce-yue');

  //验证是否在客户端访问
	setTimeout(function(){
		if(appInfo.device == ""){
			if(navigator.userAgent.toLowerCase().match(/micromessenger/)){
				$("#alipay, #globalalipay").remove();
			}
		}else{
			$("#payform").append('<input type="hidden" name="app" value="1" />');
		}
    $(".pay-list dl:eq(0)").addClass("active");
    $("#paytype").val($(".pay-list dl:eq(0)").attr("id"));
		$(".check-item, .confirm").css({"visibility": "visible"});
	}, 500);

  // 发布信息支付框
	$('.fabuPay .pay-list dl').click(function(){
		var t = $(this);
		t.addClass('active').siblings('dl').removeClass('active');
    calculationPayPrice();
	})

	// 选择余额
	$('.fabuPay .yue-btn').click(function(){
    var t = $(this), yue = $('.payPrice em').text();
    if (t.hasClass('active')) {
      t.removeClass('active');
      reduceyue.text('0.00');
    }else {
      t.addClass('active');
      reduceyue.text(yue);
    }
    calculationPayPrice();
  })

	// 关闭支付框
	$('.fabuPay .payBack').click(function(){
		// $('.fabuPay').hide();
    fabuPay.close();
	})

  $('.pay_btn').bind("click", function(){
    fabuPay.sub();
  });

  calculationPayPrice();

  //计算总价
  function calculationPayPrice(){

    //改变表单内容
    $('#paytype').val($('.pay-list .active').attr('id'));
    $('#amount').val($('.payPrice em').text());
    $("#useBalance").val($(".fabuPay .yue-btn").hasClass("active") ? 1 : 0);


    var totalPrice = $('.payPrice em').text();
    if($('.fabuPay .yue-btn').hasClass('active')){
      reduceyue.text(totalBalance > totalPrice ? totalPrice : totalBalance);
      balance = totalBalance > totalPrice ? totalPrice : totalBalance;
      $('.pay-total').html((totalPrice-balance).toFixed(2));

      if(totalPrice-balance <= 0){
        $('#paytypeObj').hide();
      }else{
        $('#paytypeObj').show();
      }
    }else{
      $('#paytypeObj').show();
      $('.pay-total').html(totalPrice);
    }

  }

  // manage页面继续支付
  $("body").delegate(".delayPay", "click", function(){
    var t = $(this), aid = t.closest(".item").attr("data-id");
    fabuPay.checkLevel(t, aid);
  })

})

// 普通会员发布信息支付费用
var fabuPay = {
  payform: $("#payform"),
  btn: null,
  url: '',
  check: function(data, url, btn){
    url = url.split('#')[0];
    this.btn = btn;
    this.url = url;
    var tip = langData['siteConfig'][20][341], icon = "success.png";
    // 修改
    if(id){
      tip = langData['siteConfig'][20][229];
    }else{
      // 付费
      if(data.info.amount > 0){
        fabuPay.show(data);
        return;
      }
    }

    alert(tip);
    location.href = url;

  },
  show: function(data){
    $("#aid").val(data.info.aid);

    var auth = data.info.auth;
    // 付费会员更新提示信息
    if(auth.level != 0){
      $(".payTip").text(langData['siteConfig'][19][826].replace('1', auth.levelname).replace('2', auth.maxcount).replace('3', auth.alreadycount));
    }

    $("#tourl").val(this.url);
    $('.fabuPay').show();
  },
  sub: function(){
    // var F = this;
    // var url = F.payform.attr("action"), data = F.payform.serialize();
    if(appInfo.device != ""){
      this.payform.append('<input type="hidden" name="app" value="1" />');
    }
    this.payform.submit();

  },
  close: function(){
    window.location.href = this.url;
  },
  checkLevel: function(t, aid){
    var F = this;
    if(t.hasClass('load')) return;
    t.addClass("load");
    $.ajax({
      url: '/include/ajax.php?service=member&action=checkFabuAmount&module='+module,
      type: 'post',
      dataType: 'json',
      success: function(data){

        if(data){
          // 需要支付
          if(data.info.needpay == "1"){
            data.info.aid = aid;
            F.url = document.URL;
            F.show(data);

          // 已升级为会员
          }else{
            var auth = data.info.auth;

            var ok = confirm(langData['siteConfig'][19][827].replace('1', auth.levelname).replace('2', auth.alreadycount).replace('3', auth.maxcount));

            if(ok){
              $.ajax({
                url: '/include/ajax.php?service=member&action=updateFabuPaystate&module='+module+'&type='+type+'&aid='+aid,
                type: 'post',
                dataType: 'json',
                success: function(data){
                  if(data && data.state == 100){
                    location.reload();
                  }else{
                    alert(data.info);
                    t.removeClass('load')
                  }
                },
                error: function(){
                  alert(langData['siteConfig'][20][183]);
                  t.removeClass('load')
                }
              })
            }else{
              t.removeClass('load');
            }

          }
        }
      },
      error: function(){
        alert(langData['siteConfig'][20][183]);
        t.removeClass("load");
      }
    })
  }
}
