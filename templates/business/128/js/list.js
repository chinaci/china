$(function(){
	if($.browser.msie && parseInt($.browser.version) >= 8){
		$('.list-tab .tab-content .tab-item:last-child').css('border-bottom','none');
	}
	$('.list-tab .tab-content .code .code-icon').hover(function(){
		$(this).next('.code-scan').toggleClass('show');
	})
	// 最新入驻
	$(".txtMarquee-top").slide({mainCell:".bd ul",autoPlay:true,effect:"topMarquee",vis:5,interTime:50});
	
	//分类、区域
	$('.filter .filter-right .one-filter li').click(function(){
		$(this).addClass('on').siblings().removeClass('on');
		if ($(this).hasClass('on')) {
			$(this).closest('.filter').find('.sort-all').removeClass('on');
		}else{
			$(this).closest('.filter').find('.sort-all').addClass('on');
		}
		$('.filter .filter-left .sort-all').click(function(){
			$(this).addClass('on');
			$(this).closest('.filter').find('.one-filter li').removeClass('on');
		})
	})
	
	// $('.two-filter li a').bind('click',function(){
	// 	var oneval = $(this).closest('li').children('aa');
	// 	var val = $(this).text();
	// 	oneval.html(val)
	// })
	// 商家店铺切换
	//$('.list-tab ul li').click(function(){
		//$(this).addClass('active').siblings().removeClass('active');
		//var i = $(this).index();
		//$('.container-wrap .container').eq(i).addClass('show').siblings().removeClass('show');
	//})

	//商铺
	if(typem=='shop'){
		$('.shoplist').each(function(){
			getShopList($(this).attr("data-id"),$(this));
		});
	}

	function getShopList(id,obj){
		$.ajax({
			url: "/include/ajax.php?service=shop&action=slist&pageSize=4&store=" + id,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						var list = data.info.list, html = [];
						console.log(list);
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
								html.push('<div class="mall-item">');
								html.push('<div class="imbox"><img src="'+huoniao.changeFileSize(list[i]['litpic'], "middle")+'" alt=""></div>');
								html.push('<p class="name">'+list[i]['title']+'</p>');
								html.push('<p class="price">'+echoCurrency('symbol')+' <span>'+list[i]['price']+'</span></p>');
						        html.push('</div>');
							}
							$(obj).append(html.join(""));
						}else{
							//$(".nearby-con").append('<div class="loading">暂无相关信息</div>');
						}
					}else{
						//$(".nearby-con").append('<div class="loading"></div>');
					}
				}else{
					//$(".nearby-con").html('<div class="loading">加载失败</div>');
				}
			},
			error: function(){
				//$(".nearby-con").html('<div class="loading">网络错误，加载失败！</div>');
			}
		});
	}

})