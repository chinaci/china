$(function(){

	var atpage = 1, isload = false, pageSize = 4;

	//点赞
	$('.shortVideoBox').on('click','._right',function(e){

        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
			return false;
		}
        var num = parseInt($(this).find('.numZan').text());
        if($(this).find('.numZan').hasClass('onclick')){
            num = parseInt(num - 1);
            $(this).find('.numZan').html(num);
			$(this).find('.numZan').removeClass('onclick');
        }else{
            num = parseInt(num + 1);
            $(this).find('.numZan').html(num);
			$(this).find('.numZan').addClass('onclick');
        }

        var uid = $(this).attr('data-uid'), id = $(this).attr('data-id');
        
        $.post("/include/ajax.php?service=member&action=getZan&module=article&temp=detail&id="+id + "&uid=" + uid);
	});

	$('.shortVideoBox').delegate('li', 'click', function(e){
        var t = $(this), a = t.find('a'), url = a.attr('data-url');
        var target = $(e.target);
        if(target.closest("._right").length == 1){//点击id为parentId之外的地方触发

        }else{
            setTimeout(function(){location.href = url;}, 500);
        }
	});

	$(window).scroll(function() {
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if ($(window).scrollTop() + 50 > scroll && !isload) {
            atpage++;
            getData();
        };
	});

	function getData(tr){

        isload = true;

        if(tr){
            atpage = 1;
			$(".recomList ul .box1").html("");
			$(".recomList ul .box2").html("");
        }

        $(".recomList").append('<div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>'+langData['siteConfig'][20][184]+'</span></div>');
        $(".recomList .loading").remove();

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);
		data.push("mold="+mold);
		data.push("notid="+detail_id);
		data.push("uid="+uid);
        data.push("get_zan=1");
		if(typeid != undefined && typeid != '' && typeid != null){
			data.push("typeid="+typeid);
		}

        $.ajax({
            url: "/include/ajax.php?service=article&action=alist",
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if (data && data.state == 100) {
                    $(".loading").remove();
                    var list = data.info.list, pageInfo = data.info.pageInfo, page = pageInfo.page, html = [], html1 = [];
                    var totalPage = data.info.pageInfo.totalPage;
                    for (var i = 0, lr; i < list.length; i++) {
                        lr = list[i];
                        var time = returnHumanTime(lr.pubdate,3);
						var piccount = lr.group_img == undefined ? 0 : lr.group_imgnum;

						if(i%2==0){
							html.push('<li class="liBox">');
							html.push('<a href="javascript:;" data-url="' + lr.url + '">');
							html.push('<div class="imgbox"><img src="'+huoniao.changeFileSize(lr.litpic, "small")+'" /></div>');
							html.push('<div class="videoInfo">');
							html.push('<h2>' + lr.title + '</h2>');
							html.push('<div class="up_more">');
							var uid = lr.admin;
                            if(lr.media != null){
								uid = lr.media.userid;
								html.push('<div class="_left"><div class="headimgbox"><img src="'+(lr.media.ac_photo ? huoniao.changeFileSize(lr.media.ac_photo, "small") : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></div><h2>'+lr.media.ac_name+'</h2></div>');
							}else{
								html.push('<div class="_left"><div class="headimgbox"><img src="'+staticPath + 'images/noPhoto_60.jpg'+'" alt=""></div><h2>'+lr.writer+'</h2></div>');
							}
                            if(lr.zan==1){
                                html.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan onclick">' + lr.zannum + '</span></div>');
                            }else{
                                html.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan">' + lr.zannum + '</span></div>');
                            }
							html.push('</div>');
							html.push('</div>');
							html.push('</a>');
							html.push('</li>');
						}else{
							html1.push('<li class="liBox">');
							html1.push('<a href="javascript:;" data-url="' + lr.url + '">');
							html1.push('<div class="imgbox"><img src="'+huoniao.changeFileSize(lr.litpic, "small")+'" /></div>');
							html1.push('<div class="videoInfo">');
							html1.push('<h2>' + lr.title + '</h2>');
							html1.push('<div class="up_more">');
							var uid = lr.admin;
                            if(lr.media != null){
								uid = lr.media.userid;
								html1.push('<div class="_left"><div class="headimgbox"><img src="'+(lr.media.ac_photo ? huoniao.changeFileSize(lr.media.ac_photo, "small") : (staticPath + 'images/noPhoto_60.jpg') )+'" alt=""></div><h2>'+lr.media.ac_name+'</h2></div>');
							}else{
								html1.push('<div class="_left"><div class="headimgbox"><img src="'+staticPath + 'images/noPhoto_60.jpg'+'" alt=""></div><h2>'+lr.writer+'</h2></div>');
							}
                            if(lr.zan==1){
                                html1.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan onclick">' + lr.zannum + '</span></div>');
                            }else{
                                html1.push('<div data-id="' + lr.id + '" data-uid="' + uid + '" class="_right"><span class="numZan">' + lr.zannum + '</span></div>');
                            }
							html1.push('</div>');
							html1.push('</div>');
							html1.push('</a>');
							html1.push('</li>');
						}
						
                    }
					$(".recomList ul.box1").append(html.join(""));
					$(".recomList ul.box2").append(html1.join(""));
                    isload = false;
                    //最后一页
                    if(atpage >= data.info.pageInfo.totalPage){
                        isload = true;
                        $(".recomList .loading").remove();
                        $(".recomList").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
                    }
                }else{
                    isload = true;
                    $(".loading").remove();
                    $(".recomList").append('<div class="loading"><span>'+data.info+'</span></div>');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".recomList").html('<div class="loading"><span>'+langData['siteConfig'][20][184]+'</span></div>');
            }
        });

	}
	
	//初始加载
    getData();

	//关注
	$('.shortdetailBox').on('click','.btn_care',function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
		}
		
		if($(this).hasClass('cared')){
			$(this).html('<s></s>关注');
			$(this).removeClass('cared')
		}else{
			$(this).html('<s></s>已关注');
			$(this).addClass('cared')
		}

		var mediaid = $(this).attr("data-id");

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+mediaid);

	});

	//点赞
	$('.commentList').on('click','.btnUp',function(){
		var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          window.location.href = masterDomain+'/login.html';
          return false;
		}

		var t = $(this), id = t.attr("data-id");
        if(t.hasClass("active")) return false;
		
		var num = t.find('em').html();
        if( typeof(num) == 'object') {
          num = 0;
		}
		var type = 'add';
        if(t.hasClass("active")){
            type = 'del';
            num--;
        }else{
            num++;
        }

		$.ajax({
			url: "/include/ajax.php?service=member&action=dingComment&id="+id+ "&type=" + type,
			type: "GET",
			dataType: "json",
			success: function (data) {
				t.addClass('active');
				t.find('em').html(num);
			}
		});

	});

	$('.shortdetailBox').on('click','.numup',function(){
		var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
			return false;
		}

		var num = $(this).text()*1;
		if($(this).hasClass('aclick')){
			$(this).removeClass('aclick');
			$(this).text(num-1)
		}else{
			$(this).addClass('aclick');
			$(this).text(num+1)
		}
		$.post("/include/ajax.php?service=member&action=getZan&module=article&temp=detail&id="+detail_id + "&uid=" + uid);
	});

	var player = new Aliplayer({
	  "id": "player-con",
	  "source": detail_video,
	  "cover": poster,
	  "width": "100%",
	  "height": "4.2rem",
	  "autoplay": false,
	  "rePlay": false,
	  "playsinline": true,
	  "preload": true,
	  "controlBarVisibility": "hover",
	  "useH5Prism": true,
	  "skinLayout": [],
	}, function (player) {
		$('#player-con video').attr('poster', poster);
	    console.log("播放器创建了。");
	  }
);
   //控制栏显示
 $('.prism-player video').on('click',function(){
    $('.video-btn').css('display','-webkit-flex');
    $('#video-control').css('display','-webkit-flex');
      setTimeout(function(){ $('#video-control').css('display','none'); $('.video-btn').css('display','none');}, 5000);
 });
        var box = $("#video-control"); //box对象
        var video = $("#video"); //视频对象
        var play = $("#play"); //播放按钮
        var vbplay = $("#vbplay");//视频中间播放按钮
        var time = $('#time');
        var progress = $("#progress"); //进度条
        var bar = $("#bar"); //蓝色进度条
        var control = $("#control"); //声音按钮
        var sound = $("#sound"); //喇叭
        var full = $("#full") //全屏
       player.on('pause',function(){
       		play.addClass('play').removeClass('pause');
       		$('.play-box').find('i').removeClass('pause-icon').addClass('play-icon');
       		
       });
       player.on('play',function(){
       		play.addClass('pause').removeClass('play');
       		vbplay.click();
       		$('.play-box').find('i').removeClass('play-icon').addClass('pause-icon');
		   	$('.load-box').hide();
		    
       });
        
		//数据缓冲
		player.on('waiting',function(){
			$('.video-btn').css('display','-webkit-flex');
			vbplay.hide();
		   	$('.load-box').show();	   
		});
		player.on('canplay',function(){
			vbplay.show();
		   	$('.load-box').hide();
		});
		
		player.on('ended',function(){
			$('.video-btn').css('display','-webkit-flex');
			vbplay.show();
		})
		//视频时间
       player.on('timeupdate',function(){
       	 var timeStr = parseInt(player.getCurrentTime());
            var minute = parseInt(timeStr/60);
            if(minute == 0){
                if(timeStr < 10){
                    timeStr = "0"+timeStr  ;
                }
                minute = "00:"+timeStr;
            }else{
                var timeStr = timeStr%60;
                if(timeStr < 10){
                    timeStr = "0"+timeStr  ;
                }
                minute = minute +":"+timeStr;
            }
            time.html(minute) ;
       });
       //当视频全屏的时候
       player.on('requestFullScreen',function(){
       	  if(!isIOS){
       	  	$('.full').addClass('small');
			$('#player-con video').css({
				'width':'100%',
				'height':'auto !important'
			})
       	  }
       		
       });
       //当视频取消全屏的时候
       player.on('cancelFullScreen',function(){
       		$('.full').removeClass('small');
       		player.play();
       });
       //进度条
       player.on('timeupdate',function(){
       	 var scales = player.getCurrentTime() / player.getDuration();
            bar.css('width',progress.width() * scales + "px") ;
            control.css('left',progress.width() * scales + "px") ;
       },false);
        var move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
        control.on("touchstart", function(e) {
            var leftv = e.touches[0].clientX - progress.offset().left - box.offset().left;
            if(leftv <= 0) {
                leftv = 0;
            }
            if(leftv >= progress.width()) {
                leftv = progress.width();
            }
            control.css('left',leftv + "px"); 
            console.log('开始'+leftv)
        }, false);
        control.on('touchmove', function(e) {
            var leftv = e.touches[0].clientX - progress.offset().left - box.offset().left;
            if(leftv <= 0) {
                leftv = 0;
            }
            if(leftv >= progress.width()) {
                leftv = progress.width();
            }
            control.css('left',leftv + "px"); 
            console.log('移动'+leftv)
        }, false);
        control.on("touchend", function(e) {
        	var leftv = e.changedTouches[0].clientX- progress.offset().left - box.offset().left
            var scales = leftv / progress.width();
          
            player.seek(player.getDuration() * scales);
           
            document.onmousemove = null;
            document.onmousedown = null;
            console.log(control.offset().left)
        }, false);
  
        //设置静音或者解除静音
      sound.click(function(){
      	if(sound.hasClass('soundon')){
      		sound.removeClass('soundon').addClass('soundoff');
      		player.setVolume(0);
      		console.log('静音')
      	}else{
      		sound.addClass('soundon').removeClass('soundoff');
      		player.setVolume(.5)
      	}
      })
      //设置全屏
     
       full.click(function(){
       	if(!isIOS){
       		if(player.fullscreenService.getIsFullScreen()){
	       	  	$(this).removeClass('small');
	       	  	 player.fullscreenService.cancelFullScreen();
	       	  }else{
	       	  	$(this).addClass('small')
	       	  	 player.fullscreenService.requestFullScreen();
	       	  }
       	}else{
       		player.fullscreenService.requestFullScreen();
       	}
       });
       
       //点击播放
      
       vbplay.click(function(){
       	 var status = player.getStatus()
       	 $('.prism-player video').click();
		   console.log(status);
		   if(status=='playing'){
		   	  player.pause();
		   }else{
		   	   player.play();
		   }
	   });

      play.click(function(){
      	if(play.hasClass('play')){
      		player.play();
            console.log('播放中')
      	}else{
      		player.pause();
             console.log('暂停中')    
      	}
      })  
	
});
		   

   
    