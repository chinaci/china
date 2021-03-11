$(function(){

    //APP端取消下拉刷新
    toggleDragRefresh('off');

    var userAgent = navigator.userAgent.toLowerCase();

    if(userAgent.toLowerCase().match(/micromessenger/)){
        $('.fi_02').show();
    }


var u = navigator.userAgent;
var isIOS = u.indexOf('iPhone') > -1
//创建播放器
var islive =false,type = $('.prism-player').data('type');
if(type==1){
	islive =true;
	$('#progress, #time').css('visibility','hidden');
}
var source = $('.prism-player').data('src');
var poster = $('.prism-player').data('poster');
var player = new Aliplayer({
  "id": "player-con",
  "source": source,
  "cover": poster,
  "width": "100%",
  "height": "4.2rem",
  "autoplay": true,
  "isLive": islive,
  "rePlay": false,
  "playsinline": true,
  "preload": true,
  "controlBarVisibility": "hover",
  "useH5Prism": true,
  "skinLayout": [],
}, function (player) {
    console.log("播放器创建了。");
  	$('#player-con video').attr('poster', poster);
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



    // 互动的高度
    var a = $(window).height();
    var b = $('.prism-player').height();
    var c = $('.navigation_list').height();
    var d = $('.header').height();
    var e = $('.search_bar').height();
    var f = $('.btn_request').height();
    $('.interact').height(a-b-c-d-e);
    $('.jieshao').height(a-b-c-d);
    $('.hudong').height(a-b-c-d);
    // $('.yaoqinbang').height(a-b-c-d);
    $('.yqb').height(a-b-c-d-f);
    // $('.interact').height(a-b-c-d-e);
    // $('.interact').height(a-b-c-d-e);




    // 点击导航切换
    $('.navigation_list ul li').click(function(){
         var t = $(this),i=t.index();
         if(!t.hasClass('active')){
            t.addClass('active').siblings().removeClass('active');
         }
        $('.main>div:eq('+i+')').show();
        $('.main>div:eq('+i+')').siblings().hide();
        if(i == 1){
            $('.jieshao').height(a-b-c-d);
        }else if(i == 0){
            $('.interact').height(a-b-c-d-e);
        }else if(i == 2){
            var f = $('.btn_request').height();
            $('.yaoqinbang').height(a-b-c-d);
            $('.yqb').height(a-b-c-d-f);
        }else if(i == 3){
            $('.hezuo').height(a-b-c-d);
        }
    });

    // 点击关注
    $('.navigation_list span').click(function(){
        // $('.disk_01').show();
        // $('.follow_QR').show();
        // $('.prism-player video').addClass('player-hide');//隐藏视频
        var t = $(this);
        if(t.hasClass('active')){
          t.text('关注');
        }else{
          t.text('已关注');
        }
        t.toggleClass('active');
        $.post("/include/ajax.php?service=live&action=followMember&id="+live_user, function(){});
    });
    $('.disk_01').click(function(){
        $('.disk_01').hide();
        $('.follow_QR').hide();
        $('.prism-player video').removeClass('player-hide');//隐藏视频
    });
	//顶部右侧导航栏
	$('.dropnav').click(function(){
		 $('.prism-player video').toggleClass('player-hide');//隐藏视频
	})

    // 点赞
    $('.fixed_icon .fi_04').click(function(){
        checkLogin();
        var t = $(this),m = parseInt(t.find('p').text());

        m = parseInt(t.find('p').text());

        t.hasClass('active') ? m-- : m++;

        $.ajax({
            url: "/include/ajax.php?service=member&action=getZan&module=live&temp=h_detail"+"&id="+id+"&uid="+live_user,
            type: "GET",
            dataType: "json",
            success: function (data) {
                t.toggleClass('active');
                t.find('p').text(m);
            }
        });
    });

    //付费观看
    $(".start_pay").click(function(){
        checkLogin();
        var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
        var re = new RegExp(regu);
        if (!re.test(amount)) {
            amount = 0;
            alert("最少0.01元！");
            return false;
        }
        var app = device.indexOf('huoniao') >= 0 ? 1 : 0;
        location.href = masterDomain + "/include/ajax.php?service=live&action=livePay&liveid="+id+"&amount="+amount+"&app="+app;
        return;
    });

    //点击加-红包、照片
    $('.jia').click(function(){
        checkLogin();
        var t = $(this);
        if(t.hasClass('on')){
            t.removeClass('on');
            $('.Multi_function').hide();
            $('.search_bar').css('bottom','0');
            $('.mask_01').hide();
        }else{
            t.addClass('on');
            $('.Multi_function').show();
            $('.search_bar').css('bottom','2.04rem');
            $('.mask_01').show();
            $('.emotion-box').hide();
        }
    });
    $('.mask_01').click(function(){
        $('.jia').removeClass('on');
        $('.Multi_function').hide();
        $('.search_bar').css('bottom','0');
        $('.mask_01').hide();
    });
    // $(document).on('click',':not(.Multi_function)',function(){
    //     $('.jia').removeClass('on');
    //     $('.Multi_function').hide();
    //     $('.search_bar').css('bottom','0');
    // })


    // 点击邀请榜
    $('.yaoqinbang .switch_list p span').click(function(){
        var t = $(this);
        var state = t.attr("data-id");
        if(!t.hasClass('active')){
            t.addClass('active');
            t.siblings().removeClass('active');
            if(state == 1){
                $(".dashangbang").hide();
                $(".yaoqingbang").show();
            }else{
                $(".yaoqingbang").hide();
                $(".dashangbang").show();
            }
        }
    });

    $(".ios-input-submit").click(function () {
        var text = $("#content_text").html();
        if(text == ''){
            alert("请输入要评论的内容");return;
        }
        if(luser_id == -1){
            alert("请登录!");
            window.location.href = masterDomain + '/login.html';
            return;
        }
        $.ajax({
            url : masterDomain + '/include/ajax.php?service=live&action=chatTalk',
            data : {
                chatid : chatRoomId,
                userid : luser_id,
                username : username,
                userphoto : userphoto,
                content : text,
            },
            type :'GET',
            dataType :'json',
            success : function (data) {
                if(data.state == 100){

                    $("#content_text").html('');
                    $('.ios-input-close').click();
                }
            }
        })
    })



    //点击互动的搜索框
   $('.search_keyword').click(function(){
        checkLogin();
        $('.ios-input-box').show();
        $('.prism-player video').addClass('player-hide');//隐藏视频
     });
    $('.ios-input-close').click(function(){
        $('.ios-input-box').hide();
        $('.emotion-box').hide();
        $('.search_bar').css('bottom','0');
        $('.biaoqin').removeClass('active');
        $('.prism-player video').removeClass('player-hide');//显示视频
    })

    // 点击送礼物
    $('.liwu').click(function(){
        checkLogin();
        $('#c-gift').show();
        $('.mask').show();

    });
    $('.mask').click(function(){
        $('#c-gift').hide();
        $('.mask').hide();
    });
    $('.layui-m-anim-scale .mlbn-present li').click(function(){
        var t = $(this);
        var c = parseFloat(t.find('.mlbn-present-zan-money').html());
        $('#c-gift').addClass('Upward');
        if(!t.hasClass('on')){
            t.addClass('on').siblings().removeClass('on');
        }
        $('#fs-gift-total').html(c)
        $('.fsl-shuliang-number').val(1);

    });

    $('.txt').click(function(){
        set_focus($('.placeholder:last'));
    })



    // 点击表情
    $('.biaoqin').click(function(){
        checkLogin();
        var t = $(this);
        if(t.hasClass('active')){
            $('.emotion-box').hide();
            $('.search_bar').css({'bottom':'0','z-index':'10'});
            t.removeClass('active');
            $('.ios-input-box').hide();
            $('.prism-player video').removeClass('player-hide');

        }else{
            $('.emotion-box').show();
            $('.search_bar').css({'bottom':'4.1rem','z-index':'10000'});
            t.addClass('active');
            $('.ios-input-box').show();
            $('.prism-player video').addClass('player-hide');
             $('#c-gift').hide();
        	 $('.mask').hide();
        	 $('.Multi_function').hide();
            $('.mask_01').hide();
        }
    })


  $("#content").focus(function(){
    var t = $(this), con = t.html();

    if(con == "帖子内容"){
      t.removeClass("placeholder").html("");
    }

  });

  $("#content").blur(function(){
    var t = $(this), con = t.html();
    if(con == ""){
      t.addClass("placeholder").html("帖子内容");
    }
  });
 $('#content_text').focus(function(){
 	$('.emotion-box').hide();
 	 $('.search_bar').css('bottom','0');
     $('.biaoqin').removeClass('active');
 })

  // 表情区域禁止滑动
  $('.emotion-box, .linkbox').bind('touchmove', function(e){
    e.preventDefault();
  })

  var textarea = $('.textarea');
  $('.emotion-box li').click(function(){
        var t = $(this).find('img');
    $('.textarea').find('.txt-gray').remove();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      $('.textarea').append('<img src="'+t.attr("src")+'" class="emotion-img" />');
      return false;
    }else {
      pasteHtmlAtCaret('<img src="'+t.attr("src")+'" class="emotion-img" />');
    }
    document.activeElement.blur();
    return false;
    })

  //根据光标位置插入指定内容
    function pasteHtmlAtCaret(html) {
      var sel, range;

      if (window.getSelection) {
          sel = memerySelection;

          if (sel.anchorNode == null) {return;}

          if (sel.anchorNode.className != undefined && sel.anchorNode.className.indexOf('placeholder') > -1 || sel.anchorNode.parentNode.className != undefined && sel.anchorNode.parentNode.className.indexOf('placeholder') > -1) {

          if (sel.getRangeAt && sel.rangeCount) {
              range = sel.getRangeAt(0);
              range.deleteContents();
              var el = document.createElement("div");
              el.innerHTML = html;
              var frag = document.createDocumentFragment(), node, lastNode;
              while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
              }
              range.insertNode(frag);
              if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
              }
          }
        }
      } else if (document.selection && document.selection.type != "Control") {
          document.selection.createRange().pasteHTML(html);
      }
  }

  //光标定位到最后
    function set_focus(el){
        el=el[0];
        el.focus();
        if($.browser.msie){
            var rng;
            el.focus();
            rng = document.selection.createRange();
            rng.moveStart('character', -el.innerText.length);
            var text = rng.text;
            for (var i = 0; i < el.innerText.length; i++) {
                if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
                    result = i + 1;
                }
            }
      return false;
        }else{
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }




    var page = 1;
    var isload = false;



    RongIMLib.RongIMClient.init(appKey,null,config);
    var instance = RongIMClient.getInstance();
    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    break;
            }
        }
    });
    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            switch(message.messageType){
                case RongIMClient.MessageType.TextMessage:
                    if(chatRoomId==message.targetId){//需要判断是否是相同的聊天室，不然后的话信息就会乱窜其他的聊天室。
                        updateMessage(message.content.content);
                    }
                    break;
                case RongIMClient.MessageType.LiveComment:
                    html='';
                    if(chatRoomId==message.targetId){//需要判断是否是相同的聊天室，不然后的话信息就会乱窜其他的聊天室。
                        console.log(message);
                        html +='<li class="fn-clear">';
                        html +='<div class="head_portrait"><img src="'+message.content.avatarUrl+'" onerror="javascript:this.src=\'/static/images/noPhoto_100.jpg\';"></div>';
                        html +='<div class="text"><p class="name">'+message.content.username+'</p><div class="content"><p>'+message.content.comment+'</p></div></div>';
                        html +='</li>';
                    }
                    $('.interact_list ul').append(html);
                    // var t = document.getElementById("main_info");
                    // t.innerHTML += html;
                    break;
            }
        }
    });
    //开始链接

    RongIMClient.connect(token, {
        onSuccess: function(userId) {
            //链接成功后 才可 发送消息
            RongIMClient.userInfo = {
                data : {userId: userId,userName:username,userPhoto:userphoto},
                status : "ok",
                info : "链接成功"
            };
            joinChat(RongIMClient.userInfo);
            loaddata();
        },
        onTokenIncorrect: function() {
            //console.log('token无效');
        },
        onError:function(errorCode){
            console.log(errorCode);
        }
    });
    var callback = {
        onSuccess: function(userId) {
            console.log("Reconnect successfully." + userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError:function(errorCode){
            console.log(errorcode);
        }
    };
    var reconfig = {
        // 默认 false, true 启用自动重连，启用则为必选参数
        auto: true,
        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
        url: staticPath + 'js/rong/RongIMLib-2.2.9.min.js',
        // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        rate: [100, 1000, 3000, 6000, 10000]
    };
    RongIMClient.reconnect(callback, reconfig);

    function joinChat(userInfo){
        RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
            onSuccess: function() {
                var messageName = "LiveComment"; // 消息名称。
                var objectName = "HNLiveComment"; // 消息内置名称，请按照此格式命名。
                var mesasgeTag = new RongIMLib.MessageTag(false,false);// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
                var prototypes = ["username","comment","avatarUrl"]; // 消息类中的属性名。
                RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes);

                var chatRoom = {
                    id : chatRoomId,
                    currentUser : userInfo.data,
                    getInfo : function (params,callbacks){
                        var order = params.order; //RongIMLib.GetChatRoomType.REVERSE;// 排序方式。
                        var memberCount = params.memberCount; // 获取聊天室人数 （范围 0-20 ）
                        RongIMClient.getInstance().getChatRoomInfo(chatRoomId, memberCount, order,callbacks);
                    },
                    quit : function(callbacks){
                        RongIMClient.getInstance().quitChatRoom(chatRoomId, callbacks);
                    },
                    sendMessage : function(content, callbacks){
                        var conversationType = RongIMLib.ConversationType.CHATROOM;
                        //var msg = new RongIMLib.TextMessage(content);
                        var msg = new RongIMClient.RegisterMessage.LiveComment({username:userInfo.data.userName,comment:content.content,avatarUrl:userInfo.data.userPhoto});
                        RongIMClient.getInstance().sendMessage(conversationType, chatRoomId, msg, callbacks);
                    }
                };
                apiDemo(chatRoom);
            },
            onError: function(error) {
                // 加入聊天室失败
                console.log('聊天室失败');
            }
        });
    }




    function apiDemo(chatRoom){
        $("#rc-chatroom-input").keyup(function (e) {
            if (!e) {
                var e = window.event;
            }
            if (e.keyCode) {
                code = e.keyCode;
            }
            else if (e.which) {
                code = e.which;
            }
            if (code === 13) {
                $("#rc-chatroom-button").click();
            }
        });

        $('.box_bottom .bg').bind('click', function(){
            $(this).hide();
            //$('.box_bottom').addClass('fixed');
            $("#rc-chatroom-input").focus();
        });

        $("#rc-chatroom-input").blur(function(){
            $('.box_bottom .bg').show();
            //$('.box_bottom').removeClass('fixed');
        });

        //点击发送消息
        $("#rc-chatroom-button").click(function(){

            var userid = $.cookie(cookiePre+"login_user");
            if(userid == null || userid == ""){
                window.location.href = masterDomain+'/login.html';
                return false;
            }

            var content = $("#rc-chatroom-input").val();
            var content1 = $("#rc-chatroom-input").val();
            if(content==''){return false;}
            var userid = chatRoom.currentUser.userId;
            var username = chatRoom.currentUser.userName;
            var userphoto = chatRoom.currentUser.userPhoto;
            content='<li class="fn-clear"><div class="head_portrait"><img src="'+userphoto+'" onerror="javascript:this.src=\'/static/images/noPhoto_100.jpg\';"></div><div class="text"><p class="name">'+username+'</p><div class="content"><p class="chat_content">'+content+'</p></div></div></li>';
            chatRoom.sendMessage({"content" : content1}, {
                onSuccess: function (message) {
                    console.log("发送聊天室消息成功");
                    updateMessage(content);
                    chatTalk(chatRoom.id,userid,username,userphoto,content1)
                },
                onError: function (errorCode,message) {
                    console.log("发送聊天室消息失败",errorCode);
                }
            });
        });
    }
    /*
    发送弹幕方法
    */
    function updateMessage(message){
        var t = document.getElementById("main_info");
        $("#rc-chatroom-input").val('');
        t.innerHTML += message;
        t.scrollTop = t.scrollHeight;
    }

    //聊天记录插入数据
    function chatTalk(chatid,userid,username,userphoto,content){
        var url = masterDomain + "/include/ajax.php?service=live&action=chatTalk";
        $.ajax({
            url: url,
            data: "chatid="+chatid+"&userid="+userid+"&username="+username+"&userphoto="+userphoto+"&content="+content,
            type: "GET",
            dataType: "jsonp",
            success: function (msg) {
                if(msg.state == 100){
                    console.log('suc');
                }else{
                    console.log('error');
                }
            },
            error: function(){
                console.log('网络错误，操作失败！');
            }
        });
    }

