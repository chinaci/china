
$(function(){

    //APP端取消下拉刷新
    toggleDragRefresh('off');

    var userAgent = navigator.userAgent.toLowerCase();

    if(userAgent.toLowerCase().match(/micromessenger/)){
        $('.fi_02').show();
    }

var device = navigator.userAgent;
	var cookie = $.cookie("HN_float_hide");
//如果不是在客户端，显示下载链接
	if (device.indexOf('huoniao') <= -1 && cookie == null && $('.float-download').size() > 0) {
		
		$('.float-download').show();
	}

	$('.float-download .closesd').click(function(){
		$('.float-download').hide();
		setCookie('HN_float_hide', '1', '1');
	});
	
	function setCookie(name, value, hours) { //设置cookie
     var d = new Date();
     d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
     var expires = "expires=" + d.toUTCString();
     document.cookie = name + "=" + value + "; " + expires;
  }
	
var u = navigator.userAgent;
var isIOS = u.indexOf('iPhone') > -1;



//打赏判断
var reward_len = $('#memberlist li').length;
if(reward_len == 0 ){
	$('#memberlist').append('<p style="font-size:.28rem; color:#2b2b2b; line-height:.44rem; margin-left:.24rem; margin-top:.06rem;">觉得内容精彩就打赏一下小编吧~</p>')
}
//标题判断
var txtlen = $('.videoTitle').find('h2').text().length;
if(txtlen==0){
	$('.videoTitle').hide()
}else{
	$('.videoTitle').show()
}
//创建播放器
var islive =false,type = $('.prism-player').data('type');
if(type==1){
	islive =true;
	$('#progress, #time').css('visibility','hidden');
}
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
		$("#control").on("touchstart",function(e){
			console.log(e)
			var leftv = e.originalEvent.changedTouches[0].clientX - progress.offset().left - box.offset().left;
			if(leftv <= 0) {
			    leftv = 0;
			}
			if(leftv >= progress.width()) {
			    leftv = progress.width();
			}
			control.css('left',leftv + "px"); 
			console.log('开始'+leftv)
		})
       
        control.on('touchmove', function(e) {
            var leftv = e.originalEvent.changedTouches[0].clientX - progress.offset().left - box.offset().left;
            if(leftv <= 0) {
                leftv = 0;
            }
            if(leftv >= progress.width()) {
                leftv = progress.width();
            }
            control.css('left',leftv + "px"); 
        });
        control.on("touchend", function(e) {
        	var leftv = e.originalEvent.changedTouches[0].clientX- progress.offset().left - box.offset().left
            var scales = leftv / progress.width();
          
            player.seek(player.getDuration() * scales);
           
            document.onmousemove = null;
            document.onmousedown = null;
        });
  
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
          url: "/include/ajax.php?service=member&action=dingComment&type=add&id="+id,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            if(data.state==100){
                if(t.hasClass("active")){
                    t.removeClass('active');
                }else{
                    t.addClass('active');
                }
                t.find('em').html(num);
            }else{
                alert(data.info);
                t.removeClass('active');
            }

          }
        });

	});
	
	$('.videoInfoBox').on('click','.numup',function(){
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
   
//关注
	$('.videoInfoBox').on('click','.btn_care',function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
		}
		
		if($(this).hasClass('cared')){
			$(this).html('<s></s>关注');   //关注
			$(this).removeClass('cared')
		}else{
			$(this).html('<s></s>已关注');  //已关注
			$(this).addClass('cared')
		}

		var mediaid = $(this).attr("data-id");

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+mediaid);

	});
    h = $('.limit').height();
    if(h<30){
    	$('.more_detail').hide()
    }
	$('.more_detail').click(function(){
		$(this).hide();
		$('.videoTitle h2').removeClass('limit')
	})
  // 文章点赞
  $('.up_num').click(function(){
      var userid = $.cookie(cookiePre+"login_user");
      if(userid == null || userid == ""){
        window.location.href = masterDomain+'/login.html';
        return false;
      }
      var num = parseInt($('.up_num em').text());
      var t = $(this);
      t.hasClass('active') ? num-- : num++;

      $.ajax({
        url: "/include/ajax.php?service=member&action=getZan&module=article&temp=detail&uid="+admin+"&id="+id,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          t.toggleClass('active');
          $('.up_num em').text(num);
        }
      });
  })
// 赞
    $('.btnUp').on('click',function(){
    
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
        num++;
      
        $.ajax({
          url: "/include/ajax.php?service=article&action=dingCommon&id="+id,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            t.addClass('active');
            t.find('em').html(num);
          }
        });
    });

  var windowTop=0;
    $(window).on("scroll", function(){
        var scrolls = $(window).scrollTop();//获取当前可视区域距离页面顶端的距离
        if(scrolls>=windowTop){//当B>A时，表示页面在向上滑动
            //需要执行的操作
            windowTop=scrolls;
            $('.nfooter').hide();

        }else{//当B<a 表示手势往下滑动
            //需要执行的操作
            windowTop=scrolls;
            $('.nfooter').show();
        }
    });


