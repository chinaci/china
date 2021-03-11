$(function(){
	var userid = $.cookie(cookiePre + "login_user");
	//客户端发帖
	setupWebViewJavascriptBridge(function(bridge) {
		$(".fabuTieba").bind("click", function(event){
			if (device.indexOf('huoniao_Android') > -1) {
				event.preventDefault();
				var userid = $.cookie(cookiePre+"login_user");
				if(userid == null || userid == ""){
					location.href = masterDomain + "/login.html";
					return false;
				}
				bridge.callHandler("postTieba", {}, function(responseData) {});
			}
		});
	});








	$('.card_box').delegate('.manage_card','click',function(){
	  $('.manage-mask').addClass('show');
	  $('.manage-alert').animate({"bottom":'0'},200);
	  $('html').addClass('noscroll');
	});
	$('.ruzhu').on('click',function(){
	  $('.manage-mask').addClass('show');
	  $('.manage-alert').animate({"bottom":'0'},200);
	  $('html').addClass('noscroll');
	});
	//关闭 管理卡片
	$(".close_alert,.manage-mask").bind("click", function(){
	  $('.manage-mask').removeClass('show');
	  $('.manage-alert').animate({"bottom":'-200%'},200);
	  $('html').removeClass('noscroll');
	});
	 $('.has-add').delegate('i','click',function(){
	    var par = $(this).parent('li')
	    var hasId = par.attr('type-id');
	    var hasTitle = par.find('span').text();
	    par.remove();//移除自身父元素
	    //添加到其他管理中
	    $('.no-add ul').prepend("<li type-id='"+hasId+"'><i></i><span>"+hasTitle+"</span></li>")
	  })

	    //2.添加新模块
	  $('.no-add').delegate('i','click',function(){
	    var par = $(this).parent('li')
	    var noId = par.attr('type-id');
	    var noTitle = par.find('span').text();
	    par.remove();//移除自身父元素
	    //添加到其他管理中
	    $('.has-add ul').append("<li type-id='"+noId+"'><i></i><span>"+noTitle+"</span><s class='sort-down'></s><s class='sort-up'></s></li>")
	});
	   //3.已有模块上移
	  $('.has-add').delegate('.sort-up','click',function(){
	    if($(this).hasClass('disabled')) return false;
	    var par = $(this).parent('li');
		$('.sort-up').addClass('disabled')
	    if(par.prev().size()>0){
	      par.addClass('slide-top');
	      par.prev().addClass('slide-bottom');
	      setTimeout(function(){
	        $('.has-add li').removeClass('slide-top');
	        $('.has-add li').removeClass('slide-bottom');
	        par.prev().before(par);

	      },500)
	    }
        setTimeout(function(){
          $('.sort-up').removeClass('disabled');
        })
	  })
	    //3.已有模块下移
	  $('.has-add').delegate('.sort-down','click',function(){
	    var par = $(this).parent('li');
		if($(this).hasClass('disabled')) return false;
		$('.sort-down').addClass('disabled')
	    if(par.next().size()>0){
	      par.addClass('slide-bottom');
	      par.next().addClass('slide-top');
	      setTimeout(function(){
	        $('.has-add li').removeClass('slide-top');
	        $('.has-add li').removeClass('slide-bottom');
	        par.next().after(par);

	      },500)
	    }
        setTimeout(function(){
          $('.sort-down').removeClass('disabled');
        })
	  })


	  //管理功能卡片完成
	  $('.manage-alert').delegate('.finish','click',function(){

	    if (userid == null || userid == "") {
	      window.location.href = masterDomain + '/login.html';
	      return false;
	    }

	    var t = $(this);
	    if(t.hasClass('disabled')) return false;
	    t.addClass('disabled');
	    showMsg('保存中...', 60000, false);

	    //将已添加 未添加的id 传给接口 接口处进行排序 页面重新刷新 请求数据
	    //已添加
	    var dataHas= [];
	    $('.has-add li').each(function(){
	      var addId = $(this).attr('type-id');
	      dataHas.push(addId);
	    })

	    //未添加
	    var dataNo= [];
	    $('.no-add li').each(function(){
	      var noId = $(this).attr('type-id');
	      dataNo.push(noId);
	    })

	    //保存数据
	    $.ajax({
	        url: '/include/ajax.php',
	        data: 'service=member&action=updateUserModule&sort=' + dataHas.join(',') + '&hide=' + dataNo.join(','),
	        type: 'post',
	        dataType: 'json',
	        success: function (res) {
	            t.removeClass('disabled');
	            if(res.state == 100){

	                $('.manage-mask').removeClass('show');
	                $('.manage-alert').animate({"bottom":'-88%'},200);
	                $('html').removeClass('noscroll');

	                showMsg(langData['siteConfig'][6][39], 2000, false); //保存成功

	                setTimeout(function(){
	                    location.reload();
	                }, 1000);

	            }else{
	                showMsg(res.info, 2000, false);
	            }
	        },
	        error: function (res) {
	            t.removeClass('disabled');
	            showMsg(langData['siteConfig'][6][201], 2000, false); //网络错误，保存失败，请稍候重试！
	        }
	    })


	  })



	  var nav_click = 1;
	  $(window).scroll(function(){
		  var scroll = $(window).scrollTop();
		  var nav_top = $('.card_nav').offset().top - $(".fixedtop").height();
		  if(device.indexOf('huoniao_iOS') > -1){
               if(scroll>0){
               	  $('.fixedtop').addClass('slide-in-top').removeClass('slide-out-top');

               }else{
               	  $('.fixedtop').removeClass('slide-in-top').addClass('slide-out-top')
               }
		  }
		  if(scroll>=nav_top){
			  $('.fixedtop').addClass('show')
			  $('.fixedtop').append($('.card_nav ul'))

		  }else{
			  $('.fixedtop').removeClass('show');
			  $('.card_nav').append($('.fixedtop ul'))
		  }

		  // 内容滑动到哪,导航跟着变化
		  $(".mod_dl").each(function(){
			  var t = $(this);
			  if((t.offset().top - 50 - $(".fixedtop").height())<=scroll && nav_click){
				  $('.fixedtop li').eq(t.index()).addClass('active').siblings().removeClass('active');
				   var end = $('.active').offset().left + $('.active').width() / 2 - $('body').width() /2;
				   var star = $(".fixedtop ul").scrollLeft();
				   $('.fixedtop ul').scrollLeft(end + star);
			  }
			  if($(".manage_card").offset().top<=scroll){
				  $('.ruzhu').addClass('active');
				  $('.fixedtop li').removeClass('active');
				  var end = $('.active').offset().left + $('.active').width() / 2 - $('body').width() /2;
				  var star = $(".fixedtop ul").scrollLeft();
				  $('.fixedtop ul').scrollLeft(end + star);
			  }
		  });

	  });
	  $('.fixedtop,.card_nav').delegate('li','click',function(){
		  let t = $(this),index = t.index();
		  t.addClass('active').siblings().removeClass('active');
		  var end = $('.active').offset().left + $('.active').width() / 2 - $('body').width() /2;
		  var star = $(".fixedtop ul").scrollLeft();
		  $('.fixedtop ul').scrollLeft(end + star);
		  nav_click = 0;
		  var scTop = $('.card_content dl').eq(index).offset().top  -$(".fixedtop ").height();
		  $(window).scrollTop(scTop);
		  setTimeout(function(){
			   nav_click = 1;
		  },500)
	  });

	  //客户端登录验证
      if (device.indexOf('huoniao') > -1) {
          setupWebViewJavascriptBridge(function(bridge) {
              //未登录状态下，隔时验证是否已登录，如果已登录，则刷新页面
              var userid = $.cookie(cookiePre+"login_user");
              if(userid == null || userid == ""){
                  var timer = setInterval(function(){
                      userid = $.cookie(cookiePre+"login_user");
                      if(userid){
                          $.ajax({
                              url: '/getUserInfo.html',
                              type: "get",
                              async: false,
                              dataType: "jsonp",
                              success: function (data) {
                                  if(data){
                                      clearInterval(timer);
                                      bridge.callHandler('appLoginFinish', {'passport': data.userid, 'username': data.username, 'nickname': data.nickname, 'userid_encode': data.userid_encode, 'cookiePre': data.cookiePre, 'photo': data.photo, 'dating_uid': data.dating_uid}, function(){});
                                      bridge.callHandler('pageReload', {}, function(responseData){});
                                  }
                              }
                          });

                          // location.reload();
                      }
                  }, 500);
              }else if($('.nlogin').size() > 0){
                  location.reload();
              }
          })
      }


	  // 消息提示
	    function showMsg(msg, time, showbg){
	        var time = time ? time : 2000;
	        var sowbg = showbg !== undefined ? showbg : true;
	        $('.dialog_msg').remove();

	        var html = '<div class="dialog_msg'+(showbg ? ' dialog_top' : '')+'">';
	        html += '<div class="box">'+msg+'</div>';
	        html += sowbg ? '<div class="bg"></div>' : '';
	        html += '</div>';
	        $('body').append(html);
	        setTimeout(function(){
	            $('.dialog_msg').remove();
	        }, time)
	    }

})
