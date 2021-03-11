$(function(){
	var page = 1,shop_load = 0;
	var swiper1 = new Swiper('.bannerBox .swiper-container', {
	  loop: true,
	  autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.bannerBox .pagination',
      },
    });
   //$('.shopList').css("min-height",$(window).height());
    // 滑动导航
	var swiperNav = [], mainNavLi = $('.nav li');
	  if(mainNavLi.length>=10){
	  	$('.nav').css('height','3.4rem')
	  	for (var i = 0; i < mainNavLi.length; i++) {
		    swiperNav.push('<li>'+$('.nav li:eq('+i+')').html()+'</li>');
		  }

		  var liArr = [];
		  for(var i = 0; i < swiperNav.length; i++){
		    liArr.push(swiperNav.slice(i, i + 10).join(""));
		    i += 9;
		  }

		  $('.nav .swiper-wrapper').html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');

		  var mySwiperNav = new Swiper('.nav',{pagination: {
	        el: '.nav-pagination',
	      },});
	  }

	
	  
	   //原生APP后退回来刷新页面
      pageBack = function(data) {
         var localin = utils.getStorage('localin'); 
      	if(localin=='1' || localin==1){
      		utils.setStorage('localin', 0); 
      		localin = 0
      		location.reload();
      	}else{
      		localin = 0
      		utils.setStorage('localin', 0); 
      	}
      	
        // 
          //setupWebViewJavascriptBridge(function(bridge) {
          //    bridge.callHandler("pageRefresh", {}, function(responseData){});
          //});
      }
      //精选品牌
      $('body').delegate('.tab_btn li','click',function(){
	      	var t = $(this), index = t.index();
			$('.tab_con li').eq(index).addClass('show').siblings('li').removeClass('show');
			t.addClass('active').siblings('li').removeClass('active');
	      	var left = t.offset().left,
	      	w = t.width(),
	      	l = parseFloat($('.tab_con').css('padding-left'));
			$('.tab_con li').eq(index).css('transform-orgin',"bottom "+(left+.5*w-l))
	      	l2 = $('.tab_con li').eq(index).find('em.zhe').width();
	      	$('.tab_con li').eq(index).find('.jiao').css('left',(left+.5*w-l));
	      	$('.tab_con li').eq(index).find('em.zhe').css('left',(left+.5*w-.5*l2-l));
      });

     //综合排序
	  var click = 0;
      $('.composite.px_li').click(function(){
		  click = 1;
      	var t = $(this);
      	if(!t.hasClass('slideUp')){
      		$('.shopList_head').addClass('fixedtop');
			console.log('1')
      		$(this).addClass('slideUp');
      		$(window).scrollTop($('.rec_shop>h2').offset().top);
      		$('.mask').show();

      	}else{
			console.log(2)
      		$(this).removeClass('slideUp');
      		$('.shopList_head').removeClass('fixedtop');
			$('.mask').hide();
      	}
       setTimeout(function(){
		   click = 0;
	   },1000)
      	$('.px_box').toggle();

		$('.dt_box .right_btn').removeClass('slideUp');
		$('.right_saixuan').hide();

      });

      //价格区间
      $("#price_u").ionRangeSlider({
        skin: "big",
        type: "double",
        min: 0,
        max: 120,
        from: 0,
        to: 121,
        grid: true,
        step: 1,
        from_fixed: false,  // fix position of FROM handle
        to_fixed: false     // fix position of TO handle
	});
    var slider = $("#price_u").data("ionRangeSlider");
   	$("#price_u").on("change", function () {
           var $inp = $(this);
           var v = $inp.prop("value");     // input value in format FROM;TO
           var from = $inp.data("from");   // input data-from attribute
           var to = $inp.data("to");       // input data-to attribute

           if(to==120){
   		   $("#pricetemp").val(from + ',' + '120');
           }else{
   			$("#pricetemp").val(from + ',' + to);
   		}


   	});
    //监听滚动
    $(window).scroll(function(){
		// 置顶
    	if($(window).scrollTop()<($('.shopList').offset().top) && click==0){
    		$('.shopList_head').removeClass('fixedtop');
    	}else{
    		$('.shopList_head').addClass('fixedtop');
    	}
		// 滚动加载
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - 200;

		if ($(window).scrollTop() >= scroll && !shop_load) {
			getlist();
		}
    });

    $('.dt_box .right_btn').click(function(){
    	var t = $(this);
      	if(!t.hasClass('slideUp')){
      		$('.shopList_head').addClass('fixedtop');
			$('.shaixuan').hide()
      		$(this).addClass('slideUp');
      		$(window).scrollTop($('.shopList').offset().top);
			$('.mask').fadeIn();
      	}else{
      		$(this).removeClass('slideUp');
      		// $('.shopList_head').removeClass('fixedtop');
			$('.shaixuan').show();
			$('.mask').hide();
      	}

    	$('.right_saixuan').toggle();
		$('.composite.px_li').removeClass('slideUp');
		$('.px_box').hide();
    });

	//快捷筛选
	$('.fast_screen li').click(function(){
		var type = $(this).attr('data-type');
		page = 1;
		var data = [];
		$(this).toggleClass('fast_active');
		$('.fast_active').each(function(){
     		var selecttype = $(this).attr('data-type');
			data.push(selecttype+'='+selecttype)
		})
		getlist(data.join('&'))
	});
    // 排序
	$('.px_box li').click(function(){
		orderby = $(this).attr('data-id');
		$('#orderby').val(orderby);
		$(this).addClass('li_click').siblings('li').removeClass('li_click');
		page = 1;
		getlist();
		$('.composite.px_li a').text($(this).text())
	    $('.mask,.px_box').hide();
		$('.composite.px_li').removeClass('slideUp');
		$('.shopList_head').removeClass('fixedtop')
	});

	$('.px_li').click(function(){
		if($(this).hasClass('distance')){
			page = 1;
			$('.composite.px_li a').text('综合排序');
			$('#orderby').val(1);
			getlist();
			$(this).addClass('li_click').siblings('li').removeClass('li_click');
		}else if($(this).hasClass('saleCount')){
			page = 1;
			$('#orderby').val(2);
			getlist();
			$('.composite.px_li a').text('综合排序');
			$(this).addClass('li_click').siblings('li').removeClass('li_click');
		}else{
			page = 1;
			$(this).siblings('li').addClass('li_click').removeClass('li_click');
		}
	});

	// 筛选

	$('.right_saixuan dd').click(function(){
		var t = $(this);
		t.toggleClass('dd_chose');
	});

	// 阻止滚动
	$('.mask,.order_box').on('touchmove',function(e){
		e.preventDefault();
	});

	// 重置
	$('.right_saixuan .reset_btn').click(function(){
		$('.right_saixuan dd').removeClass('dd_chose');  //清除所有选项
		slider.reset();
	});

	// 确定

	$('.btn_group .sure_btn').click(function(){
		var sxData =[] ;
		if($('#pricetemp').val()!=""){
			var val = $("#pricetemp").val()
			sxData.push('&pricetemp='+val)
		}
		$('.right_saixuan dd').each(function(){
			var t = $(this),datatype = t.attr('data-type');
			if(t.hasClass('dd_chose')){
				sxData.push('&'+datatype+'='+datatype)
			}
		});
		$('.mask').click();
		if(sxData.length==0) return false;
		page = 1;
		getlist(sxData.join(''));
		console.log(sxData)

	})

	// 点击遮罩层
	$('.mask').click(function(){
		$(this).hide();
		$('.right_saixuan,.px_box').hide();
		$('.right_btn,.composite.px_li').removeClass('slideUp');
		$('.shaixuan').show()
        if($(".shopList").height()<=$(window).height()){
			$('.shopList_head').removeClass('fixedtop');
		}
		// $('.shopList_head').removeClass('fixedtop');
	});

    // 定位
	var localData = utils.getStorage('waimai_local');
	if(localData != null){
		var last = localData.time;
	}else{
		var last = 0;
	}
	var time = Date.parse(new Date());

  // 手动定位或10分钟内使用上次坐标
	if(local == 'manual' || (time - last < 60*10*1000)){
		$('.posi em').html(localData.address);
		var lat = localData.lat;
		var lng = localData.lng;
		getlist();
		get_jxlist(lat,lng);
		utils.setStorage('waimai_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address': localData.address}));
	}else{
		HN_Location.init(function(data){
			if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
				$('.posi em').html(''+langData['siteConfig'][27][136]+'');    /* 定位失败 */
				$('.loading').html(''+langData['siteConfig'][27][137]+'').show();    /* 定位失败，请重新刷新页面！ */
			}else{
				lng = data.lng;
				lat = data.lat;
				name = data.name;
				page = 1;
				get_jxlist(lat,lng);
				$('.posi em').html(name);
				getlist();
				 //精选品牌
				utils.setStorage('waimai_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address':name}));
			}
		}, device.indexOf('huoniao') > -1 ? false : true);
	}

	// 跳转搜索页面
	// $('.search_box .search').click(function(){
	// 	window.location.href =channelDomain+"/search_wm.html"
	// });

	$('.tab_con').delegate('li','click',function(){
		var url = $(this).find('.btn_buy').attr('href');
		window.location.href = url ;
	})

    function getlist(selecttype){
    	if(!lat || !lng) return;
		var sx = '';
		if(selecttype){
			sx = '&'+selecttype;
		}
    	typeid = $("#typeid").val();
	    orderby = $("#orderby").val();
        $('.rec_shop .loading').remove();  //删除多余的loading
	    shop_load = 1;
		if(page == 1){
			$('.shopList dd.li_box').remove();
		}
		$('.rec_shop .shopList').append('<div class="loading">'+langData['siteConfig'][20][184]+'...</div>');
		$.ajax({
            url: '/include/ajax.php?service=waimai&action=shopList'+sx,
            data: {
                lng: lng,
                lat: lat,
				orderby: orderby,
				// yingye:1,
                page: page,
                pageSize: 10
            },
            type: 'get',
            dataType: 'json',
            success: function(data){

                if(data.state == 100){
                    var list = [];
                    $('.rec_shop .loading').remove();

                    var info = data.info.list;
                    for(var i = 0; i < info.length; i++){
                        var d = info[i];

                        // 不是默认排序隐藏休息中的店铺
                        if(orderby != 1 && orderby != ''){
                          //continue;
                        }
                        var text = d.delivery_fee==0?"免配送费":(langData['waimai'][2][7]+"<em>"+echoCurrency('symbol')+d.delivery_fee+"</em>");

						// 如果是品牌  brand_shop
						var xx = '';
						if(d.rec_brand == 1){
							xx='brand_shop'
						}
                        list.push('<dd class="li_box '+xx+'"><a class="fn-clear " href="'+d.url+'">');

						var  xx = '';
						if(d.yingye=='1'){
							xx = ""
						}else{
							xx = "<i>休息中</i>";
						}
                        list.push('<div class="left_logo"><img src="'+d.pic+'" alt="'+d.shopname+'"  onerror="this.src=\'/static/images/shop.png\'"/>'+xx+'</div>')

						list.push('<div class="right_detail"><h3>'+d.shopname+'</h3>');
						list.push('<div class="shop_info fn-clear"><p class="left_info "><span class="fen '+(d.star>0?"":"no_com")+'"><em>'+(d.star>0?d.star:langData['waimai'][2][4])+'</em></span><span class="shop_sale">'+langData['waimai'][7][84]+' <em> '+d.sale+'</em></span></p><p class="right_info"><span class="time">'+(d.delivery_time?d.delivery_time+" "+langData['waimai'][2][11]:"")+'</span><span class="shop_distance">'+d.juli+'</span></p></div>'); /* 已售 */
						list.push('<div class="ps_info fn-clear"><p class="left_ps"><span class="start_ps">'+langData['waimai'][2][6]+'<em>'+echoCurrency('symbol')+d.basicprice+'</em></span><span class="start_ps">'+text+'</span></p>'+(d.delivery_service?"<p class='ps_name'>"+d.delivery_service+"</p>":"")+'</div>');  /* 起送 --- 配送 */

						if(d.promotions && d.open_promotion == 1){
							list.push('<p class="hui_info">');
							for(var m=0; m<d.promotions.length; m++){
								if(d.promotions[m][0]!=0){
									list.push('<span>'+d.promotions[m].join(langData['waimai'][2][93])+'</span>');   /* 减 */
								}

							}
							list.push('</p>')
						}
						if(d.is_first_discount=='1'){
							list.push('<p class="first_tip"><i>'+langData['waimai'][7][137]+'</i>'+langData['waimai'][2][8].replace('1', d.first_discount)+'</p>');   //首单   --首单立减
						}
						if(d.zkproduct !='0'){
							list.push('<p class="discount_tip"><i>'+langData['waimai'][7][138]+'</i>'+langData['waimai'][2][120].replace('1', d.zkproduct)+'</p>');   //折扣 --- 本店开启了1折优惠活动
						}
                        list.push('</div></a></dd>');
                    }

                    if(page == 1){
                    	$('.shopList dd.li_box').remove();
                		$('.shopList').append(list.join(''));
                	}else{
                		$('.shopList').append(list.join(''));
                	}
                    shop_load = 0;
                    page++;
                    if(data.info.pageInfo.totalPage < page){
                        if(page == 1){
                          $('.shopList dd.li_box').remove();
                          $('.rec_shop').append('<div class="loading">'+langData['siteConfig'][20][126]+'</div>');  /* 暂无相关信息！*/
                        }else {
                          $('.rec_shop').append('<div class="loading">'+langData['siteConfig'][20][185]+'</div>');   /* 已加载完全部信息！*/
                        }
                        shop_load = 1;
                        return false;
                    }
                }else{
                    $('.shopList .loading').html(data.info);
                }

            },
            error: function(){
                $('.shopList .loading').html(langData['siteConfig'][20][227]);   /* 网络错误，加载失败！*/
            }
        })
    }
	function get_jxlist(lat,lng){
		if(!lat || !lng) return;

		$.ajax({
		    url: '/include/ajax.php?service=waimai&action=shopList&recBrand=1',
		    data: {
		        lng: lng,
		        lat: lat,
				orderby: 1,
		        page: 1,
		        pageSize: 6
		    },
		    type: 'get',
		    dataType: 'json',
		    success: function(data){
				if(data.state==100){
					var dlist = data.info.list;
					var list1 = [], list2 = [];
					for(var i = 0; i < dlist.length; i++){
						var ative = (i==0?"active":"");
						var show = (i==0?"show":"");
						list2.push('<li class="'+ative+'"><img src="'+(dlist[i].pic?dlist[i].pic:staticPath+"images/shop.png")+'"/></li>');
						list1.push('<li class="'+show+'">');
						list1.push('<div class="left_logo"><img src="'+(dlist[i].pic?dlist[i].pic:staticPath+"images/shop.png")+'" /></div>');
						list1.push('<div class="right_info"><h3>'+dlist[i].shopname+'</h3>');
						list1.push('<p>'+langData['waimai'][7][139]+'<em>'+dlist[i].juli+'</em></p>');   /* 店铺距您 */
						list1.push('<div class="price"><em>'+(dlist[i].basicprice?dlist[i].basicprice:9.9)+'</em>'+echoCurrency('short')+'</div>');   /* 元起 */
						list1.push('<a href="'+dlist[i].url+'" class="btn_buy">'+langData['waimai'][7][141]+'</a>');
						list1.push('</div><i class="jiao"></i><em class="zhe"></em></li>');
					}
					$('.tab_btn').html(list2.join(''));
					$('.con_box ul').html(list1.join(''));

				}else{
					$('.jingxuan_box').hide();
				}
			},
			error:function(){

			}
		});
	}



});
