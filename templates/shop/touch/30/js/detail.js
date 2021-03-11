$(function(){
	var device = navigator.userAgent;

    var mySwiper = new Swiper('.lunboswiper', {pagination: {el:'.swiper-pagination',type: 'fraction',},loop: false});
	// var mySwiper = new Swiper('.lunboswiper', {pagination: '.swiper-pagination',paginationType: 'fraction'});
	var mySwiperShop = new Swiper('.swiper_shop', {freeMode: true,freeModeFluid: true,spaceBetween: 10,slidesPerView: 'auto',cssWidthAndHeight: false});

	var commonLoad = null,
	    tabTop = $('.shop-info').offset().top;

	$(window).scroll(function(){
		var winTop = $(window).scrollTop();
		if (winTop > tabTop) {
			$('.shop-tab ul').addClass('top');
			if (device.indexOf('huoniao_iOS') > -1) {
				$('.shop-tab ul').addClass('padTop20');
			}
		}
		else{
			$('.shop-tab ul').removeClass('top padTop20');
		}
	})

	$('.shop-tab li').click(function(){
		var index = $(this).index();
		$('body').scrollTop(tabTop + 2);
		$(this).addClass('active').siblings().removeClass('active');
		$('.shop-con .shop-box').eq(index).removeClass('dn').siblings().addClass('dn');
		if(index == 1 && commonLoad == null){
			getComment();
		}
	})

	// 筛选评价
	$('.swiper-container-comment .swiper-slide').click(function(){
		var btn = $(this),filter = btn.attr('data-type') || '';
		btn.find('span').addClass('active');
		btn.siblings().find('span').removeClass('active');
		getComment(filter)
	})

	// 选择颜色、尺码
	var myscroll = null;
	$('.main-select').click(function() {
		$('.color-box').show();
		if(myscroll == null){
			var headHeight = $('.header').height();
			var footHeight = $('.color-footer').height();
			var winHeight = $(window).height();
			$('#color-main').height(winHeight - headHeight - footHeight);
			myscroll = new iScroll("color-main", {vScrollbar: false,});
		}
	})


	// 选择颜色、尺码返回
	$('.color-box .header-l a').click(function(){
		$('.color-box').hide();
	})

	// 获取评论
	
	var combox = $('.comment-box ul');
	var btn = $('.shop-tab li').eq(1);
	getComment();
	function getComment(filter){
		$('.comment-box .loading').remove();
		combox.html('').after('<div class="loading">'+langData['siteConfig'][20][184]+'</div>');
		var data = [];
		filter = filter || '';
		data.push('aid='+detailID);
		data.push('filter='+filter);
		$.ajax({
			url: masterDomain + "/include/ajax.php?service=member&action=getComment&type=shop-order",
			data : data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){

					var list = data.info.list,
						pageinfo = data.info.pageInfo,
						html = [];
					var totalCount = pageinfo.totalCount;

					// $('#nav_common').html('评价(' + totalCount + ')');
					var hp = 0, zp = 0, cp = 0;
					for(var i = 0; i < list.length; i++){
						var info = list[i];
						var nickname = info.user.nickname,nicklen = nickname.length;
						nickname = nickname.substr(0,3)+'***'+nickname.substr(nicklen-3);
						var photo = info.user.photo == "" ? staticPath+'images/noPhoto_40.jpg' : info.user.photo;
						rat = parseInt(info.rating);
						rating = "";
						switch (rat) {
							case 1:
								rating = langData['siteConfig'][18][6];
								hp++;
								break;
							case 2:
								rating = langData['siteConfig'][19][368];
								zp++;
								break;
							case 3:
								rating = langData['siteConfig'][19][369];
								cp++;
								break;
						}
						// 图集
						var pics = info.pics;

						html.push('<li>');
						html.push('	<dl>');
						html.push('		<dt class="comment-user">');
						html.push('			<a href="'+masterDomain+'/user/'+info.user.id+'"><img src="'+photo+'" alt=""></a>');
						html.push('		</dt>');
						html.push('		<dd>');
						html.push('			<p><span class="nickname">'+nickname+'</span><span class="time">'+huoniao.transTimes(info.dtime, 2)+'</span><span class="score score-'+rat+'"><i></i>'+rating+'</span></p>');
						html.push('			<p class="content">'+info.content+'</p>');
						html.push('			<p class="color"><span>'+info.specation+'</span></p>');
						if(pics.length > 0){
							var html1 = [];
							html1.push('		<div class="my-gallery comment-pic-slide" itemscope itemtype="">');
							html1.push('			<div class="swiper-wrapper">');
							for(var m = 0; m < pics.length; m++){
								html1.push('				<figure itemprop="associatedMedia" itemscope itemtype="" class="swiper-slide">');
								html1.push('					<a href="'+pics[m]+'" itemprop="contentUrl" data-size="400x300">');
								html1.push('						<img src="'+pics[m]+'" itemprop="thumbnail" alt="Image description" />');
								html1.push('					</a>');
								html1.push('				</figure>');
							}
							html1.push('			</div>');
							html1.push('		</div>');
							html.push(html1.join(""));
						}
						html.push('		</dd>');
						html.push('	</dl>');
						html.push('</li>');
					}
					
					if(filter == ''){
						var plt =$('.swiper-container-comment');
						plt.find('.hp').text(hp);
						plt.find('.zp').text(zp);
						plt.find('.cp').text(cp);
					}
					combox.html(html.join(""));

					new Swiper('.comment-pic-slide', {freeMode: true,freeModeFluid: true,spaceBetween: 10,slidesPerView: 'auto',cssWidthAndHeight: false});

					// execute above function
					initPhotoSwipeFromDOM('.my-gallery');

					$('.comment-box .loading').remove();
					$('html,body').animate({
						'scrollTop' : 0
					},300)

				} else {
					// 没有数据
					$('.comment-box .loading').text(data.info);
				}

				// winScrollTab();
			},
			error: function(){
				btn.removeClass('waiting');
				$('.comment-box .loading').text(langData['siteConfig'][20][227]);
			}
		})
	}


	$('img').scrollLoading();

	// 收藏
  $('.collect').click(function(){
    var t = $(this), type = t.hasClass("has") ? "del" : "add", temp = t.attr('data-temp');
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + '/login.html';
      return false;
    }
    if(type == 'add'){
    	t.html('<i></i>已收藏').addClass('has');
    }else{
    	t.html('<i></i>收藏').removeClass('has');
    }
    $.post("/include/ajax.php?service=member&action=collect&module=shop&temp="+temp+"&type="+type+"&id="+detailID);
  });


    /*调起大图 S*/
    $.fn.bigImage({
        artMainCon:".shop_detail",  //图片所在的列表标签
    });

})
