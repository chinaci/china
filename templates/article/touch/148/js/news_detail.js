$(function(){
	
	// 判断新闻内容里是否有图片
	$('.html2Wrap .artMainCon').find('img').remove();
	
	var device = navigator.userAgent;
	var cookie = $.cookie("HN_float_hide");
//如果不是在客户端，显示下载链接
	if (device.indexOf('huoniao') <= -1 && cookie == null && $('.float-download').size() > 0) {
		
		$('.float-download').show();
	}

	$('.float-download .closesd').click(function(){
		$('.float-download').hide();
		setCookie('HN_float_hide', '1', '1');
	});
	
	function setCookie(name, value, hours) { //设置cookie
     var d = new Date();
     d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
     var expires = "expires=" + d.toUTCString();
     document.cookie = name + "=" + value + "; " + expires;
  }
	
	
	
	//打赏判断
var reward_len = $('#memberlist li').length;
if(reward_len == 0 ){
	$('#memberlist').append('<p style="font-size:.28rem; color:#2b2b2b; line-height:.44rem; margin-left:.24rem; margin-top:.06rem;">觉得内容精彩就打赏一下小编吧~</p>')
}
	
	
	var atpage = 1, isload = 0, pageSize = 5;
 $.fn.bigImage({
        artMainCon:".artMainCon",  //图片所在的列表标签
    });
    $(".artMainCon p > img").each(function(){
        var p = $(this).parent('p');
        if(p.css('text-indent') != 'undefined'){
            p.css('text-indent', 0);
        }
    })
	$('.videoinfo').on('click','.btn_care',function(){
		var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
			return false;
		}
		
		if($(this).hasClass('cared')){
    		$(this).removeClass('cared').html('<s></s>关注');
    	}else{
    		$(this).addClass('cared').html('已关注');
    	}

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+media);
	});

    // 文章点赞
    $('.up_num').click(function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          window.location.href = masterDomain+'/login.html';
          return false;
        }
        var num = parseInt($('.up_num i').text());
        var t = $(this);
        t.hasClass('active') ? num-- : num++;

        $.ajax({
          url: "/include/ajax.php?service=member&action=getZan&module=article&temp=detail&uid="+admin+"&id="+id,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            t.toggleClass('active');
            $('.up_num i').text(num);
          }
        });
    })
	
 // 赞
    $('.btnUp').on('click',function(){
    
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          window.location.href = masterDomain+'/login.html';
          return false;
        }
        
        var t = $(this), id = t.attr("data-id");
        if(t.hasClass("active")) return false;
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
          url: "/include/ajax.php?service=member&action=dingComment&type=add&id="+id,
          type: "GET",
          dataType: "jsonp",
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
    });
    
    //为你推荐
    getList();
    $(window).scroll(function() {
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if ($(window).scrollTop() + 50 > scroll && !isload) {
            atpage++;
			getList()
        };
	});
    
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
    