var msgIdArr = [];
    //加载聊天室数据  msgArrId
    function loaddata(){
        isload = true;
        var url = masterDomain + "/include/ajax.php?service=live&action=talkList&chatid="+chatRoomId;
        var t = $("#main_info");
        $.ajax({
            url: url,
            data: "page="+page,
            type: "GET",
            dataType: "jsonp",
            success: function (msg) {
                if(msg.state == 100){
                    console.log(msg);
                    var list = msg.info.list, html ="" , date = msg.info.pageInfo.date;
                    if(list.length > 0){
                        html = '<div class="interact_list">' +
                            '<p class="hour">'+date+'</p>' +
                            '<ul>';
                        for(var i = 0; i < list.length; i++){
                            msgIdArr.push(list[i].id);
                            var content_type = list[i].content;
                            if(content_type.indexOf("__H__:") != -1){
                                var h_id = content_type.replace("__H__:","");
                                var is_fin = '1';
                                var data_state = '0';
                                if(list[i].h_state == 1){
                                    is_fin = '2';
                                    data_state = 1;
                                }else if(list[i].h_state == 2){
                                    data_state = 2;
                                }

                                html += '<li class="fn-clear">' +
                                    '<div class="head_portrait"><img src="'+list[i].userphoto+'"></div>' +
                                    '<div class="text">' +
                                    '<p class="name">'+list[i].username+'</p>' +
                                    '<div class="hongbao hongbao_bg_0'+is_fin+'" data-state="'+data_state+'" data-liveid="'+h_id+'">' +
                                    '<img src="'+templets_skin+'images/bb_xiao.png">' +
                                    '<div class="hongbao_top">' +
                                    '<p class="h_01">'+list[i].note+'</p>' +
                                    '<p class="h_02">领取红包</p>' +
                                    '</div>' +
                                    '<div class="hongbao_bottom">普通红包</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>';
                            }else if(content_type.indexOf("__L__:") != -1){
                                //礼物
                                if(list[i].is_gift == 0){
                                    //打赏
                                    html += '<li><div class="liwu_list"><p>'+list[i].username+' 打赏了'+live_user_n+' '+list[i].amount+' 元</p></div></li>';
                                }else{
                                    //礼物
                                    html += '<li><div class="liwu_list"><p>'+list[i].username+' 送了'+live_user_n+' '+list[i].num+' 个 <em>'+list[i].gift_name+'</em></p></div></li>';
                                }
                            }else if(content_type.indexOf("__T__:") != -1){
                                var img_ = content_type.replace("__T__:","");
                                html += '<li class="fn-clear">' +
                                    '<div class="head_portrait"><img src="'+list[i].userphoto+'"></div>' +
                                    '<div class="text">' +
                                    '<p class="name">'+list[i].username+'</p>' +
                                    '<div class="content"><p><img style="width: 3rem;" src="'+img_+'" alt=""></p></div>' +
                                    '</div>' +
                                    '</li>';
                            }else{
                                html += '<li class="fn-clear">' +
                                    '<div class="head_portrait"><img src="'+list[i].userphoto+'"></div>' +
                                    '<div class="text">' +
                                    '<p class="name">'+list[i].username+'</p>' +
                                    '<div class="content"><p>'+list[i].content+'</p></div>' +
                                    '</div>' +
                                    '</li>';
                            }


                        }

                    }

                    html += '</ul></div>';

                    t.html(html);
                    $("#main_info").scrollTop($("#main_info")[0].scrollHeight);


                }else{
                    console.log('error');
                }
            },
            error: function(){
                console.log('网络错误，操作失败！');
            }
        });

    }


    function msgArr(){
        var masTime = (Date.parse(new Date()) / 1000)-2;
        var url = masterDomain + "/include/ajax.php?service=live&action=talkList&chatid="+chatRoomId+"&date="+masTime;
        var t = $("#main_info ul");
        $.ajax({
            url: url,
            data: "page="+page,
            type: "GET",
            dataType: "jsonp",
            success: function (msg) {
                if(msg.state == 100){
                    var list = msg.info.list, html ="" , date = msg.info.pageInfo.date;
                    if(list.length > 0){

                        html = '';
                        for(var i = 0; i < list.length; i++){
                            var index = $.inArray(list[i].id, msgIdArr);
                            if(index >= 0){
                                return;
                            }
                            msgIdArr.push(list[i].id);
                            var content_type = list[i].content;
                            if(content_type.indexOf("__H__:") != -1){
                                var h_id = content_type.replace("__H__:","");
                                var is_fin = '1';
                                var data_state = '0';
                                if(list[i].h_state == 1){
                                    is_fin = '2';
                                    data_state = 1;
                                }else if(list[i].h_state == 2){
                                    data_state = 2;
                                }

                                html += '<li class="fn-clear">' +
                                    '<div class="head_portrait"><img src="'+list[i].userphoto+'"></div>' +
                                    '<div class="text">' +
                                    '<p class="name">'+list[i].username+'</p>' +
                                    '<div class="hongbao hongbao_bg_0'+is_fin+'" data-state="'+data_state+'" data-liveid="'+h_id+'">' +
                                    '<img src="'+templets_skin+'images/bb_xiao.png">' +
                                    '<div class="hongbao_top">' +
                                    '<p class="h_01">'+list[i].note+'</p>' +
                                    '<p class="h_02">领取红包</p>' +
                                    '</div>' +
                                    '<div class="hongbao_bottom">普通红包</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</li>';
                            }else if(content_type.indexOf("__L__:") != -1){
                                //礼物
                                if(list[i].is_gift == 0){
                                    //打赏
                                    html += '<li><div class="liwu_list"><p>'+list[i].username+' 打赏了'+live_user_n+' '+list[i].amount+' 元</p></div></li>';
                                }else{
                                    //礼物
                                    html += '<li><div class="liwu_list"><p>'+list[i].username+' 送了'+live_user_n+' '+list[i].num+' 个 <em>'+list[i].gift_name+'</em></p></div></li>';
                                }
                            }else if(content_type.indexOf("__T__:") != -1){
                                var img_ = content_type.replace("__T__:","");
                                html += '<li class="fn-clear">' +
                                    '<div class="head_portrait"><img src="'+list[i].userphoto+'"></div>' +
                                    '<div class="text">' +
                                    '<p class="name">'+list[i].username+'</p>' +
                                    '<div class="content"><p><img style="width: 3rem;" src="'+img_+'" alt=""></p></div>' +
                                    '</div>' +
                                    '</li>';
                            }else{
                                html += '<li class="fn-clear">' +
                                    '<div class="head_portrait"><img src="'+list[i].userphoto+'"></div>' +
                                    '<div class="text">' +
                                    '<p class="name">'+list[i].username+'</p>' +
                                    '<div class="content"><p>'+list[i].content+'</p></div>' +
                                    '</div>' +
                                    '</li>';
                            }


                        }


                        t.append(html);
                        $("#main_info").scrollTop($("#main_info")[0].scrollHeight);

                    }



                }else{
                    console.log('error');
                }
            },
            error: function(){
                console.log('网络错误，操作失败！');
            }
        });

    }

    setInterval(function(){
        msgArr();
    },800)



    // 红包未抢完的状态
    //$('.hb_img .hb_receive').remove();

    //红包抢完时候的状态
    //$('.hb_img .hb_qiang').remove();
    //$('.hb_img .hb_slogan').text('该红包已被抢完')

    $(".hd_sign_out").click(function () {
        $(".disk_03").hide();
        $(".hongbao_list").hide();
    })



    $('.main_info').delegate('.hongbao', 'click', function() {
        var t = $(this), h_id = t.attr("data-liveid"), state = t.attr("data-state");
        if(state == 1){
            var info = getHongBaoInfo(h_id);
            showHongBaoAfter(info);
            $('.hb_img').hide();
            $('.disk_02').hide();
            return;
        }else if(state == 2){
            //已经抢过 展示抢到的结果
            var info = getHongBaoInfo(h_id);
            showHongBaoAfter(info);
            $('.hb_img').hide();
            $('.disk_02').hide();
        }else{
            $(".hb_qiang").attr("data-id", h_id);
            //让红包显示
            var h_info = t.find('.h_01').text();
            $(".hb_slogan").html(h_info);

            $('.hb_img').show();
            $('.disk_02').show();

            //show
            // getHongBao(t, h_id);
        }
    })

    //点击 抢
    $(".hb_qiang").click(function () {
        var t = $(this);
        var h_id = t.attr("data-id");
        getHongBao(t, h_id);

    })


    $(".hudong .fixed_icon .fi_03").click(function () {
        checkLogin();
        $(".disk_04").show();
        $(".dashang").show();

        $('.prism-player video').addClass('player-hide');//隐藏视频
    })


    function showHongBaoAfter(info){
        if(info.user == undefined){
            $(".hb_m_number").text('0');//自己没抢到
        }else{
            $(".hb_m_number").text(info.user.recv_money);
        }
        $(".hongbao_list .hb_txt").text(info.hongbao.user['username']+"的红包"); //发红包的人昵称
        $(".hongbao_list .hb_portrait img").attr("src", info.hongbao.user['photo']); //发红包的人头像
        var yilq = info.list.length;
        var zongg = info.hongbao.count;
        $(".h_yilingqu").text(yilq); //已抢多少人
        $(".h_zonggong").text(zongg); //总共多少个
        var ylq_y = 0;
        var list_h = '';
        for(var i=0; i<yilq; i++){
            ylq_y += info.list[i].recv_money * 1 ;
            list_h += '<li class="fn-clear">' +
                '<div class="listuser_img"><img src="'+info.list[i].user.photo+'"></div>' +
                '<div class="listuser_name">' +
                '<p class="fn-clear"><em>'+info.list[i].user.username+'</em><em>'+info.list[i].recv_money+'元</em></p>' +
                '<p>'+info.list[i].date+'</p>' +
                '</div>' +
                '</li>';
        }
        var zg_y = info.hongbao.amount;
        $(".ylq_yuan").text(ylq_y); // 已抢多少钱
        $(".zg_yuan").text(zg_y); //红包总额
        // 抢红包列表
        $(".list_qianghongbao").html(list_h);
        $(".disk_03").show();
        $(".hongbao_list").show();
    }

    //送礼物
    $("#fs-gift-send").click(function () {
        var t =  $(this);
        var gift_id = $("#c-gift").find(".on").attr("data-id");
        var num = $("#fs-gift-amount").val();
        var amount = $(".fs-gift-total").html();
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=live&action=songGift',
            data: {
                reward_userid : live_user,
                live_id : id,
                gift_id : gift_id,
                num : num,
                chat_id : chatRoomId,
                amount : amount,
            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.state == 100){
                    info = data.info;
                    location.href = info;
                }else{
                    alert(data.info);
                }
            },
            error: function(){
                console.log('网络错误，操作失败！');
            }
        });
    })


