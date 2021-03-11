$(function(){

	$(document).on('click','.good',function(){
		var t = $(this), id = t.closest("dl").attr("data-id");
		if(t.hasClass("active")) return false;
		if(id != "" && id != undefined){
			$.ajax({
				url: masterDomain + "/include/ajax.php?service=member&action=dingComment&type=add&id="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					var ncount = parseInt(t.children('span').text());
					t.addClass("active")
					t.children('span').text((ncount+1));

					//加1效果
					var $i = $("<b>").text("+1");
					var x = t.offset().left, y = t.offset().top;
					$i.css({top: y - 10, left: x + 17, position: "absolute", color: "#E94F06"});
					$("body").append($i);
					$i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 1000, function(){
						$i.remove();
					});


				}
			});
		}
	})

	// 发布评论
	$('click','.reply').click(function(){
		$('.f_cmnt_input').click();
		var o = $(this), id = o.closest('dl').attr('data-id');
		toggleFootComment(id);
	})

	/* 底部 写评论 */
  $('.f_cmnt_input ,.wcmt_cancel').click(function(){
    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			top.location.href = masterDomain + '/login.html';
			return false;
		}

  	toggleFootComment();
  })


  function toggleFootComment(id){
  	var replayid = id ? id : 0;
  	$('#wcmt_send_btm').attr('data-id',replayid);
  	var box = $('.footer_comment');
    if(box.hasClass('open')) {
				$('html, body').css({"height": "auto", "overflow": "auto"});
    	$('.footer_comment').removeClass('open');
    	$('#cmnt_bdbg').remove();
    } else {

			var wh = $(window).height();
			$('html, body').css({"height": wh, "overflow": "hidden"});

      box.addClass('open');
      $('.newcomment1').focus();
      $('body').append('<div id="cmnt_bdbg" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:899;"></div>');
      G('cmnt_bdbg').addEventListener('touchstart',function(e){
	    	toggleFootComment();
	    	e.preventDefault();
			})
    }
  }


  $(".newcomment").on("input propertychange",function(){
  	var a = $(this),val = a.val();
  	if(val.length > 200) {
  		a.val(val.substr(0,200));
  	}
  })

  $('.wcmt_send, .submit_top').click(function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			top.location.href = masterDomain + '/login.html';
			return false;
		}

		var t = $(this);
		if(t.hasClass("loading")) return false;

		var contentObj = t.hasClass("submit_top") ? $(".newcomment") : $(".newcomment1"), content = contentObj.val();

		if(content == ""){
      alert("请输入您要评论的内容！");
			return false;
		}
		if(huoniao.getStrLength(content) > 200){
			alert("超过200个字了！");
			return false;
		}

		t.addClass("loading").html('提交中...');
		$.ajax({
			url: "/include/ajax.php?service=member&action=sendComment&type=article-detail&aid="+newsid,
			data: "content="+content,
			type: "POST",
			dataType: "json",
			success: function (data) {
				t.removeClass("loading").html('评论');
				if(data && data.state == 100){
          contentObj.val('');
					alert('提交成功！');
					location.reload();
				}else{
          alert(data.info);
        }
			}
		});
	})
	var loadmoreLock = false;
	var totalPage;
	var cmntbox = $('#cmnt_list');
	$(window).scroll(function(){
		if(loadmoreLock || page > totalPage) return;
		var sct = $(window).scrollTop();
		if(sct + $(window).height() + 50 > $('#footer').offset().top) {
			$('.loadmore').show();
      loadmoreLock = true;
      cmntbox.find('.error').remove();
      var orderby = 'time';
      var url = masterDomain + "/include/ajax.php?service=member&action=getComment&type=article-detail&son=1&aid="+newsid+"&page="+page+"&orderby="+orderby+"&pageSize=" + pageSize;
      $.ajax({
          url: url,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
          	if(data && data.state == 100){
              	$('.loadmore').hide();
              	totalPage = data.info.pageInfo.totalPage;
          		if(cmntbox.find(".cmnt_item").length <= 0){
          			cmntbox.html(getCommentList(data.info.list));
          		} else {
          			cmntbox.append(getCommentList(data.info.list));
          		}
          		page++;
          		loadmoreLock = false;
          		if(page >= totalPage) {
          			cmntbox.append("<p class='error'>已加载全部评论</p>");
          		}
          	} else {
							$('.loadmore').hide();
          		cmntbox.append("<p class='error' align='center'>暂无相关评论</p>");
          	}
          },
          error: function(){
              $('.loadmore').hide();
          	cmntbox.append("<p class='error'>获取数据失败，请稍后再试···</p>");
          	loadmoreLock = false;
          }
      })
		}
	}).scroll()

	function getCommentList(list){
		var html = [];
		for(var i = 0; i < list.length; i++){
			var photo = list[i].user['photo'] == "" ? staticPath+'images/noPhoto_40.jpg' : huoniao.changeFileSize(list[i].user['photo'], "small");
			var nickname = list[i].user['nickname'];
			var userid = list[i].user['userid'];
			var ftime = list[i]['ftime'];
			var ipaddr = list[i]['ipaddr'];
			var content = list[i]['content'];
			var good = list[i]['zan'];
			var already = list[i]['zan_has'];
			var lower = list[i]['lower'];
			if(lower != null &&　lower != undefined && list[i]['lower'].count > 0) {
				var subHtml = [] , subHtml1 = [];
				var sublower = lower.list;
				var cmnt = [],m = -1;
				while(sublower != null && sublower.length != undefined) {
					m++;
					cmnt[m] = [];
					var first = sublower.length - 1;
					cmnt[m]['nickname'] = sublower[first].user['nickname'];
					cmnt[m]['userid'] = sublower[first].user['userid'];
					cmnt[m]['ftime'] = sublower[first]['ftime'];
					cmnt[m]['ipaddr'] = sublower[first]['ipaddr'];
					cmnt[m]['content'] = sublower[first]['content'];
					cmnt[m]['good'] = sublower[first]['zan'];
					cmnt[m]['id'] = sublower[first]['id'];
					cmnt[m]['photo'] = sublower[first].user['photo'] == "" ? staticPath+'images/noPhoto_40.jpg' : huoniao.changeFileSize(sublower[first].user['photo'], "small");
					sublower = sublower[first]['lower'];
				}

				//最外层--最后回复内容
				html.push('<dl class="cmnt_item" data-id="' + cmnt[m]['id'] + '">');
				html.push('<dt><a href="'+masterDomain+'/user/'+cmnt[m]['userid']+'"><img src="'+ cmnt[m]['photo'] + '" onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" class="cmnt_user_head" alt=""></a></dt>');
				html.push('<dd>');
				html.push('<p class="cmnt_nick">');
				html.push('<span class="cmnt_user_name"><a href="'+masterDomain+'/user/'+cmnt[m]['userid']+'">' + cmnt[m]['nickname'] + '</a></span>');
				html.push('<span class="cmnt_addres">' + cmnt[m]['ipaddr'] + '</span>');
				html.push('</p>');

				var first = true; //最内层 加载一楼信息
				for(var t = 0; t < m + 1;t++) {
					html.push('<div class="cmnt_base">');
				}
				for(var t = 0; t < m + 1;t++) {
					var subItem = [];
					if(first) {
						subItem.push('<p class="cmnt_nick">');
							// subItem.push('<span class="cmnt_user_name">' + nickname + '</span>');
							subItem.push('<span class="cmnt_source">' + cmnt[t]['nickname'] + ' ' + cmnt[t]['ipaddr'] + '</span> <code>1</code>');
						subItem.push('</p>');
						subItem.push('<p class="cmnt_text">' + content + '</p>');
						subItem.push('<div class="cmnt_do clearfix">');
						subItem.push('<div class="comment_op clearfix">');
						subItem.push('<span class="fl"> <time>&nbsp;' + cmnt[t]['ftime'] + '</time></span>')
						//subItem.push('<span class="fr"> <a href="javascript:;" title="赞" class="' + zanCls + '"><i class="icon-good"></i><span>' + good + '</span></a> <a href="javascript:;" class="cmntnum reply"><i class="icon-pl2"></i></a> </span>')
						subItem.push('</div>');
						subItem.push('</div>');
						subItem.push('</div>');
						first = false;
						t--;

					} else if(t == m) {
						var zanCls = already == 1 ? 'good active' : 'good';
						subItem.push('<p class="cmnt_text">' + cmnt[t]['content'] + '</p>');
						subItem.push('<div class="cmnt_do clearfix">');
						subItem.push('<div class="comment_op clearfix">');
						subItem.push('<span class="fl"> <time>' + cmnt[t]['ftime'] + '</time></span>')
						//subItem.push('<span class="fr"> <a href="javascript:;" title="赞" class="' + zanCls + '"><i class="icon-good"></i><span>' + good + '</span></a> <a href="javascript:;" class="cmntnum reply"><i class="icon-pl2"></i></a> </span>')
						subItem.push('</div>');
						subItem.push('</div>');
						subItem.push('</dd>');
						subItem.push('</dl>');

					} else {

						subItem.push('<p class="cmnt_nick"');
						subItem.push('<span class="cmnt_user_name">' + cmnt[t]['nickname'] + '</span>');
						subItem.push('<span class="cmnt_source">' + ftime + ' ' + ipaddr + '</span> <code>' + (t+2) + '</code>');
						subItem.push('</p>');
						subItem.push('<p class="cmnt_text">' + cmnt[t]['content'] + '</p>');
						subItem.push('</div>');
					}

						subHtml.push(subItem.join(""));
				}
				html.push(subHtml.join(""));
			} else {
				var zanCls = already ? ' icon-good-ok active' : ' icon-good-no';
				html.push('<dl class="cmnt_item" data-id="' + list[i]['id'] + '">');
  			html.push('<dt><a href="'+masterDomain+'/user/'+userid+'"><img src="' + photo + '" onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" class="cmnt_user_head" alt=""></a></dt>');
  			html.push('<dd>');
  			html.push('<p class="cmnt_nick"><span class="cmnt_user_name"><a href="'+masterDomain+'/user/'+userid+'">' + nickname + '</a></span><span class="cmnt_addres">' + ipaddr + '</span></p>');
  			html.push('<p class="cmnt_text">' + content + '</p>');
  			html.push('<div class="cmnt_do clearfix">');
  			html.push('<div class="comment_op clearfix">');
  			html.push('<span class="fl"> <time>' + ftime + '</time></span>');
  			//html.push('<span class="fr"> <a href="javascript:;" title="赞" class="' + zanCls + '"><i class="icon-good"></i><span>' + good + '</span><i class="icon-good icon-good-ok fly"></i></a> <a href="javascript:;" class="cmntnum"><i class="icon-pl2"></i></a> </span>');
  			html.push('</div>');
  			html.push('</div>');

  			html.push('</dd>')
  			html.push('</dl>');
    	}
		}

		return html.join("");
	}



	// $('.f_shear').click(function(){
	// 		$('.shearBox').css('top','0');
	// 		$('.shearBox .bg').css({'height':'100%','opacity':1});
	// })
	//
	// $('#cancelShear').click(function(){
	// 		closeShearBox();
	// })
	//
	// // 分享
	// G('shearBg').addEventListener('touchstart',function(){
	// 		closeShearBox();
	// })
	//
	// function closeShearBox(){
	// 		$('.shearBox').css('top','-100%');
	// 		$('.shearBox .bg').css({'height':'0','opacity':0});
	// }

})






//单点登录执行脚本
function ssoLogin(info){


	//已登录
	if(info){
    $(".btn.login").html('<img onerror="javascript:this.src=\'/static/images/noPhoto_40.jpg\';"src="'+info['photo']+'">');
    $(".user_info .fl a").html('<img onerror="javascript:this.src=\'/static/images/noPhoto_40.jpg\';"src="'+info['photo']+'">'+info['nickname']);

    $.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
    $(".btn.login").html('');
    $.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});
	}

}
