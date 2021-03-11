$(function(){
	var page = 1,shop_load = 0; 
	var str = window.location.search;
	var URLArrary = str.split('=');
	var strArrary = str.split('?');
	var id = URLArrary[1]  ? URLArrary[1] : 0;
    var typeid = str?(str.slice(1)):"";
    var orderby = 1
      $('.mask').bind('touchmove',function(e){
      	e.preventDefault();
      });
     
      //综合排序
      $('.composite.px_li').click(function(){
      	var t = $(this);
      	$('.px_box').toggle();
      	$('.right_saixuan').hide();
      	$('.right_btn').removeClass('slideUp');
      	if(!t.hasClass('slideUp')){
      		$('.pxBox').addClass('fixedtop');
      		$(this).addClass('slideUp');
      		$('.mask').show();
      	}else{
      		$(this).removeClass('slideUp');
      		$('.pxBox').removeClass('fixedtop');
      		$('.mask').hide();
      	}
      });
	  
      
       $('.dt_box .right_btn').click(function(){
    	var t = $(this);
      	if(!t.hasClass('slideUp')){
      		$('.pxBox').addClass('fixedtop');
      		$(this).addClass('slideUp');
      		$('.mask').show();
      	}else{
      		$(this).removeClass('slideUp');
      		$('.pxBox').removeClass('fixedtop');
      		$('.mask').hide();
      	}
    	$('.right_saixuan').toggle();
    	$('.px_box').hide();
    	$('.composite.px_li').removeClass('slideUp');
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
 
   
 
   var swiper1 = new Swiper('.swiper_box.swiper-container', {
	  autoHeight:true,
	  on:{
	  	slideChangeTransitionStart:function(){
	  		page = 1;
	  		shop_load = 1;
	  		$('.fenlei_box ul li').eq(this.activeIndex).addClass('li_active').siblings('li').removeClass('li_active');
	  		var tid = $('.fenlei_box ul li').eq(this.activeIndex).attr('data-id');
	  		typeid = tid?("typeid="+tid):"";
	  		$('.swiper-slide-active').addClass('show').siblings('.swiper-slide').removeClass('show');
	  		var end = $('.li_active').offset().left + $('.li_active').width() / 2 - $('body').width() /2;
            var star = $(".fenlei_box ul").scrollLeft();
            $(".fenlei_box ul").scrollLeft(end + star);
            window.history.pushState({}, 0, strArrary[0]+"?typeid="+tid);
            if($('.ulbox').eq(this.activeIndex).find('li').length>0) {return false;}
	  		getlist();
	  		 
	  	},
	  	slideChangeTransitionEnd:function(){
	  		setTimeout(function(){
	  			shop_load = 0;
	  		},500)
	  	},
	  }
      
    });
    
   
    $(".fenlei_box ul li").click(function(){
   		swiper1.slideTo($(this).index())
   });
   
    
     var localData = utils.getStorage('waimai_local');
  	if(localData){
		lat = localData.lat;
		lng = localData.lng;
		// console.log("本地存储："+localData.address);
		if(id!=0){
			swiper1.slideTo($('.fenlei_box ul li[data-id="'+id+'"]').index())
		}else{
			getlist();
		}
	}else{
		// 百度地图
		if (site_map == 'baidu') {
			var geolocation = new BMap.Geolocation();
	    geolocation.getCurrentPosition(function(r){
	    	if(this.getStatus() == BMAP_STATUS_SUCCESS){
	    		lat = r.point.lat;
					lng = r.point.lng;

					var geoc = new BMap.Geocoder();
					geoc.getLocation(r.point, function(rs){
						var rs = rs.addressComponents;
						$('.posi em').html(rs.district + rs.street + rs.streetNumber)
					});
					getlist();
	    	}
	    	else {
	    		alert('failed'+this.getStatus());
	    	}
	    },{enableHighAccuracy: true})

			// 谷歌地图
			}else if (site_map == 'google') {

				if (navigator.geolocation) {

					//获取当前地理位置
					navigator.geolocation.getCurrentPosition(function(position) {
							var coords = position.coords;
							lat = coords.latitude;
							lng = coords.longitude;

							//指定一个google地图上的坐标点，同时指定该坐标点的横坐标和纵坐标
							var latlng = new google.maps.LatLng(lat, lng);
							var geocoder = new google.maps.Geocoder();
							geocoder.geocode( {'location': latlng}, function(results, status) {
									if (status == google.maps.GeocoderStatus.OK) {
											var time = Date.parse(new Date());
											var resultArr = results[0].address_components, address = "";

											for (var i = 0; i < resultArr.length; i++) {
												var type = resultArr[i].types[0] ? resultArr[i].types[0] : 0;
												if (type && type == "street_number") {
													address = resultArr[i].short_name;
												}
												if (type && type == "route") {
													address += " " + resultArr[i].short_name;
												}
											}

											utils.setStorage('waimai_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address': address}));
											console.log(address);
											getlist();

									} else {
										alert('Geocode was not successful for the following reason: ' + status);
									}
							});

					}, function getError(error){
							switch(error.code){
								case error.TIMEOUT:
										 alert(langData['siteConfig'][22][100]);   /* 超时 */
										 break;
								case error.PERMISSION_DENIED:
										 alert(langData['siteConfig'][22][101]);    /* 用户拒绝提供地理位置 */
										 break;
								case error.POSITION_UNAVAILABLE:
										 alert(langData['siteConfig'][22][102]);   /* 地理位置不可用 */
										 break;
								default:
										 break;
							}
				 })
			 }else {
				alert(langData['waimai'][3][72])   /* 不支持 */
			 }
			}


	} 

  //滚动定位
   var p = 0, t = 0;
   $(window).scroll(function(){
   		p = $(this).scrollTop(); 
   		var ul_t = $('.cont_box').offset().top-30;
   		if(p>=ul_t){
   			$('.pxBox').addClass('fixedtop');
   		}else{
   			$('.pxBox').removeClass('fixedtop');
   		}
   		
   		var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if ($(window).scrollTop() >= scroll && !shop_load) {
        	page = $('.li_active').attr('data-page');
        	total = $('.li_active').attr('data-total');
        	page++;
        	$('.li_active').attr('data-page',page);
        	getlist();
        	
        }
   	
   });
    
  
  //快捷筛选
  $('.fast_screen li').click(function(){
  	page = 1;
	var type;
  	$(this).addClass('fast_active');
	
	var data = []
	$('.fast_active').each(function(){
		var selecttype = $(this).attr('data-type');
		data.push(selecttype+'='+selecttype)
	})
	$('.right_saixuan dd[data-type='+type+']').click();
  	getlist(data.join('&'))
  });
    //排序
   $('.px_box li').click(function(){
		orderby = $(this).attr('data-id');
		$('#orderby').val(orderby);
		$(this).addClass('li_click').siblings('li').removeClass('li_click');
		page = 1;
		getlist();
		$('.composite.px_li a').text($(this).text())
		$('.mask,.px_box').hide();
		$('.composite.px_li').removeClass('slideUp');
		$('.pxBox').removeClass('fixedtop');
   });
   
   $('.px_li').click(function(){
   	if($(this).hasClass('distance')){
		page = 1;
   		$('.composite.px_li a').text('综合排序');
   		$('#orderby').val(1);
		getlist();
   		$(this).addClass('li_click').siblings('li').removeClass('li_click');
   	}else if($(this).hasClass('saleCount')){
		page=1;
   		$('#orderby').val(2);
   		$('.composite.px_li a').text('综合排序');
		getlist();
   		$(this).addClass('li_click').siblings('li').removeClass('li_click');
   	}else{
		page = 1;
   		$(this).siblings('li').addClass('li_click').removeClass('li_click');
   	}
   });
	
	// 筛选
	var sxData = {}
	$('.right_saixuan dd').click(function(){
		var t = $(this);
		t.toggleClass('dd_chose');
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
		$('dt.order_box,.pxBox').removeClass('fixedtop');
	});
    
    
    function getlist(selecttype){
    	if(!lat || !lng) return;
		var sx = '';
		if(selecttype){
			sx = '&'+selecttype;
		}
	    shop_load = 1;
	    var page = $('.tab_li.li_active').attr('data-page');
	    var total = $('.tab_li.li_active').attr('data-total');
		typeid = '&typeid='+$('.tab_li.li_active').attr('data-id');
		orderby = $("#orderby").val();
	    if(total!=undefined && total<page) return;
		if(page == 1){
			$('.ulbox.show').html('');
		}	
		$('.ulbox.show').append('<div class="loading">'+langData['siteConfig'][20][184]+'...</div>');   //加载中，请稍候
		$.ajax({
            url: '/include/ajax.php?service=waimai&action=shopList&'+typeid+sx,
            data: {
                lng: lng,
                lat: lat,
				orderby: orderby,
                page: page,
                pageSize: 6
            },
            type: 'get',
            dataType: 'json',
            success: function(data){
                if(data.state == 100){
                    var list = [];
                    
                    $('.ulbox.show .loading').remove();
                    
                    var info = data.info.list;
                    $('.tab_li.li_active').attr('data-total',data.info.pageInfo.totalPage)
                    for(var i = 0; i < info.length; i++){
                        var d = info[i];
                        // 如果是品牌  brand_shop
                        var hideClass="";
                        if(d.rec_brand == 1){
							hideClass='brand_shop'
						}
                        list.push('<li class="li_box '+hideClass+'"><a class="fn-clear " href="'+d.url+'">');
                        var  xx = '';
						if(d.yingye=='1'){
							xx = ""
						}else{
							xx = "<i>休息中</i>";
						}
						 var text = d.delivery_fee==0?"免配送费":(langData['waimai'][2][7]+"<em>"+echoCurrency('symbol')+d.delivery_fee+"</em>");
                        list.push('<div class="left_logo"><img src="'+d.pic+'" alt="'+d.shopname+'"  onerror="this.src=\'/static/images/shop.png\'"/>'+xx+'</div>')
						
						list.push('<div class="right_detail"><h3>'+d.shopname+'</h3>');
						list.push('<div class="shop_info fn-clear"><p class="left_info "><span class="fen '+(d.star>0?"":"no_com")+'"><em>'+(d.star>0?d.star:langData['waimai'][2][4])+'</em></span><span class="shop_sale">'+langData['waimai'][7][84]+' <em> '+d.sale+'</em></span></p><p class="right_info"><span class="time">'+(d.delivery_time?d.delivery_time:0)+langData['waimai'][2][11]+'</span><span class="shop_distance">'+d.juli+'</span></p></div>');   /*暂无评分 - - 已售  --分钟 */
						list.push('<div class="ps_info fn-clear"><p class="left_ps"><span class="start_ps">'+langData['waimai'][2][6]+'<em>'+echoCurrency('symbol')+d.basicprice+'</em></span><span class="start_ps">'+text+'</span></p>'+(d.delivery_service?"<p class='ps_name'>"+d.delivery_service+"</p>":"")+'</div>');  /* 起送 --- 配送 */
						
						if(d.promotions){
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
						if(d.zkproduct!='0'){
							list.push('<p class="discount_tip"><i>'+langData['waimai'][7][138]+'</i>'+langData['waimai'][2][120].replace('1', d.zkproduct)+'</p>');   //折扣 --- 本店开启了1折优惠活动
						}
                        list.push('</div></a></li>');
                    }
					
                    if(page == 1){
                    	$('.ulbox.show').html('');
                		$('.ulbox.show').append(list.join(''));
                	}else{
                		$('.ulbox.show').append(list.join(''));
                	} 
                	swiper1.updateAutoHeight(300);
                	setTimeout(function(){
                		 shop_load = 0;
                		 if(data.info.pageInfo.totalPage <= page){
	                        $('.ulbox.show').append('<div class="loading">'+langData['siteConfig'][20][185]+'</div>'); /* 已加载完全部信息！*/
	                        shop_load = 1;
	                        return false;
	                    }
                	},500)

                   
                }else{
                    $('.ulbox.show .loading').html(data.info);
                }
				
            },
            error: function(){
                $('.ulbox.show.loading').html(langData['siteConfig'][20][227]);    /* 网络错误，加载失败！*/
            }
        })
    };
    
    
  
});