function getHongBaoInfo(h_id)
{
    var info;
    $.ajax({
        url: masterDomain + '/include/ajax.php?service=live&action=getHongBaoInfo',
        data: {
            h_id : h_id
        },
        type: "GET",
        async:false,
        dataType: "json",
        success: function (data) {
            if(data.state == 100){
                info = data.info;
            }else{
                alert(data.info);
            }
        },
        error: function(){
            console.log('网络错误，操作失败！');
        }
    });
    return info;
}

// 抢红包
    function getHongBao(T, h_id)
    {
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=live&action=getHongbao',
            data: {
                h_id : h_id
            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.state == 100){
                    if(data.info.states == 200){
                        //显示领到的钱
                        var info = getHongBaoInfo(h_id);
                        showHongBaoAfter(info);
                        $('.hb_img').hide();
                        $('.disk_02').hide();
                        $(".hongbao").attr("data-state", 2); //已经领过

                    }else if(data.info.states == 201){
                        //抢完
                        $(".hb_receive").css('display', 'block');
                        $(".hb_qiang img").hide();
                        $(".hb_slogan").text("已抢完");
                        $(".hb_receive").attr("data-hid", h_id);
                        $(".disk_02").show();
                        $(".hb_img").show();

                    }else{

                        if(data.info.is_fin == 1 && data.info.states == 203){
                            var info = getHongBaoInfo(h_id);
                            showHongBaoAfter(info);
                            $('.hb_img').hide();
                            $('.disk_02').hide();
                            $(".hongbao").attr("data-state", 2); //已经领过

                            //已抢完
                            $(".hongbao").removeClass('hongbao_bg_01').addClass('hongbao_bg_02').attr("data-state", 1);

                        }else if(data.info.states == 202){
                            T.attr("data-state", 2);
                            alert('不能重复领取');
                        }

                    }
                }else{
                    alert(data.info);
                }
            },
            error: function(){
                console.log('网络错误，操作失败！');
            }
        });
    }


    $(".hb_receive").click(function () {
        var t = $(this);

        $(".disk_02").hide();
        $(".hb_img").hide();
        var info = getHongBaoInfo(t.attr("data-hid"));
        showHongBaoAfter(info);
    })


    //验证提示弹出层
    function showTipMsg(msg){
        /* 给出一个浮层弹出框,显示出errorMsg,2秒消失!*/
        /* 弹出层 */
        $('.protips').html(msg);
        var scrollTop=$(document).scrollTop();
        var windowTop=$(window).height();
        var xtop=windowTop/2+scrollTop;
        $('.protips').css('display','block');
        setTimeout(function(){
            $('.protips').css('display','none');
        },2000);
    }

    $('.dashang .hong_bottom .hong_bg_l ul li').on('touchstart',function(e) {
        var t = $(this);
        t.css('background','#bd2726');
        t.css('color','#fff');
    })
    $('.dashang .hong_bottom .hong_bg_l ul li').on('touchend',function(e) {
        var t = $(this);
        t.css('background','#fefbdc');
        t.css('color','#d63233');
    })

    $('.gengduo .gengduo_btn .gengduo_btn_01').click(function(){
        $('.disk_05').hide();
        $('.gengduo').hide();
    })

    $('.other_money').click(function(){
        $('.disk_05').show();
        $('.gengduo').show();
    });

    $('.dashang .hong_sign_out').click(function(){
        $('.disk_04').hide();
        $('.dashang').hide();
        $('.prism-player video').removeClass('player-hide');
    });


    $(".gengduo_btn_02").click(function () {
        var other_money = $("input[name=other_money]").val();
        if(other_money < 0.1 || other_money > 999){
            alert('请填写规定的金额');return;
        }

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=live&action=songGift',
            data: {
                reward_userid : live_user,
                live_id : id,
                gift_id : 0,
                num : 1,
                chat_id : chatRoomId,
                amount : other_money,
            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.state == 100){
                    info = data.info;
                    location.href = info;
                }else{
                    alert(data.info);
                }
            },
            error: function(){
                console.log('网络错误，操作失败！');
            }
        });


    })


    $(".hong_bg_l li").click(function () {
        var t = $(this);
        var money = parseInt(t.html());
        var gift_id = 0;
        var num = 1;

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=live&action=songGift',
            data: {
                reward_userid : live_user,
                live_id : id,
                gift_id : gift_id,
                num : num,
                chat_id : chatRoomId,
                amount : money,
            },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.state == 100){
                    info = data.info;
                    location.href = info;
                }else{
                    alert(data.info);
                }
            },
            error: function(){
                console.log('网络错误，操作失败！');
            }
        });

    })



    // 红包的隐藏
    $('.hb_img .sign_out').click(function(){
        $('.hb_img').hide();
        $('.disk_02').hide();
    });