var dashangElse = false;
    $('.rewardbox').click(function(){
        var t = $(this);
      if(t.hasClass("load")) return;
        t.addClass("load");
        console.log('aaaa');
      //验证文章状态
        $.ajax({
            "url": masterDomain + "/include/ajax.php?service=article&action=checkRewardState",
            "data": {"aid": newsid},
            "dataType": "jsonp",
            success: function(data){
                t.removeClass("load");
                if(data && data.state == 100){

                  $('.mask').show();
                  $('.shang-box').show();
                    $('.shang-item-cash').show();$('.shang-item .inp').show();
                    $('.shang-item .shang-else').hide();
                    $('body').bind('touchmove',function(e){e.preventDefault();});

                }else{
                    alert(data.info);
                }
            },
            error: function(){
                t.removeClass("load");
                alert("网络错误，操作失败，请稍候重试！");
            }
        });
    })

      // 其他金额
    $('.shang-item .inp').click(function(){
      	$(this).hide();
      	$('.shang-item-cash').hide();
    	$('.shang-money .shang-item .error-tip').show()
      	$('.shang-item .shang-else').show();
    	dashangElse = true;
    	$(".shang-else input").focus();
    })

    // 遮罩层
    $('.mask').on('click',function(){
	    $('.mask').hide();
	    $('.shang-money .shang-item .error-tip').hide()
	    $('.shang-box').hide();
	    $('.paybox').animate({"bottom":"-100%"},300)
	    setTimeout(function(){
	      $('.paybox').removeClass('show');
	    }, 300);
        $('body').unbind('touchmove')
    })

    // 关闭打赏
    $('.shang-money .close').click(function(){
        $('.mask').hide();$('.shang-box').hide();
        $('.shang-money .shang-item .error-tip').hide()
        $('body').unbind('touchmove')
    })

  // 选择打赏支付方式
  var amount = 0;
  $('.shang-btn').click(function(){
      amount = dashangElse ? parseFloat($(".shang-item input").val()) : parseFloat($(".shang-item-cash em").text());
      var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
      var re = new RegExp(regu);
      if (!re.test(amount)) {
          amount = 0;
          alert("打赏金额格式错误，最少0.01元！");
          return false;
      }

      var app = device.indexOf('huoniao') >= 0 ? 1 : 0;
      location.href = masterDomain + "/include/ajax.php?service=article&action=reward&aid="+newsid+"&amount="+amount+"&app="+app;

      return;

      $('.shang-box').animate({"opacity":"0"},300);
      setTimeout(function(){
        $('.shang-box').hide();
      }, 300);

      //如果不在客户端中访问，根据设备类型删除不支持的支付方式
      if(appInfo.device == ""){
        // 赏
        if(navigator.userAgent.toLowerCase().match(/micromessenger/)){
            $("#shangAlipay, #shangGlobalAlipay").remove();
        }
        // else{
        //  $("#shangWxpay").remove();
        // }
      }
      $(".paybox li:eq(0)").addClass("on");

      $('.paybox').addClass('show').animate({"bottom":"0"},300);
  })

  $('.paybox li').click(function(){
    var t = $(this);
    t.addClass('on').siblings('li').removeClass('on');
  })

  //提交支付
  $("#dashang").bind("click", function(){

      var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
      var re = new RegExp(regu);
      if (!re.test(amount)) {
          amount = 0;
          alert("打赏金额格式错误，最少0.01元！");
          return false;
      }

      var paytype = $(".paybox .on").data("id");
      if(paytype == "" || paytype == undefined){
          alert("请选择支付方式！");
          return false;
      }

      //非客户端下验证支付类型
      if(appInfo.device == ""){

            if (paytype == "alipay" && navigator.userAgent.toLowerCase().match(/micromessenger/)) {
                showErr("微信浏览器暂不支持支付宝付款<br />请使用其他浏览器！");
                return false;
              }

          location.href = masterDomain + "/include/ajax.php?service=article&action=reward&aid="+newsid+"&amount="+amount+"&paytype="+paytype;
      }else{
          location.href = masterDomain + "/include/ajax.php?service=article&action=reward&aid="+newsid+"&amount="+amount+"&paytype="+paytype+"&app=1";
      }


  });

})

//判断登录
function checkLogin(){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
        window.location.href = masterDomain+'/login.html';
        return false;
    }
}
var page = 1,isload=0;
//初始加载
getdata();
//滚动加载
$(window).scroll(function() {
	var allh = $('body').height();
	var w = $(window).height();
	var scroll = allh - w;
	
	if ($(window).scrollTop() >= scroll&& !isload) {
		console.log(111)
	    page++;
	    getdata();
	};
});


function getdata(){
	isload=1;
	$('.recmbox').append('<div class="loading"><img src="'+templets_skin+'images/loading.png"></div>');
	var v_mold = 2;
	if(v_type=='svdetail'){
		v_mold = 3;
	}else{
		v_mold = 2;
	}
	$.ajax({
        url: "/include/ajax.php?service=article&action=alist&mold="+v_mold+"&page="+page+"&pageSize=5",
        type: "GET",
        dataType: "json", //指定服务器返回的数据类型
        crossDomain:true,
        success: function (data) {
         if(data.state == 100){
         	var datalist = data.info.list,
         	totalpage = data.info.pageInfo.totalPage;
         	var html = [];
         	for(var i=0; i<datalist.length; i++){
         		html.push('<dd class="libox big_img vbox"><a href="'+datalist[i].url+'" class="fn-clear">');
         		html.push('<h2>'+datalist[i].title+'</h2>')
	         	html.push('<div class="img_box"><img src="'+datalist[i].litpic+'" /><i class="time">'+datalist[i].videotime_+'</i></div>');
	         	html.push('<p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(datalist[i].pubdate,3)+'</span><i>'+datalist[i].click+'</i>  </p>');
	         	html.push('</a></dd>');
         	}
         	
         	$('.loading').remove();
         	$('.recmbox').append(html.join(''));
         	setTimeout(function(){
         		isload=0;
         		if(page == totalpage){
	//              console.log('true')
	                isload = 1;
	                $('.recmbox').append('<div class="loading"><span>已全部加载</span></div>');
	             }
         	},500)
         	
          
         }else{
            $('.loading').remove(); 
            $('.recmbox').append('<div class="loading"><span>已全部加载</span></div>');
         }
        },
        error:function(err){
        	console.log('fail');
        }
     });
}