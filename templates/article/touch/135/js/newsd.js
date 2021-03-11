$(function(){

    //放大图片
    $.fn.bigImage({
        artMainCon:".img_box",  //图片所在的列表标签
    });

    $('img').scrollLoading();

    // 关注
    $('.btn_care').click(function() {
      var userid = $.cookie(cookiePre+"login_user");
      if(userid == null || userid == ""){
        window.location.href = masterDomain+'/login.html';
        return false;
      }
      var t=$(this),type=t.hasClass('cared') ? "del" : "add";
    
      if(type=="del"){
        t.removeClass('cared');
        t.html('<s></s>关注');
      }else{
        t.addClass('cared');
        t.html('<s></s>已关注');
      }

      var mediaid = t.attr("data-id");

      $.post("/include/ajax.php?service=member&action=followMember&for=media&id="+mediaid);

    });

    // 赞
    $('.btnUp').on('click',function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          window.location.href = masterDomain+'/login.html';
          return false;
        }
        
        var t = $(this), id = t.attr("data-id");
        // if(t.hasClass("active")) return false;
        var num = t.find('em').html();
        if( typeof(num) == 'object') {
          num = 0;
        }
        var type = 'add';
        if(t.hasClass("active")){
            type = 'del';
            num--;
        }else{
            num++;
        }

        $.ajax({
          url: "/include/ajax.php?service=member&action=dingComment&id="+id+ "&type=" + type,
          type: "GET",
          dataType: "json",
          success: function (data) {
            if(data.state==100){
              if(t.hasClass("active")){
                  t.removeClass('active');
              }else{
                  t.addClass('active');
              }
              t.find('em').html(num);
          }else{
              alert(data.info);
              t.removeClass('active');
          }
          }
        });
    })

  //   /*调起大图 S*/
  //  var mySwiper = new Swiper('.bigSwiper', {pagination: {el:'.bigPagination',type: 'fraction',},loop: false})
  //   $(".artMainCon").delegate('img', 'click', function() {
  //       var imgBox = $(this).closest('.artMainCon').find('img');
  //       console.log(imgBox.length)
  //       var i = $(imgBox).index(this);
  //       console.log(i)
  //       $(".bigBoxShow .swiper-wrapper").html("");
  //       for(var j = 0 ,c = imgBox.length; j < c ;j++){
  //        $(".bigBoxShow .swiper-wrapper").append('<div class="swiper-slide"><div class="swiper-img"><img src="' + imgBox.eq(j).attr("src") + '" / ></div></div>');
  //       }
  //       mySwiper.update();
  //       $(".bigBoxShow").css({
  //           "z-index": 999999,
  //           "opacity": "1"
  //       });
  //       mySwiper.slideTo(i, 0, false);
  //        console.log(i)
  //       return false;
  //   });
  //
  //   $(".bigBoxShow").delegate('.vClose', 'click', function() {
  //       $(this).closest('.bigBoxShow').css({
  //           "z-index": "-1",
  //           "opacity": "0"
  //       });
  //
  //   });
  // /*调起大图 E*/



    var dashangElse = false;
  	$('.rewardbox').click(function(){
  		var t = $(this);
        if(t.hasClass("loading")) return;
    		t.addClass("loading");

        //验证文章状态
    		$.ajax({
    			"url": masterDomain + "/include/ajax.php?service=article&action=checkRewardState",
    			"data": {"aid": newsid},
    			"dataType": "jsonp",
    			success: function(data){
    				t.removeClass("loading");
    				if(data && data.state == 100){

                        $('.mask').show();
                        $('.shang-box').show();
                		$('.shang-item-cash').show();$('.shang-item .inp').show();
                		$('.shang-item .shang-else').hide();
                		$('body').bind('touchmove',function(e){e.preventDefault();});

    				}else{
    					alert(data.info);
    				}
    			},
    			error: function(){
    				t.removeClass("loading");
    				alert("网络错误，操作失败，请稍候重试！");
    			}
    		});
  	})

  	// 其他金额
  	$('.shang-item .inp').click(function(){
  	  $('.shang-item-cash').hide();
      $(this).hide();
  	  $('.shang-item .shang-else').show();
      dashangElse = true;
      $(".shang-else input").focus();
  	})

  	// 遮罩层
  	$('.mask').on('click',function(){
      $('.mask').hide();
      $('.shang-box').hide();
      $('.paybox').animate({"bottom":"-100%"},300)
      setTimeout(function(){
        $('.paybox').removeClass('show');
      }, 300);
  	    $('body').unbind('touchmove')
  	})

  	// 关闭打赏
  	$('.shang-money .close').click(function(){
  		$('.mask').hide();$('.shang-box').hide();
  		$('body').unbind('touchmove')
  	})

    // 选择打赏支付方式
    var amount = 0;
    $('.shang-btn').click(function(){
        amount = dashangElse ? parseFloat($(".shang-item input").val()) : parseFloat($(".shang-item-cash em").text());
        var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
        var re = new RegExp(regu);
        if (!re.test(amount)) {
            amount = 0;
            alert("打赏金额格式错误，最少0.01元！");
            return false;
        }

        var app = device.indexOf('huoniao') >= 0 ? 1 : 0;
        location.href = masterDomain + "/include/ajax.php?service=article&action=reward&aid="+newsid+"&amount="+amount+"&app="+app;

        return;

        $('.shang-box').animate({"opacity":"0"},300);
        setTimeout(function(){
          $('.shang-box').hide();
        }, 300);

        //如果不在客户端中访问，根据设备类型删除不支持的支付方式
        if(appInfo.device == ""){
          // 赏
          if(navigator.userAgent.toLowerCase().match(/micromessenger/)){
        		$("#shangAlipay, #shangGlobalAlipay").remove();
        	}
          // else{
        	// 	$("#shangWxpay").remove();
        	// }
        }
        $(".paybox li:eq(0)").addClass("on");

        $('.paybox').addClass('show').animate({"bottom":"0"},300);
    })

    $('.paybox li').click(function(){
      var t = $(this);
      t.addClass('on').siblings('li').removeClass('on');
    })

    //提交支付
    $("#dashang").bind("click", function(){

        var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
        var re = new RegExp(regu);
        if (!re.test(amount)) {
            amount = 0;
            alert("打赏金额格式错误，最少0.01元！");
            return false;
        }

        var paytype = $(".paybox .on").data("id");
        if(paytype == "" || paytype == undefined){
            alert("请选择支付方式！");
            return false;
        }

        //非客户端下验证支付类型
        if(appInfo.device == ""){

        		if (paytype == "alipay" && navigator.userAgent.toLowerCase().match(/micromessenger/)) {
        			showErr("微信浏览器暂不支持支付宝付款<br />请使用其他浏览器！");
        			return false;
      		  }

            location.href = masterDomain + "/include/ajax.php?service=article&action=reward&aid="+newsid+"&amount="+amount+"&paytype="+paytype;
        }else{
            location.href = masterDomain + "/include/ajax.php?service=article&action=reward&aid="+newsid+"&amount="+amount+"&paytype="+paytype+"&app=1";
        }


    });

    // 返回顶部
    var windowTop=0;
    $(window).on("scroll", function(){
        var scrolls = $(window).scrollTop();//获取当前可视区域距离页面顶端的距离
        if(scrolls>=windowTop){//当B>A时，表示页面在向上滑动
            //需要执行的操作
            windowTop=scrolls;
            $('.nfooter').hide();

        }else{//当B<a 表示手势往下滑动
            //需要执行的操作
            windowTop=scrolls;
            $('.nfooter').show();
        }
    });

})



//单点登录执行脚本
function ssoLogin(info){


	//已登录
	if(info){
    $(".nav .login").html('<img onerror="javascript:this.src=\'/static/images/noPhoto_40.jpg\';"src="'+info['photo']+'">').removeClass().addClass("user");
    $(".user_info .fl a").html('<img onerror="javascript:this.src=\'/static/images/noPhoto_40.jpg\';"src="'+info['photo']+'">'+info['nickname']);

    $.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
    $(".nav .user").html('').removeClass().addClass("login");
    $.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});
	}

}