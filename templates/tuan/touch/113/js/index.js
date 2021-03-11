$(function(){
	var device = navigator.userAgent;
  	if(device.indexOf('huoniao') > -1){
        $('.area a').bind('click', function(e){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goToCity', {'module': 'tuan'}, function(){});
            });
        });
    }

	  $('.swiper-slide ul').each(function(){
	    if($(this).find('li').length == 0){
	      $(this).parent().remove();
	    }
	  });


	var lng = '', lat = '', clearTime='';
    var isload = false;
   HN_Location.init(function(data){
   	if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
	  //getList();
	  $('#store ul').html('<div class="loading" style="text-align:center;">定位失败，请刷新页面</div>');
	}else{
	  lng = data.lng, lat = data.lat;
	  getList();
	}

	function getList(){
        if(isload) return false;
        isload = true;
		$.ajax({
		    url: masterDomain + '/include/ajax.php?service=tuan&action=storeList&pageSize=3&orderby=2&page=1'+'&lng='+lng+'&lat='+lat,
		    dataType: 'jsonp',
		    success: function(data){
				if(data.state == 100){
			        var list = data.info.list, html = [];
			        for(var i = 0; i < list.length; i++){
						html.push('<li class="fn-clear">');
						html.push('<a href="'+list[i].url+'">');
						html.push('<div class="s_img"><img src="'+huoniao.changeFileSize(list[i].litpic, "small")+'"></div>');
						html.push('<div class="s_title">');
						html.push('<div class="bus_txt fn-clear"><span class="bus_txt_title business-txt">'+list[i].company+'</span></div>');
						html.push('<p class="tuan"><span>发布团购<em>'+list[i].tuannum+'</em></span>  <span>综合评分<em>'+list[i].rating+'分</em></span></p>');
						if(list[i].package!=''){
							html.push('<div class="quan fn-clear"><span>券</span><span>'+list[i].vouchers+'</span></div>');
						}
						html.push('<div class="addr fn-clear"><span class="bb"><em>'+list[i].address+'</em><em>'+list[i].distance+'</em></span><span class="aa">进入店铺</span></div>');
						html.push('</div>');
						if(list[i].istop==1){
							html.push('<i></i>');
						}
						html.push('</a>');
						html.push('</li>');
			        }
			        $('#store ul').append(html.join(''));
			    }else{
					$('#store ul').html('<div class="loading">'+data.info+'</div>');
			    }
		    },
		    error: function(){
	        	$('.loading').show();
				$('#store ul').html('<div class="loading">网络错误！</div>');
		    }
		});
	}
   });

   $(".flash_sale .info .info_header ul").delegate("li","click",function(){
	  var t = $(this);
	  if( !t.hasClass('active') ){
	    var nextHour = t.attr("data-time");
	    getTime(nextHour,1);
		t.addClass('active');
		t.siblings().removeClass('active');
	  }
  });

   // banner轮播图
   new Swiper('.banner .swiper-container', {pagination: '.pagination',slideClass:'slideshow-item',paginationClickable: true, loop: true,autoplay:2000, autoplayDisableOnInteraction : false});

   new Swiper('.swipre', {pagination: '.pagination',loop: false,grabCursor: true,paginationClickable: true});

   $('.jia').click(function(){
    var t = $(this);

    if( $('.dindan').hasClass('dindan_show') || $('.dindan').hasClass('dindan_hide') ){
      if(t.hasClass('active')){
        $('.mask').hide();
        $('.dindan').removeClass('dindan_show');
        $('.fabu_t').removeClass('fabu_t_show');
        $('.dindan').addClass('dindan_hide');
        $('.fabu_t').addClass('fabu_t_hide');
        t.removeClass('jia_x');
        t.addClass('jia_y');
        t.removeClass('active');
      }else{
        $('.mask').show();
        $('.dindan').removeClass('dindan_hide');
        $('.fabu_t').removeClass('fabu_t_hide');
        $('.dindan').addClass('dindan_show');
        $('.fabu_t').addClass('fabu_t_show');
         t.addClass('jia_x');
         t.removeClass('jia_y');
        t.addClass('active');
      }
    }else{
      $('.mask').show();
        $('.dindan').removeClass('dindan_hide');
        $('.fabu_t').removeClass('fabu_t_hide');
        $('.dindan').addClass('dindan_show');
        $('.fabu_t').addClass('fabu_t_show');
         t.addClass('jia_x');
        t.addClass('active');
    }
   });


	//倒计时（开始时间、结束时间、显示容器）
	var sys_second=0;
	var countDown = function(stime, etime, obj, func){
		sys_second = etime - stime;
		clearInterval(clearTime);
		var timer = setInterval(function(){
			if (sys_second > 0) {
				sys_second -= 1;
				clearTime = timer;
				var hour = Math.floor((sys_second / 3600) % 24);
				var minute = Math.floor((sys_second / 60) % 60);
				var second = Math.floor(sys_second % 60);

				hour   = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				var downTime = hour + ':' + minute + ':' +second;
				$(obj).find("li span.timeD").text(downTime);
			} else {
				getTime('',1);
				clearInterval(timer);
				console.log(timer);
				typeof func === 'function' ? func() : '';
			}
		}, 1000);
	};

   // 限时抢购
   //getTime();
   function getTime(time,tr){
   if(tr){
   		$("#limitlist").html("");
   	}
    $.ajax({
      url: "/include/ajax.php?service=tuan&action=systemTime",
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        if(data.state == 100){
			var list = data.info.list, now = data.info.now, nowTime = data.info.nowTime, html = [];
			if(list.length > 0){
				for(var i = 0; i < list.length; i++){
					//判断是否是当前时间
					if(now == list[i].nowTime){
						var nextHour = list[i].nextHour;
						if(list[i].nextHour==time){
							className='active';
					    }else if((time=='' || time==undefined) && now == list[i].nowTime){
							className='active';
					    }else{
							className='';
					    }
						html.push('<li class="'+className+'" data-hour="'+list[i].nowTime+'" data-time="'+list[i].nextHour+'"><p>'+list[i].showTime+'</p><p>抢购中</p></li>');
					}else{
						if(list[i].nextHour==time){
							className='active';
					    }else{
							className='';
					    }
						html.push('<li class="'+className+'" data-hour="'+list[i].nowTime+'" data-time="'+list[i].nextHour+'"><p>'+list[i].showTime+'</p><p>即将开始</p></li>');
					}
				}
				$("#limit").html(html.join(""));
				if(time!='' && time!=undefined){
						nextHour = time;
				}
				$.ajax({
					url: "/include/ajax.php?service=tuan&action=tlist&iscity=1&hourly=1&time="+nextHour+"&pageSize=4",
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100 && data.info.list.length > 0){
							var list = data.info.list, html = [];
							for(var i = 0; i < list.length; i++){
								html.push("<li>");
								html.push('<div class="bg_img"><img src="'+list[i].litpic+'"><span class="timeD"></span></div>');
								html.push('<p>'+list[i].shorttitle+'</p>');
								html.push('<div class="price"><span>'+echoCurrency('symbol')+'<em>'+list[i].price+'</em></span><span>'+echoCurrency('symbol')+''+list[i].market+'</span></div>');
								var state = '';
						        if(list[i].state==1){
									state = '<a href="'+list[i].url+'">已结束</a>';
						        }else if(list[i].state==2){
									state = '<a href="'+list[i].url+'">已抢光</a>';
						        }else if(list[i].state==3){
									state = '<a href="'+list[i].url+'">立即抢购</a>';
						        }else if(list[i].state==4){
									state = '<a data-id="'+list[i].id+'" class="remind" href="javascript:;">取消提醒</a>';
						        }else if(list[i].state==5){
									state = '<a data-id="'+list[i].id+'" class="remind" href="javascript:;">提醒我</a>';
						        }
								html.push('<div class="msq">'+state+'</div>');
								html.push("</li>");
							}
							$("#limitlist").append(html.join(""));
							//引入倒计时效果
							countDown(parseInt(nowTime), parseInt(nextHour), '#limitlist', function(){
								$(".timeD").fadeOut();
							});
						}else{
							$("#limitlist").append('<div class="loading">暂无相关信息</div>');
						}
					}
				});
			}
        }
      }
    });
  }
  setInterval(getTime(),1000);


	//提醒与取消提醒
  $("#limitlist").delegate(".remind","click",function(){
	var userid = $.cookie(cookiePre+"login_user");
	if(userid == null || userid == ""){
		window.location.href = masterDomain+'/login.html';
		return false;
	}
	var id = $(this).data('id');
	var t  = $(this);
	$.ajax({
    	url: "/include/ajax.php?service=tuan&action=remind",
    	type: "GET",
    	data: {id:id},
    	dataType: "json",
    	success: function (data) {
			if(data.state == 100){
				if(data.info==1){
					t.text('提醒我');
					t.removeClass('btn_04');
					t.addClass('btn_02');
				}else if(data.info==2){
					t.text('取消提醒');
					t.removeClass('btn_02');
					t.addClass('btn_04');
				}
			}
 		}
	});
  });

  $(".inp").delegate("#search","click",function(){
	$("#myForm").submit();
  });



