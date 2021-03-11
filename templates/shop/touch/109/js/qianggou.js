$(function(){
    var isload = false, nowIdexTime = '';
    var navHeight = $('.timeaxis_warp').offset().top;
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

    //var galleryMain = new Swiper('.gallery-main', {
      //spaceBetween: 0,
    //});
    var galleryThumbs = new Swiper('.gallery-thumbs', {
      autoHeight: true,
      centeredSlides : true,
      freeModeSticky : true,
      slideToClickedSlide:true,
      slidesPerView: 5,
      touchRatio: 0.2,
      observer:true,//修改swiper自己或子元素时，自动初始化swiper
      observeParents:false,//修改swiper的父元素时，自动初始化swiper
      on: {
          slideChangeTransitionStart: function(){
              isload = false;
              galleryThumbs.update();
              $(".gallery-main .swiper-slide").eq(galleryThumbs.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());

              // 当模块的数据为空的时候加载数据
              //第一个无法获取时间
              if(galleryThumbs.activeIndex==0){
				getList(nowIdexTime,1);
              }
              if($.trim($(".gallery-main .swiper-slide").eq(galleryThumbs.activeIndex).find(".qg-slide").html()) == ""){
                  $(".gallery-main .swiper-slide").eq(galleryThumbs.activeIndex).find('.qg-slide').html('<div class="loading"><span></span><span></span><span></span><span></span><span></span></div>');
                  var time= $(".gallery-thumbs .swiper-slide").eq(galleryThumbs.activeIndex).attr("data-time");
                  getList(time,1);
              }
            },
        }
    });
    //galleryMain.controller.control = galleryThumbs;
    //galleryThumbs.controller.control = galleryMain;

    getList()
    function getList(time,tr){
        isload = true;
        if(tr){
            atpage = 1;
            $(".ggoodbox").html("");
			$("#likebox").html("");
            $(".glistbox ul").html("");
        }
        $(".glistbox .loading").remove();
        $.ajax({
	      url: "/include/ajax.php?service=shop&action=systemTime&num=24",
	      type: "GET",
	      dataType: "jsonp",
	      success: function (data) {
			if(data.state == 100){
				var list = data.info.list, now = data.info.now, nowTime = data.info.nowTime, html = [], className='';

				if(list.length > 0){
					for(var i = 0; i < list.length; i++){
					    //html.push('<li class="'+className+'" data-hour="'+list[i].nowTime+'" data-time="'+list[i].nextHour+'"><p>'+list[i].showTime+'</p><p>抢购中</p></li>');
					    var textname = '';
					    if(now == list[i].nowTime){
					   		textname = '已开抢';
					   		var nextHour = list[i].nextHour;
					   		nowIdexTime  = list[i].nextHour;
					    }else{
					    	textname = '即将开抢';
					    }
						html.push('<div class="swiper-slide"  data-hour="'+list[i].nowTime+'" data-time="'+list[i].nextHour+'" ><p>'+list[i].showTime+'</p><span>'+textname+'</span></div>');
					}
				}
				$("#limit").html(html.join(""));
				var parm = [];
				if(time!='' && time!=undefined){
					nextHour = time;
				}
				parm.push("page="+atpage);
				$.ajax({
						url: "/include/ajax.php?service=shop&action=slist&limited=4&time="+nextHour+"&pageSize=5",
						type: "GET",
						data: parm.join("&"),
						dataType: "jsonp",
						success: function (data) {
							if(data && data.state == 100 && data.info.list.length > 0){
								var list = data.info.list, ggoodboxhtml = [], likeboxhtml = [], html = [];
								if(list.length > 0){
									for(var i = 0; i < list.length; i++){
										if(i==0 && atpage==1){
											ggoodboxhtml.push('<div class="good_box">');
											ggoodboxhtml.push('<a href="'+list[i].url+'"><p class="ptitle"><img src="'+templets_skin+'images/bqhh.png" alt=""></p>');
											ggoodboxhtml.push('<div class="main_box fn-clear">');
											ggoodboxhtml.push('<div class="imgbox"><img src="'+huoniao.changeFileSize(list[i].litpic, "small")+'" alt=""></div>');
											ggoodboxhtml.push('<div class="txtbox">');
											//ggoodboxhtml.push('<div class="info"><h4>'+list[i].title+'</h4><p class="fn-clear"><i class="mark1"></i>前30分钟立减300元</p><p class="fn-clear"><i class="mark2"></i>送美的扫地机</p></div>');
											ggoodboxhtml.push('<div class="info"><h4>'+list[i].title+'</h4></div>');
											var textName = '';
											 if(list[i].states==1){
											 	 textName = '查看详情';
												 ggoodboxhtml.push('<div class="qtstart">'+list[i].statesname+list[i].statestime+' 开启</div>');
											 }else{
											     textName = '去抢购';
											     var width = ((list[i].sales/list[i].inventory)*100).toFixed(0);
												 ggoodboxhtml.push('<div class="qprogress"><s style="width:'+width+'%"></s> <span>已抢'+list[i].sales+'件</span></div>');
											 }
											ggoodboxhtml.push('<div class="pricebox"><span class="nprice"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</span><span class="yprice">'+echoCurrency('symbol')+''+list[i].mprice+'</span><a href="'+list[i].url+'" class="gobuying">'+textName+'</a></div>');
											ggoodboxhtml.push('</div>');
											ggoodboxhtml.push('</div></a>');
											ggoodboxhtml.push('</div>');
										}else if(i>=1 && i<4 && atpage==1){
											 likeboxhtml.push('<li>');
											 likeboxhtml.push('<a href="'+list[i].url+'">');
											 likeboxhtml.push('<div class="imgbox">');
					                         likeboxhtml.push('<img src="'+huoniao.changeFileSize(list[i].litpic, "small")+'" alt="">');
					                    	 likeboxhtml.push('</div>');
					                    	 likeboxhtml.push('<div class="textbox">');
						                     likeboxhtml.push('<p>'+list[i].title+'</p>');
						                     likeboxhtml.push('<span>'+echoCurrency('symbol')+''+list[i].price+'</span>');
						                     likeboxhtml.push('</div>');
											 likeboxhtml.push('</a>');
											 likeboxhtml.push('</li>');
										}else{
											 html.push('<li data-id="'+list[i].id+'" class="fn-clear">');
						                     html.push('<div class="imgbox">');
						                     html.push('<img src="'+huoniao.changeFileSize(list[i].litpic, "small")+'" alt="">');
						                     html.push('</div>');
						                     html.push('<div class="txtbox">');
						                     html.push('<div class="info">');
						                     html.push('<h4>'+list[i].title+'</h4>');
						                     html.push('<p class="fn-clear">'+list[i].storeTitle+'</p>');
						                     html.push('</div>');
						                     var textName = '';
											 if(list[i].states==1){
											 	 textName = '查看详情';
												 html.push('<div class="qtstart">'+list[i].statesname+list[i].statestime+' 开启</div>');
											 }else{
											     textName = '去抢购';
											     var width = ((list[i].sales/list[i].inventory)*100).toFixed(0);
												 html.push('<div class="qprogress"><s style="width:'+width+'%"></s> <span>已抢'+list[i].sales+'件</span></div>');
											 }
						                     html.push('<div class="pricebox">');
						                     html.push('<span class="nprice"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</span>');
						                     html.push('<span class="yprice">'+echoCurrency('symbol')+''+list[i].mprice+'</span>');
						                     html.push('<span class="gobuying">'+textName+'</span>');
						                     html.push('</div>');
						                     html.push('</div>');
						                     html.push('</li>');
										}

									}
									$(".ggoodbox").append(ggoodboxhtml.join(""));
									$("#likebox").append(likeboxhtml.join(""));
									$(".glistbox ul").append(html.join(""));
									if(ggoodboxhtml.length<1 && atpage==1){
										$('.ggoodbox').hide();
									}else{
										$('.ggoodbox').show();
									}
									if(likeboxhtml.length<1 && atpage==1){
										$('.likebox').hide();
									}else{
										$('.likebox').show();
									}
					                isload = false;
					                //最后一页
					                if(atpage >= data.info.pageInfo.totalPage){
					                    isload = true;
					                    $(".glistbox ul").append('<div class="loading">'+langData['siteConfig'][18][7]+'</div>');
					                }
								}else{
					                isload = true;
					                 $(".ggoodbox").html("");
									 $("#likebox").html("");
									 $('.likebox').hide();
									 $('.ggoodbox').hide();
					                $(".glistbox ul").append('<div class="loading">暂无相关信息</div>');
					            }
							}else{
				                isload = true;
				                $(".ggoodbox").html("");
								$("#likebox").html("");
								$('.likebox').hide();
								$('.ggoodbox').hide();
				                $(".glistbox ul").append('<div class="loading">暂无相关信息</div>');
				            }
						},
						error: function(){
							isload = false;
							$(".ggoodbox").html("");
							$("#likebox").html("");
							$('.likebox').hide();
							$('.ggoodbox').hide();
            				$('.glistbox ul').html('<div class="loading">'+langData['siteConfig'][20][227]+'</div>');
						}
				});
			}
		  }
		});
    }

    $(window).scroll(function() {
        if ($(window).scrollTop() > navHeight) {
             $('.timeaxis_warp').addClass('topfixed');
        } else {
             $('.timeaxis_warp').removeClass('topfixed');
        }
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if ($(window).scrollTop() + 50 > scroll && !isload) {
            atpage++;
            getList();
        };
    });

    //微信引导关注
     $('.wechat').bind('click', function(){
      $('.wechat-popup').css("visibility","visible");
    });

    $('.wechat-popup .close').bind('click', function(){
      $('.wechat-popup').css("visibility","hidden");
    });
  	// 回到顶部
	$('.gotop').click(function(){
		var dealTop = $("body").offset().top;
        $("html,body").scrollTo({toT:dealTop})
	})
	$('.topbox ul li').click(function(event) {
		$(this).addClass('active').siblings().removeClass('active');
	});


})
