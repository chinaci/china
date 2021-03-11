$(function(){
    /*调起大图 S*/
    $.fn.bigImage({
        artMainCon:".shop_detail",  //图片所在的列表标签
    });

  var mask = $('.mask'), footBox = $('.footBox');

  $('.shop-tab li').click(function(){
		var index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.shop-con .shop-box').eq(index).removeClass('fn-hide').siblings().addClass('fn-hide');
	})

  // 兑换弹出层
  $('.want').click(function(){
    if($(this).hasClass('disabled')){
      alert('抱歉，产品库存不足');
      return;
    }
    mask.addClass('show');
    footBox.addClass('show').animate({"bottom":"0"},300);
  })

  // 遮罩层
  mask.on('click',function(){
    mask.removeClass('show');
    footBox.animate({"bottom":"-100%"},300);
    setTimeout(function(){
      footBox.removeClass('show');
    }, 300);
      $('body').unbind('touchmove')
  })

  // 兑换数量 加
  $('.add').click(function(){
    var count = $('.count'), num = parseInt(count.text()), inventory = parseInt(count.attr('data-inventory'));
    if($(this).hasClass('disabled')){
      alert('已达到库存数量');
      return;
    }
    if(num < inventory){
      count.text(num+1);
    }
    if(num + 1 == inventory){
      $(this).addClass('disabled');
    }
  })

  // 兑换数量 减
  $('.reduce').click(function(){
    var count = $('.count'), num = parseInt(count.text());
    if (num > 1) {
      count.text(num-1);
    }
    $('.add').removeClass('disabled');
  })

  // 礼品折扣
  $('.checkbox').click(function(){
    var t = $(this);
    if (t.hasClass('active')) {
      t.removeClass('active');
    }else {
      t.addClass('active');
    }
  })

  // 兑换方式
  $('.radio a').click(function(){
    if($(this).hasClass('disabled')){
      return;
    }
    $(this).addClass('active').siblings('a').removeClass('active');
  })

  // 兑换
  $('.sureBtn').click(function(){
    var t = $(this);
    if(t.hasClass('disabled')) return;

    var userid = $.cookie(cookiePre+'login_user');
    if(userid == undefined || userid == null || userid == ''){
      location.href = '/login.html';
      return;
    }

    var count = parseInt($('.count').text());

    // 如果使用全积分，判断用户积分
    var totalPoint = detail.price * pointRatio * count;
    var paytype = $('.radio a.active').attr('data-type');
    if(paytype = 'point'){
      if(userPoint < totalPoint){
        alert('您的积分不足，请先充值');
        return;
      }
    }

    t.attr('href', confirmUrl.replace('#count', count).replace('#paytype', paytype));


  })

  // 评价图片点击放大
	initPhotoSwipeFromDOM('.my-gallery');

})
