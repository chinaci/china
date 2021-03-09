$(function(){

	var loadMoreLock = false;

	//登录成功向客户端发送passport
	setTimeout(function(){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('appLoginFinish', {'passport': userid}, function(){});

			//退出
			$(".logout").bind("click", function(){
				bridge.callHandler('appLogout', {}, function(){});
			});
		});
	}, 500);

	var isload = false, page = 1, pageSize = 10, initialSlide = $(".stateNow .daiQiang").index();
	var changeFirst = true;


	//开工
	$(".kaiGuan").bind("click", function(){
		var t = $(this), state = 1, title = langData['waimai'][4][2];
		if(t.hasClass("disabled")){
			alert(langData['waimai'][4][32]);
			return;
		}
		t.addClass("disabled");

		if(t.hasClass("kaiGuan01")){
			state = 0;
			title = langData['waimai'][4][3];
			// t.removeClass("kaiGuan01");
		}else{
			// t.addClass("kaiGuan01");
		}

		$('.youqingTixing').html('<i>'+title+'</i>').show();
		setTimeout(function(){
			$(".youqingTixing").hide();
		}, 1000);



		$.ajax({
            url: '/include/ajax.php?service=waimai&action=updateCourierState',
            data: {
				state: state
            },
            type: 'get',
            dataType: 'json',
            success: function(data){
            	if(data && data.state == 100){
            		t.toggleClass("kaiGuan01");
            		var url = location.href;
            		url = url.split("&time")[0];
            		window.location.href = url+'&time='+((new Date()).getTime());
            		// location.reload();
            	}else{
            		$('.youqingTixing').html('<i>'+langData['siteConfig'][21][72]+'</i>').show();
					setTimeout(function(){
						$(".youqingTixing").hide();
					}, 2000);
					t.removeClass("disabled");
            	}

			},
			error: function(){
				t.removeClass("disabled");
			}
		});

	});


	// 外卖→配送→点击取货
	$('.lianxiFangs .bG04').click(function(){
		$(this).hide();
		$(this).siblings('.bG05').show();
		$(this).closest('.lianxiFangs').siblings('.dingNum').find('.bfColor').hide();
		$(this).closest('.lianxiFangs').siblings('.dingNum').find('.bfColor01').show();
		// 提示1秒后消失 setTimeout用法
		$('.youqingTixing .youqingTixing01').show();
		setTimeout("$('.youqingTixing .youqingTixing01').hide()",1000);
	})

	//更新状态
	$(".reTry").delegate(".bG04, .bG05", "click", function(){
		var t = $(this), id = t.closest(".successFul").attr("data-id"), state = t.attr("data-state");
		if(t.hasClass("disabled") || !id) return false;

		t.addClass("disabled");
		$('.youqingTixing').html('<i>'+langData['siteConfig'][7][8]+'...</i>').show();

		$.ajax({
            url: '/include/ajax.php?service=waimai&action=peisong',
            data: {
                id: id,
				state: state,
				ordertype: ordertype
            },
            type: 'get',
            dataType: 'json',
            success: function(data){
				if(data && data.state == 100){
					$('.youqingTixing').html('<i>'+langData['siteConfig'][20][244]+'</i>').show();
					setTimeout(function(){
						location.reload();
					}, 1000);
				}else{
					t.removeClass("disabled");
					$('.youqingTixing').html('<i>'+data.info+'</i>').show();
					setTimeout(function(){
						$(".youqingTixing").hide();
					}, 2000);
				}
			},
			error: function(){
				t.removeClass("disabled");
				$('.youqingTixing').html('<i>'+langData['waimai'][4][11]+'</i>').show();
				setTimeout(function(){
					$(".youqingTixing").hide();
				}, 2000);
			}
		});
	});

	//点击抢单
	$(".reTry").delegate(".qiangDan", "click", function(){
		var t = $(this), id = t.closest(".successFul").attr("data-id");
		if(t.hasClass("disabled") || !id) return false;

		t.addClass("disabled");
		$('.youqingTixing').html('<i>'+langData['waimai'][4][22]+'...</i>').show();

		$.ajax({
            url: '/include/ajax.php?service=waimai&action=qiangdan',
            data: {
                id: id,
                ordertype: ordertype
            },
            type: 'get',
            dataType: 'json',
            success: function(data){
				if(data && data.state == 100){
					$('.youqingTixing').html('<i>'+langData['waimai'][4][23]+'</i>').show();
					setTimeout(function(){
						location.reload();
					}, 1000);
				}else{
					t.removeClass("disabled");
					$('.youqingTixing').html('<i>'+data.info+'</i>').show();
					setTimeout(function(){
						$(".youqingTixing").hide();
					}, 2000);
				}
			},
			error: function(){
				t.removeClass("disabled");
				$('.youqingTixing').html('<i>'+langData['waimai'][4][24]+'</i>').show();
				setTimeout(function(){
					$(".youqingTixing").hide();
				}, 2000);
			}
		});
	});

	// 下拉加载回调方法
	var dragTimer = null;
	new DragLoading($('.loading'), {
		onReload: function () {
			var self = this;
			clearTimeout(dragTimer);
			dragTimer = setTimeout(function () {
				var index = $('.stateNow .daiQiang').index();
				$('.stateNow .daiQiang').attr("data-page","1");
				$('.swiper-wrapper .swiper-slide').eq(index).html("");
				console.log("down")
				// location.reload();
				// console.log("aaa")
				getData();
				self.origin();
			}, 2000 * Math.random());
		}
	});



	var navbar = $('.stateNow');
	var navHeight = navbar.offset().top;
	// 左右滑动切换
	$("#tabs-container .swiper-slide").eq(0).css('height', 'auto').siblings('.swiper-slide').height($(window).height());
	var tabsSwiper = new Swiper('#tabs-container',{
	    speed:350,
	    initialSlide: initialSlide,
	    preventClicks : false,
	    autoHeight: true,
		touchAngle : 35,
	    onSlideChangeStart: function(swiper){
	    	$("#tabs-container .swiper-slide").eq(swiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());
	    	if(changeFirst){
	    		changeFirst = false;
	    		if(initialSlide != 0){
	    			return;
	    		}
	    	}
			loadMoreLock = false;
		  	$(".stateNow .daiQiang").removeClass('daiQiang');
	      	$(".stateNow a").eq(swiper.activeIndex).addClass('daiQiang');
	    	// $(window).scrollTop(navHeight);

			// 当模块的数据为空的时候加载数据
			if($.trim($("#tabs-container .swiper-slide").eq(swiper.activeIndex).html()) == ""){
				getData();
			}

			var state = $(".stateNow a").eq(swiper.activeIndex).attr("data-state");
			$(".bottomFix01 li").each(function(i){
				if(i < 2){
					var a = $(this).children('a'), url = a.attr('data-url') + state;
					a.attr('href', url);
				}
			})
			var gurl = pageUrl+state;
			window.history.pushState({}, 0, gurl);

	    },
	    onSliderMove: function(){
	      // isload = true;
	    },
	    onSlideChangeEnd: function(swiper){

	    }
	})
	$(".stateNow a").on('touchstart mousedown',function(e){
	    e.preventDefault();
	    $(".stateNow .active").removeClass('daiQiang');
	    $(this).addClass('daiQiang');
	    tabsSwiper.slideTo( $(this).index() );

	})
	$(".stateNow a").click(function(e){
		e.preventDefault();
	})
  	// 导航吸顶
	$(window).on("scroll", function(){
		var sct = $(window).scrollTop();

		if(sct + $(window).height() + 50 > $(document).height() && !loadMoreLock) {
        var page = parseInt($('.stateNow .daiQiang').attr('data-page')),
            totalPage = parseInt($('.stateNow .daiQiang').attr('data-totalPage'));
        if(page < totalPage) {
			++page;
			$('.stateNow .daiQiang').attr('data-page', page);
        }
    }

	});

	//加载数据
	function getData(type){
	    var active = $('.stateNow .daiQiang'),
	    	action = active.attr('data-action'),
	    	state = active.attr('data-state'),
	    	page = active.attr('data-page'),
	    	totalPage = active.attr('data-totalPage');

 		//未开工不可以抢单
		if(state == 3 && courier_state == 0){
			return false;
		}

		// 暂时不显示待抢订单
		if(state == 3 && ordertype == 'waimai'){
			return false;
		}

		if(type == 'scroll'){
			if(page == totalPage) return false;
		}

	    var url = "/include/ajax.php?service=waimai&action=courierOrderList&ordertype="+ordertype+"&page="+page+"&pageSize="+pageSize+"&state="+state;

		isload = true;

		// $(".load").remove();
		// $(".show01").append('<div class="load">加载中...</div>');
		$(".show01 .load").text(langData['siteConfig'][20][184]+'...');

		//异步提交
		$.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			success: function (data) {
				if(data){
					if(data.state == 100){

						$(".show01 .load").text('');
						$(".youqingTixing").hide();

						var pageInfo = data.info.pageInfo, list = data.info.list;
						var html = [];
						active.attr('data-totalPage', pageInfo.totalPage);

						for (var i = 0; i < list.length; i++) {
							var d = list[i];

							if(ordertype == "waimai"){
								//待抢
								if(state == "3"){
									html.push('<div class="successFul yaowuli successFul01" data-id="'+d.id+'">');
					        		html.push('<div class="layOut fn-clear layOut02">');
				        			html.push('<p>'+(d.juliShop > 1000 ? (d.juliShop/1000).toFixed(2) + "km" : d.juliShop + "m")+'</p>');
				        			html.push('<p>118m</p>');
				        			html.push('<p class="lastOne">'+transTimes(d.pubdate, 4)+'</p>');
					        		html.push('</div>');
					        		html.push('<div class="layOut fn-clear layOut01">');
				        			html.push('<p>'+langData['siteConfig'][17][6]+'</p>');
				        			html.push('<p>'+langData['siteConfig'][17][7]+'</p>');
				        			html.push('<p>'+langData['siteConfig'][17][8]+'</p>');
					        		html.push('</div>');
					        		html.push('<div class="dingNum03 fn-clear">');
				        			html.push('<p class="dingNum04 dingNum05"><a href="javascript:;"><img src="/static/images/store.png"></a></p>');
				        			html.push('<div class="dingNum04"><p><a href="javascript:;">'+d.shopname+'</a></p><span><a href="javascript:;">'+d.address1+'</a></span></div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+d.shopname+'" data-address="'+d.address1+'"><img src="/static/images/location.png"></a></div>');
					        		html.push('</div>');
					        		html.push('<div class="dingNum03 fn-clear">');
				        			html.push('<p class="dingNum04 dingNum05"><a href="javascript:;"><img src="/static/images/itsme.png"></a></p>');
				        			html.push('<div class="dingNum04"><p><a href="javascript:;">'+d.person+'&nbsp;&nbsp;'+d.tel+'</a></p><span><a href="javascript:;">'+langData['siteConfig'][17][9]+'：'+d.address+'</a></span></div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
					        		html.push('</div>');
					        		html.push('<div class="qiangDan">');
				        			html.push('<a href="javascript:;">'+langData['siteConfig'][17][10]+'</a>');
					        		html.push('</div>');
						        	html.push('</div>');
								}

								//配送
								if(state == "4,5"){
									html.push('<div class="successFul zhengti01 successFul01" data-id="'+d.id+'">');
									html.push('<ul class="fn-clear dingNum">');
									html.push('<li class="dingNum01"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][19][308]+'：'+d.ordernum+'</a></li>');
									html.push('<li class="dingNum02'+(d.state == 4 ? " bfColor" : " bfColor01")+'"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+(d.state == 4 ? langData['waimai'][4][25] : langData['siteConfig'][16][115])+'</a></li>');
									// html.push('<li class="dingNum01">下单时间：'+transTimes(d.pubdate, 1)+'</li>');
									html.push('</ul>');

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'"><img src="/static/images/store.png"></a></p>');
									html.push('<div class="dingNum04">');
									html.push('<p><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.shopname+'</a></p>');
									html.push('<span><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.address1+'</a></span>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+d.shopname+'" data-address="'+d.address1+'"><img src="/static/images/location.png"></a></div>');
									html.push('</div>');
									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'" class="time"><span>'+transTimes(d.pubdate, 4)+'</span><img src="/static/images/itsme.png"></a></p>');
									html.push('<div class="dingNum04">');
									html.push('<p><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.person+'&nbsp;&nbsp;'+d.tel+'</a></p>');
									html.push('<span><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][17][9]+'：'+d.address+'</a></span>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
									html.push('</div>');
									html.push('<div class="lianxiFangs fn-clear">');

									if(d.state == 5){
										html.push('<a href="javascript:;" class="bG03 bG05 left" style="margin-right: 0.3rem;" data-state="1">'+langData['siteConfig'][6][108]+'</a>');
									}

									html.push('<a href="tel:'+d.phone+'" class="bG01"><i></i> <span>'+langData['siteConfig'][17][12]+'</span></a>');
									html.push('<a href="tel:'+d.tel+'" class="bG01 bG02"'+(d.state == 5 ? 'style="margin-right: 0"' : "")+'><i></i> <span>'+langData['siteConfig'][17][13]+'</span></a>');

									if(d.state == 4){
										html.push('<a href="javascript:;" class="bG03 bG04" data-state="5">'+langData['siteConfig'][17][14]+'</a>');
									}

									html.push('</div></div>');
								}

								//成功
								if(state == "1"){
									html.push('<div class="successFul successFul01">');
									html.push('<ul class="fn-clear dingNum">');
									html.push('<li class="dingNum01"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][19][308]+'：'+d.ordernum+'</a></li>');
									html.push('<li class="dingNum02"><a href="javascript:;">'+langData['siteConfig'][17][4]+'</a></li>');
									// html.push('<li class="dingNum01">下单时间：'+transTimes(d.pubdate, 1)+'</li>');
									html.push('</ul>');
									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'"><img src="/static/images/store.png"></a></p>');
									html.push('<div class="dingNum04">');
									html.push('<p><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.shopname+'</a></p>');
									html.push('<span><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.address1+'</a></span>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+d.shopname+'" data-address="'+d.address1+'"><img src="/static/images/location.png"></a></div>');
									html.push('</div>');
									html.push('<div class="dingNum03 fn-clear xiangJun">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'" class="time"><span>'+transTimes(d.pubdate, 4)+'</span><img src="/static/images/itsme.png"></a></p>');
									html.push('<div class="dingNum04">');
									html.push('<p><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.person+'&nbsp;&nbsp;'+d.tel+'</a></p>');
									html.push('<span><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][17][9]+'：'+d.address+'</a></span>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
									html.push('</div>');
									html.push('</div>');
								}

								//失败
								if(state == "7"){
									html.push('<div class="successFul successFul01">');
									html.push('<ul class="fn-clear dingNum">');
									html.push('<li class="dingNum01"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][19][308]+'：'+d.ordernum+'</a></li>');
									html.push('<li class="dingNum02 fail"><a href="javascript:;">'+langData['siteConfig'][9][6]+'</a></li>');
									// html.push('<li class="dingNum01">下单时间：'+transTimes(d.pubdate, 1)+'</li>');
									html.push('</ul>');
									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'"><img src="/static/images/store.png"></a></p>');
									html.push('<div class="dingNum04">');
									html.push('<p><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.shopname+'</a></p>');
									html.push('<span><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.address1+'</a></span>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+d.shopname+'" data-address="'+d.address1+'"><img src="/static/images/location.png"></a></div>');
									html.push('</div>');
									html.push('<div class="dingNum03 fn-clear xiangJun">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'" class="time"><span>'+transTimes(d.pubdate, 4)+'</span><img src="/static/images/itsme.png"></a></p>');
									html.push('<div class="dingNum04">');
									html.push('<p><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+d.person+'&nbsp;&nbsp;'+d.tel+'</a></p>');
									html.push('<span><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][17][9]+'：'+d.address+'</a></span>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
									html.push('</div>');
									html.push('</div>');
								}


							}else if(ordertype == "paotui"){
								//待抢
								if(state == "3"){
									html.push('<div class="successFul yaowuli successFul01" data-id="'+d.id+'">');
					        		// html.push('<div class="layOut fn-clear layOut02">');
				        			// html.push('<p>'+(d.juliShop > 1000 ? (d.juliShop/1000).toFixed(2) + "千米" : d.juliShop + "米")+'</p>');
				        			// html.push('<p>'+(d.juliPerson > 1000 ? (d.juliPerson/1000).toFixed(2) + "千米" : d.juliPerson + "米")+'</p>');
				        			// html.push('<p class="lastOne">立即送达</p>');
					        		// html.push('</div>');
					        		// html.push('<div class="layOut fn-clear layOut01">');
				        			// html.push('<p>距离取货地</p>');
				        			// html.push('<p>取货地-收货地</p>');
				        			// html.push('<p>'+(d.type == 2 ? "取货时间" : "送达时间")+'</p>');
					        		// html.push('</div>');

					        		html.push('<ul class="orderinfo">');
									// html.push('<li>'+langData['siteConfig'][17][15]+'：'+(d.type == 1 ? langData['siteConfig'][17][16] : langData['siteConfig'][17][17])+'&nbsp;&nbsp;&nbsp;&nbsp;'+(d.type == 2 ? "取货时间：" : "送达时间：") + (d.gettimef ? d.gettimef : d.type == 1 ? '立即送达' : '立即取货') + '</li>');
									if(d.type == 1){
										html.push('<li>'+langData['waimai'][4][26]+'</li>');
										html.push('<li>'+langData['siteConfig'][17][23]+'：' + (d.gettimef ? d.gettimef : langData['waimai'][4][28]) + '</li>');
									}else{
										html.push('<li>'+langData['waimai'][4][27]+'</li>');
										html.push('<li>'+langData['siteConfig'][17][45]+'：' + (d.gettimef ? d.gettimef : langData['siteConfig'][17][46]) + '</li>');
									}
									html.push('</ul>');

					        		html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'"><img src="/static/images/store.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									if(d.type == 2){
										html.push('<p>'+langData['waimai'][4][29]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
										html.push('<span>'+langData['siteConfig'][19][642]+'：'+d.getperson+' '+langData['siteConfig'][3][1]+'：'+d.gettel+'</span>');
									}else{
										html.push('<p>'+langData['siteConfig'][17][18]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
									}
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'" data-address="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'"><img src="/static/images/location.png"></a></div>');
									html.push('</div>');

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'" class="time"><span>'+transTimes(d.pubdate, 4)+'</span><img src="/static/images/itsme.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									html.push('<p>'+langData['siteConfig'][17][20]+'</p>');
									html.push('<p>'+langData['siteConfig'][19][642]+'：'+d.person+' '+langData['siteConfig'][3][1]+'：'+d.tel+'</p>');
									html.push('<span>'+langData['siteConfig'][17][9]+'：'+d.address+'</span>');
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
									html.push('</div>');
					        		html.push('<div class="qiangDan">');
				        			html.push('<a href="javascript:;">'+langData['siteConfig'][17][10]+'</a>');
									html.push('</div>');
					        		html.push('</div>');
						        	html.push('</div>');
								}

								//配送
								if(state == "4,5"){
									html.push('<div class="successFul zhengti01 successFul01" data-id="'+d.id+'">');
									html.push('<ul class="fn-clear dingNum">');
									html.push('<li class="dingNum01"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][19][308]+'：'+d.ordernum+'</a></li>');
									html.push('<li class="dingNum02'+(d.state == 4 ? " bfColor" : " bfColor01")+'"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+(d.state == 4 ? langData['waimai'][4][25] : langData['siteConfig'][16][115])+'</a></li>');
									// html.push('<li class="dingNum01">下单时间：'+transTimes(d.pubdate, 1)+'</li>');
									html.push('</ul>');

									html.push('<ul class="orderinfo">');
									html.push('<li>'+langData['siteConfig'][17][15]+'：'+(d.type == 1 ? langData['siteConfig'][17][16] : langData['siteConfig'][17][17])+'</li>');
									html.push('</ul>');


									/*html.push('<ul class="orderinfo">');
									html.push('<li>'+langData['siteConfig'][17][15]+'：'+(d.type == 1 ? langData['siteConfig'][17][16] : langData['siteConfig'][17][17])+'</li>');
									html.push('<li>商品描述：'+d.shop+'</li>');
									html.push('<li>商品价值：'+d.price+'</li>');

									if(ordertype == "paotui"){
										html.push('<li>取货时间：'+(d.gettime > 0 ? d.gettimef : "立即取货")+'</li>');
									}

									html.push('<li>送达时间：预计'+d.totime+'分钟</li>');
									html.push('<li>备注信息：'+d.note+'</li>');
									html.push('</ul>');*/

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'"><img src="/static/images/store.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									if(d.type == 2){
										html.push('<p>'+langData['waimai'][4][29]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
										html.push('<span>'+langData['siteConfig'][19][642]+'：'+d.getperson+' '+langData['siteConfig'][3][1]+'：'+d.gettel+'</span>');
									}else{
										html.push('<p>'+langData['siteConfig'][17][18]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
									}
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'" data-address="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'"><img src="/static/images/location.png"></a></div>');
									html.push('</div>');

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'" class="time"><span>'+transTimes(d.pubdate, 4)+'</span><img src="/static/images/itsme.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									html.push('<p>'+langData['siteConfig'][17][20]+'</p>');
									html.push('<p>'+langData['siteConfig'][19][642]+'：'+d.person+' '+langData['siteConfig'][3][1]+'：'+d.tel+'</p>');
									html.push('<span>'+langData['siteConfig'][17][9]+'：'+d.address+'</span>');
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
									html.push('</div>');


									html.push('<div class="lianxiFangs fn-clear">');

									if(d.state == 5){
										html.push('<a href="javascript:;" class="bG03 bG05 left" style="margin-right: 0.3rem;" data-state="1">'+langData['siteConfig'][6][108]+'</a>');
									}

									if(d.type == 2){
										html.push('<a href="tel:'+d.gettel+'" class="bG01"><i></i> <span>'+langData['waimai'][4][30]+'</span></a>');
									}
									html.push('<a href="tel:'+d.tel+'" class="bG01 bG02"'+(d.state == 5 ? 'style="margin-right: 0"' : "")+'><i></i> <span>'+langData['siteConfig'][19][33]+'</span></a>');

									if(d.state == 4){
										html.push('<a href="javascript:;" class="bG03 bG04" data-state="5">'+langData['siteConfig'][17][14]+'</a>');
									}

									html.push('</div></div>');
								}

								//成功
								if(state == "1"){
									html.push('<div class="successFul successFul01">');
									html.push('<ul class="fn-clear dingNum">');
									html.push('<li class="dingNum01"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][19][308]+'：'+d.ordernum+'</a></li>');
									html.push('<li class="dingNum02"><a href="javascript:;">'+langData['siteConfig'][17][4]+'</a></li>');
									// html.push('<li class="dingNum01">下单时间：'+transTimes(d.pubdate, 1)+'</li>');
									html.push('</ul>');

									html.push('<ul class="orderinfo">');
									html.push('<li>'+langData['siteConfig'][17][15]+'：'+(d.type == 1 ? langData['siteConfig'][17][16] : langData['siteConfig'][17][17])+'</li>');
									html.push('</ul>');

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'"><img src="/static/images/store.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									if(d.type == 2){
										html.push('<p>'+langData['waimai'][4][29]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
										html.push('<span>'+langData['siteConfig'][19][642]+'：'+d.getperson+' '+langData['siteConfig'][3][1]+'：'+d.gettel+'</span>');
									}else{
										html.push('<p>'+langData['siteConfig'][17][18]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
									}
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'" data-address="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'"><img src="/static/images/location.png"></a></div>');
									html.push('</div>');

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'" class="time"><span>'+transTimes(d.pubdate, 4)+'</span><img src="/static/images/itsme.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									html.push('<p>'+langData['siteConfig'][17][20]+'</p>');
									html.push('<p>'+langData['siteConfig'][19][642]+'：'+d.person+' '+langData['siteConfig'][3][1]+'：'+d.tel+'</p>');
									html.push('<span>'+langData['siteConfig'][17][9]+'：'+d.address+'</span>');
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
									html.push('</div>');

									html.push('</div>');
								}

								//失败
								if(state == "7"){
									html.push('<div class="successFul successFul01">');
									html.push('<ul class="fn-clear dingNum">');
									html.push('<li class="dingNum01"><a href="/index.php?service=waimai&do=courier&template=detail&id='+d.id+'">'+langData['siteConfig'][19][308]+'：'+d.ordernum+'</a></li>');
									html.push('<li class="dingNum02 fail"><a href="javascript:;">'+langData['siteConfig'][9][6]+'</a></li>');
									// html.push('<li class="dingNum01">下单时间：'+transTimes(d.pubdate, 1)+'</li>');
									html.push('</ul>');

									html.push('<ul class="orderinfo">');
									html.push('<li>'+langData['siteConfig'][17][15]+'：'+(d.type == 1 ? langData['siteConfig'][17][16] : langData['siteConfig'][17][17])+'</li>');
									html.push('</ul>');

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'"><img src="/static/images/store.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									if(d.type == 2){
										html.push('<p>'+langData['waimai'][4][29]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
										html.push('<span>'+langData['siteConfig'][19][642]+'：'+d.getperson+' '+langData['siteConfig'][3][1]+'：'+d.gettel+'</span>');
									}else{
										html.push('<p>'+langData['siteConfig'][17][18]+'</p>');
										html.push('<p>'+langData['siteConfig'][19][9]+'：'+d.buyaddress+'</p>');
									}
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.coordY+'" data-lat="'+d.coordX+'" data-title="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'" data-address="'+(d.buyaddress == langData['siteConfig'][17][19] ? d.address : d.buyaddress)+'"><img src="/static/images/location.png"></a></div>');
									html.push('</div>');

									html.push('<div class="dingNum03 fn-clear">');
									html.push('<p class="dingNum04 dingNum05"><a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'" class="time"><span>'+transTimes(d.pubdate, 4)+'</span><img src="/static/images/itsme.png"></a></p>');
									html.push('<div class="dingNum04">');

									html.push('<a href="/index.php?service=waimai&do=courier&ordertype=paotui&template=detail&id='+d.id+'">');
									html.push('<p>'+langData['siteConfig'][17][20]+'</p>');
									html.push('<p>'+langData['siteConfig'][19][642]+'：'+d.person+' '+langData['siteConfig'][3][1]+'：'+d.tel+'</p>');
									html.push('<span>'+langData['siteConfig'][17][9]+'：'+d.address+'</span>');
									html.push('</a>');
									html.push('</div>');
									html.push('<div class="dingNum06"><a href="javascript:;" class="showmap" data-lng="'+d.lng+'" data-lat="'+d.lat+'" data-title="'+d.person+'" data-address="'+d.address+'"><img src="/static/images/nav.png"></a></div>');
									html.push('</div>');

									html.push('</div>');
								}
							}

						}

						var con = $('.xuanXiang .reTry .'+action);
						// if(page == 1)
						$('.xuanXiang .reTry .'+action).append(html.join(""));

						if(pageInfo.totalPage > page){
							isload = 0;
							++page;
						}

					}else{
						isload = 0;
						$(".youqingTixing").html('<i>'+data.info+'</i>').show();
						// $(".load").remove();
						$(".show01 .load").text(langData['siteConfig'][21][64]);
						setTimeout(function(){
							$(".youqingTixing").hide();
						}, 2000);

						$('.xuanXiang .reTry .'+action).html('<button class="reload">'+langData['waimai'][4][31]+'</button>');
					}
				}else{
					isload = 0;
					$(".youqingTixing").html('<i>'+langData['siteConfig'][20][228]+'</i>').show();
					$(".show01 .load").text('');
					setTimeout(function(){
						$(".youqingTixing").hide();
					}, 2000);

					$('.xuanXiang .reTry .'+action).html('<button class="reload">'+langData['waimai'][4][31]+'</button>');
				}
			},
			error: function(){
				isload = 0;
				$(".youqingTixing").html('<i>'+langData['siteConfig'][20][168]+'</i>').show();
				$(".show01 .load").text('');
				// $(".load").remove();
				setTimeout(function(){
					$(".youqingTixing").hide();
				}, 2000);

				$('.xuanXiang .reTry').html('<button class="reload">'+langData['waimai'][4][31]+'</button>');
			}

		});
	}

	//页面加载获取数据
	getData();

	// 滚动到底部加载
	$(window).scroll(function(){
	  	var totalHeight = $(document).height();
	  	var windowHeight = $(window).height();
	  	var topHeight = $(window).scrollTop();
	  	if(topHeight >= totalHeight - windowHeight - 50 && !isload){
			getData('scroll');
	  	}
	});


	//注册客户端webview
    function setupWebViewJavascriptBridge(callback){
      if(window.WebViewJavascriptBridge){
        return callback(WebViewJavascriptBridge);
      }else{
        document.addEventListener("WebViewJavascriptBridgeReady", function() {
          return callback(WebViewJavascriptBridge);
        }, false);
      }

      if(window.WVJBCallbacks){return window.WVJBCallbacks.push(callback);}
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement("iframe");
      WVJBIframe.style.display = "none";
      WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function(){document.documentElement.removeChild(WVJBIframe) }, 0);
    }

	setupWebViewJavascriptBridge(function(bridge) {
    	$(".xuanXiang .reTry").delegate(".showmap", "click", function(){
			var t = $(this), lng = t.attr("data-lng"), lat = t.attr("data-lat"), title = t.attr("data-title"), address = t.attr("data-address");
    		if (lat != "" && lng != "") {
		        bridge.callHandler("skipAppMap", {
		            "lat": lat,
		            "lng": lng,
		            "addrTitle": title,
		            "addrDetail": address
		        }, function(responseData) {});
	        }
    	})
    });

	//小地图
	// $(".xuanXiang .reTry").delegate(".showmap", "click", function(){
	// 	var t = $(this), lng = t.attr("data-lng"), lat = t.attr("data-lat");
	// 	if(lng && lat){
	// 		$(".mapPath").show();
	// 		var map = new BMap.Map("mapPath");
	// 		var mPoint = new BMap.Point(lng, lat);
	// 		var marker = new BMap.Marker(mPoint);
	// 		map.centerAndZoom(mPoint, 16);
	// 		map.addOverlay(marker);
	// 	}
	// });
	//
	// //关闭大地图
	// $("#closeMap").bind("click", function(){
	// 	$(".mapPath").hide();
	// });

	//点击刷新
	$(".xuanXiang").delegate(".reload", "click", function(){
		var index = $('.stateNow .daiQiang').index();
		$('.stateNow .daiQiang').attr("data-page","1");
		$('.swiper-wrapper .swiper-slide').eq(index).html("");
		// console.log("aaa")
		getData();
	});

	//转换PHP时间戳
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
			return (hour+":"+minute);
		}else{
			return 0;
		}
	}

})
