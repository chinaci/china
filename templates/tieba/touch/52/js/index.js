$(function(){

	//客户端发帖
	setupWebViewJavascriptBridge(function(bridge) {
		$(".fabu-btn").bind("click", function(event){
			if (device.indexOf('huoniao_Android') > -1) {
				event.preventDefault();
				var userid = $.cookie(cookiePre+"login_user");
				if(userid == null || userid == ""){
					location.href = masterDomain + "/login.html";
					return false;
				}
				bridge.callHandler("postTieba", {}, function(responseData) {});
			}
		});
	});

	// 签到
	// $('.sign_btn').click(function(){
	// 	if (!$(this).hasClass('disabled')) {
	// 		$(this).addClass('disabled');
	// 		$(this).text('已签到');
	// 		$('.sign_box').show();
	// 		setTimeout(function(){
	// 			$('.sign_box').hide();
	// 		}, 2000)
	// 	}
	// })

	// 选择帖子类型
	$('.typebox li').click(function(){
		var t = $(this);
		t.addClass('active').siblings('li').removeClass('active');
	})

	// 选择帖子板块
	$('.mode-type li').click(function(){
		var t = $(this);
		t.addClass('active').siblings('li').removeClass('active');
		typeid = t.data('id');
		atpage = 1;
		getList();
	})

	// 点击打赏
	$('.list').delegate('.shang', 'click', function(){
		$('.reward, .mask').addClass('show');
		$('.reward').bind('touchmove', function(e){e.preventDefault();});
	})

	var id;
	// 点击打赏
	$('.list').delegate('.shang', 'click', function(){
    var t = $(this);
    id = t.closest('.item').attr('data-id');
    if(t.hasClass("disabled") || t.hasClass("load")) return;

    t.addClass("load");
    //验证帖子状态
    $.ajax({
      "url": masterDomain + "/include/ajax.php?service=tieba&action=checkRewardState",
      "data": {"aid": id},
      "dataType": "jsonp",
      success: function(data){
        t.removeClass("load");
        if(data && data.state == 100){
          $(".reword-sure").removeClass("disabled");
          $('.reward, .mask').addClass('show');
          $('.reward').bind('touchmove', function(e){e.preventDefault();});
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


	})

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

      location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid="+id+"&amount="+amount+"&paytype="+paytype;

    }else{
      location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid="+id+"&amount="+amount+"&paytype="+paytype+"&app=1";
    }

  });

	// 关闭打赏
	$('.reward .close').click(function(){
		hideReward();
	})

	// 点击遮罩层
	$('.mask').click(function(){
		hideReward();
	}).bind('touchmove', function(){
		hideReward();
	})

	// 关闭打赏
  function hideReward(has){
		$('.reward-a').show();
		$('.reward-inp input').val("");
    $('.reword-sure').addClass('disabled');
    $('.reward, .paybox').removeClass('show');
    if(!has){
  		$('.mask').removeClass('show');
    }
		$('.reward').unbind('touchmove');
	}

	function hideMore(){
		$('.more-box, .mask').removeClass('show');
		$('.more-box').unbind('touchmove');
	}

	// 收藏
	$('.collect').click(function(){
		var t = $(this), id = t.closest('.item').attr('data-id');
		if (t.hasClass('active')) {
			t.removeClass('active');
			t.find('em').text('收藏');
		}else {
			t.addClass('active');
			t.find('em').text('已收藏');
		}
	})

	// 点赞
	$('.list').delegate('.zan', 'click', function(){
		var t = $(this), text = t.text();
		if (!t.hasClass('active')) {t.hasClass()}
	})

	// 显示错误
  function showErr(txt){
    $('.error').text(txt).show();
    setTimeout(function(){
      $('.error').hide();
    }, 1000)
  }

	function transTimes(timestamp, n){
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
		}else if(n == 4){
			return (hour+':'+minute);
		}else{
			return 0;
		}
	}


	//加载帖子列表
	var hallList = $(".list"), atpage = 1, pageSize = 20, listArr = [], totalPage = 0, isload = false;
	function getList(){
		isload = true;
		if(atpage == 1){
			hallList.html('');
			totalPage = 0;
		}

		hallList.find(".loading, .empty").remove();
		hallList.append('<div class="loading"><i></i>加载中...</div>');

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=tieba&action=tlist",
			data: {
				"typeid": typeid,
				"page": atpage,
				"pageSize": pageSize
			},
			dataType: "jsonp",
			success: function (data) {
				hallList.find(".loading").remove();
				if(data){
					if(data.state == 100){
						var list = data.info.list, pageInfo = data.info.pageInfo, li = [];
						for (var i = 0, lr, cla; i < list.length; i++) {
							lr = list[i];
	            var photo = lr.photo == "" ? staticPath+'images/noPhoto_100.jpg' : lr.photo;

							var style = [];

							//颜色
							if(lr.color != ""){
								style.push('color:'+lr.color+';');
							}

							//加粗
							if(lr.bold != ""){
								style.push('font-weight:700;');
							}

							li.push('<div class="item item-'+lr.id+'" data-id="'+lr.id+'"><a href="'+lr.url+'" class="item-a">');
							li.push('<dl class="fn-clear">');
							li.push('<dt class="fn-left"><img src="'+photo+'" alt=""></dt>');
							li.push('<dd>');
							li.push('<p class="name fn-clear"><em>'+lr.username+'</em><span class="biaoqian">'+lr.typename[0]+'</span></p>');
							li.push('<p class="addr">来自  '+lr.ipAddress+'</p>');
							li.push('<p class="title fn-clear">');
							li.push('<span class="fn-left" style="'+style.join(" ")+'">'+lr.title+'</span>');

							if(lr.top == "1"){
								li.push('<i class="ding">顶</i>');
							}
							if(lr.jinghua == "1"){
								li.push('<i class="jing">精</i>');
							}
							li.push('</p>');

							li.push('<p class="content">'+lr.content+'</p>');

							//图集
							if(lr.imgGroup){
								li.push('<div class="imgbox fn-clear">');
								if(lr.imgGroup.length > 3){
									// li.push('<span class="total">共 '+lr.imgGroup.length+' 张</span>');
								}
								for(var g = 0; g < lr.imgGroup.length; g++){
									if(g < 4){
										li.push('<img src="'+lr.imgGroup[g]+'">');
									}
								}
								li.push('</div>');
							}

							li.push('</dd>');
							li.push('</dl>');
							li.push('</a>');
							li.push('<div class="operate fn-clear">');
							li.push('<a href="javascript:;" class="time">'+transTimes(lr.pubdate, 4)+'</a>');
							li.push('<a href="javascript:;" class="more HN_PublicShare">更多</a>');
							li.push('<a href="javascript:;" class="comment">'+lr.reply+'</a>');
							li.push('<a href="javascript:;" class="shang">打赏</a>');
							li.push('</div>');
							li.push('</div>');

							if (lr.reply != 0) {
								getComment(lr.id, lr.url);
							}

						}

						hallList.append(li.join(""));
						// baiduShare();

					}else{

						if(atpage == 1){
							hallList.append('<div class="empty">暂无相关信息！</div>');
						}

					}

					if(pageInfo && atpage >= pageInfo.totalPage){
						isload = true;
						hallList.append('<div class="loading">已加载全部数据！</div>');
					}else{
						isload = false;
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				isload = false;
				hallList.find(".loading").remove();
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
				console.log(textStatus);
			}
		});

	}
	getList();

	//滚动加载
	$(window).on("touchmove", function(){
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - 300;
		if ($(window).scrollTop() > scroll && !isload) {
			atpage++;
			getList();
		};
	});


	var ele, bdTitle, bdAbstract, bdUrl;

	$('.list').delegate('.more', 'click', function(){
		var t = $(this), item = t.closest('.item'), bdTitle = encodeURIComponent(item.find('.title span').text()),
				bdUrl = encodeURIComponent(item.find('.item-a').attr('href'));
		var href = 'http://service.weibo.com/share/share.php?url='+bdUrl+'&title='+bdTitle;
		$('.bds_tsina').attr('href', href);
	})


})

var commentPageSize = 2;
function getComment(id, url) {
	$.ajax({
		url: "/include/ajax.php?service=member&action=getComment&type=tieba-detail&son=1&aid="+id+"&page=1&pageSize="+commentPageSize,
		type: "GET",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){
				var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

				html.push('<div class="discuss">');
				html.push('<a href="'+url+'">');
				for(var i = 0; i < list.length; i++){
					html.push('<p><span>'+list[i].user.nickname+'&nbsp;&nbsp;评论:</span>'+list[i].content+'</p>');
				}
				if (pageInfo.totalCount > 2) {
					html.push('<p class="gray">查看剩余的回复 >></p>');
				}
				html.push('</a>');
				html.push('</div>');

				$('.item-'+id).find('.operate').after(html.join(""));
			}
		}
	});
}
