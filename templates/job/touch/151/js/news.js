$(function(){
	//APP端取消下拉刷新
    toggleDragRefresh('off');
	//更多导航栏展开，关闭
    $('.more_nav').click(function () {
        $('.mask').fadeIn();
        setTimeout(function(){
            $('.nav_all').animate({
                'top': '0',
            }, 100);
        },100)
        setTimeout(function(){
            $('.nav_box').css('z-index','100000');
        },200)
        $('html').addClass('noscroll');
        $(".nav_all .nav_on").removeClass('nav_on'); 
    });
    $('.close_btn,.cancel,.mask').click(function () {      
       $('.nav_all').animate({
            'top': '-100%',
        }, 100);
        
        $('.mask').fadeOut();
        $('.nav_box').css('z-index','100001'); 
        $('html').removeClass('noscroll');
    });
    var isload = false,atpage=1;
    //左右导航切换
    var tabsSwiper = new Swiper('#tabs-container', {
        speed: 350,
        touchAngle: 35,
        observer: true,
        observeParents: true,
        freeMode: false,
        longSwipesRatio: 0.1,
        autoHeight: true,
        on: {
            init: function () {
				getList($(".item:eq("+this.activeIndex+")").attr('data-id'));
            },
            slideChangeTransitionEnd: function () {
 
                $(".nav_box .active").removeClass('active');
                $(".nav_box li").eq(this.activeIndex).addClass('active');     
                var end = $('.active').offset().left + $('.active').width() / 2 - $('body').width() /2;
                var star = $(".nav_box .f_nav").scrollLeft();
                $('.f_nav').scrollLeft(end + star);
                var hasload =  $('.item').eq(this.activeIndex).attr('data-type');
                var len = $('.channel_'+this.activeIndex).children('li').length;

                if(hasload==0 && len==0){//第一次加载
                    $(window).scrollTop(0);
                    atpage=1;                   
                    var acId =$(".item:eq("+(this.activeIndex*1)+")").attr('data-id') 
                    $('.channel_'+acId).find('ul').html('');
                    getList(acId);
                    tabsSwiper.updateAutoHeight(100)
                }else{//已经滑动加载过
                    tabsSwiper.updateAutoHeight(100)
                }
            }
        },

    });

	$('.f_nav li').click(function(e){
		e.preventDefault();
        $(".f_nav .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo($(this).index());
	})
	//全部导航点击
    $('.nav_all').delegate('li', 'click', function (e) {
        var p = $(this).parents('ul'),t = $(this);        
        $(this).addClass('nav_on').siblings().removeClass('nav_on');
        var iname = $(this).attr('data-id');
        $('.nav_box li[data-id="'+iname+'"]').click();
        $('.nav_all').animate({
            'top': '-100%'
        }, 200);
        $('.nav_box').fadeIn();
        $('.mask').hide();
        $('html').removeClass('noscroll');
    });
	// 下拉加载
	$(window).scroll(function() {
		if($(window).scrollTop()>($('.header').height())){
            $('.nav_box').addClass('topfixed');
            $('.nav_all').addClass('top0');
        }else{
            $('.nav_box').removeClass('topfixed');
            $('.nav_all').removeClass('top0');
        } 
        var id = $('.f_nav li.active').attr('data-id');
        var hasload =  $('.f_nav li.active').attr('data-type');
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w;
		if ($(window).scrollTop() > scroll && !isload &&(hasload==0)) {
			atpage++;
			getList(id);
		};
	});
	var newsTime = {

        //转换PHP时间戳
        transTimes: function(timestamp, n){
            update = new Date(timestamp*1000);//时间戳要乘1000
            year   = update.getFullYear();
            month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
            day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
            hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
            minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
            second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
            if(n == 1){
                return (year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second);
            }else if(n == 2){
                return (year+'/'+month+'/'+day);
            }else if(n == 3){
                return (month+'/'+day);
            }else{
                return 0;
            }
        }
    }

	
	function getList(id){
		$('.item'+id).attr('data-type',1);
		isload = true;

		//如果进行了筛选或排序，需要从第一页开始加载
		// if(tr){
		// 	atpage = 1;
		// 	$('.channel_'+id).find('ul').html("");
		// }
		// $(".news-list .loading").remove();
		// $('.channel_'+id).find('ul').append('<div class="loading"><img src="'+templets_skin+'images/loading.png"></div>')
		if(atpage!=1){
            $('.channel_'+id).find('ul').append('<div class="loading"><img src="'+templets_skin+'images/loading.png"></div>')
        }

		var id = $('.f_nav .active').attr('data-id');
		if (id == undefined) {
			id = 0;
		}

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);

		$.ajax({
			url: "/include/ajax.php?service=job&action=news&typeid="+id,
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$('.channel_'+id).find('.loading').remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){

								html.push('<li class="fn-clear">');
			                    html.push('<a href="'+list[i].url+'">');
			                    if (list[i].litpic != "") {
				                    html.push('<div class="news_r">')
				                    html.push('<img src="'+list[i].litpic+'" alt="">')
				                    html.push('</div>')
				                }
			                    html.push('<div class="news_l">')
			                    html.push('<h2>'+list[i].title+'</h2>')
			                    html.push('<div class="newsInfo">')
			                    if(list[i].click > 500){//浏览量大于500 时 为hot
			                        if(list[i].click >= 10000){
			                           list[i].click = (list[i].click/10000).toFixed(1) + '万';
			                        }
			                        html.push('<i class="hot"></i>');
			                    }
			                    var time = list[i].pubdate;
			                    var pubTime = newsTime.transTimes(time,2)
			                    html.push('<em class="pub-time">'+pubTime+'</em><i class="see"></i><em class="see_num">'+list[i].click+'</em>')
			                    html.push('</div>')
			                    html.push('</div>')
			                    
			                    html.push('</a>')
			                    html.push('</li>')
							}

							$('.channel_'+id).find('ul').append(html.join(''));
                        	$('.item'+id).attr('data-type',0);
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$('.item'+id).attr('data-type',1);
								$('.channel_'+id).find('ul').append('<div class="loading">已经到最后一页了</div>');
							}
							tabsSwiper.updateAutoHeight(100);

						//没有数据
						}else{
							isload = true;
							$('.channel_'+id).find('ul').append('<div class="loading">暂无相关信息</div>');
						}

					//请求失败
					}else{
						$('.channel_'+id).find('ul').append('<div class="loading nomore">'+data.info+'</div>');
					}

				//加载失败
				}else{
					$('.channel_'+id).find('ul').append(langData['siteConfig'][20][227]); //网络错误，加载失败！
				}
			},
			error: function(){
				isload = false;
				$('.channel_'+id).find('ul').append(langData['siteConfig'][20][227]); //网络错误，加载失败！
			}
		});
	}

})
