$(function(){

  // 回复评论展开
	$('body').delegate('.reply', "click", function(){
		var x = $(this), replyBox = x.closest('.reply-box').find('.reply-txt');
		if (replyBox.css("display") == "block") {
			replyBox.hide();
		}else{
			replyBox.show();
		}
		replyBox.find(".textarea").focus();
	})

  //发表回复
	$('body').delegate('.submit', "click", function(){
		var t = $(this), txt = t.text();
		if(t.hasClass("disabled")) return false;

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain + '/login.html';
			return false;
		}

		var content = t.closest('.reply-txt').find('.textarea').val();
		if($.trim(content) == ""){
			alert(langData['siteConfig'][20][385]);
			return false;
		}

		var rid = t.closest('.item').attr("data-id");

		t.addClass("disabled").html(langData['siteConfig'][6][35]);

		$.ajax({
			url: "/include/ajax.php?service=member&action=sendMessage&uid="+uid,
			type: "POST",
			data: {content: content, rid: rid},
			async: false,
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
                    page = 1;
                    getMessage();
                    t.removeClass("disabled").html(txt);
                    $('.layer_txt .textarea').val('');
                    $('.layer_num').text(200);
                    $('.layer').hide();
				}else{
					t.removeClass("disabled").html(txt);
					alert(data.info);
				}
			},
			error: function(){
				t.removeClass("disabled").html(txt);
				alert(langData['siteConfig'][20][386]);
			}
		});

	});

  // 评论弹出层
  $('.fabuBtn').click(function(){
    $('.layer').show();
  })

  // 隐藏弹出层
  $('.layer .header-l').click(function(){
    $('.layer').hide();
  })

	function commonChange(t){
		var val = t.val(), maxLength = 200;
		var charLength = val.replace(/<[^>]*>|\s/g, "").replace(/&\w{2,4};/g, "a").length;
		var alllength = charLength;
		var surp = maxLength - charLength;
		surp = surp <= 0 ? 0 : surp;

		$('.layer_num').text(surp);

		if(alllength > maxLength){
			t.val(val.substring(0,maxLength));
			return false;
		}
	}

	$('.layer_txt .textarea').bind('input propertychange', function(){
		commonChange($(this));
	})


  $('.tjBtn').click(function(){
    var t = $(this).find('a'), txt = t.text();
		if(t.hasClass("disabled")) return false;

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain + '/login.html';
			return false;
		}

		var content = $('.layer_txt .textarea').val();
		if($.trim(content) == ""){
			alert(langData['siteConfig'][20][385]);
			return false;
		}

		var rid = 0;

		t.addClass("disabled").html(langData['siteConfig'][6][35]);

		$.ajax({
			url: "/include/ajax.php?service=member&action=sendMessage&uid="+uid,
			type: "POST",
			data: {content: content, rid: rid},
			async: false,
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
				    page = 1;
                    getMessage();
                    t.removeClass("disabled").html(txt);
                    $('.layer_txt .textarea').val('');
                    $('.layer_num').text(200);
                    $('.layer').hide();
				}else{
					t.removeClass("disabled").html(txt);
					alert(data.info);
				}
			},
			error: function(){
				t.removeClass("disabled").html(txt);
				alert(langData['siteConfig'][20][386]);
			}
		});

  })


    // 下拉加载
    $(window).scroll(function() {
        var h = $('.item').height();
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w - h;
        if ($(window).scrollTop() > scroll && !isload) {
            getList();
        };
    });


  var loadmore = $("#leave_message .load_more");
	getMessage();

	//加载留言
	function getMessage(){
		$.ajax({
			url: "/include/ajax.php?service=member&action=messageList&uid="+uid+"&page="+page+"&pageSize="+pageSize,
			type: "GET",
			async: false,
			dataType: "jsonp",
			success: function (data) {
				loadmore.removeClass("disabled").html(langData['siteConfig'][6][148]);
				if(data && data.state == 100){
					var list = data.info.list, pageInfo = data.info.pageInfo;

					totalPage = pageInfo.totalPage;

					//拼接留言列表
					var html = [];
					for(var i = 0; i < list.length; i++){
						html.push('<div class="item" data-id="'+list[i].id+'">');
						html.push('<dl class="fn-clear">');
						html.push('<dt><a href="'+masterDomain+'/user/'+list[i].uid+'"><img src="'+list[i].photo+'" onerror="this.src=\'/static/images/noPhoto_60.jpg\'" alt=""></a></dt>');
            html.push('<dd>');
            html.push('<p class="nickname"><a href="'+masterDomain+'/user/'+list[i].uid+'">'+list[i].nickname+'</a></p>');
            html.push('<p class="date">'+list[i].date+'</p>');
            html.push('<div class="content">'+list[i].content+'</div>');
            html.push('</dd>');


						if(list[i].reply){
							html.push('<div class="replyed">');
							html.push('<em class="arrow"></em>');
							html.push('<p class="nickname"><a href="'+masterDomain+'/user/'+list[i].reply.uid+'">'+list[i].reply.nickname+'</a></p>');
							html.push('<p class="content">'+list[i].reply.content+'</p>');
							html.push('</div>');
						}

						html.push('<div class="reply-box">');
						html.push('<p class="fn-clear"><a href="javascript:;" class="fn-right reply">'+langData['siteConfig'][6][29]+'</a></p>');
						html.push('<div class="reply-txt">');
						html.push('<em class="arrow"><i></i></em>');
						html.push('<textarea name="name" rows="2" class="textarea txt"></textarea>');
						html.push('<a href="javascript:;" class="submit">'+langData['siteConfig'][6][29]+'</a>');
						html.push('</div>');
						html.push('</div>');
						html.push('</dl>');
						html.push('</div>');

					}

					if(page == 1) {
                        $(".list").html(html.join(""));
                    }else{
                        $(".list").append(html.join(""));
                    }

					//如果已经到最后一页了，移除更多按钮
					if(page == pageInfo.totalPage){
						loadmore.remove();
					}else{
						page++;
					}

				}else{
					loadmore.remove();
					if(page == 1){
							$(".list").html('<div class="empty">'+langData['siteConfig'][20][387]+'</div>');
					}
				}
			},
			error: function(){
				alert(langData['siteConfig'][20][388]);
				loadmore.removeClass("disabled").html(langData['siteConfig'][6][148]);
			}
		});
	}

})
