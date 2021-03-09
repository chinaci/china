$(function(){
  var device = navigator.userAgent;
if(device.indexOf('huoniao') > -1){
  $('.areaChose').bind('click', function(e){
    e.preventDefault();
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler('goToCity', {'module': 'huangye'}, function(){});
    });
  });
}
	var lng = lat = 0;
  // 幻灯片
  new Swiper('#slider', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('.search').css('margin-top', 'calc(.9rem + 20px)');
	}
	$('img').scrollLoading();

	// 滑动导航
	var swiperNav = [], mainNavLi = $('.mainNav li');
	for (var i = 0; i < mainNavLi.length; i++) {
		swiperNav.push('<li>'+$('.mainNav li:eq('+i+')').html()+'</li>');
	}

	var liArr = [];
	for(var i = 0; i < swiperNav.length; i++){
		liArr.push(swiperNav.slice(i, i + 10).join(""));
		i += 9;
	}

	$('.mainNav .swiper-wrapper').html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');

	var mySwiperNav = new Swiper('.mainNav',{pagination : '.swiper-pagination',})

	// 下部列表
	$('.content-lead ul li').click(function(){
		var  u = $(this);
		var index = u.index();
		$('.content .content-list').eq(index).show();
		$('.content .content-list').eq(index).siblings().hide();
		u.addClass('ll');
		u.siblings('li').removeClass('ll');
	})

	function getList(){
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=business&action=blist&page=1&pageSize=3&orderby=3&lng='+lng+'&lat='+lat,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
          if(list.length > 0){
	          for(var i = 0; i < list.length; i++){
	          	var d = list[i];
							html.push('<li>');
							html.push('	<div class="list-left">');
							html.push('		<a href="'+d.url+'" class="fn-clear">');
							html.push('			<img src="'+d.logo+'">');
							html.push('		</a>');
							html.push('	</div>');
							html.push('	<div class="list-right">');
							html.push('		<a href="'+d.url+'">'+d.title+' '+(d.auth.length ? '<span class="state">已认证</span>' : '')+'</a>');
							html.push('		<p class="fn-clear"><span class="mark">['+d.typename.join(" ")+']</span><i class="hy-address"></i>'+d.address+'</p>');
							html.push('		<p class="fn-clear"><i class="hy-phone"></i>'+d.tel+' <span class="metre">'+d.distance+'</span></p>');
							html.push('	</div>');
							html.push('</li>');
						}
	        	$('#nearby').html(html.join(""));
	        	$('.load').remove();
	        }else{
	        	$('.load').html('暂无相关信息！');
	        }
	      }else{
	      	$('.load').html('暂无相关信息！');
	      }
      },
      error: function(){
      	$('.load').html('网络错误，请重试！');
      }
    })
  }

  HN_Location.init(function(data){
	  if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
		  getList();
	  }else{
		  lng = data.lng;
		  lat = data.lat;
		  getList();
	  }
	})


})