//    送礼物数量
    $('.fsl-shuliang-plus').click(function(){
        var a = $('.fsl-shuliang-number').val();
        var b = $('.fsl-present-price #fs-gift-total');
        var c = parseFloat($('.mlbn-present .on .mlbn-present-zan-money').html());
        a++;
        var r = (c*a).toFixed(2);
        $('.fsl-shuliang-number').val(a);
        b.html(r);

    });
    $('.fsl-shuliang-reduce').click(function(){
        var a = $('.fsl-shuliang-number').val();
        var b = $('.fsl-present-price #fs-gift-total');
        var c = parseFloat($('.mlbn-present .on .mlbn-present-zan-money').html());
        if(a > 1){
            a--;
            var r = (c*a).toFixed(2);
            $('.fsl-shuliang-number').val(a);
            b.html(r);
        }
    });


    //    图片上传
    var upPhoto = new Upload({
        btn: '.photograph',
        bindBtn: '.topbox .album .null',
        title: 'Images',
        mod: modelType,
        deltype: 'delAtlas',
        params: 'type=atlas',
        fileQueued: function(file){

        },
        uploadSuccess: function(file, response, btn){
            console.log(response.state)
            if(response.state == "SUCCESS"){
                saveImage(response.url);
            }
        }
    });








    function saveImage(url){

        $.ajax({
            url : masterDomain + '/include/ajax.php?service=live&action=chatTalk',
            data : {
                chatid : chatRoomId,
                userid : luser_id,
                username : username,
                userphoto : userphoto,
                content : '__T__:'+url,
                system: 1, //图片类型必传
            },
            type :'GET',
            dataType :'json',
            success : function (data) {
                if(data.state == 100){
                    $(".mask_01").click();
                }
            }
        })
    }



