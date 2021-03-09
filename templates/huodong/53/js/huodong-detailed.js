$(function(){

	// 收费类型
	$('.crtxt-1 span').click(function(){
		var i = $(this);
		if (i.hasClass('select')) {
			i.removeClass('select');
		}else{
			i.addClass('select');
			i.siblings("span").removeClass("select");
		}
	})
	//国际手机号获取
	  
	  function getNationalPhone(){
	    $.ajax({
	            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
	            type: 'get',
	            dataType: 'JSONP',
	            success: function(data){

	                if(data && data.state == 100){
	                   var phoneList = [], list = data.info;

	                   for(var i=0; i<list.length; i++){
	                        phoneList.push('<li data-cn="'+list[i].name+'" data-code="'+list[i].code+'">'+list[i].name+' +'+list[i].code+'</li>');
	                   }

	                   $('.areaCode_wrap ul').html(phoneList.join(''));
	                }else{
	                   $('.areaCode_wrap ul').html('<div class="loading">暂无数据！</div>');
	                  }
	            },
	            error: function(){
	                        $('.areaCode_wrap ul').html('<div class="loading">加载失败！</div>');
	                    }

	        })
	  }
	  //显示区号
	  $('body').delegate('.areaCode','click', function(){
	  	getNationalPhone();
	    var areaWrap =$(this).closest("dd").find('.areaCode_wrap');
	    if(areaWrap.is(':visible')){
	      areaWrap.fadeOut(300)
	    }else{
	      areaWrap.fadeIn(300);
	      return false;
	    }
	  });

	  //选择区号
	  $('body').delegate('.areaCode_wrap li', 'click', function(){
	    var t = $(this), code = t.attr('data-code');
	    var par = t.closest("dd");
	    var areaIcode = par.find(".areaCode");
	    areaIcode.find('i').html('+' + code);
	  });

	  $('body').bind('click', function(){
	    $('.areaCode_wrap').fadeOut(300);
	  });

	//报名&取消报名
	$(".baoming a").bind("click", function(){
		var t = $(this), fid = $(".crtxt-1 .select").data("id");

		//验证登录
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(!t.hasClass("loading")){


			//取消报名
			if(t.hasClass("cancel")){

				if(confirm("确认取消报名吗？")){
					t.addClass("loading");
					$.ajax({
						url: masterDomain+"/include/ajax.php?service=huodong&action=cancelJoin&id="+id,
						type: "GET",
						dataType: "jsonp",
						success: function (data) {
							if(data && data.state == 100){
								alert(data.info);
								location.reload();
							}else{
								alert(data.info);
								t.removeClass("loading");
							}
						},
						error: function(){
							alert("网络错误，操作失败，请稍候重试！");
							t.removeClass("loading");
						}
					});
				}
				return false;

			}


			if(feetype == 1 && (fid == undefined || fid == 0 || fid == "")){
				alert("请选择收费项");
				return false;
			}

			$.dialog({
				title: '填写报名信息',
				width: 550,
				content: $('#propertyHtml').html(),
				cancel: true,
				ok: function(){

					var tj = true, data = [];
					var areaCode = $(".areaCode i").text().replace('+', '');
					$('.popupForm dl').each(function(){
						if(!tj) return false;
						var dl = $(this), title = dl.attr('data-id'), type = dl.attr('data-type'), required = dl.attr('data-required');
						
						
						var val;
						//单行文本
						if(type == 'text'){
							val = $.trim(dl.find('input').val());
						}
						//多行文本
						else if(type == 'text_long'){
							val = $.trim(dl.find('textarea').val());
						}
						//单选文本
						else if(type == 'single_vote'){
							val = dl.find('input:checked').val();
						}
						//多选文本
						else if(type == 'multi_vote'){
							var che = [];
							dl.find('input:checked').each(function(){
								che.push($(this).val());
							});
							val = che.join('、');
						}
						if(required == '1' && (val == '' || val == undefined)){
							tj = false;
							alert('请'+(type == 'text' || type == 'text_long' ? '输入' : '选择') + title);
							return false;
						}

						if(val != '' && val != undefined){
							data.push('{"'+title+'": "'+val+'"}');
						}
					});

					if(!tj) return false;

					data = '['+data.join(',')+']';

					$.ajax({
						url: masterDomain+"/include/ajax.php?service=huodong&action=join&id="+id+"&fid="+fid+"&areaCode="+areaCode+"&data="+data,
						type: "GET",
						dataType: "jsonp",
						success: function (data) {
							if(data && data.state == 100){
								if(feetype == 1 && data.info != "报名成功！"){
									location.href = data.info;
								}else{
									alert("报名成功！");
									location.reload();
								}
							}else{
								alert(data.info);
							}
						},
						error: function(){
							alert("网络错误，报名失败，请稍候重试！");
						}
					});
					return false;
				}
			});

		}
	});


	// 用户讨论
	$('.featur-lead p').click(function(){
		var k = $(this);
		var index = k.index();
		$('.xuanze .tt').eq(index).show();
		$('.xuanze .tt').eq(index).siblings().hide();
		k.addClass('fea-bc');
		k.siblings('p').removeClass('fea-bc');
	})

	// 导航栏置顶
	var Ggoffset = $('.list-lead').offset().top;
	$(window).bind("scroll",function(){
		var d = $(document).scrollTop();
		if(Ggoffset < d){
				$('.list-lead').addClass('fixed');
		}else{
			$('.list-lead').removeClass('fixed');
		}
	});

	var isClick = 0;
	//左侧导航点击
	$(".list-lead a").bind("click", function(){
		isClick = 1; //关闭滚动监听
		var t = $(this), parent = t.parent(), index = parent.index(), theadTop = $(".con-tit:eq("+index+")").offset().top - 40;
		parent.addClass("current").siblings("li").removeClass("current");
		$('html, body').animate({
         	scrollTop: theadTop
     	}, 300, function(){
     		isClick = 0; //开启滚动监听
     	});
	});

	//滚动监听
	$(window).scroll(function() {
		if(isClick) return false;
	    var scroH = $(this).scrollTop();
	    var theadLength = $(".con-tit").length;
	    $(".list-lead li").removeClass("current");

	    $(".con-tit").each(function(index, element) {
	        var offsetTop = $(this).offset().top;
	        if (index != theadLength - 1) {
	            var offsetNextTop = $(".con-tit:eq(" + (index + 1) + ")").offset().top - 40;
	            if (scroH < offsetNextTop) {
	                $(".list-lead li:eq(" + index + ")").addClass("current");
	                return false;
	            }
	        } else {
	            $(".list-lead li:last").addClass("current");
	            return false;
	        }
	    });
	});

	//收藏
	$('.shoucang .gt').click(function(){

		var t = $(this), type = "add";
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(t.hasClass("gy")){
			type = "del";
			t.removeClass("gy").find("span").html("收藏");
		}else{
			t.addClass("gy").find("span").html("已收藏");
		}
		$.post("/include/ajax.php?service=member&action=collect&module=huodong&temp=detail&type="+type+"&id="+id);
	});


	//发表评论
	var rid = 0, uid = 0; uname = "";
	$("#rtj").bind("click", function(){
		var t = $(this), content = $(".writ textarea");
		rid = 0;
		sendReply(t, content);
	});

	var businessUrl = $("#replyList").data("url");

	function sendReply(t, content){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(!t.hasClass("disabled") && $.trim(content.val()) != ""){
			t.addClass("disabled");

			if(rid == undefined || rid == ''){
                var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=huodong-detail&aid=' + id;
            }else{
                var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + rid;
            }
			rid = rid == undefined ? 0 : rid;

			$.ajax({
				url: url,
				data: "sco1=1&content="+encodeURIComponent(content.val()),
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data && data.state == 100){

						var info = data.info;
						content.val("");

						//一级评论
						if(rid == 0){
							if($("#replyList ul").size() == 0){
								$("#replyList").html('<ul></ul>');
							}
							$("#replyList ul").prepend('<li data-id="'+info.id+'" data-uid="'+info.userinfo.userid+'" data-name="'+info.userinfo.nickname+'"><p><a href="'+(businessUrl.replace("%id", info.userinfo.userid))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+info.userinfo.photo+'"></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", info.userinfo.userid))+'" target="_blank">'+info.userinfo.nickname+'</a>：</span><div class="wr-da"><em>'+info.ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+info.content+'</div></li>');

						//子级评论
						}else{
							var par = t.closest("li");
							t.closest(".writ-reply").remove();
							par.after('<li class="writ-repeat" data-id="'+info.id+'" data-uid="'+info.userinfo.userid+'" data-name="'+info.userinfo.nickname+'"><p><a href="'+(businessUrl.replace("%id", info.userinfo.userid))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+info.userinfo.photo+'"></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", info.userinfo.userid))+'" target="_blank">'+info.userinfo.nickname+'</a>&nbsp;回复&nbsp;<a href="'+(businessUrl.replace("%id", uid))+'" target="_blank">'+uname+'</a>：</span><div class="wr-da"><em>'+info.ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+info.content+'</div></li>');
						}


						t.removeClass("disabled");

					}else{
						alert(data.info);
						t.removeClass("disabled");
					}
				},
				error: function(){
					alert("网络错误，发表失败，请稍候重试！");
					t.removeClass("disabled");
				}
			});
		}
	}


	//获取评论
	var atpage = 1;
	function getReplyList(){
		$.ajax({
			url : masterDomain + "/include/ajax.php?service=member&action=getComment&type=huodong-detail&son=1&aid="+id+"&page="+atpage+"&pageSize=5",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					for(var i = 0; i < list.length; i++){
						var src = staticPath+'images/noPhoto_100.jpg';
						if(list[i].user.photo){
							src = huoniao.changeFileSize(list[i].user.photo, "middle");
						}
						html.push('<li data-id="'+list[i].id+'" data-uid="'+list[i].user.useruid+'" data-name="'+list[i].user.nickname+'"><p><a href="'+(businessUrl.replace("%id", list[i].user.useruid))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+src+'" /></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", list[i].user.useruid))+'" target="_blank">'+list[i].user.nickname+'</a>：</span><div class="wr-da"><em>'+list[i].ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+list[i].content+'</div></li>');

						if(list[i]['lower']!=undefined && list[i]['lower'].count > 0 && list[i]['lower'].list!=null){
							html.push(getLowerReply(list[i].lower.list, list[i].user));
						}
					}

					if($("#replyList ul").size() == 0){
						$("#replyList").html('<ul>'+html.join("")+'</ul>');
					}else{
						$("#replyList ul").append(html.join(""));
					}

					if(atpage < pageInfo.totalPage){
						$("#replyList").append('<div class="more"><a href="javascript:;"><span>展开更多评论</span></a></div>');
					}
				}else{
					if(atpage == 1){
						$("#replyList").html('<div class="loading">暂无评论！</div>');
					}
				}
			}
		});
	}

	//评论子级
	function getLowerReply(arr, member){
		if(arr){
			var html = [];
			for(var i = 0; i < arr.length; i++){
				var src = staticPath+'images/noPhoto_100.jpg';
				if(arr[i].user.photo){
					src = huoniao.changeFileSize(arr[i].user.photo, "middle");
				}
				html.push('<li class="writ-repeat" data-id="'+arr[i].id+'" data-uid="'+arr[i].user.useruid+'" data-name="'+arr[i].user.nickname+'"><p><a href="'+(businessUrl.replace("%id", arr[i].user.useruid))+'" target="_blank"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+src+'" /></a></p><div class="wr-name"><span><a href="'+(businessUrl.replace("%id", arr[i].user.useruid))+'" target="_blank">'+arr[i].user.nickname+'</a>&nbsp;回复&nbsp;<a href="'+(businessUrl.replace("%id", member.userid))+'" target="_blank">'+member.nickname+'</a>：</span><div class="wr-da"><em>'+arr[i].ftime+'</em><b><a href="javascript:;">回复</a></b></div></div><div class="wr-txt">'+arr[i].content+'</div></li>');

				if(arr[i]['lower']!=undefined && arr[i]['lower'].count > 0 && arr[i]['lower'].list!=null){
					html.push(getLowerReply(arr[i].lower.list, arr[i].user));
				}
			}
			return html.join("");
		}
	}

	//加载评论
	getReplyList();


	//加载更多评论
	$("#replyList").delegate(".more", "click", function(){
		atpage++;
		$(this).remove();
		getReplyList();
	});

	//回复评论
	$("#replyList").delegate(".wr-da b a", "click", function(){
		var t = $(this), li = t.closest("li");
		rid = li.attr("data-id");
		uid = li.attr("data-uid");
		uname = li.attr("data-name");
		if(li.find(".writ-reply").size() == 0){
			$("#replyList .writ-reply").remove();
			li.append('<div class="writ-reply"><textarea placeholder="回复'+uname+'："></textarea><button>回复</button></div>');
		}
	});

	//提交回复
	$("#replyList").delegate(".writ-reply button", "click", function(){
		var t = $(this), content = t.prev("textarea");
		sendReply(t, content);
	});




	// 百度分享
	var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
	var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"32"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];
})

//单点登录执行脚本
function ssoLogin(info){

	$("#navLoginBefore, #navLoginAfter").remove();

	//已登录
	if(info){
		$(".loginbox").prepend('<div class="loginafter fn-clear" id="navLoginBefore"><span class="fn-left">欢迎您回来，</span><a href="'+info['userDomain']+'" target="_blank">'+info['nickname']+'</a><a href="'+masterDomain+'/logout.html" class="logout">退出</a></div>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".loginbox").prepend('<div class="loginbefore fn-clear" id="navLoginAfter"><a href="'+masterDomain+'/register.html" class="regist">免费注册</a><span class="logint"><a href="'+masterDomain+'/login.html">请登录</a></span><a class="loginconnect" href="'+masterDomain+'/api/login.php?type=qq" target="_blank"><i class="picon picon-qq"></i>QQ登陆</a><a class="loginconnect" href="'+masterDomain+'/api/login.php?type=wechat" target="_blank"><i class="picon picon-weixin"></i>微信登陆</a><a class="loginconnect" href="'+masterDomain+'/api/login.php?type=sina" target="_blank"><i class="picon picon-weibo"></i>新浪登陆</a></div>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}
