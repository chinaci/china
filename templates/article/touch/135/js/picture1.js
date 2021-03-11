$(function() {

	toggleDragRefresh('off');

	var atPage =0;
	var havemore = true;
	var mediaInit = $('.userinfo').html();

	var device = navigator.userAgent;
  if (device.indexOf('huoniao_iOS') > -1) {
    $('body').addClass('huoniao_iOS');
  }

	var height = $(window).height()-$('.photo-head-h').height()-$('.by_day').height();
	$('.swiper-container,.swiper-slide').css({'height':height,'opacity':1});
	$('.swiper-slide').css('line-height',height+'px');

	var mySwiper = new Swiper('.swiper-container', {
		observer:true,//修改swiper自己或子元素时，自动初始化swiper
    observeParents:true,//修改swiper的父元素时，自动初始化swiper
		onSlideChangeStart: function(swiper){
			getImage(swiper.activeIndex);
		},
		onSlideChangeEnd: function(swiper){
			var id = $('#Gallery li').eq(swiper.activeIndex).attr('data-id');
			if(id == undefined){
				$('.userinfo').html(mediaInit);
				$('.header-address span').html(pageInfo[0].title);
				id = pageInfo[0].id;
				$('.openBody').attr('data-id', id);
				if($.trim($('#body_'+id).html()) == ''){
					$('.openBody').removeClass('show');
				}else{
					$('.openBody').addClass('show');
				}
			}else{
				for(var i = 0; i < pageInfo.length; i++){
					var info = pageInfo[i];
					if(info.id == id){
						var html = [];
						if(info.media){
							html.push('<dt><img src="'+info.media.ac_photo+'" alt=""></dt>');
							html.push('<dd>');
							html.push('<h3><a href="'+info.media.url+'">'+info.writer+'</a></h3>');
							html.push('<p>'+huoniao.transTimes(info.pubdate, 1)+(info.source ? (' <em>·</em> '+info.source) : '') + ' <em>·</em> 阅读' + info.click + '</p>');
							html.push('</dd>');
						}else{
							html.push('<dt><img src="/static/images/default_user.jpg" alt=""></dt>');
							html.push('<dd>');
							html.push('<h3>'+info.writer+'</h3>');
							html.push('<p>'+huoniao.transTimes(info.pubdate, 1)+(info.source ? (' <em>·</em> '+info.source) : '') + ' <em>·</em> 阅读' + info.click + '</p>');
							html.push('</dd>');
						}
						$('.userinfo').html(html.join(""));
						$('.header-address span').html(info.title);

						$('.openBody').attr('data-id', id);
						if($.trim($('#body_'+id).html()) == ''){
							$('.openBody').removeClass('show');
						}else{
							$('.openBody').addClass('show');
						}
						return;
					}
				}
			}

		}
	});

	$('#Gallery').delegate('li', 'touchend', function(){
		var t = $(this), index = t.index(), parent = t.closest('ul'), length = parent.find('li').length;
		if (index == length - 2 && havemore) {
			getData(function(data){
				if(data && data.imglist.length > 0){

					next = t.next();
					nextLen = next.length;
					if(nextLen == 0){
						$(this).addClass('disabled');
					}else{
						next.click();
					}
				}else{
					havemore = false;
				}
			});
		}
	})

	// mySwiper.swipeTo(atPage, 100, false);
	getImage(atPage);


	function getImage(index){
		var li = $(".swiper-container li:eq("+index+")"), type = li.data("type"), img = li.find("img"), src = img.data("src"), alt = img.attr("alt"), id = li.attr('data-id');

		img.attr("src", src);
		$(".f14").html(alt);
		
	}

	$('.swiper-container').click(function(){
		if ($('.pic-int').css("display")=="none") {
			$('.pic-int,.f10,.btn-box').show();
		}else{
			$('.pic-int,.f10,.btn-box').hide();
		}
	})

	$('body').on('touchmove', function(){

	})

	function getData(callback){
		isload = true;
		$.ajax({
			url: masterDomain+'/include/ajax.php?service=article&action=nextData&id='+pageid,
			dataType: 'jsonp',
			success: function(data){

				if(data.state == 100){

					var info    = data.info,
						id      = info.id,
						typeid  = info.typeid,
						typeName = info.typeName,
						typeUrl = info.typeUrl,
						title   = info.title,
						url     = info.url,
						imglist = info.imglist,
						from    = info.source,
						fromUrl = info.sourceurl;

					pageid = id;

					length += imglist.length;

					var html = [];
					var lastGroup = parseInt($('.listul li').last().attr('data-group'));

					for(var i = 0; i < imglist.length; i++){
						html.push('<li class="swiper-slide" data-id="'+id+'"><img src="'+imglist[i].path+'" alt="'+(i+1)+'/'+imglist.length+'" class="swiper-lazy"><div class="swiper-lazy-preloader"></div><div class="font_scroll"><span><em>'+(i+1)+'</em>/'+imglist.length+'&nbsp;&nbsp;&nbsp;'+imglist[i].info+'</span></div></li>')
					}

					$('#Gallery').append(html.join(""));
					// html = [];
					// if(info.media){
					// 	html.push('<dt><img src="'+info.media.ac_photo+'" alt=""></dt>');
					// 	html.push('<dd>');
					// 	html.push('<h3><a href="'+info.media.url+'">'+(info.writer ? info.writer : info.media.ac_name)+'</a></h3>');
					// 	html.push('<p>'+huoniao.transTimes(info.pubdate, 1)+'</p>');
					// 	html.push('</dd>');
					// }else{
					// 	html.push('<dt><img src="/static/images/default_user.jpg" alt=""></dt>');
					// 	html.push('<dd>');
					// 	html.push('<h3>'+info.writer+'</h3>');
					// 	html.push('<p>'+huoniao.transTimes(info.pubdate, 1)+'</p>');
					// 	html.push('</dd>');
					// }
					// $('.userinfo').html(html.join(""));

					// 重新初始化swiper
					mySwiper.reInit();
					$('.swiper-container,.swiper-slide').css({'height':height,'opacity':1});
					$('.swiper-slide').css('line-height',height+'px');
					
					var newGroup = {
						'id': id,
						'typeid': typeid,
						'typeName': typeName,
						'typeUrl': typeUrl,
						'title': title,
						'url': url,
						'picnum': imglist.length,
						'from': from,
						'fromUrl': fromUrl,
						'media': info.media,
						'pubdate': info.pubdate,
						'writer': info.writer,
						'click': info.click,
					}
					pageInfo.push(newGroup);

					$('.fixedWin-content').append('<div class="content" id="body_'+id+'">'+info.body+'</div>');

					if(typeof callback == 'function'){
						callback(data.info);
					}

					// setThumbWidth(true);

				}

				isload = false;

			},
			error: function(){
				isload = false;

				if(typeof callback == 'function'){
					callback(data.info);
				}
			}
		})
	}



	$('.imgsBox').on('tap', function(){
		var t = $(this);
		if(t.hasClass('ing')) return;
		t.addClass('ing');
		setTimeout(function(){
			t.removeClass('ing');
		},200)
		if($('body').hasClass('hideotherinfo')){
			$('body').removeClass('hideotherinfo');
			$('.openBody').css('visibility','visible');
		}else{
			$('body').addClass('hideotherinfo');
			$('.openBody').css('visibility','hidden');
		}
	})


	var fixedWin = {
	  init: function(ids){
	    var that = this;
	    $(ids).click(function(){
	      var id = $(this).attr('id');
	      that.show("#"+id+'Win');
	    })
	  },
	  show: function(id){
	    var that = this;
	    if($('.fixedWin-show.active').length){
	      $('.fixedWin-show.active').addClass('active-last').removeClass('active');
	    }
	    var con = $(id);
	    if(con.length){
	      con.addClass("fixedWin-show active");
	      con.find('.fixedWin-close').off().on("click", function(){
	        that.close(true);
	      })
	    }
	    $('html').addClass('md_fixed');
	  },
	  close: function(id){
	    if(id){
	      if(Boolean(id)){
	        $(".fixedWin-show.active").removeClass("fixedWin-show active");
	      }else{
	        $(id).removeClass("fixedWin-show active");
	      }
	      if($('.fixedWin-show.active-last').length){
	        setTimeout(function(){
	          $('.fixedWin-show.active-last').addClass('active').removeClass('active-last');
	        }, 250)
	      }else{
	        $('html').removeClass('md_fixed');
	      }
	    }else{
	      $('.fixedWin').removeClass('fixedWin-show active active-last');
	      $('html').removeClass('md_fixed');
	    }
	    
	  }
	}

	$('.openBody').click(function(){
		var sid = $(this).attr('data-id');
		fixedWin.show('#bodyWin');
		$('#body_'+sid).fadeIn(100).siblings().hide();
	})

})
