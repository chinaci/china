$(function() {
	$('.html2Con .tieba_main .content').find('img').remove()

	/*调起大图 S*/
	$.fn.bigImage({
		artMainCon: ".content", //图片所在的列表标签
	});
	//APP端取消下拉刷新
	toggleDragRefresh('off');

	var isload = false,
		commentPage = 1,
		commentPageSize = 6,
		rid = 0;
	var userAgent = navigator.userAgent.toLowerCase();
	
	// 收藏
	$(".shoucan").click(function(){
		var t = $(this),type='add',txt='已收藏';
		var userid = $.cookie(cookiePre + "login_user");
		if (userid == null || userid == "") {
			location.href = masterDomain + '/login.html';
			return false;
		}		
		
		if(!t.hasClass("active")){
			t.addClass("active");
			t.find('img').attr('src',templets+'images/shoucang.png')
		}else{
			type = "del";
			t.removeClass("active");
			txt = "收藏";
			t.find('img').attr('src',templets+'images/shoucan.png')
		}
		t.find('span').text(txt)
		$.post("/include/ajax.php?service=member&action=collect&module=tieba&temp=detail&type="+type+"&id="+id);
	})
	
	// 表情调用
	$('.emotion-box').append(appendEmoji());
	
	
	$(".text.placeholder").click(function(e){
		
		$(".c-bottom").removeClass("emotion");
		$('.emotion-box').hide();
		$(".commenttext .text").focus();
		if (/iphone|ipad|ipod/.test(userAgent)) {
			console.log('ios系统')
		} else {
			$(".c-bottom").css("padding-bottom","3rem");
				
		}
		$(document).one("click",function(){
			$(".c-bottom").css("padding-bottom","");
		});
		e.stopPropagation()
	});
	
	
	
	
	
	$('audio').removeAttr('controls');

	  var amr_;
	  $('body').delegate('.audio-panel', 'click', function(){
	    var t = $(this);
	    var init = t.find('audio');
		var aUrl = init.attr('src');
		if(amr_ && amr_.isInit()){
			amr_.stop();
		}
		amr_ = new BenzAMRRecorder();
		if(amr_.isPlaying()){   //是否正在播放
			t.removeClass('im-voicePlay');
			amr_.stop();
		}else{
			t.addClass('im-voicePlay');
			amr_.initWithUrl(aUrl).then(function() {  //重新初始化
			  amr_.play();
			});
		}
		amr_.onEnded(function(){
			t.removeClass('im-voicePlay');  //是否播放完成
		})
	    return false;
	  })

	var amount = 0; // 打赏金额
	$('.btn-care').on('click', function() {
		var userid = $.cookie(cookiePre + "login_user");
		if (userid == null || userid == "") {
			location.href = masterDomain + '/login.html';
			return false;
		}
		var t = $(this),
			type = t.hasClass('cared') ? "del" : "add";
		$.post("/include/ajax.php?service=member&action=followMember&id=" + louzuid, function() {
			if (type == "del") {
				t.removeClass('cared');
				t.html('关注');
			} else {
				t.addClass('cared');
				t.html('<i></i>已关注');
			}
		});
	});

	$('.videobox').on('click', function() {
		$('.video-btn').css('display', '-webkit-flex');
		$('#video-control').css('display', '-webkit-flex');
		setTimeout(function() {
			$('#video-control').css('display', 'none');
			$('.video-btn').css('display', 'none');
		}, 5000);
	});
	// 视频
	if ($(".topMain .swiper-slide").hasClass('video-box')) {

		var box = document.getElementById("video-control"); //box对象
		var video = document.getElementById("video"); //视频对象
		var play = document.getElementById("play"); //播放按钮
		var vbplay = document.getElementById("vbplay"); //视频中间播放按钮
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
			var minute = parseInt(timeStr / 60);
			if (minute == 0) {
				if (timeStr < 10) {
					timeStr = "0" + timeStr;
				}
				minute = "00:" + timeStr;
			} else {
				var timeStr = timeStr % 60;
				if (timeStr < 10) {
					timeStr = "0" + timeStr;
				}
				minute = minute + ":" + timeStr;
			}
			time.innerHTML = minute;
		});
		video.addEventListener('volumechange', function() {
			if (video.muted) {
				sound.className = "soundoff"
			} else {
				sound.className = "soundon"
			}
		});
		full.addEventListener("click", function() {
			$('.videobox').toggleClass('fullscreen-box');
			var type = $(this).hasClass('small') ? "del" : "add";
			if (type == "del") {
				$(this).removeClass('small')
			} else {
				$(this).addClass('small')
			}

		}, false)
		play.onclick = function() {
			if (video.paused) {
				play.className = "pause";
				video.play();
			} else {
				play.className = "play";
				video.pause();
			}
		}
		vbplay.onclick = function() {
			if (video.paused) {
				video.play();
				video.value = "pause";
			} else {
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
			if (leftv <= 0) {
				leftv = 0;
			}
			if (leftv >= progress.offsetWidth) {
				leftv = progress.offsetWidth;
			}
			control.style.left = leftv + "px"
		}, false);
		control.addEventListener('touchmove', function(e) {
			var leftv = e.touches[0].clientX - progress.offsetLeft - box.offsetLeft;
			if (leftv <= 0) {
				leftv = 0;
			}
			if (leftv >= progress.offsetWidth) {
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
			if (video.muted) {
				video.muted = false;
				sound.className = "soundon"
			} else {
				video.muted = true;
				sound.className = "soundoff"
			}
		}
	}

	// 大图关闭
	$('.videobox .vClose').on('click', function() {
		$('.videobox').removeClass('fullscreen-box');
		return false;
	});

	getUpLike();

	function getUpLike() {
		$.ajax({
			url: "/include/ajax.php?service=member&action=upList&type=0&tid=" + id +
				"&page=1&pageSize=10&temp=detail&module=tieba",
			type: "GET",
			dataType: "json",
			success: function(data) {
				if (data && data.state == 100) {
					var list = data.info.list,
						pageInfo = data.info.pageInfo,
						html = [],
						rid;
					for (var i = 0; i < list.length; i++) {
						var photo = (list[i].photo == "" || list[i].photo == undefined) ? staticPath + 'images/noPhoto_100.jpg' :
							list[i].photo;
						html.push('<li><a href="' + masterDomain + '/user/' + list[i].uid + '"><img src="' + photo +
							'" alt=""></a></li>');
					}
					$('#memberlist').append(html.join(""));
					if (pageInfo.totalCount > 7) {
						$('.morebox').html('<a href="' + uplikeUrl + '"><i></i></a><em>' + pageInfo.totalCount + '</em>');
					} else {
						$('.morebox').html('<em>' + pageInfo.totalCount + '</em>');
					}
				}
			}
		});
	}

	// 点赞
	$('.uplikebox').on('click', function() {
		var userid = $.cookie(cookiePre + "login_user");
		if (userid == null || userid == "") {
			location.href = masterDomain + '/login.html';
			return false;
		}
		var num = $('.morebox em').html();
		if (typeof(num) == 'object') {
			num = 0;
		}
		num++;
		var photo = (currentPhoto == "" || currentPhoto == undefined) ? staticPath + 'images/noPhoto_100.jpg' :
			currentPhoto;
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			upLike(function() {
				$('.uplikelist').find('ul').prepend('<li><a href="javascript:;"><img src="' + photo + '" alt=""></a></li>')
				$('.morebox em').html(num);
			});
		} else {
			upLike(function() {
				$('.uplikelist').find('ul li:first-child').remove();
				$('.morebox em').html(num - 2);
			});
		}
	})

	var upLike = function(func) {
		$.post("/include/ajax.php?service=member&action=getZan&module=tieba&temp=detail&id=" + id + "&uid=" + louzuid,
			function() {
				func();
			});
	}

	// 点击打赏
	$('.rewardbox').on('click', function() {
		$.ajax({
			"url": masterDomain + "/include/ajax.php?service=tieba&action=checkRewardState",
			"data": {
				"aid": id
			},
			"dataType": "jsonp",
			success: function(data) {
				if (data && data.state == 100) {
					$('.reward, .mask').addClass('show');
					$('.reward').bind('touchmove', function(e) {
						e.preventDefault();
					});
				} else {
					alert(data.info);
				}
			},
			error: function() {
				alert("网络错误，操作失败，请稍候重试！");
			}
		});
	})

	// 选择打赏金额
	$('.reward-box a').click(function() {
		var t = $(this),
			account = t.find('em');
		t.addClass('active').siblings('a').removeClass('active');
		amount = parseFloat(account.text());
	}).eq(0).click();

	// 选择其他金额
	$('.reword-other').click(function() {
		amount = 0;
		$('.reward-a').hide();
		$('.reward-inp').show();
		if ($("#reward").val() == '') {
			$(".reword-sure").addClass("disabled");
		}
	})

	// 输入打赏金额
	$('.reward-inp input').bind('input propertychange', function() {
		var reward = $('#reward').val();
		amount = reward;
		if (reward != "") {
			$('.reword-sure').removeClass('disabled');
		} else {
			$('.reword-sure').addClass('disabled');
		}
	})

	// 确认打赏
	$('.reword-sure').click(function() {
		var t = $(this);

		var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
		var re = new RegExp(regu);
		if (!re.test(amount)) {
			amount = 0;
			alert("打赏金额格式错误，最少0.01" + echoCurrency('short') + "！");
			return false;
		}

		hideReward(1);

		var app = device.indexOf('huoniao') >= 0 ? 1 : 0;
		location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid=" + id + "&amount=" + amount +
			"&app=" + app;
		return;

		//如果不在客户端中访问，根据设备类型删除不支持的支付方式
		if (appInfo.device == "") {
			// 赏
			if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {
				$("#shangAlipay, #shangGlobalAlipay").remove();
			}
			// else{
			//   $("#shangWxpay").remove();
			// }
		}
		$(".paybox li:eq(0)").addClass("on");

		$('.paybox').addClass('show').animate({
			"bottom": "0"
		}, 300);

	})

	$('.paybox li').click(function() {
		var t = $(this);
		t.addClass('on').siblings('li').removeClass('on');
	})

	//提交支付
	$("#dashang").bind("click", function() {

		var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
		var re = new RegExp(regu);
		if (!re.test(amount)) {
			amount = 0;
			alert("打赏金额格式错误，最少0.01" + echoCurrency('short') + "！");
			return false;
		}

		var paytype = $(".paybox .on").data("id");
		if (paytype == "" || paytype == undefined) {
			alert("请选择支付方式！");
			return false;
		}

		//非客户端下验证支付类型
		if (appInfo.device == "") {

			if (paytype == "alipay" && navigator.userAgent.toLowerCase().match(/micromessenger/)) {
				showErr("微信浏览器暂不支持支付宝付款<br />请使用其他浏览器！");
				return false;
			}

			location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid=" + id + "&amount=" + amount +
				"&paytype=" + paytype;

		} else {
			location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid=" + id + "&amount=" + amount +
				"&paytype=" + paytype + "&app=1";
		}

	});

	// 关闭打赏
	$('.reward .close').click(function() {
		hideReward();
	})

	// 点击遮罩层
	$('.mask').click(function() {
		hideReward();
	}).bind('touchmove', function() {
		hideReward();
	})

	// 关闭打赏
	function hideReward(has) {
		$('.reward-a').show();
		$('.reward-inp').hide();
		$('.reward-inp input').val("");
		$('.reword-sure').removeClass('disabled');
		$('.reward, .paybox').removeClass('show');
		if (!has) {
			$('.mask').removeClass('show');
		}
		$('.reward').unbind('touchmove');
	}

	function hideMore() {
		$('.more-box, .mask').removeClass('show');
		$('.more-box').unbind('touchmove');
	}

	// 举报
	$('.reportbox').click(function() {
		$('.more-box').removeClass('show');
		$('.JubaoBox, .JuMask').addClass('show');
		$('.JubaoBox').bind('touchmove', function(e) {
			e.preventDefault();
		});
	})

	// 关闭举报
	$('.JubaoBox .JuClose,.JuMask').click(function() {
		hideJubao();
	})


	// 选择举报类型
	$('.JubaoBox .select li').click(function() {
		var t = $(this),
			dom = t.hasClass('active');
		if (dom) {
			t.removeClass('active');
		} else {
			t.addClass('active');
		}
	})

	// 举报提交
	$('.JubaoBox .submit').click(function() {
		if ($('.JubaoBox .select .active').length < 1) {
			showErr('请选择举报类型');
		} else if ($('#jubaoTel').val() == "") {
			showErr('请填写联系方式')
		} else {
			hideJubao();
		}
	})

	function hideJubao() {
		$('.JubaoBox .select li').removeClass('active');
		$('.remark textarea').val("");
		$('#jubaoTel').val("");
		$('.JubaoBox, .JuMask').removeClass('show');
		$('.JubaoBox').unbind('touchmove');
	}



	// 选择表情
	var memerySelection;
	$('.emoIcon').click(function() {
		var t = $(this),
			box = $('.emotion-box'),
			editor = $('.editor').height(),
			emotionBox = $('.emotion-box').height(),
			windowHeight = $(window).height(),
			bodyHeight = $('body').height();
		var autoHeight = windowHeight - $('.header').height() * 3 - emotionBox;
		set_focus($('.placeholder:last')); //定位光标 不然的话 表情会乱窜
		memerySelection = window.getSelection();
		$(".c-bottom").css("padding","")
		if (box.css('display') == 'none') {
			$('.emotion-box').show();
			$('.c-bottom').addClass('emotion');

			t.addClass('on');
			return false;
		} else {
			$('.emotion-box').hide();
			$('.c-bottom').removeClass('emotion');
		}
	})

	$('.emotion-box li').bind('click', function() {
		
		var t = $(this).find('img');
		var txt = $(this).attr('data-txt');
		$('.text').find('span').remove();
		if (/iphone|ipad|ipod/.test(userAgent)) {
			$('.text').append('<img src="' + t.attr("src") + '" data-txt="'+txt+'" class="emotion-img" />');
			return false;
		} else {
			set_focus($('.placeholder:last'));
			pasteHtmlAtCaret('<img src="' + t.attr("src") + '" data-txt="'+txt+'" class="emotion-img" />');
		}
		
		document.activeElement.blur();
		return false;
	})

	$(document).click(function() {
		$('.c-bottom').removeClass('emotion');
		$('.emotion.item').removeClass('on');
		$('.emotion-box').hide();
	})

	$('.c-bottom').click(function() {
		set_focus($('.placeholder:last'));
	})

	$('.text').focus(function() {
		var t = $(this),
			txtGray = t.find('span');
		if (txtGray.length > 0) {
			t.html('');
		}
	})

	$('.text').blur(function() {
		var t = $(this);
			// txtGray = t.find('span');
		if (t.html() == "") {
			t.attr('placeholder','我来说两句...')
		}
	})

	$('body').delegate('.placeholder', 'click', function() {
		var t = $(this);
		set_focus(t);
		$('.editor, .anotherbox').removeClass('emotion');
		$('.emotion.item').removeClass('on');
		$('.emotion-box').hide();
		return false;
	})


	//发表回复
	$(".btnSend").bind("click", function() {
		var userid = $.cookie(cookiePre + "login_user");
		if (userid == null || userid == "") {
			location.href = masterDomain + '/login.html';
			return false;
		}
		if($(this).hasClass("disabled")) return false;
		// var txtGray = $(".commenttext .text").find('span');
		// if (txtGray.length > 0) {
		// 	$(".commenttext .text").html('');
		// }

		setTimeout(function(){
			$(".btnSend").removeClass('disabled')
		},1000);
		
		$('.commenttext .text img').each(function(){
			var t = $(this),txt= t.attr('data-txt');
			t.after('<em>'+txt+'</em>');
			t.remove()
		});
		
		var content = $(".commenttext .text").html();
		
		if ($.trim(content) != "") {
			if (rid == '' || rid == undefined) {
				var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=tieba-detail&aid=' + id;
			} else {
				var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + rid;
			}


			$.ajax({
				url: url,
				data: "content=" + encodeURIComponent(content),
				type: "POST",
				dataType: "json",
				success: function(data) {
					if (data && data.state == 100) {
						// $(".commenttext .text").html('<span>我来说两句...</span>');
						if (data.info.ischeck == 1) {
							alert("回复成功！");
							location.reload();
						} else {
							alert("回复成功，请等待管理员审核！");
							$(".text.placeholder").html('')
						}


					} else {
						alert(data.info);
					}
				},
				error: function() {
					alert("网络错误，发表失败，请稍候重试！");
				}
			});
		}
	});

	//根据光标位置插入指定内容
	function pasteHtmlAtCaret(html) {
		var sel, range;
		if (window.getSelection) {
			sel = memerySelection;
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(),
					node, lastNode;
				while ((node = el.firstChild)) {
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
		} else if (document.selection && document.selection.type != "Control") {
			document.selection.createRange().pasteHTML(html);
		}
	}

	//光标定位到最后
	function set_focus(el) {
		el = el[0];
		el.focus();
		if (/msie/.test(navigator.userAgent.toLowerCase())) {
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
		} else {
			var range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

	//滚动加载
	$(window).on("touchmove", function() {
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - 300;
		if ($(window).scrollTop() > scroll && !isload) {
			commentPage++;
			getComment();
		};
	});

	getComment()
	//获取评论列表
	function getComment() {
		isload = true;
		$('.commentlist').append('<div class="loading">加载中...</div>');
		$.ajax({
			url: "/include/ajax.php?service=member&action=getComment&type=tieba-detail&son=1&aid=" + id + "&page=" +
				commentPage + "&pageSize=" + commentPageSize,
			type: "GET",
			dataType: "json",
			success: function(data) {
				if (data && data.state == 100) {
					var list = data.info.list,
						pageInfo = data.info.pageInfo,
						html = [],
						rid;
					for (var i = 0; i < list.length; i++) {
						var rid = list[i].id,
							reply = list[i].reply;
						var d = list[i];
						var photo = (list[i].user.photo == "" || list[i].user.photo == undefined) ? staticPath +
							'images/noPhoto_100.jpg' : list[i].user.photo;
						// html.push('<li class="fn-clear">');
						// html.push('<div class="left"><a href="'+masterDomain+'/user/'+list[i].user.id+'"><img src="'+photo+'" alt=""></a></div>');
						// html.push('<div class="right">');
						// html.push('<p class="name fn-clear"><span class="sname">'+list[i].user.nickname+'</span> <span class="time">'+transTimes(list[i].dtime, 5)+'</span></p>');
						// html.push('<p class="content">'+list[i].content+'</p>');
						// html.push('</div>');
						// if(list[i]['lower']!=undefined && list[i]['lower'].count > 0 && list[i]['lower'].list!=null){
						// 	html.push('<ul class="children children-'+list[i].id+'">');
						// 	html.push('</ul>');
						// 	getReply(rid, list[i].user.nickname, 1);
						// }

						// html.push('</li>');

						/* <div class="rightInfo"><h4>广州加氏迈通信设备有限公司</h4><p class="txtInfo">hhhh</p><div class="replyCon"><dl><dt><span class="spColor">广州加氏迈通信设备有限公司：</span></dt><dd>daasd </dd></dl></div><div class="rbottom"><div class="rtime">2019.10.14</div><div class="rbInfo"><a href="http://zt.215000.com/sz/article/comdetail-255.html" class="btnReply"> <s></s> 回复 </a><a href="javascript:;" class="btnUp " data-id="255"> <s></s> <em>0</em> </a></div></div></div> */
						html.push('<li data-id="'+d.id+'"><div class="imgbox"><img src="' + photo + '" alt=""></div>');
						html.push('<div class="rightInfo"><h4>' + list[i].user.nickname + '</h4><p class="txtInfo">' + list[i].content +
							'</p>');
						if (d.lower.list != null && d.lower.list != undefined) {
							html.push('<div class="replyCon">');
							for (var j = 0; j < d.lower.list.length; j++) {
								html.push('<dl><dt><span class="spColor">' + d.lower.list[j].user.nickname + '：</span></dt><dd>' + d.lower
									.list[j].content + '</dd></dl>');
								if (d.lower.list[j].lower != null && d.lower.list[j].lower != undefined) {
									for (var k = 0; k < d.lower.list[j].lower.length; k++) {
										html.push('<dl><dt><span class="spColor">' + d.lower.list[j].lower[k].user.nickname +
											'</span>回复 <span class="spColor">' + d.lower.list[j].user.nickname + '：</span></dt><dd>' + d.lower.list[
												j].lower[k].content + '</dd></dl>');
									}

								}
							}
							html.push('</div>')
						}
						html.push('<div class="rbottom">');
						html.push('<div class="rtime">' + huoniao.transTimes(d.dtime, 2).replace(/-/g, '.') + '</div>');
						html.push('<div class="rbInfo">');
						html.push('<a href="javascript:;" class="btnReply"> <s></s> 回复 </a>');
						var praise = "";
						if (d.zan_has == 1) {
							praise = " active";
						}
						html.push('<a href="javascript:;" class="btnUp ' + praise + '" data-id="' + d.id + '"> <s></s> <em>' + d.zan +
							'</em> </a>');
						html.push('</div>');
						html.push('</div>');
						html.push('</div></li>');

					}

					$('.commentlist .loading').remove();
					$('.totalCount').html(pageInfo.totalCount);
					$('.commentlist').append(html.join(""));
					if (commentPage >= pageInfo.totalPage) {
						isload = true;
						$('.commentlist').append('<div class="loading">已加载全部数据！</div>');
					} else {
						isload = false;
					}
				} else {
					$('.commentlist .loading').html(data.info);
					$('.totalCount').html('0');
				}
			}
		});
	}

	var replyPageSize = 3;

	function getReply(rid, name, page) {
		$.ajax({
			url: "/include/ajax.php?service=member&action=getChildComment&sid=" + rid + "&page=" + page + "&pageSize=" +
				replyPageSize,
			type: "GET",
			dataType: "jsonp",
			success: function(data) {
				if (data && data.state == 100) {
					var list = data.info.list,
						pageInfo = data.info.pageInfo,
						html = [];
					for (var i = 0; i < list.length; i++) {
						var photo = (list[i].user.photo == "" || list[i].user.photo == undefined) ? staticPath +
							'images/noPhoto_100.jpg' : list[i].user.photo;
						html.push('<li class="fn-clear">');
						html.push('<div class="left"><a href="' + masterDomain + '/user/' + list[i].user.id + '"><img src="' + photo +
							'" alt=""></a></div>');
						html.push('<div class="right"><p class="name fn-clear"><span class="sname">' + list[i].user.nickname +
							'</span> <span class="time">' + transTimes(list[i].dtime, 5) + '</span></p><p class="content">回复<span>' +
							name + '</span>:' + list[i].content + '</p></div>');
						html.push('</li>');
					}
					if (page == 1) {
						$('.children-' + rid).html(html.join(""));
					}
					var sur = pageInfo.totalCount - page * replyPageSize;
					if (sur > 0) {
						if (page == 1) {
							//$('.children-'+rid).append('<a href="comment.html" class="reply-more">查看剩余'+sur+'条回复 >></a>');
						}
					} else {
						$('.children-' + rid).find(".rmore").remove();
					}
				}
			}
		});
	}

	function transTimes(timestamp, n) {
		update = new Date(timestamp * 1000); //时间戳要乘1000
		year = update.getFullYear();
		month = (update.getMonth() + 1 < 10) ? ('0' + (update.getMonth() + 1)) : (update.getMonth() + 1);
		day = (update.getDate() < 10) ? ('0' + update.getDate()) : (update.getDate());
		hour = (update.getHours() < 10) ? ('0' + update.getHours()) : (update.getHours());
		minute = (update.getMinutes() < 10) ? ('0' + update.getMinutes()) : (update.getMinutes());
		second = (update.getSeconds() < 10) ? ('0' + update.getSeconds()) : (update.getSeconds());
		if (n == 1) {
			return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
		} else if (n == 2) {
			return (year + '-' + month + '-' + day);
		} else if (n == 3) {
			return (month + '-' + day);
		} else if (n == 4) {
			return (hour + ':' + minute);
		} else if (n == 5) {
			return (year + '.' + month + '.' + day);
		} else {
			return 0;
		}
	}

	// 回复
	$('.commentBox').delegate('.btnReply','click',function(e){
		var t = $(this);
		rid = t.parents('li').attr('data-id');
		var rname = t.parents('li').find('.rightInfo h4').text();

		$('.commenttext>div[contenteditable]').focus().attr("placeholder",'回复 '+rname);
		if (/iphone|ipad|ipod/.test(userAgent)) {
			console.log('ios系统')
		} else {
			$(".c-bottom").css("padding-bottom","3rem");
				
		}
		$(document).one("click",function(){
			$(".c-bottom").css("padding-bottom","");
		});
		e.stopPropagation()

	});

	// 点赞
	$('.commentBox').delegate('.btnUp','click',function(){
		var t = $(this);
		 var userid = $.cookie(cookiePre+"login_user");
		        if(userid == null || userid == ""){
		          window.location.href = masterDomain+'/login.html';
		          return false;
		        }
		        var t = $(this), rid = t.attr("data-id");
		        // if(t.hasClass("active")) return false;
		        var num = t.find("em").html();
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
		            url: "/include/ajax.php?service=member&action=dingComment&id="+rid+ "&type=" + type,
		            type: "GET",
		            dataType: "json",
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
	})

})
