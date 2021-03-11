$(function(){

    $('img').scrollLoading();
    $.fn.bigImage({
        artMainCon:".art_text",  //图片所在的列表标签
    });

    // 收藏
    $('.collect').click(function(){
        var btn = $(this) , obox , autoClose = false;;
        if(btn.hasClass('disabled')) {
            obox = $('.modal-msg');
            obox.children('.txt').text('已取消收藏');
            btn.removeClass('disabled').children('span').text('收藏');
            autoClose = true;
        } else {
            obox = $('.modal-collect');
            if(true) {
                btn.addClass('disabled').children('span').text('已收藏');
            } else {
                obox.children('.re_success').hide()
                    .children('.re_error').show()
            }
        }

        var op = obox.parent();
        if(op.is('.modalwrap')) {
            op.addClass('open');
        } else {
            var len = $('.modalwrap').length;
            var $wrap = '<div class="modalwrap open" id="modalwrap_' + len + '" data-close="' + autoClose + '">';
            obox.wrapAll($wrap);
            op = obox.parent();
        }
        if(op.attr('data-close') == 'true') {
            setTimeout(function(){
                op.removeClass('open');
            },2000)
        }
    })

    // 关闭弹出层
    $(document).on('click','.re_cancel',function(){
        $('.modalwrap').removeClass('open');
    })

    $(window).resize(function(){
        resizeRoot();
    })

    // 赞/踩
    $('#m_attitude .p_act').click(function(){
        pinLunBarPos();
        var a = $(this);
        if(a.hasClass('lose')) return;
        var on = a.find('.num'), n = parseInt(on.text());
        var type = a.hasClass('dig') ? 'dig' : 'tread';
        var src = '';
        if(a.hasClass('done')) {
            on.text(--n);
            setBar(type,n);
            $('.p_bar span').css('width',0);
            $('.p_bar').addClass('default');
            a.removeClass('done').siblings('.p_act').removeClass('lose');
            src = type == 'dig' ? templatePath+'images/zan.png' : templatePath+'images/cai.png';
            a.find('img.m').attr('src',src);
            $('.state').css('opacity',0);
            $('.p_tip').css('opacity',1);
        } else {
            on.text(++n);
            setBar(type,n);
            $('.p_bar').removeClass('default');
            a.addClass('done').siblings('.p_act').addClass('lose');
            src = type == 'dig' ? templatePath+'images/zan_haved.png' : templatePath+'images/cai_haved.png';
            a.find('img.m').attr('src',src);
        }
    })

    function pinLunBarPos(){
        var myaw = $('#m_attitude').width();
        var barw = myaw - $('#m_attitude .dig').width() - $('#m_attitude .tread').width() - 10;
        $('#m_attitude .p_bar').css({'width':barw + 'px','margin-left':'-' + (barw/2) + 'px'})
    }

    function setBar(type,n){
        var dig_num,tread_num,str;
        if(type == 'dig') {
            dig_num = n;
            tread_num = parseInt($('.tread_num').text());
            str = '赞';
        } else {
            dig_num = parseInt($('.dig_num').text());
            tread_num = n;
            str = '踩';
        }
        var digbl = dig_num / (dig_num + tread_num),
            treadbl = 1 - digbl,
            str = '我等' + n + '人<span class="fcr">' + str + '</span>了这篇文章';
        $('.p_bar .red').css('width',digbl * 100 + '%');
        $('.p_bar .blur').css('width',treadbl * 100 + '%');
        $('.state').html(str).removeClass('hide').css('opacity',1);
        $('.p_tip').css('opacity',0);
    }

    // 勾选分享我的态度到微博
    $('.p_describ .tip').click(function(){
        $(this).toggleClass('on');
    })


    // ----底部搜索
    // 改变搜索范围
    $('.scopeselect').change(function(){
        var o = $(this),
            r = $(this).val();
        var s = $('.scopeselect option:selected').text();
        o.siblings('strong').text(s);
    })

    /* 写评论 */
    $('.f_cmnt_input ,.wcmt_cancel').click(function(){

      var userid = $.cookie(cookiePre+"login_user");
  		if(userid == null || userid == ""){
  			top.location.href = masterDomain + '/login.html';
  			return false;
  		}

      toggleFootComment();
    })


    function toggleFootComment(id){
        // var replayid = id ? id : 0;
        // $('#wcmt_send_btm').attr('data-id',replayid);
        var box = $('.footer_comment');
        if(box.hasClass('open')) {
            $('html, body').css({"height": "auto", "overflow": "auto"});
            $('.footer_comment').removeClass('open');
            $('#cmnt_bdbg').remove();
        } else {

            var wh = $(window).height();
            $('html, body').css({"height": wh, "overflow": "hidden"});

            box.addClass('open');
            $('.newcomment').focus();
            $('body').append('<div id="cmnt_bdbg" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:899;"></div>');
            G('cmnt_bdbg').addEventListener('touchstart',function(e){
                toggleFootComment();
                e.preventDefault();
            })
        }
    }


    //提交评论回复
  	$("#wcmt_send_btm").click(function(){

      var userid = $.cookie(cookiePre+"login_user");
  		if(userid == null || userid == ""){
  			top.location.href = masterDomain + '/login.html';
  			return false;
  		}

  		var t = $(this);
  		if(t.hasClass("loading")) return false;

  		var contentObj = $(".newcomment"),
  			content = contentObj.val();

  		if(content == ""){
        alert("请输入您要评论的内容！");
  			return false;
  		}
  		if(huoniao.getStrLength(content) > 200){
  			alert("超过200个字了！");
        return false;
  		}

  		t.addClass("loading").html('发布中...');
  		$.ajax({
  			url: "/include/ajax.php?service=member&action=sendComment&type=article-detail&aid="+newsid,
  			data: "content="+content,
  			type: "POST",
  			dataType: "json",
  			success: function (data) {
  				t.removeClass("loading").html('发布');
  				if(data && data.state == 100){
            contentObj.val('');
    				$(".wcmt_cancel").click();
  					alert('发布成功！');
  				}else{
            alert(data.info);
          }
  			}
  		});

  	});



    var dashangElse = false;
  	$('.shangbtn span').click(function(){
  		var t = $(this);
        if(t.hasClass("loading")) return;
		t.addClass("loading");

        //验证文章状态
		$.ajax({
			"url": masterDomain + "/include/ajax.php?service=article&action=checkRewardState",
			"data": {"aid": newsid},
			"dataType": "jsonp",
			success: function(data){
				t.removeClass("loading");
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
				t.removeClass("loading");
				alert("网络错误，操作失败，请稍候重试！");
			}
		});


  	})

  	// 其他金额
  	$('.shang-item .inp').click(function(){
  	  $('.shang-item-cash').hide();
      $(this).hide();
  	  $('.shang-item .shang-else').show();
      dashangElse = true;
      $(".shang-else input").focus();
  	})

  	// 遮罩层
  	$('.mask').on('click',function(){
      $('.mask').hide();
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
        	// 	$("#shangWxpay").remove();
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



//单点登录执行脚本
function ssoLogin(info){


	//已登录
	if(info){
    $(".nav .login").html('<img onerror="javascript:this.src=\'/static/images/noPhoto_40.jpg\';"src="'+info['photo']+'">').removeClass().addClass("user");
    $(".user_info .fl a").html('<img onerror="javascript:this.src=\'/static/images/noPhoto_40.jpg\';"src="'+info['photo']+'">'+info['nickname']);

    $.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
    $(".nav .user").html('').removeClass().addClass("login");
    $.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});
	}

}