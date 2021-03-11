$(function(){
    //APP端取消下拉刷新
    toggleDragRefresh('off');
	var cpage = 1,rload =0
    // 互动的高度
    var a = $(window).height();
    var b = $('.video-box').height();
    var c = $('.name_title').height();
    var d = $('.header').height();
    var f = $('iframe').height();
    var e = $('.Bottom_inputBox').height();
    //$('.comment_list').height(a-b-c-d-e-f);

    //点击input获取和失去焦点事件
    $("#common_btn").focus(function(){
        $('.information').hide();
        $('.fabulous').hide();
        $('.fasong').show();
        $('.mask').show();
    });

    $('.mask').click(function(){
        $('.mask').hide();
        $('.information').show();
        $('.fabulous').show();
        $('.fasong').hide();
        $("#common_btn").blur();
    });



    //导航内容切换
    $('.tabBox li').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        var i = $(this).index();
        $('.listWrap .sameList').eq(i).addClass('show').siblings().removeClass('show');
        getList();
    });
    var page = 1;
    var loadMoreLock = false;
    var objId = $('.comment_list');
    var objId2 = $('.good_list');
    var objId3 = $('.albumlist');
    //加载
    var oft = $('.tabBox').offset().top;
    $(window).scroll(function() {       
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if($(window).scrollTop() > oft){
            $('.tabBox').addClass('topFixed'); 
        }else{
            $('.tabBox').removeClass('topFixed');
        }
        if ($(window).scrollTop() >= scroll && !loadMoreLock) {
            var page = parseInt($('.tabBox .active').attr('data-page')),
                totalPage = parseInt($('.tabBox .active').attr('data-totalPage'));
            if (page < totalPage) {
                ++page;
                loadMoreLock = true;
                $('.tabBox .active').attr('data-page', page);
                getList();
            }
        };
    });

	getList()
	
	function getList() {
        var active = $('.tabBox .active'), action = active.attr('data-id'), url;
        var page = active.attr('data-page');
        $('.loading').remove();
        if (action == 1) {
            
            objId.append('<div class="loading">'+langData['siteConfig'][38][8]+'</div>');//加载中...           
            url =  "/include/ajax.php?service=member&action=getComment&type=video-detail&son=1&aid="+detail_id+"&page="+page+"&pageSize=10";
          
        }else if(action == 2){
            
            objId2.append('<div class="loading">'+langData['siteConfig'][38][8]+'</div>');//加载中...
            url = "/include/ajax.php?service=video&action=goodlist&vid="+detail_id+"&page="+page+"&pageSize=15";
        }else if(action == 3){
            
            objId3.append('<div class="loading">'+langData['siteConfig'][38][8]+'</div>');//加载中...
            url = "/include/ajax.php?service=video&action=alist&album="+album+"&orderby=2&page="+page+"&pageSize=10";
        }
        loadMoreLock = true;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function (data) {
                var list = data.info.list;
                if(data && data.state == 100){
                    var html   = [];
                    var defend =  certify = listpic =  domain = "";
                    var pageinfo = data.info.pageInfo,totalpage = pageinfo.totalPage;
                    active.attr('data-totalPage', totalpage);
                    if(list.length >0){

                        for(var i=0;i<list.length;i++){
                            if(action==1){//评论
                                html.push('<li class="fn-clear">');
                                html.push('<div class="com_img"><img onerror="this.src=\'/static/images/noPhoto_100.jpg\'" src="'+(list[i].user.photo?list[i].user.photo:"/static/images/noPhoto_100.jpg")+'"></div>');
                                html.push('<div class="con_txtList">');
                                html.push('<div class="huifu" data-id="'+list[i].id+'">');
                                html.push('<p class="txt_name">'+(list[i].user.nickname?list[i].user.nickname:langData['info'][2][33])+'</p>');
                                html.push('<p class="txt_title">'+list[i].content+'</p></div>');
                                        // {#if $common.lower.list!=null#}
                                if(list[i].lower.count>0){
                                    html.push('<div class="reply_list">');
                                    for(var m=0; m<list[i].lower.count; m++){
                                        html.push('<p><span>'+(list[i].lower.list[m]?list[i].lower.list[m].user.nickname:langData['info'][2][33])+'：</span>'+list[i].lower.list[m].content+'</p>')
                                    }
                                    html.push('</div>')
                                }
                                var cls = list[i].zan_has?"active":"";
                                html.push('<p class="while fn-clear"><span class="t_date">'+list[i].ftime+'</span><span class="t_time"></span><span data-common-id="'+list[i].id+'" class="dianzan '+cls+'">'+list[i].zan+'</span></p>');
                                html.push('</div></li>');
                            }if(action==2){//商品
                                var pic = list[i].litpic!='' && list[i].litpic != undefined ? list[i].litpic : "/static/images/404.jpg";
                                html.push('<li><a href="'+list[i].goodsurl+'">');
                                html.push('<div class="goodImg">');
                                if( page == 1 && i<10 ){
                                   html.push('<em>'+(i+1)+'</em>');  
                                }                              
                                html.push('     <img src="'+pic+'" onerror="javascript:this.src=\''+staticPath+'images/404.jpg\';this.onerror=this.src=\''+staticPath+'images/noPhoto_100.jpg\';">');
                                html.push('</div>');
                                html.push('<div class="goodInfo">');
                                html.push('<h3>'+list[i].title+'</h3>');
                                var priceArr = list[i].price.split('.')
                                if(list[i].price){
                                    html.push('<p class="price"><strong>'+priceArr[0]+'</strong>.'+priceArr[1]+'</p>');
                                }
                                html.push('<span class="goBuy">去购买</span>');
                                html.push('</div>');
                                html.push('</a></li>');
                            }else if(action==3){//专辑视频

                                var pic = list[i].litpic!='' && list[i].litpic != undefined ? list[i].litpic : "/static/images/404.jpg";
                                html.push('<li>');
                                html.push('  <div class="top_img">');             
                                html.push('     <a href="'+list[i].url+'">');
                                html.push('     <img src="'+pic+'" onerror="javascript:this.src=\''+staticPath+'images/404.jpg\';this.onerror=this.src=\''+staticPath+'images/noPhoto_100.jpg\';">');
                                html.push('     <div class="scInfo">');
                                if(list[i].click > 0){
                                html.push('    <span class="see"><em>'+list[i].click+'</em>次观看</span>');
                                }                              
                             	 if(list[i].times){
                                html.push('     <span class="time">'+list[i].times+'</span>');
                              	}
                               html.push('     </div>');
                                html.push('     <div class="need">');
                                var str1 = str2 ='';
                                if(list[i].videocharge ==3){
                                    str1 = ' <span class="money">付费</span>';
                                }
                                if(list[i].videocharge ==1){
                                    str2 = ' <span class="vip">VIP</span>';
                                }
                                html.push('       '+str1+str2+'');
                                html.push('     </div>');
                                html.push('     </a>');
                                html.push('   </div>');             
                                html.push('   <div class="vInfo">');
                                html.push('     <h3><a href="'+list[i].url+'">'+list[i].title+'</a></h3>');
                                html.push('</div>');
                                html.push('</li>');
                            }                        
 
                        }
                        if (action == 1) {
                            objId.find('.loading').remove();
                            if(page == 1){
                                objId.find('ul').html(html.join(""));
                            }else{
                                objId.find('ul').append(html.join(""));
                            }
                        }else if(action == 2){
                            objId2.find('.loading').remove();
                            if(page == 1){
                                objId2.find('ul').html(html.join(""));
                            }else{
                                objId2.find('ul').append(html.join(""));
                            }
                        }else if(action == 3){
                            objId3.find('.loading').remove();
                            if(page == 1){
                                objId3.find('ul').html(html.join(""));
                            }else{
                                objId3.find('ul').append(html.join(""));
                            }
                        }
                        loadMoreLock = false;
                        if(page >= pageinfo.totalPage){
                            loadMoreLock = true;
                            if (action == 1) {
                                objId.append('<div class="loading">'+langData['renovation'][15][1]+'</div>');//没有更多啦~
                            }else if(action == 2){
                                objId2.append('<div class="loading">'+langData['renovation'][15][1]+'</div>');//没有更多啦~
                            }else if(action == 3){
                                objId3.append('<div class="loading">'+langData['renovation'][15][1]+'</div>');//没有更多啦~
                            }
                        }
                    }else{
                        loadMoreLock = false;
                        if(action == 1) {
                            objId.find('.loading').html(langData['siteConfig'][20][126]);//暂无相关信息！
                        }else if(action == 2){
                            objId2.find('.loading').html(langData['siteConfig'][20][126]);//暂无相关信息！
                        }else if(action == 3){
                            objId3.find('.loading').html(langData['siteConfig'][20][126]);//暂无相关信息！
                        }
                    }
                }else {
                    loadMoreLock = false;
                    if(action == 1) {
                        objId.find('.loading').html(data.info);
                    }else if(action == 2){
                        objId2.find('.loading').html(data.info);
                    }else if(action == 3){
                        objId3.find('.loading').html(data.info);
                    }
                }
            },
            error: function(){
                loadMoreLock = false;
                if (action == 1) {
                    objId.find('.loading').html(langData['renovation'][2][29]);//网络错误，加载失败...
                }else if(action == 2){
                    objId2.find('.loading').html(langData['renovation'][2][29]);//网络错误，加载失败...
                }else if(action == 3){
                    objId3.find('.loading').html(langData['renovation'][2][29]);//网络错误，加载失败...
                }
            }
        })
    }
	


    //回复事件
    $('.comment_list ul').delegate('.huifu','click',function(){
        var t = $(this);
        var huifu_user = t.attr("data-id");
        $("#common_btn").focus();
        var a = t.find('.txt_name').text();
        $('#common_btn').attr('placeholder','回复：'+a);
        $('#common_btn').attr('data-id', huifu_user);
    });


    $('.video-box').on('click',function(){
        $('.video-btn').css('display','-webkit-flex');
        $('#video-control').css('display','-webkit-flex');
        setTimeout(function(){ $('#video-control').css('display','none'); $('.video-btn').css('display','none');}, 5000);
    });

    if(detail_videotype != 1){
        var box = document.getElementById("video-control"); //box对象
        var video = document.getElementById("video"); //视频对象
        var play = document.getElementById("play"); //播放按钮
        var vbplay = document.getElementById("vbplay");//视频中间播放按钮
        var time = document.getElementById('time');
        var progress = document.getElementById("progress"); //进度条
        var bar = document.getElementById("bar"); //蓝色进度条
        var control = document.getElementById("control"); //声音按钮
        var sound = document.getElementById("sound"); //喇叭
        var full = document.getElementById("full") //全屏
        video.addEventListener('play', function() {
            play.className = "pause";
            $('.play-box').find('i').removeClass('play-icon').addClass('pause-icon');
        });
        video.addEventListener('pause', function() {
            play.className = "play";
            $('.play-box').find('i').removeClass('pause-icon').addClass('play-icon');
        });
        video.addEventListener('timeupdate', function() {
            var timeStr = parseInt(video.currentTime);
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
            time.innerHTML = minute;
        });
        video.addEventListener('volumechange', function() {
            if(video.muted) {
                sound.className = "soundoff"
            } else {
                sound.className = "soundon"
            }
        });
        full.addEventListener("click", function() {
            $('.video-box').toggleClass('fullscreen-box');
            $('.markBox').toggleClass('show');
            var type = $(this).hasClass('small') ? "del" : "add";
            if(type=="del"){
                $(this).removeClass('small')
            }else{
                $(this).addClass('small')
            }

        }, false)
        play.onclick = function() {
            if(video.paused) {
                play.className = "pause";
                video.play();
            } else {
                play.className = "play";
                video.pause();
            }
        }
        vbplay.onclick = function() {
            if (video.paused){
                video.play();
                video.value = "pause";
            }else{
                video.pause();
                video.value = "play";
            }
        }
        //进度条
        video.addEventListener("timeupdate", function() {
            var scales = video.currentTime / video.duration;
            bar.style.width = progress.offsetWidth * scales + "px";
            control.style.left = progress.offsetWidth * scales + "px";
        }, false);
        var move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
        control.addEventListener("touchstart", function(e) {
            var leftv = e.touches[0].clientX - progress.offsetLeft - box.offsetLeft;
            if(leftv <= 0) {
                leftv = 0;
            }
            if(leftv >= progress.offsetWidth) {
                leftv = progress.offsetWidth;
            }
            control.style.left = leftv + "px"
        }, false);
        control.addEventListener('touchmove', function(e) {
            var leftv = e.touches[0].clientX - progress.offsetLeft - box.offsetLeft;
            if(leftv <= 0) {
                leftv = 0;
            }
            if(leftv >= progress.offsetWidth) {
                leftv = progress.offsetWidth;
            }
            control.style.left = leftv + "px"
        }, false);
        control.addEventListener("touchend", function(e) {
            var scales = control.offsetLeft / progress.offsetWidth;
            video.currentTime = video.duration * scales;
            video.play();
            document.onmousemove = null;
            document.onmousedown = null;
            //video.pause();
        }, false);
        sound.onclick = function() {
            if(video.muted) {
                video.muted = false;
                sound.className = "soundon"
            } else {
                video.muted = true;
                sound.className = "soundoff"
            }
        }

    }



    // 点赞
    $('.comment_list ul').delegate('.dianzan','click',function(){
      var t = $(this);
      var detail_comm_id = t.attr("data-common-id");
      var type_ = 0;

      var b = parseInt(t.text());
      var type = 'add';
      if(t.hasClass('active')){
        type = 'del';
        b--;
      }else{
        b++;
      }

        $.ajax({
            url: masterDomain + "/include/ajax.php?service=member&action=dingComment&id="+detail_comm_id+"&type="+type,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data.state==100){
                    if(t.hasClass("active")){
                        t.removeClass('active');
                    }else{
                        t.addClass('active');
                    }
                    t.text(b);
                }else{
                    alert(data.info);
                    t.removeClass('active');
                }

            }
        });
    });

    // 评论框处的点赞
    $('.fabulous').click(function(){
        var t = $(this);
        var type = 1;

    	$.ajax({
    		url: "/include/ajax.php?service=member&action=getZan&module=video&temp=detail"+"&id="+detail_id+"&uid="+admin,
    		type: "GET",
    		dataType: "json",
    		success: function (data) {
    			t.find('i').toggleClass('active');
    		}
    	});
    });


    //点关注
    $(".guanzhu").click(function () {
        var type = 0;
        var t = $(".guanzhu");
        if(t.hasClass('isfollow')){
            type = 1;
            $.ajax({
                url : '/include/ajax.php?service=video&action=follow&userid=' + followId + '&type=' + type + '&temp=video',
                data : '',
                type : 'get',
                dataType : 'json',
                success : function (data) {
                    if(data.state == 100){
                        if(type){
                            $('.sucAdd').show();
                            setTimeout(function(){$('.sucAdd').fadeOut()},1500);
                            t.html('<a href="'+fbUrl+'">已关注</a>');
                            t.removeClass('isfollow');
                            t.addClass('follow');

                        }
                    }else{
                        alert(data.info);
                    }

                }
            })
        }
        

    })


    /**
     * 评论
     */
    function common_method(comm_content, floor)
    {
        if(!comm_content){
            return false;
        }
        if(floor == 0 || floor == undefined){
            var url = masterDomain + '/include/ajax.php?service=member&action=sendComment&type=video-detail&aid=' + detail_id + '&content=' + comm_content;
        }else{
            var url = masterDomain + '/include/ajax.php?service=member&action=replyComment&id=' + floor + '&content=' + comm_content;
        }
        $.ajax({
            url : url,
            data : '',
            type : 'get',
            dataType : 'jsonp',
            success : function (data) {
                if(data.state == 100){
                    // window.location.href = window.location.href;
					cpage = 1;
					getList();
					$("#common_btn").val('')
                }else{
                    alert(data.info);
                }

            }
        })
    }



    $(".fasong").click(function () {
        var floor = 0;
        var common = $("#common_btn").val();
        var huifu_user = $("#common_btn").attr("data-id");
        if(!common){
            alert("请输入评论");
            return;
        }
        if(huifu_user){
            floor = huifu_user;
        }
        common_method(common, floor, detail_id);

    })
    $('.needA.money').click(function(){
        $('.disk').show();
        $('.moneyAlert').animate({'bottom':'0'},200);
    })
    //去支付
    $('.goPay').click(function(){
        $.ajax({
            url: '/include/ajax.php?service=video&action=videodeal&aid='+detail_id+'&amount='+price,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.state == '100'){
                    window.location.href=data.info;
                    return false;
                }
            },
            error:function(){
            }
        });
        // $('.disk').hide();
        // $('.moneyAlert').animate({'bottom':'-100%'},200);
        // $('.paySuc').show();
        // setTimeout(function(){$('.paySuc').fadeOut()},1500);
    })

    //关闭弹窗
    $('.disk').click(function(){
        $('.disk').hide();
        $('.moneyAlert').animate({'bottom':'-100%'},200);
    })


})