//    点击图片放大
    /*调起大图 S*/
    var mySwiper = new Swiper('.bigSwiper', {pagination: {el:'.bigPagination',type: 'fraction',},loop: false})
    // $('.interact').click(function () {
    //     alert(1)
    // })
    $("#main_info").delegate('.interact_list .content img', 'click', function() {
        console.log('aaa');
        var imgBox = $(this);
        var i = $(imgBox).index(this);
        $(".bigBoxShow .swiper-wrapper").html("");
        for(var j = 0 ,c = imgBox.length; j < c ;j++){
            $(".bigBoxShow .swiper-wrapper").append('<div class="swiper-slide"><div class="swiper-img"><img src="' + imgBox.eq(j).attr("src") + '" / ></div></div>');
        }
        mySwiper.update();
        $(".bigBoxShow").css({
            "z-index": 999999000000000,
            "opacity": "1"
        });
        mySwiper.slideTo(i, 0, false);
        return false;
    });

    $(".bigBoxShow").delegate('.vClose', 'click', function() {
        $(this).closest('.bigBoxShow').css({
            "z-index": "-1",
            "opacity": "0"
        });

    });
    /*调起大图 E*/



})

//判断登录
function checkLogin(){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
        window.location.href = masterDomain+'/login.html';
        return false;
    }
}
