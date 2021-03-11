$(function(){

	//收藏
	$(".icon-2").bind("click", function(){
		var t = $(this), type = "add", oper = "+1", txt = "已收藏";

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(!t.hasClass("curr")){
			t.addClass("curr");
		}else{
			type = "del";
			t.removeClass("curr");
			oper = "-1";
			txt = "收藏";
		}

		var $i = $("<b>").text(oper);
		var x = t.offset().left, y = t.offset().top;
		$i.css({top: y - 10, left: x + 17, position: "absolute", "z-index": "10000", color: "#E94F06"});
		$("body").append($i);
		$i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
			$i.remove();
		});

		t.html("<i></i>"+txt);

		$.post("/include/ajax.php?service=member&action=collect&module=tieba&temp=detail&type="+type+"&id="+id);

	});



    // 表情
	var memerySelection;
	$('.ml-list').delegate('.emotion-more',"click", function(){
		memerySelection = window.getSelection();
		var t = $(this), box = $('.emotion-box'), width = box.width(),  pos = t.offset(), top = pos.top + 25, left = pos.left - width/2 - 69;
		if (box.css('display') == 'none') {
			$('.emotion-box').css({"top": top + "px", "left": left + "px"}).show();
			return false;
		}else {
			$('.emotion-box').hide();
		}
	})

	// 我也说一句
	var hfTextObj;
	$('.ml-list').delegate('.my-reply',"click", function(){
		var t = $(this), parent = t.closest('.reply-more');
		replyFunc(parent);
	})

	// 查看回复第一个
	$('.main-content-left .reply-bottom').click(function(){
		var height = $('body').height();
		$('html, body').animate({scrollTop: height}, 300);

	})

	// 查看回复
	$('.ml-list-right .reply-box span.reply:not(:first)').click(function(){
		var t = $(this), more = t.siblings('.reply-shou'), parent = t.closest('.ml-list-right'), box = parent.find('.reply-more');

		//如果没有回复，查看回复则显示回复框
		if(Number(t.closest(".ml-list-info").attr("data-reply")) == 0){
			replyFunc(box);
			box.css({"padding-top": "20px"});
		}

		t.hide();more.show();box.slideDown(300);
	})

	// 收起回复
	$('.ml-list-right .reply-box span.reply-shou').click(function(){
		var t = $(this), more = t.siblings('.reply'), parent = t.closest('.ml-list-right'), box = parent.find('.reply-more');
		box.css('margin-top','0');
		box.slideUp(300, function(){
			t.hide();more.show();
		});
	})

	// 回复某人
	$('.reply-more').delegate('.reply-sb', 'click', function(){
		var t = $(this), li = t.closest('li'), parent = t.closest('.reply-more'), name = li.find('.name').find('.user_hover').text();
		replyFunc(parent, name);

		$('html, body').animate({scrollTop: $(".comment").offset().top - 300}, 300);
	})

	//回复框
	function replyFunc(parent, name){
		var comment = $(".comment"), mlinfo = comment.closest(".ml-list-info");
		if(Number(mlinfo.attr("data-reply")) == 0){
			mlinfo.find(".reply-shou").click();
		}
		comment.remove();
		parent.find(".comment").remove();
		parent.append($("#replyTemp").html());
		parent.find(".comment").show();

		var textarea = parent.find(".textarea");

		if(name){
			textarea.html('<label contenteditable="false">回复  ' + name + '</label>&nbsp;');
		}

		set_focus(textarea);
		hfTextObj = textarea;
		textarea.bind("paste", function(e){
			clearHtml(e);
		})
		textarea.bind("keydown", function(e){
			clearShortKey(e);
		})
	}

	//发表回复
	$('.reply-more').delegate('.subtn', 'click', function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		var t = $(this), par = t.closest(".ml-list-info"), rid = par.data("id"), content = par.find(".textarea").html();
		if(!t.hasClass("disabled") && $.trim(content) != ""){
			t.addClass("disabled");

			if(rid == '' || rid == undefined){
				var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=tieba-detail&aid=' + id;
			}else{
				var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + rid;
			}

			$.ajax({
				url:  url,
				data: "content="+encodeURIComponent(content),
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data && data.state == 100){

						var info = data.info;
						$(".comment").remove();

						var html = '<li class="fn-clear"><div class="reply-img user_hover user_simg_hover"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_100.jpg\';" src="'+info.userinfo.photo+'"></div><div class="reply-txt"><div class="name"><div class="user_hover">'+info.userinfo.nickname+':</div><span>'+info.content+'</span></div><div class="time"><span>'+huoniao.transTimes(info.dtime, 1)+'</span><a href="javascript:;" class="reply-sb">回复</a></div></div></li>';
						if(par.find(".reply-more ul").length == 0){
							par.find(".reply-more").html('<ul>'+html+'</ul><div class="page fn-clear"><a class="my-reply fn-right">我也说一句</a></div>');
						}else{
							par.find(".reply-more ul").append(html);
						}
						
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
	});


	// 表情
	$('.emotion-con td').click(function(){
		var t = $(this).find('img'), parent = $('.comment.show'), textarea = parent.find('.textarea');
		hfTextObj.focus();
		pasteHtmlAtCaret('<img src="'+t.attr("src")+'" />');
	})

	$(document).click(function(){
		$('.emotion-box').hide();
	})

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
		}else{
			var range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}


	//HTML枨式化
	function clearHtml(e){
		e.preventDefault();
		var text = null;

		if(window.clipboardData && clipboardData.setData) {
			// IE
			text = window.clipboardData.getData('text');
		} else {
			text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
		}
		if (document.body.createTextRange) {
			if (document.selection) {
				textRange = document.selection.createRange();
			} else if (window.getSelection) {
				sel = window.getSelection();
				var range = sel.getRangeAt(0);

				// 创建临时元素，使得TextRange可以移动到正确的位置
				var tempEl = document.createElement("span");
				tempEl.innerHTML = "&#FEFF;";
				range.deleteContents();
				range.insertNode(tempEl);
				textRange = document.body.createTextRange();
				textRange.moveToElementText(tempEl);
				tempEl.parentNode.removeChild(tempEl);
			}
			textRange.text = text;
			textRange.collapse(false);
			textRange.select();
		} else {
			// Chrome之类浏览器
			document.execCommand("insertText", false, text);
		}
	}


	//去除快捷键
	function clearShortKey(e){
		// e.metaKey for mac
		if (e.ctrlKey || e.metaKey) {
			switch(e.keyCode){
				case 66: //ctrl+B or ctrl+b
				case 98:
				case 73: //ctrl+I or ctrl+i
				case 105:
				case 85: //ctrl+U or ctrl+u
				case 117: {
						e.preventDefault();
						break;
				}
			}
		}
	}


	// 贴吧热议榜固定
	var offset = $('.topic-box').offset().top;
	var Ggoffset = $('.ml-header').offset().top;
	$(window).bind("scroll",function(){
		var d = $(document).scrollTop();
		if(Ggoffset < d){
				$('.ml-header').addClass('fixed');
		}else{
			$('.ml-header').removeClass('fixed');
		}
	});


	//异步获取回复信息
	$(".ml-list-info:not(first)").each(function(){
		var t = $(this), replyMore = t.find(".reply-more"), rid = Number(t.data("id")), reply = Number(t.data("reply"));
		if(id && reply){
			getReply(replyMore, rid, 1);
		}

	});


	//音频皮肤
	audiojs.events.ready(function() {
    audiojs.createAll();
  });


	// 打赏金额
	$('.rewardS-pay-select li').click(function(){
		var t = $(this), li = t.text(), num = parseInt(li);
		$('.rewardS-pay-box .rewardS-pay-money .inp').focus().val(num);
	})

	// 打赏金额验证
	var rewardInput = $('.rewardS-pay-box .rewardS-pay-money .inp');
	rewardInput.blur(function(){
		var t = $(this), val = t.val();

		var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
		var re = new RegExp(regu);
		if (!re.test(val)) {
			t.val(0);
		}
	})

	// 支付方式
	$('.rewardS-pay-way ul li').click(function(){
		$(this).addClass('on').siblings('li').removeClass('on');
	})

	//打开
	$('.rewardS .rewardS-support .money').click(function(){
		var t = $(this);
		if(t.hasClass("loading")) return;
		t.addClass("loading");

		//验证文章状态
		$.ajax({
			"url": masterDomain + "/include/ajax.php?service=tieba&action=checkRewardState",
			"data": {"aid": id},
			"dataType": "jsonp",
			success: function(data){
				t.removeClass("loading");
				if(data && data.state == 100){
					$('.rewardS-pay').show(); $('.rewardS-mask').show();
					rewardInput.focus().val(rewardInput.val());
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

	//关闭
	$('.rewardS-pay-tit .close').click(function(){
		$('.rewardS-pay').hide(); $('.rewardS-mask').hide();
	})

	//立即支付
	$('.rewardS-pay .rewardS-sumbit a').bind("click", function(event){
		var t = $(this);
		var amount = rewardInput.val();
		var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
		var re = new RegExp(regu);
		if (!re.test(amount)) {
			event.preventDefault();
			alert("打赏金额格式错误，最少0.01元！");
		}

		var paytype = $(".rewardS-pay-way .on").data("type");
		if(paytype == "" || paytype == undefined || paytype == null){
			event.preventDefault();
			alert("请选择支付方式！");
		}

		var url = t.data("url").replace("$amount", amount).replace("$paytype", paytype);
		t.attr("href", url);
		$('.rewardS-pay-tit .close').click();

	})


	// 查看更多打赏列表
	$(".rewardS-support .num").click(function(){
		var num = parseInt($(this).find("font").text());
		if (num > 10) {
			$(".pop_main_box, .rewardS-mask").show();
		}
	})

	// 关闭打赏列表
	$(".pop-close").click(function(){
		$(".pop_main_box, .rewardS-mask").hide();
	})

	pageInfo();

	// 打赏分页
	function pageInfo(){

		var pageSize = 10, total = Math.ceil($(".gratuity_list li").length / pageSize);
		var current = 1, pageHtml = [];
		$(".gratuity_list li:lt("+pageSize+")").show();

		// 打印页数
		pageHtml.push('<li id="btnPrev" class="btn disabled always">上一页</li>');
		for (var i = 0; i < total; i++) {
			if (i == 0) {
				pageHtml.push('<li data-id="'+(i+1)+'" class="always"><a href="javascript:;" class="pageCurrent">'+(i+1)+'</a></li>');
				pageHtml.push('<li class="prevdot"><span>...</span></li>');
			}else if (i == total - 1) {
				pageHtml.push('<li class="nextdot"><span>...</span></li>');
				pageHtml.push('<li data-id="'+(i+1)+'" class="always"><a href="javascript:;">'+(i+1)+'</a></li>');
			}else {
				pageHtml.push('<li data-id="'+(i+1)+'"><a href="javascript:;">'+(i+1)+'</a></li>');
			}
		}
		pageHtml.push('<li id="btnNext" class="btn always">下一页</li>');
		if (total > 1) {
			$("#page-list-content .rwPage").html(pageHtml.join(""));
		}

		pagedot();

		// 上一页
		$("#btnPrev").click( function() {
				var t = $(this);
				if (t.hasClass("disabled")) return;

				$("#btnNext").removeClass("disabled");
				var cur = $('.rwPage .pageCurrent'), li = cur.parent("li");
				cur.removeClass("pageCurrent");
				$(".rwPage li[data-id="+(current - 1)+"]").find('a').addClass("pageCurrent");

				current -= 1;
				var indexStart = (current - 1) * pageSize, indexEnd = indexStart + pageSize - 1;
				$(".gratuity_list li").show();
				$(".gratuity_list li:lt(" + indexStart + "), .gratuity_list li:gt(" + indexEnd + ")").hide();

				if (current == 1) t.addClass("disabled");
				pagedot();
		});

		// 下一页
		$("#btnNext").click( function() {

			var t = $(this);
			if (t.hasClass("disabled")) return;

			$("#btnPrev").removeClass("disabled");
			var cur = $('.rwPage .pageCurrent'), li = cur.parent("li");
			cur.removeClass("pageCurrent");
			$(".rwPage li[data-id="+(current + 1)+"]").find('a').addClass("pageCurrent");


			current += 1;
			$(".gratuity_list li").show();
			var indexStart = (current - 1) * pageSize,
					indexEnd = current * pageSize - 1 > $(".gratuity_list li").length - 1 ? $(".gratuity_list li").length - 1 : current * pageSize - 1;
			$(".gratuity_list li:lt(" + indexStart + "), .gratuity_list li:gt(" + indexEnd +")").hide();
			if (current == total) t.addClass("disabled");
			pagedot();
		});

		// 点击页数
		$('.rwPage li').click(function(){
			var t = $(this);
			if (t.hasClass("btn")) return;

			current = parseInt(t.attr("data-id"));
			$('.rwPage .pageCurrent').removeClass("pageCurrent");
			$(".rwPage li[data-id="+current+"]").find('a').addClass("pageCurrent");

			var indexStart = (current - 1) * pageSize, indexEnd = indexStart + pageSize - 1;
			$(".gratuity_list li").show();
			$(".gratuity_list li:lt(" + indexStart + "), .gratuity_list li:gt(" + indexEnd + ")").hide();

			if (current == 1) {
				$("#btnPrev").addClass("disabled");
			}else {
				$("#btnPrev").removeClass("disabled");
			}
			if (current == total) {
				$("#btnNext").addClass("disabled");
			}else {
				$("#btnNext").removeClass("disabled");
			}

			pagedot();

		})

		function pagedot(){

			if (total < 6) {
				$(".nextdot, .prevdot").hide();
			}else {

				if (current > 3) {
					$('.prevdot').show();
					$(".rwPage li").show();
					$(".rwPage li:lt(" + current + ")").hide();


					if (current > (total - 3)) {
						$(".rwPage li:gt(" + (total - 3) + ")").show();
						$('.nextdot').hide();
					}else {
						$(".rwPage li:gt(" + (current + 2) + ")").hide();
						$('.nextdot').show();
					}
					$(".prevdot").show();

				}else {
					$(".rwPage li").show();
					$('.prevdot').hide();
					$(".rwPage li:gt(5)").hide();
					$('.nextdot').show();

				}

				$(".always").show();

			}
		}

	}


})


//获取回复列表
function getReply(replyMore, rid, page){
	replyMore.html("<div class='loading'><i></i>加载中...</div>");
	$.ajax({
		url: masterDomain+"/include/ajax.php?service=member&action=getChildComment&sid="+rid+"&page="+page+"&pageSize="+replyPageSize,
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
					html.push('<li class="fn-clear"><div class="reply-img user_hover user_simg_hover"><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_100.jpg\';" src="'+src+'" /></div><div class="reply-txt"><div class="name"><div class="user_hover">'+list[i].user.nickname+':</div><span>'+list[i].content+'</span></div><div class="time"><span>'+huoniao.transTimes(list[i].dtime, 1)+'</span><a href="javascript:;" class="reply-sb">回复</a></div></div></li>')
				}
				replyMore.html('<ul>'+html.join("")+'</ul>');
				replyMore.append('<div class="page fn-clear"><a class="my-reply fn-right">我也说一句</a></div>');

				if(pageInfo.totalPage > 1){
					showReplyPage(pageInfo, replyMore, rid);
				}

			}
		}
	});
}


//打印回复分页
function showReplyPage(pageInfo, replyMore, rid){

	var info = replyMore.find(".page");
	var nowPageNum = Number(pageInfo.page);
	var allPageNum = Math.ceil(Number(pageInfo.totalCount)/Number(pageInfo.pageSize));
	var pageArr = [];

	var pages = document.createElement("div");
	pages.className = "pagination-pages";
	info.prepend(pages);

	//拼接所有分页
	if (allPageNum > 1) {

		//上一页
		if (nowPageNum > 1) {
			var prev = document.createElement("a");
			prev.className = "prev";
			prev.innerHTML = '上一页<i></i>';
			prev.onclick = function () {
				atpage = nowPageNum - 1;
				getReply(replyMore, rid, atpage);
			}
		}
		info.find(".pagination-pages").append(prev);

		//分页列表
		if (allPageNum - 2 < 1) {
			for (var i = 1; i <= allPageNum; i++) {
				if (nowPageNum == i) {
					var page = document.createElement("span");
					page.className = "curr";
					page.innerHTML = i;
				} else {
					var page = document.createElement("a");
					page.innerHTML = i;
					page.onclick = function () {
						atpage = Number($(this).text());
						getReply(replyMore, rid, atpage);
					}
				}
				info.find(".pagination-pages").append(page);
			}
		} else {
			for (var i = 1; i <= 2; i++) {
				if (nowPageNum == i) {
					var page = document.createElement("span");
					page.className = "curr";
					page.innerHTML = i;
				}
				else {
					var page = document.createElement("a");
					page.innerHTML = i;
					page.onclick = function () {
						atpage = Number($(this).text());
						getReply(replyMore, rid, atpage);
					}
				}
				info.find(".pagination-pages").append(page);
			}
			var addNum = nowPageNum - 4;
			if (addNum > 0) {
				var em = document.createElement("span");
				em.className = "interim";
				em.innerHTML = "...";
				info.find(".pagination-pages").append(em);
			}
			for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
				if (i > allPageNum) {
					break;
				}
				else {
					if (i <= 2) {
						continue;
					}
					else {
						if (nowPageNum == i) {
							var page = document.createElement("span");
							page.className = "curr";
							page.innerHTML = i;
						}
						else {
							var page = document.createElement("a");
							page.innerHTML = i;
							page.onclick = function () {
								atpage = Number($(this).text());
								getReply(replyMore, rid, atpage);
							}
						}
						info.find(".pagination-pages").append(page);
					}
				}
			}
			var addNum = nowPageNum + 2;
			if (addNum < allPageNum - 1) {
				var em = document.createElement("span");
				em.className = "interim";
				em.innerHTML = "...";
				info.find(".pagination-pages").append(em);
			}
			for (var i = allPageNum - 1; i <= allPageNum; i++) {
				if (i <= nowPageNum + 1) {
					continue;
				}
				else {
					var page = document.createElement("a");
					page.innerHTML = i;
					page.onclick = function () {
						atpage = Number($(this).text());
						getReply(replyMore, rid, atpage);
					}
					info.find(".pagination-pages").append(page);
				}
			}
		}

		//下一页
		if (nowPageNum < allPageNum) {
			var next = document.createElement("a");
			next.className = "next";
			next.innerHTML = '下一页<i></i>';
			next.onclick = function () {
				atpage = nowPageNum + 1;
				getReply(replyMore, rid, atpage);
			}
		}
		info.find(".pagination-pages").append(next);

		info.show();

	}else{
		info.hide();
	}

}