$.fn.scrollTo =function(options){
        var defaults = {
            toT : 0, //滚动目标位置
            durTime : 500, //过渡动画时间
            delay : 30, //定时器时间
            callback:null //回调函数
        };
        var opts = $.extend(defaults,options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(),//滚动条当前的位置
            subTop = opts.toT - curTop, //滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function(t){
                index++;
                var per = Math.round(subTop/dur);
                if(index >= dur){
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if(opts.callback && typeof opts.callback == 'function'){
                        opts.callback();
                    }
                    return;
                }else{
                    _this.scrollTop(curTop + index*per);
                }
            };
        timer = window.setInterval(function(){
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };


  //头部--微信引导关注
     $('.wechat-fix,.wechat').bind('click', function(){
      $('.wechat-popup').css("visibility","visible");
    });

    $('.wechat-popup .close').bind('click', function(){
      $('.wechat-popup').css("visibility","hidden");
    });



   // 回到顶部
  $('.gotop').click(function(){
    var dealTop = $("body").offset().top;
        $("html,body").scrollTo({toT:dealTop})
    $('.gotop').hide();
  })
    // 返回上一页
    $('.goback').click(function(){
      history.go(-1);
    })

  // 返回顶部
   var windowTop=0;
    $(window).on("scroll", function(){
            var scrolls = $(window).scrollTop();//获取当前可视区域距离页面顶端的距离
            if(scrolls>=windowTop){//当B>A时，表示页面在向上滑动
                //需要执行的操作
                windowTop=scrolls;
                $('.gotop').hide();
                $('.wechat-fix').hide();

            }else{//当B<a 表示手势往下滑动
                //需要执行的操作
                windowTop=scrolls;
                $('.gotop').show();
                $('.wechat-fix').show();
            }
            if(scrolls==0){
              $('.gotop').hide();
                $('.wechat-fix').hide();
            }
     });




})