function getList(tr){
        isload = true;

        if(tr){
            atpage = 1;
            $(".recmbox").html("");
        }

        $(".recmbox").append('<div class="loading"><img src="'+templets_skin+'images/loading.png" alt=""></div>');
        

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);
		data.push("uid="+admin);
		
		var mold = $('.mddetailnav ul .active a').attr('data-id');
		if(mold != undefined && mold != '' && mold != null){
			data.push("mold="+mold);
		}

        $.ajax({
            url: "/include/ajax.php?service=article&action=alist",
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if (data && data.state == 100) {
                    $(".loading").remove();
                    var list = data.info.list, pageInfo = data.info.pageInfo, page = pageInfo.page, html = [];
                    var totalPage = data.info.pageInfo.totalPage;
                    for (var i = 0, lr, d; i < list.length; i++) {
                        lr = d = list[i];
                        var time = returnHumanTime(lr.pubdate,3);
                        var ihot =  lr.flag && lr.flag.indexOf('h') ? '<i class="ihot"></i>' : '';
                        var piccount = lr.group_img == undefined ? 0 : lr.group_img.length;

                        if(lr.mold == 0){
                            // 大图
                            if(d.litpic && d.typeset == 1){
                                html.push('<dd class="libox big_img">');
                                html.push('<a href="'+d.url+'" data-url="' + lr.url + '">');
                                html.push('<h2>' + ihot + lr.title + '</h2>');
                                if(lr.litpic!=''){
                                    html.push('<div class="img_box"><img src="' + lr.litpic + '" alt=""></div>');
                                }
                                html.push('<p class="art_info"><span class="">' + (lr.source?lr.source:"管理员") + ' · '+time+'</span><i>' + returnHumanClick(lr.click) + '</i></p>');
                                html.push('</a>');
                                html.push('</dd>');
                            // 小图或无图
                            }else{
                            	var imgclass  = lr.litpic?"single_img":"no_img";
                                html.push('<dd class="libox '+imgclass+'">');
                                html.push('<a href="'+d.url+'" data-url="' + lr.url + '" class="fn-clear">');
                                if(lr.litpic!=''){
                                    html.push('<div class="_right">');
                                    html.push('<img src="' + lr.litpic + '">');
                                    html.push('</div>');
                                }
                                html.push('<div class="_left">');
                                html.push('<h2>' + ihot + lr.title + '</h2>');
                                //<span class="">' + lr.source + ' · '+time+'</span><i>' + returnHumanClick(lr.click) + '</i>
                                html.push('<p class="art_info"><span class="">' + (lr.source?lr.source:"管理员") + ' · '+time+'</span><i>' + returnHumanClick(lr.click) + '</i></p>');
                                html.push('</div>');
                                html.push('</a>');
                                html.push('</dd>');
                            }
                        }else if(d.mold == 1){
                            if(list[i].group_img && lr.group_img.length >= 3 && lr.group_img.length != undefined){
                                html.push('<dd class="libox more_img">');
                                html.push('<a href="'+d.url+'" data-url="' + lr.url + '">');
                                html.push('<h2>' + ihot + lr.title + '</h2>');
                                html.push('<ul class="pics_box">');
                                var n = 0;
                                for (var g = 0; g < lr.group_img.length; g++) {
                                    var src = huoniao.changeFileSize(lr.group_img[g].path, "small");
                                    if(src && n < 3) {
                                        html.push('<li><img src="'+src+'" onerror=this.src="'+lr.litpic+'" data-url="' + src + '" alt="title"></li>');
                                        n++;
                                        if(n == 3) break;
                                    }
                                }
                                html.push('</ul>');
                                html.push('<p class="art_info"><span class="">' + (lr.source?lr.source:"管理员") + ' · '+time+'</span><i>' + returnHumanClick(lr.click) + '</i></p>');
                                html.push('</a>');
                                html.push('</dd>');
                            }else{
                                html.push('<dd class="libox single_img">');
                                html.push('<a href="'+d.url+'" data-url="' + lr.url + '" class="fn-clear">');
                                if(lr.litpic!=''){
                                    html.push('<div class="_right">');
                                    html.push('<img src="' + lr.litpic + '">');
                                    html.push('</div>');
                                }
                                html.push('<div class="_left">');
                                html.push('<h2>' + ihot + lr.title + '</h2>');
                                //<span class="">' + lr.source + ' · '+time+'</span><i>' + returnHumanClick(lr.click) + '</i>
                                html.push('<p class="art_info"><span class="">' + (lr.source?lr.source:"管理员") + ' · '+time+'</span><i>' + returnHumanClick(lr.click) + '</i></p>');
                                html.push('</div>');
                                html.push('</a>');
                                html.push('</dd>');
                            }
                        }else{
                            html.push('<dd class="libox big_img">');
                            html.push('<a href="'+d.url+'" data-url="' + lr.url + '">');
                            html.push('<h2>' + ihot + lr.title + '</h2>');
                            if(lr.litpic!=''){
                                html.push('<div class="img_box"><img src="' + lr.litpic + '" alt=""></div>');
                            }
                            html.push('<p class="art_info"><span class="">' + (lr.source?lr.source:"管理员") + ' · '+time+'</span><i>' + returnHumanClick(lr.click) + '</i></p>');
                            html.push('</a>');
                            html.push('</dd>');
                        }
                    }
                    $(".recmbox").append(html.join(""));
                    $(".loading").remove();
                    setTimeout(function(){
                    	isload = false;
	                    //最后一页
	                    if(atpage >= data.info.pageInfo.totalPage){
	                        isload = true;
	                        $(".recmbox .loading").remove();
	                        $(".recmbox").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
	                    }
                    })
                }else{
                    isload = true;
                    $(".loading").remove();
                    $(".recmbox").append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".recmbox").append('<div class="loading"><img src="'+templets_skin+'images/loading.png" alt=""></div>');
            }
        });
        
}
function nofind(){
	var img = event.srcElement; 
	img.src = staticPath+"images/noPhoto_60.jpg"; 
	img.onerror = null;
}
  var dashangElse = false;
    $('.rewardbox').click(function(){
        var t = $(this);
      if(t.hasClass("load")) return;
        t.addClass("load");
        console.log('aaaa');
      //验证文章状态
        $.ajax({
            "url": masterDomain + "/include/ajax.php?service=article&action=checkRewardState",
            "data": {"aid": newsid},
            "dataType": "jsonp",
            success: function(data){
                t.removeClass("load");
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
                t.removeClass("load");
                alert("网络错误，操作失败，请稍候重试！");
            }
        });
    })

    // 其他金额
    $('.shang-item .inp').click(function(){
      	$(this).hide();
      	$('.shang-item-cash').hide();
    	$('.shang-money .shang-item .error-tip').show()
      	$('.shang-item .shang-else').show();
    	dashangElse = true;
    	$(".shang-else input").focus();
    })

    // 遮罩层
    $('.mask').on('click',function(){
	    $('.mask').hide();
	    $('.shang-money .shang-item .error-tip').hide()
	    $('.shang-box').hide();
	    $('.paybox').animate({"bottom":"-100%"},300)
	    setTimeout(function(){
	      $('.paybox').removeClass('show');
	    }, 300);
        $('body').unbind('touchmove')
    })

    // 关闭打赏
    $('.shang-money .close').click(function(){
    	
        $('.mask').hide();
        $('.shang-box').hide();
        $('.shang-money .shang-item .error-tip').hide()
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
        //  $("#shangWxpay").remove();
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
})
 


