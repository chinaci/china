$(function(){
	var timer = null;

	if($.browser.msie && parseInt($.browser.version) >= 8){
		$('.charge .charge-list:nth-child(3n)').css('margin-right','0');
		$('.footer .foot-bottom .wechat .wechat-pub:last-child').css('margin-right','0');
	}
	// 切换会员等级
	$('.charge .charge-list').click(function(){
		var t = $(this), level = t.data('id');
		t.addClass('active').siblings().removeClass('active');
		$('.upgradeinfo').html('');
		// upgrade(1, function(str){
		// 	if(str && str.state != 100){
		// 		$('.upgradeinfo').html(str.info);
		// 	}
		// })
		$('.now-recharge').removeClass('disabled');
		if(user.level){
			if(user.level < level){
				$('.upgradeinfo').html('您当前已经是VIP会员，并且与'+user.expired+'到期。升级后到期时间将从当前时间开始计算。');
			}else if(user.level > level){
				$('.upgradeinfo').html('您当前的会员等级高于选中等级');
				$('.now-recharge').addClass('disabled');
			}else{
				$('.upgradeinfo').html('<p class="review">您将续费当前会员等级</p>');
			}
		}
	}).eq(0).click();
	// 使用余额
	$('.use-money .select-btn').click(function(){
		if($(this).hasClass('disabled')) return;
		$(this).toggleClass('active');
	})
	// 立即充值弹窗
	$('.right-now .now-recharge').click(function(){
		if($(this).hasClass('disabled')) return;
		$('.desk').show();
		$('.recharge-now-popup').show();
		calculationAmount();
	})
	$('.recharge-close img').click(function(){
		$('.desk').hide();
		$('.recharge-now-popup').hide();
	})

	//计算费用
  function calculationAmount() {
      //总价
      var totalAmount = parseFloat($('.charge-list.active').data('price'));
      var payAmount = totalAmount;

      //余额
      $('#useBalance').val(0);
      $('#balance').val(0);
      if ($('.balance .select-btn').hasClass('active')) {
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

      $('.buy-now').show();
      if (payAmount > 0) {
          $('.onlinepay').show();
          if ($('.onlinepay').length == 0) {
              $('#payType').show();
          } else {
              getQrCode();
      				$('.buy-now').hide();
          }
      } else {
          $('.onlinepay').hide();
          if ($('.onlinepay').length == 0) {
              $('#payType').hide();
          }
      }
  }

  function upgrade(check, callback){
  		var check = check == 1 ? 1 : 0;
      var active = $('.morepaytype .active');
      var paytype = active.data('type');
      var id = $('.charge-list.active').data('id');
      $('#paytype').val(paytype);
      $('#id').val(id);
      var data = $('#payform').serialize(),
          action = $('#payform').attr('action');

      $.ajax({
          type: 'POST',
          url: action,
          data: data + '&check='+check,
          dataType: 'jsonp',
          success: function (str) {
              callback(str);
          },
          error: function () {

          }
      })
  }

  // 购买金币-非扫码支付
  $('.recharge-now-popup .buy-now').click(function () {
  	upgrade(0, function(str){
  		if (str.state == 100) {
	        $('#action').val('pay');
	        $('#ordernum').val(str.info);
	        $('#payform').submit();
	    }
  	})
  })

	//获取付款二维码

    function getQrCode() {
    	$('#qrimg').attr('src', templets_skin + 'images/buy-strings-select.png');
      var paytype = $('.morepaytype .active').data('type');
      $('#paytype').val(paytype);
      $('#id').val($('.charge-list.active').data('id'));
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
})










