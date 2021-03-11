$(function(){

	// 报名
	$('.baoming').click(function(){
		var state = '';
		if(vote.state == 0){
			state = '活动还未开始';
		}else if(vote.state == 2){
			state = '报名已结束';
		}else if(vote.state == 3){
			state = '活动已结束';
		}
		if(state == ''){
			checkLogin();
		}else{
			$.dialog.alert(state);
		}
	})
	// -----------------------------------投票 s

	// 打开投票层
	var time = 0;
	$('.openvote').click(function(){
		// 判断活动是否结束
		if(vote.state == 3){
			$.dialog.alert('抱歉，投票已结束！');
			return;
		}
		var r = true;
		// 判断活动是否允许匿名
		if(vote.voteuser == 1){
			r = checkLogin();
		}
		if(r){
			$('.rewardS-mask,.opdv').show();
			$('.vdimgckinp').val('');
			$('.mname').focus();
		}
	})
	// 投票
	$('.votesubmit').click(function(){
		var t = $(this), mname = $('.mname').val(), mtel = $('.mtel').val(), vdimgck = $('.vdimgckinp').val(), tj = true;

		if(t.hasClass('disabled')) return;

		if(mname != '' && mtel == ''){
			tj = false;
			$.dialog.alert('请输入您的手机号');
		}else if(mname == '' && mtel != ''){
			tj = false;
			$.dialog.alert('请输入您的姓名');
		}
		if(mname != '' && mtel != ''){
			var telReg = !!mtel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			if(!telReg){
				tj = false;
				$.dialog.alert('您输入的手机号不正确');
			}
		}
		if(vdimgck == ''){
			tj = false;
			$.dialog.alert('请输入验证码');
		}

		if(tj){
			t.addClass('disabled').text('正在提交...');
			$.ajax({
				url: '/include/ajax.php?service=vote&action=vote&tid='+vote.id+'&uid='+user.id+'&mname='+user.name+'&mtel='+mtel+'&vdimgck='+vdimgck,
				type: 'GET',
				dataType: 'JSONP',
				success: function(data){
					$('.vdimgck').click();
					if(data && data.state == 100){
						$.dialog.tips('投票成功，感谢您对“'+user.name+'”的支持！', 3, 'success.png');
						$('.votes .n1').text(data.info)
						setTimeout(function(){
							$('.op-1 .close').click();
						},1000)
					}else{
						$.dialog.alert(data.info);
					}
					t.removeClass('disabled').text('我要投票');
				},
				error: function(){
					$('.vdimgck').click();
					t.removeClass('disabled').text('我要投票');
					$.dialog.alert('网络错误，请重试！');
				}
			})
		}
	})

	// 关闭投票窗口
	$('.op-1 .close').click(function(){
		$('.rewardS-mask,.opdv').hide();
	})

	// 更换验证码
	$('.vdimgck ,.change').click(function(){
		var img = $('.vdimgck');
		var src = img.attr('src') + '?v=' + new Date().getTime();
		img.attr('src',src);
	})
	// 验证是否登录
	function checkLogin(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			top.location.href = masterDomain + '/login.html';
			return false;
		}else{
			return true;
		}
	}

	// -----------------------------------投票 e

	//------------------------------------评论s
	var commentObj = $("#commentList");
	var isLoad = 0;
	//评论登录
	$(".comment").delegate(".login", "click", function(){
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
			$("html, body").scrollTop(0);
		}
		huoniao.login();
	});

	//评论筛选【时间、热度】
	$(".c-orderby a").bind("click", function(){
		if(!$(this).hasClass("active")){
			$(".c-orderby a").removeClass("active");
			$(this).addClass("active");

			commentObj
				.attr("data-page", 1)
				.html('<div class="loading"></div>');
			$("#loadMore").removeClass().hide();

			loadComment();
		}
	});

	//加载评论
	function loadComment(){
		if(user.id && user.id != undefined){
			var page = commentObj.attr("data-page");
			var orderby = $(".c-orderby .active").attr('data-id');
			//异步获取用户信息
			$.ajax({
				url: "/include/ajax.php?service=vote&action=common&infoid="+user.id+"&page="+page+"&orderby="+orderby,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){

						if(commentObj.find("li").length > 0){
							commentObj.append(getCommentList(data.info.list));
						}else{
							commentObj.html(getCommentList(data.info.list));
						}

						page = commentObj.attr("data-page", (Number(page)+1));

						var pageInfo = data.info.pageInfo;
						if(Number(pageInfo.page) < Number(pageInfo.totalPage)){
							$("#loadMore").removeClass().show();
						}else{
							$("#loadMore").removeClass().hide();
						}
						var url = location.href;
						if(url.indexOf('#commont') > -1){
							var srt = $('#commont').offset().top;
							$('html,body').animate({
								'scrollTop': srt + 'px'
							},500)
						}
						// $('.totalCount').text(pageInfo.totalCount);

					}else{
						if(commentObj.find("li").length <= 0){
							commentObj.html("<div class='empty'>暂无相关评论</div>");
							$("#loadMore").removeClass().hide();
						}
					}
				},
				error: function(){
					if(commentObj.find("li").length <= 0){
						commentObj.html("<div class='empty'>暂无相关评论</div>");
						$("#loadMore").removeClass().hide();
					}
				}
			});
		}else{
			commentObj.html("Error!");
		}
	}

	//拼接评论列表
	function getCommentList(list){
		var html = [];
		for(var i = 0; i < list.length; i++){
			var info = list[i];
			var photodefault = staticPath+'images/noPhoto_40.jpg',
				photo = '',
				uid = -1,
				nickname = '';
			if(info.userinfo == ""){
				photo = photodefault;
				nickname = '网友';
			}else{
				uid = info.userinfo.id;
				photo = info.userinfo['photo'] == "" ? photodefault : huoniao.changeFileSize(info.userinfo['photo'], "small");
				nickname = info.userinfo['nickname'];
			}

			html.push('<li class="fn-clear" data-id="'+list[i]['id']+'" data-uid="'+uid+'">');

			html.push('  <img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+photo+'" alt="'+nickname+'">');
			html.push('  <div class="c-body">');
			html.push('    <div class="c-header">');
			html.push('      <a href="javascript:;">'+nickname+'</a>');
			html.push('      <span>'+list[i]['ftime']+'</span>');
			html.push('    </div>');
			html.push('    <p>'+list[i]['content']+'</p>');
			html.push('    <div class="c-footer">');

			var praise = "praise";
			if(list[i]['already'] == 1){
				praise = "praise active";
			}
			html.push('      <a href="javascript:;" class="'+praise+'"><s></s>(<em>'+list[i]['good']+'</em>)</a>');

			html.push('      <a href="javascript:;" class="reply"><s></s>回复(<em>'+(list[i]['lower'] ? list[i]['lower'].length : 0)+'</em>)</a>');
			html.push('    </div>');
			html.push('  </div>');
			if(list[i]['lower'] != null){
				html.push('  <ul class="children">');
				html.push(getCommentList(list[i]['lower']));
				html.push('  </ul>');
			}
			html.push('</li>');
		}
		return html.join("");
	}

	//加载更多评论
	$("#loadMore").bind("click", function(){
		$(this).addClass("loading");
		loadComment();
	});

	//顶
	commentObj.delegate(".praise", "click", function(){
		var t = $(this), id = t.closest("li").attr("data-id");
		if(t.hasClass("active")) return false;
		if(id != "" && id != undefined){
			$.ajax({
				url: "/include/ajax.php?service=vote&action=dingCommon&id="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					var ncount = Number(t.text().replace("(", "").replace(")", ""));
					t
						.addClass("active")
						.html('<s></s>(<em>'+(ncount+1)+'</em>)');

					//加1效果
					var $i = $("<b>").text("+1");
					var x = t.offset().left, y = t.offset().top;
					$i.css({top: y - 10, left: x + 17, position: "absolute", color: "#E94F06"});
					$("body").append($i);
					$i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
						$i.remove();
					});

				}
			});
		}
	});

	//评论回复
	commentObj.delegate(".reply", "click", function(){
		commentObj.find('.reply').removeClass('curr');
		$(this).addClass('curr');
		var carea = commentObj.find(".c-area");
		if(carea.html() != "" && carea.html() != undefined){
			carea.stop().slideUp("fast");
			commentObj.find(".reply").removeClass("active");
		}

		var areaObj = $(this).closest(".c-body"),
			replaytemp = $("#replaytemp").html();
		if(areaObj.find(".c-area").html() == "" || areaObj.find(".c-area").html() == undefined){
			areaObj.append(replaytemp);
		}
		areaObj.find(".c-area").stop().slideToggle("fast");

	});

	//提交评论回复
	$(".comment").delegate(".subtn", "click", function(){
		var t = $(this), cid = t.closest("li").attr("data-id");
		if(t.hasClass("loading")) return false;



		var contentObj = t.closest(".c-area").find(".textarea"),
			content = contentObj.html();

		if(content == ""){
			return false;
		}
		if(huoniao.getStrLength(content) > 200){
			alert("超过200个字了！");
		}

		cid = cid == undefined ? 0 : cid;

		t.addClass("loading");

		$.ajax({
			url: "/include/ajax.php?service=vote&action=sendCommon&tid="+vote.id+"&uid="+user.id+"&id="+cid,
			data: "content="+content,
			type: "POST",
			dataType: "json",
			success: function (data) {

				t.removeClass("loading");
				contentObj.html("");
				if(data && data.state == 100){

					var reply = commentObj.find('.reply.curr'),
						replycon  = reply.children('em'),
						count = parseInt(replycon.text())+1;
					replycon.text(count);
					reply.removeClass('curr');

					var info = data.info;
					var list = [];

					var photodefault = staticPath+'images/noPhoto_40.jpg',
						photo = '',
						uid = -1,
						nickname = '';
					if(info.userinfo == ""){
						photo = photodefault;
						nickname = '网友';
					}else{
						photo = info.userinfo['photo'] == "" ? photodefault : huoniao.changeFileSize(info.userinfo['photo'], "small");
						uid = info.userinfo['id'];
						nickname = info.userinfo['nickname'];
					}

					list.push('<li class="fn-clear colorAnimate" data-id="'+info['id']+'" data-uid="'+uid+'">');
					list.push('  <img src="'+photo+'" alt="'+nickname+'">');
					list.push('  <div class="c-body">');
					list.push('    <div class="c-header">');
					list.push('      <a href="javascript:;">'+ nickname	+'</a>');
					list.push('      <span>'+info['ftime']+'</span>');
					list.push('    </div>');
					list.push('    <p>'+info['content']+'</p>');
					list.push('    <div class="c-footer">');
					list.push('      <a href="javascript:;" class="praise"><s></s>(<em>'+info['good']+'</em>)</a>');
					list.push('      <a href="javascript:;" class="reply">回复(<em>'+(info['lower'] ? info['lower'].length : 0)+'</em>)</a>');
					list.push('    </div>');
					list.push('  </div>');
					list.push('</li>');

					//一级评论
					if(contentObj.attr("data-type") == "parent"){
						if(commentObj.find("li").length <= 0){
							commentObj.html("");
							$("#loadMore").removeClass().hide();
						}

						commentObj.prepend(list.join(""));

					//子级
					}else{

						t.closest(".c-area").hide();

						var children = t.closest("li").find(".children");
						//判断子级是否存在
						if(children.html() == "" || children.html() == undefined){
							t.closest("li").append('<ul class="children"></ul>');
						}

						t.closest("li").find("ul.children").prepend(list.join(""));


					}

					$('.totalCount').text((parseInt($('.totalCount').text())+1));

				}

			}
		});

	});
	var start = true;
	$(window).scroll(function(){
		if(start && $(window).scrollTop()+$(window).height() > $('.wangyou').offset().top){
			start = false;
			loadComment();
		}
	})
	//------------------------------------评论e



	window._bd_share_config = {
	"common": {
	  "bdSnsKey": {},
	  "bdText": "",
	  "bdMini": "2",
	  "bdMiniList": false,
	  "bdPic": "",
	  "bdStyle": "0",
	  "bdSize": "16"
	},
	"share": {}
	};
	with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = '//bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~ ( - new Date() / 36e5)];

})
