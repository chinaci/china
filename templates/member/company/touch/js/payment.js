$(function(){

  var reduceyue = $('.reduce-yue');

  // 选择保障金
  $('.select li').click(function(){
    var t = $(this);
    t.addClass('active').siblings('li').removeClass('active');
    $('#amount').val('');
    calculationPayPrice();
  });

  // 自定义金额
  $('#amount').bind('input properchange', function(){
    var val = $(this).val();
    if (val != "") {
      $('.select li').removeClass('active');
      calculationPayPrice();
    }
  });


  //如果不在客户端中访问，根据设备类型删除不支持的支付方式
  setTimeout(function(){
    if(appInfo.device == ""){
        if(navigator.userAgent.toLowerCase().match(/micromessenger/)){
            $("#alipay, #globalalipay").remove();
        }
    }else{
        $("#pay").append('<input type="hidden" name="app" value="1" />');
    }
    $(".pay-list dl:eq(0)").addClass("active");
    calculationPayPrice();
  }, 500);


  //计算总价
  function calculationPayPrice(){
    var selected = $('.select li.active'), length = selected.length;
    var totalPrice = length > 0 ? selected.find('em').text() : $('#amount').val();
    totalPrice = parseFloat(totalPrice);

    if($('.yue-btn').hasClass('active')){
      reduceyue.text(totalBalance > totalPrice ? totalPrice.toFixed(2) : totalBalance.toFixed(2));
      balance = totalBalance > totalPrice ? totalPrice : totalBalance;
      $('.pay-total').html((totalPrice-balance).toFixed(2));

      if(totalPrice-balance <= 0){
        $('#paytypeObj').hide();
        $('.next-btn').html(langData['siteConfig'][19][673]);
      }else{
        $('#paytypeObj').show();
        $('.next-btn').html(langData['siteConfig'][19][665]);
      }
    }else{
      $('#paytypeObj').show();
      $('.pay-total').html(totalPrice.toFixed(2));
      $('.next-btn').html(langData['siteConfig'][19][665]);
    }

    $("#totalPrice").val(totalPrice);
    $("#balance").val($(".yue-btn").hasClass("active") ? 1 : 0);
    $("#paytype").val($(".pay-list .active").attr("id"));

  }

  calculationPayPrice();


  // 选择支付方式
  $('.pay-list dl').click(function(){
    $(this).addClass('active').siblings('dl').removeClass('active');
    $("#paytype").val($(this).attr("id"));
  });

  // 账户余额
  $('.yue-btn').click(function(){
    var t = $(this), yue = t.find('em').text();
    if (t.hasClass('active')) {
      t.removeClass('active');
      reduceyue.text('0.00');
    }else {
      t.addClass('active');
      reduceyue.text(yue);
    }
    calculationPayPrice();
  })

  // 提交
  $('#submit').click(function(){
    var length = $('.select li.active').length;
    var val = $('.select li.active').val() == undefined ? $('#amount').val() : $('.select li.active em').val();
    if (val == "" && length <= 0) {
      showMsg(langData['siteConfig'][20][455]);
    }else if (val != "" && val < 1000) {
      showMsg(langData['siteConfig'][20][456]);
    }else {
      $("#pay").submit();
    }
  })

  // 计算实付款
  function totalMoney(){
    var selected = $('.select li.active'), length = selected.length, reduce = $('.reduce-yue').text();
    var amount = length > 0 ? selected.find('em').text() : $('#amount').val();
    var payTotal = amount - reduce;
    if (payTotal > 0) {
      $('.pay-total').text(payTotal);
    }else {
      $('.pay-total').text('0');
    }
  }

})

// 错误提示
function showMsg(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}
