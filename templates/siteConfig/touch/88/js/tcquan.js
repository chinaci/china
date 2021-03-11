var huoniao = {
  transTimes: function(timestamp, n){
		update = new Date(timestamp*1000);//时间戳要乘1000
		year   = update.getFullYear();
		month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
		day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
		hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
		minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
		second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
		if(n == 1){
			return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
		}else if(n == 2){
			return (year+'-'+month+'-'+day);
		}else if(n == 3){
			return (month+'-'+day);
		}else{
			return 0;
		}
	}
}


function returnHumanTime(t,type) {
    var n = new Date().getTime();
    var c = n - t;
    var str = '';
    if(c < 3600) {
        str = parseInt(c / 60) + '分钟前';
    } else if(c < 86400) {
        str = parseInt(c / 3600) + '小时前';
    } else if(c < 604800) {
        str = parseInt(c / 86400) + '天前';
    } else {
        str = huoniao.transTimes(t,type);
    }
    return str;
}

$(function(){

  var swiper1 = $('#swiper-container1');
  var navHeight = swiper1.offset().top;
  var loadMoreLock = true;

  var device = navigator.userAgent;
  // 判断设备类型，ios全屏
  if (device.indexOf('huoniao_iOS') > -1) {
    $('.header').addClass('padTop20');
  }

  // 幻灯片
  new Swiper('#slider', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

  var mySwiper1 = new Swiper('#swiper-container1', {
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		slidesPerView: 7,
		onTap: function() {
			mySwiper2.slideTo(mySwiper1.clickedIndex)
		}
	})

	var isLoadVideoArr = [];
	var mySwiper2 = new Swiper('#swiper-container2', {
		speed:500,
		autoHeight: true,
		freeModeMomentumBounce: false,
    spaceBetween: 30,
    touchAngle : 40,
		onSlideChangeStart: function() {
			loadMoreLock = false;
			updateNavPosition();
      if (swiper1.hasClass('fixed')) {
        $(window).scrollTop(navHeight + 1);
      }

      // slide高度
      $("#swiper-container2 .swiper-slide").eq(mySwiper2.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());

      // 当模块的数据为空的时候加载数据
			if($.trim($("#swiper-container2 .swiper-slide").eq(mySwiper2.activeIndex).find(".content-slide").html()) == ""){
				$("#swiper-container2 .swiper-slide").eq(mySwiper2.activeIndex).find('.content-slide').html('<div class="loading"><i class="icon-loading"></i>加载中...</div>')
				getList();
			}

		}

	})

	function updateNavPosition() {
		$('#swiper-container1 .active-nav').removeClass('active-nav')
		var activeNav = $('#swiper-container1 .swiper-slide').eq(mySwiper2.activeIndex).addClass('active-nav');

		if (!activeNav.hasClass('swiper-slide-visible')) {
			if (activeNav.index() >= mySwiper1.activeIndex) {
				var thumbsPerNav = Math.floor(mySwiper1.width / activeNav.width()) - 2;
				mySwiper1.slideTo(activeNav.index() - thumbsPerNav);
			} else {
				mySwiper1.slideTo(activeNav.index());
			}
		}
	}

	var tabIndex = $('#swiper-container1 .active-nav').index();
	mySwiper1.slideTo(tabIndex, 0, false);
	mySwiper2.slideTo(tabIndex, 0, false);

  // 导航吸顶
	$(window).on("scroll", function(){
		var sct = $(window).scrollTop();
		if ($(window).scrollTop() > navHeight) {
			$('#swiper-container1').addClass('fixed');
      if (device.indexOf('huoniao_iOS') > -1) {
				$('#swiper-container1, .navblank').addClass('padTop20');
			}
		}else {
      $('#swiper-container1').removeClass('fixed padTop20');
      $('.navblank').removeClass('padTop20');
			$('.gotop').hide();
		}

		if(sct + $(window).height() + 50 > $(document).height() && !loadMoreLock) {
      var page = parseInt($('#swiper-container1 .active-nav').attr('data-page')),
        totalPage = parseInt($('#swiper-container1 .active-nav').attr('data-totalPage'));
      if(page < totalPage) {
				++page;
				$('#swiper-container1 .active-nav').attr('data-page', page);
				getList();
      }
    }
	});


	// 上滑下滑导航隐藏
	var upflag = 1, downflag = 1, fixFooter = $(".fixFooter, #swiper-container1");
	//scroll滑动,上滑和下滑只执行一次！
	scrollDirect(function (direction) {
		var dom = $('#swiper-container1').hasClass('fixed');
		if (direction == "down" && dom) {
			if (downflag) {
				fixFooter.hide();
				$('.gotop').hide();
				downflag = 0;
				upflag = 1;
			}
		}
		if (direction == "up") {
			if (upflag) {
				fixFooter.show();
				$('.gotop').show();
				downflag = 1;
				upflag = 0;
			}
		}
	});

	// 回到顶部
	$('.gotop').click(function(){
		$(window).scrollTop(navHeight);
	})

  var tiebaId;
  // 点击打赏
  $('body').delegate('.shangbtn', 'click', function(){
   var t = $(this);
   tiebaId = t.closest('.item').attr('data-id');
   if(t.hasClass("disabled") || t.hasClass("load")) return;

   t.addClass("load");
   //验证帖子状态
   $.ajax({
     "url": masterDomain + "/include/ajax.php?service=tieba&action=checkRewardState",
     "data": {"aid": tiebaId},
     "dataType": "jsonp",
     success: function(data){
       t.removeClass("load");
       if(data && data.state == 100){
         $(".reword-sure").removeClass("disabled");
         $('.rewardBox, .mask').addClass('show');
         $('.rewardBox').bind('touchmove', function(e){e.preventDefault();});
         $('.reward-a').show();
         $('.reward-inp').hide();

         amount = parseFloat($('.reward-box a.active em').text());

       }else{
         alert(data.info);
       }
     },
     error: function(){
       t.removeClass("load");
       alert("网络错误，操作失败，请稍候重试！");
     }
    });
  });

  // 选择打赏金额
	$('.reward-box a').click(function(){
    var t = $(this), account = t.find('em');
    t.addClass('active').siblings('a').removeClass('active');
    amount = parseFloat(account.text());
	}).eq(0).click();

	// 选择其他金额
	$('.reword-other').click(function(){
    amount = 0;
		$('.reward-a').hide();
		$('.reward-inp').show();
    if($("#reward").val() == ''){
      $(".reword-sure").addClass("disabled");
    }
	})

	// 输入打赏金额
	$('.reward-inp input').bind('input propertychange', function(){
		var reward = $('#reward').val();
    amount = reward;
		if (reward != "") {
			$('.reword-sure').removeClass('disabled');
		}else {
			$('.reword-sure').addClass('disabled');
		}
	})

  // 确认打赏
  $('.reword-sure').click(function(){
    var t = $(this);

    var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
    var re = new RegExp(regu);
    if (!re.test(amount)) {
      amount = 0;
      alert("打赏金额格式错误，最少0.01元！");
      return false;
    }

    hideReward(1);

    //如果不在客户端中访问，根据设备类型删除不支持的支付方式
    if(appInfo.device == ""){
      // 赏
      if(navigator.userAgent.toLowerCase().match(/micromessenger/)){
        $("#shangAlipay, #shangGlobalAlipay").remove();
      }
      // else{
      //   $("#shangWxpay").remove();
      // }
    }
    $(".paybox li:eq(0)").addClass("on");

    $('.paybox').addClass('show').animate({"bottom":"0"},300);

  })

  $('.paybox li').click(function(){
    $(this).addClass('on').siblings('li').removeClass('on');
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

        location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid="+tiebaId+"&amount="+amount+"&paytype="+paytype;

    }else{
        location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid="+tiebaId+"&amount="+amount+"&paytype="+paytype+"&app=1";
    }


  });

  // 关闭打赏
  $('.rewardBox .close').click(function(){
    hideReward();
  })

  $('.mask').click(function(){
    hideReward();
    $('.jubao').hide();
    $('.mask').removeClass('show');
  })

  //收藏
  $(".info").delegate(".zan", "click", function(){
    var t = $(this), type = "add", oper = "+1", txt = "已收藏", id = t.closest('.item').attr('data-id');

    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      huoniao.login();
      return false;
    }

    if(!t.hasClass("curr")){
      t.addClass("curr");
    }else{
      type = "del";
      t.removeClass("curr");
      oper = "-1";
      txt = "收藏";
    }

    var $i = $("<b>").text(oper);
    var x = t.offset().left, y = t.offset().top;
    $i.css({top: y - 10, left: x + 17, position: "absolute", "z-index": "10000", color: "#23b8f6"});
    $("body").append($i);
    $i.animate({top: y - 50, opacity: 0, "font-size": ".3rem"}, 800, function(){
      $i.remove();
    });

    t.text(txt);

    $.post("/include/ajax.php?service=member&action=collect&module=info&temp=detail&type="+type+"&id="+id);

  });

  // 举报
  var module = "", action = "", id = 0;
  $('.container').delegate('.report', 'click', function(){
    module = $(this).closest('.content-slide').data('module');
    action = $(this).closest('.content-slide').data('action');
    id = $(this).closest('.item').attr('data-id');
    if(module == "" || action == "" || id == ""){
      showErr('此信息不可以举报！');
      return false;
    }
    $('.jubao').show();
    $('.mask').addClass('show');
  })

  // 关闭举报
  $('.jubao .close').click(function(){
    $('.jubao').hide();
    $('.mask').removeClass('show');
  })


  // 选择举报类型
  $('.jubao .select li').click(function(){
    var t = $(this), dom = t.hasClass('active');
    t.siblings('li').removeClass('active');
    if (dom) {
      t.removeClass('active');
    }else {
      t.addClass('active');
    }
  })

  // 举报提交
  $('.jubao .submit').click(function(){
    if ($('.jubao .select .active').length < 1) {
      showErr('请选择举报类型');
    }else if ($('#jubaoTel').val() == "") {
      showErr('请填写联系方式');
    }else {

      var type = $('.jubao .select .active').text();
      var desc = $('.jubao .remark textarea').val();
      var phone = $('#jubaoTel').val();

      if(module == "" || action == "" || id == 0){
        showErr('信息传输失败！');
        setTimeout(function(){
          $('.jubao').hide();
          $('.mask').removeClass('show');
        }, 1000);
        return false;
      }

      $.ajax({
        url: masterDomain+"/index.php",
        data: "service=member&template=complain&module="+module+"&dopost="+action+"&aid="+id+"&type="+encodeURIComponent(type)+"&desc="+encodeURIComponent(desc)+"&phone="+encodeURIComponent(phone),
        type: "POST",
        dataType: "json",
        success: function(data){
          if (data && data.state == 100) {
            showErr('举报成功，我们将尽快处理！');
            setTimeout(function(){
              $('.jubao').hide();
              $('.mask').removeClass('show');
            }, 1500);

          }
        },
        error: function(){
          showErr('网络错误，举报失败！');
        }
      });

    }
  })

  // 显示错误
  function showErr(txt){
    $('.error').text(txt).show();
    setTimeout(function(){
      $('.error').hide();
    }, 1000)
  }

  // 关闭打赏
  function hideReward(has){
		$('.reward-a').show();
		$('.reward-inp input').val("");
    $('.reword-sure').addClass('disabled');
    $('.rewardBox, .paybox').removeClass('show');
    if(!has){
  		$('.mask').removeClass('show');
    }
		$('.rewardBox').unbind('touchmove');
	}

  getList();

  // 异步获取列表
  function getList(){
    var active = $('#swiper-container1 .active-nav'), action = active.attr('data-action'), url;
    var page = active.attr('data-page');

    if (action == "info") {
      url = masterDomain + "/include/ajax.php?service=info&action=ilist&page=" + page + "&pageSize=10";
    }else if (action == "house") {
      url = masterDomain + "/include/ajax.php?service=house&action=saleList&page=" + page + "&pageSize=10";
    }else if (action == "tuan") {
      url = masterDomain + "/include/ajax.php?service=tuan&action=tlist&page=" + page + "&pageSize=10";
    }else if (action == "huodong") {
      url = masterDomain + "/include/ajax.php?service=huodong&action=hlist&page=" + page + "&pageSize=10";
    }else if (action == "tieba") {
      url = masterDomain + "/include/ajax.php?service=tieba&action=tlist&page=" + page + "&pageSize=10";
    }else if (action == "live") {
      // url = masterDomain + "/include/ajax.php?service=info&action=ilist&page=" + page + "&pageSize=10";
    }else if (action == "dating") {
      url = masterDomain + "/include/ajax.php?service=dating&action=memberList&page=" + page + "&pageSize=10";
    }else if (action == "renovation") {
      url = masterDomain + "/include/ajax.php?service=renovation&action=team&page=" + page + "&pageSize=10";
    }else if (action == "job") {
      url = masterDomain + "/include/ajax.php?service=job&action=post&page=" + page + "&pageSize=10";
    }else {
      // url = masterDomain + "/include/ajax.php?service=marry&action=jlist&page=" + page + "&pageSize=10";
    }


		loadMoreLock = true;

    $.ajax({
      url: url,
      type: "GET",
      dataType: "jsonp",
      success: function(data){
        if (data && data.state != 200) {
          if (data.state == 101) {
            $('.loading, .loadmore').remove();
            $('#swiper-container2 .swiper-slide-active').append('<div class="loadmore">已加载全部数据</div>');
          }else {
            $('#swiper-container2 .swiper-slide-active').append('<div class="loadmore">加载中...</div>')
            var list = data.info.list, houseHtml = [], huodongHtml = [], tuanHtml = [], tiebaHtml = [],
                videoHtml = [], liveHtml = [], infoHtml = [], datingHtml = [], renovationHtml = [], jobHtml = [];
            var totalPage = data.info.pageInfo.totalPage;
						active.attr('data-totalPage', totalPage);
            for (var i = 0; i < list.length; i++) {
              var lr = list[i];
              // 二手模块
              if (action == "info") {
                var member = lr.member;
                infoComUrlR = infoComUrl.replace('%id%', lr.id);

                infoHtml.push('<div class="item" data-id="'+lr.id+'">');
                infoHtml.push('<a href="' + lr.url + '" class="item-a">');
                infoHtml.push('<div class="user-box fn-clear">');
                if (member.photo == null) {
                  infoHtml.push('<div class="user-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                }else {
                  infoHtml.push('<div class="user-img"><img src="' + member.photo + '"></div>');
                }
                infoHtml.push('<div class="user-txt">');
                if (member.nickname) {
                  infoHtml.push('<p class="user-name fn-clear"><span>'+member.nickname+'</span><em class="ding">顶</em></p>');
                }else {
                  infoHtml.push('<p class="user-name fn-clear"><span>匿名</span><em class="ding">顶</em></p>');
                }
                infoHtml.push('<p class="user-tag"><span>'+lr.address+'</span></p>');
                infoHtml.push('<span class="user-type">'+lr.typename+'</span>');
                infoHtml.push('</div>');
                infoHtml.push('</div>');
                infoHtml.push('<p class="con">'+lr.desc+'</p>');
                if (lr.litpic != "" && lr.litpic != undefined) {
                  infoHtml.push('<div class="imgbox fn-clear">');
                  infoHtml.push('<img src="'+lr.litpic+'" alt="">');
                  infoHtml.push('</div>');
                }
                infoHtml.push('</a>');
                infoHtml.push('<div class="fn-clear item-span"><em class="fn-left">' + returnHumanTime(list[i].pubdate,1) + '</em><a href="'+infoComUrlR+'"><span class="comment">'+lr.common+'</span></a>');
                if (lr.collect) {
                  infoHtml.push('<span class="zan curr">已收藏</span>');
                }else {
                  infoHtml.push('<span class="zan">收藏</span>');
                }
                infoHtml.push('<span class="report">举报</span>');
                infoHtml.push('</div></div>');

              // 房产列表
              }else if (action == "house") {
                var flags = lr.flags;
                houseHtml.push('<div class="item" data-id="'+lr.id+'">');
                houseHtml.push('<a href="' + lr.url + '" class="item-a">');
                houseHtml.push('<div class="user-box fn-clear">');
                houseHtml.push('<div class="user-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                houseHtml.push('<div class="user-txt">');
                houseHtml.push('<p class="user-name fn-clear"><span>匿名</span><em class="ding">顶</em></p>');
                houseHtml.push('<p class="user-tag">');
                for (var j = 0; j < flags.length; j++) {
                  houseHtml.push('<span>'+flags[j]+'</span>');
                }
                houseHtml.push('</p>');
                houseHtml.push('<span class="user-type">'+lr.protype+'</span>');
                houseHtml.push('</div>');
                houseHtml.push('</div>');
                houseHtml.push('<p class="con">'+lr.title+'</p>');
                if (lr.litpic != "" && lr.litpic != undefined) {
                  houseHtml.push('<div class="imgbox fn-clear">');
                  houseHtml.push('<img src="'+lr.litpic+'" alt="">');
                  houseHtml.push('</div>');
                }
                houseHtml.push('</a>');
                houseHtml.push('<div class="fn-clear item-span"><em class="fn-left">' + returnHumanTime(list[i].pubdate,1) + '</em>');
                houseHtml.push('<span class="report">举报</span>');
                houseHtml.push('</div></div>');

              // 团购列表
            }else if (action == "tuan") {
                var store = lr.store, member = lr.store.member, flag = lr.flag;
                tuanComUrlR = tuanComUrl.replace('%id%', lr.id);
                tuanHtml.push('<div class="item">');
                tuanHtml.push('<a href="' + lr.url + '" class="item-a">');
                tuanHtml.push('<div class="user-box fn-clear">');
                if (member.photo == null) {
                  tuanHtml.push('<div class="user-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                }else {
                  tuanHtml.push('<div class="user-img"><img src="' + member.photo + '"></div>');
                }
                tuanHtml.push('<div class="user-txt">');
                tuanHtml.push('<p class="user-name fn-clear"><span>'+lr.title+'</span><em class="ding">顶</em></p>');
                tuanHtml.push('<p class="user-tag">');
                for (var m = 0; m < 3; m++) {
                  var flagtxt;
                  if (flag[m] == 'yexiao') {flagtxt = '夜宵可用'};
                  if (flag[m] == 'yuyue') {flagtxt = '免预约'};
                  if (flag[m] == 'duotaocan') {flagtxt = '多套餐'};
                  if (flag[m] == 'quan') {flagtxt = '代金券'};
                  if (flag[m] == 'dujia') {flagtxt = '独家'};
                  if (flag[m] == 'baozhang') {flagtxt = '保障'};
                  if (flag[m] == 'zhutui') {flagtxt = '主推'};
                  tuanHtml.push('<span>'+flagtxt+'</span>');
                }
                tuanHtml.push('</p>');
                tuanHtml.push('<span class="user-type">'+store.typename+'</span>');
                tuanHtml.push('</div>');
                tuanHtml.push('</div>');
                tuanHtml.push('<p class="con">'+lr.subtitle+'</p>');
                if (lr.litpic != "" && lr.litpic != undefined) {
                  tuanHtml.push('<div class="imgbox fn-clear">');
                  tuanHtml.push('<img src="'+lr.litpic+'" alt="">');
                  tuanHtml.push('</div>');
                }
                tuanHtml.push('</a>');
                tuanHtml.push('<div class="fn-clear item-span"><em class="fn-left">'+lr.store.tel+'</em><a href="'+tuanComUrlR+'"><span class="comment">'+lr.common['count']+'</span></a></div>');
                tuanHtml.push('</div>');

              // 活动列表
              }else if (action == "huodong") {
                var typename = lr.typename;
                huodongHtml.push('<div class="item">');
                huodongHtml.push('<a href="' + lr.url + '" class="item-a">');
                huodongHtml.push('<div class="user-box fn-clear">');
                if (lr.userphoto == null || lr.userphoto == '') {
                  huodongHtml.push('<div class="user-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                }else {
                  huodongHtml.push('<div class="user-img"><img src="' + lr.userphoto + '"></div>');
                }
                huodongHtml.push('<div class="user-txt">');
                if (lr.username) {
                  huodongHtml.push('<p class="user-name fn-clear"><span>'+lr.username+'</span><em class="ding">顶</em></p>');
                }else {
                  huodongHtml.push('<p class="user-name fn-clear"><span>匿名</span><em class="ding">顶</em></p>');
                }

                // 标签
                huodongHtml.push('<p class="user-tag">');
                for (var j = 0; j < typename.length; j++) {
                  huodongHtml.push('<span>'+typename[j]+'</span>');
                }
                huodongHtml.push('</p>');

                if (lr.feetype == '0') {
                  huodongHtml.push('<span class="user-type">免费</span>');
                }else {
                  huodongHtml.push('<span class="user-type">收费</span>');
                }

                huodongHtml.push('</div>');
                huodongHtml.push('</div>');
                huodongHtml.push('<p class="con">'+lr.title+'</p>');
                if (lr.litpic != "" && lr.litpic != undefined) {
                  huodongHtml.push('<div class="imgbox fn-clear">');
                  huodongHtml.push('<img src="'+lr.litpic+'" alt="">');
                  huodongHtml.push('</div>');
                }
                huodongHtml.push('</a>');
                huodongHtml.push('<div class="fn-clear item-span"><em class="fn-left">' + returnHumanTime(list[i].pubdate,1) + '</em><a href="'+lr.url+'"><span class="comment">'+lr.reply+'</span></a></div>');
                huodongHtml.push('</div>');

              // 贴吧列表
              }else if (action == "tieba") {
                var imgGroup = lr.imgGroup, typename = lr.typename;
                tiebaHtml.push('<div class="item" data-id="'+lr.id+'">');
                tiebaHtml.push('<a href="' + lr.url + '" class="item-a">');
                tiebaHtml.push('<div class="user-box fn-clear">');
                if (lr.photo == null) {
                  tiebaHtml.push('<div class="user-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                }else {
                  tiebaHtml.push('<div class="user-img"><img src="' + lr.photo + '"></div>');
                }
                tiebaHtml.push('<div class="user-txt">');
                if (lr.username) {
                  tiebaHtml.push('<p class="user-name fn-clear"><span>'+lr.username+'</span><em class="ding">顶</em></p>');
                }else {
                  tiebaHtml.push('<p class="user-name fn-clear"><span>匿名</span><em class="ding">顶</em></p>');
                }

                // 标签
                tiebaHtml.push('<p class="user-tag">');
                tiebaHtml.push('<span>'+lr.typename[1]+'</span>');
                tiebaHtml.push('</p>');

                tiebaHtml.push('<span class="user-type">'+lr.typename[0]+'</span>');

                tiebaHtml.push('</div>');
                tiebaHtml.push('</div>');
                tiebaHtml.push('<p class="con">'+lr.content+'</p>');

                if (imgGroup != "" && imgGroup != undefined) {
                  tiebaHtml.push('<div class="imgbox fn-clear">');
                  if (imgGroup.length > 4) {
                    tiebaHtml.push('<span class="amount"></span>');
                  }
                  for (var k = 0; k < 4; k++) {
                    tiebaHtml.push('<img src="'+imgGroup[k]+'" alt="">');
                  }
                  tiebaHtml.push('</div>');
                }
                tiebaHtml.push('</a>');
                tiebaHtml.push('<div class="fn-clear item-span"><em class="fn-left">' + returnHumanTime(list[i].pubdate,1) + '</em><a href="'+lr.url+'"><span class="comment">'+lr.reply+'</span></a><span class="shang shangbtn">打赏</span></div>');
                tiebaHtml.push('</div>');

              // 交友列表
              }else if (action == "dating") {

                datingHtml.push('<div class="item">');
                datingHtml.push('<a href="' + lr.url + '" class="item-a">');
                datingHtml.push('<div class="user-box fn-clear">');
                if (lr.photo == null) {
                  datingHtml.push('<div class="user-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                }else {
                  datingHtml.push('<div class="user-img"><img src="' + lr.photo + '"></div>');
                }
                datingHtml.push('<div class="user-txt">');
                if (lr.nickname) {
                  datingHtml.push('<p class="user-name fn-clear"><span>'+lr.nickname+'</span></p>');
                }else {
                  datingHtml.push('<p class="user-name fn-clear"><span>匿名</span></p>');
                }

                // 标签
                datingHtml.push('<p class="user-tag">');
                if (lr.age) {
                  datingHtml.push('<span>'+lr.age+'岁</span>');
                }
                if (lr.educationName) {
									datingHtml.push('<span>'+lr.educationName+'</span>');
								}
                datingHtml.push('</p>');

                if (lr.certifyState == 0) {
                  datingHtml.push('<span class="user-type">未认证</span>');
                }else {
                  datingHtml.push('<span class="user-type">已认证</span>');
                }

                datingHtml.push('</div>');
                datingHtml.push('</div>');
                datingHtml.push('<p class="con">'+lr.profile+'</p>');

                if (lr.photo != "" && lr.photo != undefined) {
                  datingHtml.push('<div class="imgbox fn-clear">');
                  datingHtml.push('<img src="'+lr.photo+'" alt="">');
                  datingHtml.push('</div>');
                }

                datingHtml.push('</a>');
                datingHtml.push('<div class="fn-clear item-span"><em class="fn-left"></em></div>');
                datingHtml.push('</div>');

              // 招聘列表
              }else if (action == "job") {
                var company = lr.company;
                jobHtml.push('<div class="item">');
                jobHtml.push('<a href="' + lr.url + '" class="item-a">');
                jobHtml.push('<div class="user-box fn-clear">');
                if (company.logo == null) {
                  jobHtml.push('<div class="user-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                }else {
                  jobHtml.push('<div class="user-img"><img src="' + company.logo + '"></div>');
                }
                jobHtml.push('<div class="user-txt">');
                if (company.title) {
                  jobHtml.push('<p class="user-name fn-clear"><span>'+company.title+'</span></p>');
                }else {
                  jobHtml.push('<p class="user-name fn-clear"><span>匿名</span></p>');
                }

                // 标签
                jobHtml.push('<p class="user-tag">');
                if (lr.experience) {
                  jobHtml.push('<span>'+lr.experience+'年</span>');
                }
                if (lr.educational) {
									jobHtml.push('<span>'+lr.educational+'</span>');
								}
                jobHtml.push('</p>');

                if (company.nature != "") {
                  jobHtml.push('<span class="user-type">'+company.nature+'</span>');
                }

                jobHtml.push('</div>');
                jobHtml.push('</div>');
                jobHtml.push('<p class="con">'+lr.note+'</p>');

                jobHtml.push('</a>');
                jobHtml.push('<div class="fn-clear item-span"><em class="fn-left">'+lr.timeUpdate+'</em></div>');
                jobHtml.push('</div>');

              }

            }

            $('.loading, .loadmore').remove();
            $('.house').append(houseHtml.join(""));
            $('.tuan').append(tuanHtml.join(""));
            $('.huodong').append(huodongHtml.join(""));
            $('.tieba').append(tiebaHtml.join(""));
            $('.dating').append(datingHtml.join(""));
            $('.job').append(jobHtml.join(""));
            $('.info').append(infoHtml.join(""));

            if(data.info.pageInfo.totalPage == page){
              $('#swiper-container2 .swiper-slide-active').append('<div class="loadend">已加载全部数据</div>');
            }

          }
        }
				loadMoreLock = false;

      }
    })



  }


})

var	scrollDirect = function (fn) {
  var beforeScrollTop = document.body.scrollTop;
  fn = fn || function () {
  };
  window.addEventListener("scroll", function (event) {
      event = event || window.event;

      var afterScrollTop = document.body.scrollTop;
      delta = afterScrollTop - beforeScrollTop;
      beforeScrollTop = afterScrollTop;

      var scrollTop = $(this).scrollTop();
      var scrollHeight = $(document).height();
      var windowHeight = $(this).height();
      if (scrollTop + windowHeight > scrollHeight - 10) {
          return;
      }
      if (afterScrollTop < 10 || afterScrollTop > $(document.body).height - 10) {
          fn('up');
      } else {
          if (Math.abs(delta) < 10) {
              return false;
          }
          fn(delta > 0 ? "down" : "up");
      }
  }, false);
}
