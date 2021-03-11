$(function(){

  var userAgent = navigator.userAgent.toLowerCase();
  var amount = 0; // 打赏金额

  var isload = false;
  //音频皮肤
  audiojs.events.ready(function() {
    audiojs.createAll();
  });


  try{
		var upType1 = upType;
	}catch(e){
		var upType1 = 'atlas';
	}

  // 点击打赏
	$('.reward_btn').click(function(){
    var t = $(this);
    if(t.hasClass("disabled") || t.hasClass("load")) return;

    t.addClass("load");
    //验证帖子状态
    $.ajax({
      "url": masterDomain + "/include/ajax.php?service=tieba&action=checkRewardState",
      "data": {"aid": id},
      "dataType": "jsonp",
      success: function(data){
        t.removeClass("load");
        if(data && data.state == 100){
          $(".reword-sure").removeClass("disabled");
          $('.rewardBox, .mask').addClass('show');
          $('.rewardBox').bind('touchmove', function(e){e.preventDefault();});
          $('.reward-a').show();
          $('.reward-inp').hide();

          amount = parseFloat($('.reward-box a.active em').text());

        }else{
          alert(data.info);
        }
      },
      error: function(){
        t.removeClass("load");
        alert("网络错误，操作失败，请稍候重试！");
      }
    });


	})

	// 选择打赏金额
	$('.reward-box a').click(function(){
    var t = $(this), account = t.find('em');
    t.addClass('active').siblings('a').removeClass('active');
    amount = parseFloat(account.text());
	}).eq(0).click();

	// 选择其他金额
	$('.reword-other').click(function(){
    amount = 0;
		$('.reward-a').hide();
		$('.reward-inp').show();
    if($("#reward").val() == ''){
      $(".reword-sure").addClass("disabled");
    }
	})

	// 输入打赏金额
	$('.reward-inp input').bind('input propertychange', function(){
		var reward = $('#reward').val();
    amount = reward;
		if (reward != "") {
			$('.reword-sure').removeClass('disabled');
		}else {
			$('.reword-sure').addClass('disabled');
		}
	})

  // 确认打赏
  $('.reword-sure').click(function(){
    var t = $(this);

    var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
    var re = new RegExp(regu);
    if (!re.test(amount)) {
      amount = 0;
      alert("打赏金额格式错误，最少0.01元！");
      return false;
    }

    hideReward(1);

    var app = device.indexOf('huoniao') >= 0 ? 1 : 0;
    location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid="+id+"&amount="+amount+"&app="+app;
    return;

    //如果不在客户端中访问，根据设备类型删除不支持的支付方式
    if(appInfo.device == ""){
      // 赏
      if(navigator.userAgent.toLowerCase().match(/micromessenger/)){
        $("#shangAlipay, #shangGlobalAlipay").remove();
      }
      // else{
      //   $("#shangWxpay").remove();
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

      location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid="+id+"&amount="+amount+"&paytype="+paytype;

    }else{
      location.href = masterDomain + "/include/ajax.php?service=tieba&action=reward&aid="+id+"&amount="+amount+"&paytype="+paytype+"&app=1";
    }


  });

	// 关闭打赏
	$('.rewardBox .close').click(function(){
		hideReward();
	})

  // 点击遮罩层
	$('.mask').click(function(){
		hideReward();
		hideMore();
		hideJubao();
	}).bind('touchmove', function(){
		hideReward();
		hideMore();
		hideJubao();
	})

	function hideReward(has){
		$('.reward-a').show();
		$('.reward-inp input').val("");
    $('.reword-sure').addClass('disabled');
    $('.rewardBox, .paybox').removeClass('show');
    if(!has){
  		$('.mask').removeClass('show');
    }
		$('.rewardBox').unbind('touchmove');
	}

  // 点击分享
  // $('.footer .share').click(function(){
  //   $('.more-box, .mask').addClass('show');
	// 	$('.more-box').bind('touchmove', function(e){e.preventDefault();});
  // })

  // 关闭分享
  $('.more-box .close').click(function(){
    hideMore();
  })

  function hideMore(){
		$('.more-box, .mask').removeClass('show');
		$('.more-box').unbind('touchmove');
	}

  // 举报
	$('.jubao').click(function(){
		$('.more-box').removeClass('show');
		$('.jubaobox, .mask').addClass('show');
		$('.jubaobox').bind('touchmove', function(e){e.preventDefault();});
	})

	// 关闭举报
  $('.jubaobox .close').click(function(){
    hideJubao();
  })


  // 选择举报类型
  $('.jubaobox .select li').click(function(){
    var t = $(this), dom = t.hasClass('active');
    if (dom) {
      t.removeClass('active');
    }else {
      t.addClass('active');
    }
  })

  // 举报提交
  $('.jubaobox .submit').click(function(){
    if ($('.jubaobox .select .active').length < 1) {
      showErr('请选择举报类型');
    }else if ($('#jubaoTel').val() == "") {
      showErr('请填写联系方式')
    }else {
      hideJubao();
    }
  })

	function hideJubao(){
		$('.jubaobox .select li').removeClass('active');
		$('.remark textarea').val("");
		$('#jubaoTel').val("");
		$('.jubaobox, .mask').removeClass('show');
    $('.jubaobox').unbind('touchmove');
	}

	// 显示错误
  function showErr(txt){
    $('.error').text(txt).show();
    setTimeout(function(){
      $('.error').hide();
    }, 1000)
  }

  // 播放语音
  $('.audio-panel').click(function(){
    var t = $(this), audio = $(this).find('audio')[0];
    if (audio.paused) {
      $('.audio-panel audio')[0].pause();
      audio.play();
    }else {
      audio.pause();
    }
  })

  // 点击点赞
  $('.footer .zan').click(function(){
    var t = $(this);
    if (t.hasClass('active')) {
      t.removeClass('active');
    }else {
      t.addClass('active');
    }
  })

  var rid = 0;

  // 回复
  $('.comment-btn').click(function(){
    var userid = $.cookie(cookiePre+"login_user");
  	if(userid == null || userid == ""){
  		location.href = masterDomain + "/login.html";
  		return false;
  	}

    var t = $(this);
    $('.layer').addClass('show').animate({"left":"0"},100);
    $(".layer").find('.placeholder').attr('contenteditable', true);


  })

  // 回复
  $('body').delegate('.comment', 'click tap', function(){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + "/login.html";
      return false;
    }

    var t = $(this);
    $('.layer').addClass('show').animate({"left":"0"},100);
    $(".layer").find('.placeholder').attr('contenteditable', true);

    rid = $(this).parents('.item').data('id');

  })

  // 隐藏回复
  $('.layer .header-l').click(function(){
    $('.layer').removeClass('show').animate({"left":"100%"},100);
    $('.layer .textarea').html('');
  })

  // 选择表情
  var memerySelection;
  $('.editor .emotion').click(function(){
    var t = $(this), box = $('.emotion-box'), editor = $('.editor').height(), emotionBox = $('.emotion-box').height(),
        windowHeight = $(window).height(), bodyHeight = $('body').height();
    var autoHeight = windowHeight - $('.header').height() * 3 - emotionBox;
    memerySelection = window.getSelection();

		if (box.css('display') == 'none') {
			$('.emotion-box').show();
      $('.layer .editor').addClass('emotion');

      if ((bodyHeight + emotionBox) > windowHeight) {
        $('.layer .discuss').css({'bottom':'4rem', 'padding-bottom': '6rem', 'height': autoHeight});
      }

      t.addClass('on');
			return false;
		}else {
			$('.emotion-box').hide();
      $('.layer .editor').removeClass('emotion');
      $('.layer .discuss').css('padding-bottom', '1rem');
      t.removeClass('on');
      $('.discuss').height($(window).height() - $('.editor').height() * 3);
		}
	})

  $('.emotion-box li').bind('click', function(){
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

  $(document).click(function(){
    $('.editor, .anotherbox').removeClass('emotion');
    $('.emotion.item').removeClass('on');
    $('.emotion-box').hide();
    $('.discuss').css({'padding-bottom': '1.4rem'});
    $('.discuss').height($(window).height() - $('.editor').height() * 3);
  })

  $('.discuss').click(function(){
    set_focus($('.placeholder:last'));
  })

  $('.textarea').focus(function(){
    var t = $(this), txtGray = t.find('.txt-gray');
    if (txtGray.length > 0) {
      t.html('');
    }
  })

  $('.textarea').blur(function(){
    var t = $(this), txtGray = t.find('.txt-gray');
    if (t.html() == "") {
      t.html('<font class="txt-gray">帖子内容</font>');
    }
  })

  $('body').delegate('.placeholder', 'click', function(){
    var t = $(this);
    set_focus(t);
    $('.editor, .anotherbox').removeClass('emotion');
    $('.emotion.item').removeClass('on');
    $('.emotion-box').hide();
    $('.discuss').css({'padding-bottom': '1.4rem'});
    return false;
  })

  $('.discuss').height($(window).height() - $('.editor').height() * 3);

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
		}else{
			var range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

  $('body').delegate('.placeholder', 'click', function(){
    $(this).focus();
    return false;
  })

  $('.textarea').click(function(){
    set_focus($('.placeholder:last'));
  })

  // 收藏
  $('.footer .collect').click(function(){
    var t = $(this), type = "add";
    if (t.hasClass('active')) {
      type = "del";
      t.removeClass('active');
    }else {
      t.addClass('active');
    }
    $.post("/include/ajax.php?service=member&action=collect&module=tieba&temp=detail&type="+type+"&id="+id);
  })
  // 判断是否收藏
  function checkCollect(){
    $.ajax({
      url: "/include/ajax.php?service=member&action=collect&module=tieba&temp=detail&type=add&check=1&id="+id,
      type: "post",
      dataType: "json",
      success: function(data){
        if(data && data.state == 100){
          if(data.info == "has"){
            $(".collect").addClass("active");
          }
        }
      }
    })
  }
  checkCollect();

  // 更多回复
  $('.rlist').delegate('.rmore', 'click', function(){
    var t = $(this), par = t.closest(".cbox"), replyMore = par.find(".rlist"), rid = Number(par.data("id")), reply = Number(par.data("reply"));
    var page = par.attr("data-page");
  	if(id && reply){
      page++;
      par.attr("data-page", page);
    	  getReply(replyMore, rid, page);
  	}
  })

  // 回复某人
  $('.rlist').delegate('li', 'click', function(){
    var t = $(this), name = t.find('.rname').text();
    $('.layer').addClass('show').animate({"left":"0"},100);
    $('.layer .textarea').html('<label contenteditable="false">回复 ' + name + '</label>')
    rid = t.closest(".cbox").data("id");
  })



  //异步获取回复信息
  $(".cbox").each(function(){
	var t = $(this), replyMore = t.find(".rlist"), rid = Number(t.data("id")), reply = Number(t.data("reply"));
	if(id && reply){
      t.attr("data-page", 1);
	  getReply(replyMore, rid, 1);
	}
  });




  //发表回复
  $(".replyBtn").bind("click", function(){
    var t = $(this);
    $("#content").find('.placeholder').attr('contenteditable', false);
    var content = $("#content .textarea").html();
    content = content.replace('<font class="txt-gray">帖子内容</font>', '');

  	if(!t.hasClass("disabled") && $.trim(content) != ""){
  		t.addClass("disabled");

      if(rid == '' || rid == undefined){
          var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=tieba-detail&aid=' + id;
      }else{
          var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + rid;
      }
  		$.ajax({
  			url: url,
  			data: "content="+encodeURIComponent(content),
  			type: "POST",
  			dataType: "json",
  			success: function (data) {
          t.removeClass("disabled");
  				if(data && data.state == 100){
            $(".top-l").click();
            if(data.info.ischeck == 1){
                alert("回复成功！");
                location.reload();
            }else{
                alert("回复成功，请等待管理员审核！");
            }
  				}else{
  					alert(data.info);
  				}
  			},
  			error: function(){
  				alert("网络错误，发表失败，请稍候重试！");
  				t.removeClass("disabled");
  			}
  		});
  	}
  });

  //上传凭证
  var $list = $('#content'),
    uploadbtn = $('.textarea'),
      ratio = window.devicePixelRatio || 1,
      fileCount = 0,
      thumbnailWidth = 100 * ratio,   // 缩略图大小
      thumbnailHeight = 100 * ratio,  // 缩略图大小
      uploader,
      atlasMax = 9;

  fileCount = $list.find("li.item").length;

  // 初始化Web Uploader
  uploader = WebUploader.create({
    auto: true,
    swf: staticPath + 'js/webuploader/Uploader.swf',
    server: '/include/upload.inc.php?mod='+modelType+'&type='+upType1,
    pick: '#filePicker',
    fileVal: 'Filedata',
    accept: {
      title: 'Images',
      extensions: 'jpg,jpeg,gif,png',
      mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif'
    },
    compress: {
      width: 750,
      height: 750,
      // 图片质量，只有type为`image/jpeg`的时候才有效。
      quality: 90,
      // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
      allowMagnify: false,
      // 是否允许裁剪。
      crop: false,
      // 是否保留头部meta信息。
      preserveHeaders: true,
      // 如果发现压缩后文件大小比原来还大，则使用原来图片
      // 此属性可能会影响图片自动纠正功能
      noCompressIfLarger: false,
      // 单位字节，如果图片大小小于此值，不会采用压缩。
      compressSize: 1024*200
    },
    fileNumLimit: atlasMax
  });

  //删除已上传图片
  var delAtlasPic = function(b){
    var g = {
      mod: modelType,
      type: "delAtlas",
      picpath: b,
      randoms: Math.random()
    };
    $.ajax({
      type: "POST",
      url: "/include/upload.inc.php",
      data: $.param(g)
    })
  };

  //更新上传状态
  function updateStatus(){
    if(fileCount == 0){
      $('.imgtip').show();
    }else{
      $('.imgtip').hide();
      if(atlasMax > 1 && $list.find('.litpic').length == 0){
        $list.children('li').eq(0).addClass('litpic');
      }
    }
    $(".uploader-btn .utip").html('还能上传'+(atlasMax-fileCount)+'张图片');
  }

  // 负责view的销毁
  function removeFile(file) {
    var $li = $('#'+file.id);
    fileCount--;
    delAtlasPic($li.find("img").attr("data-val"));
    $li.remove();
    updateStatus();
  }

  //从队列删除
  $list.delegate(".cancel", "click", function(){
    var t = $(this), li = t.closest(".thumbnail"), inpItem = li.next('.inp-item');
    var file = [];
    file['id'] = li.attr("id");
    if (inpItem.html() == "") {
      inpItem.remove();
    }
    removeFile(file);
    return false;
  });

  // 切换litpic
  if(atlasMax > 1){
    $list.delegate(".item img", "click", function(){
      var t = $(this).parent('.item');
      if(atlasMax > 1 && !t.hasClass('litpic')){
      console.log('eee')
        t.addClass('litpic').siblings('.item').removeClass('litpic');
      }
    });
  }

  // 当有文件添加进来时执行，负责view的创建
  function addFile(file) {
    var $li   = $('<div id="' + file.id + '" class="thumbnail"><img></div>'),
        $btns = $('<div class="file-panel"><span class="cancel"></span></div>').appendTo($li),
        $img = $li.find('img');

    // 创建缩略图
    uploader.makeThumb(file, function(error, src) {
        if(error){
          $img.replaceWith('<span class="thumb-error">不能预览</span>');
          return;
        }
        $img.attr('src', src);
      }, thumbnailWidth, thumbnailHeight);

      $btns.on('click', 'span', function(){
        uploader.removeFile(file, true);
      });

      $list.append($li);
  }

  // 当有文件添加进来的时候
  uploader.on('fileQueued', function(file) {

    //先判断是否超出限制
    if(fileCount == atlasMax){
      showErr('图片数量已达上限');
      // $(".uploader-btn .utip").html('<font color="ff6600">图片数量已达上限</font>');
      return false;
    }

    fileCount++;
    addFile(file);
    updateStatus();
  });

  // 文件上传过程中创建进度条实时显示。
  uploader.on('uploadProgress', function(file, percentage){
    var $li = $('#'+file.id),
    $percent = $li.find('.progress span');

    // 避免重复创建
    if (!$percent.length) {
      $percent = $('<p class="progress"><span></span></p>')
        .appendTo($li)
        .find('span');
    }
    $percent.css('width', percentage * 100 + '%');
  });

  // 文件上传成功，给item添加成功class, 用样式标记上传成功。
  uploader.on('uploadSuccess', function(file, response){
    var $li = $('#'+file.id);
    if(response.state == "SUCCESS"){
      $li.find("img").attr("src", response.turl).attr("data-val", response.url).attr("data-url", response.turl);
      $li.after('<div contenteditable="true" class="inp-item placeholder"></div>');
    }else{
      removeFile(file);
      showErr('上传失败！');
    }
  });

  // 文件上传失败，现实上传出错。
  uploader.on('uploadError', function(file){
    removeFile(file);
    showErr('上传失败！');
  });

  // 完成上传完了，成功或者失败，先删除进度条。
  uploader.on('uploadComplete', function(file){
    $('#'+file.id).find('.progress').remove();
  });

  //上传失败
  uploader.on('error', function(code){
    var txt = "上传失败！";
    switch(code){
      case "Q_EXCEED_NUM_LIMIT":
        txt = "图片数量已达上限";
        break;
      case "F_EXCEED_SIZE":
        txt = "图片大小超出限制，单张图片最大不得超过"+atlasSize/1024/1024+"MB";
        break;
      case "F_DUPLICATE":
        txt = "此图片已上传过";
        break;
    }
    showErr(txt);
  });

  //滚动加载
	$(window).on("touchmove", function(){
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - 300;
		if ($(window).scrollTop() > scroll && !isload) {
			commentPage++;
			getComment();
		};
	});

  // 获取评论列表
  function getComment() {

    isload = true;
    $('.list').append('<div class="loading">加载中...</div>');
    $.ajax({
  		url: "/include/ajax.php?service=member&action=getComment&type=tieba-detail&son=1&aid="+id+"&page="+commentPage+"&pageSize="+commentPageSize,
  		type: "GET",
  		dataType: "json",
  		success: function (data) {
  			if(data && data.state == 100){
  				var list = data.info.list, pageInfo = data.info.pageInfo, html = [], rid;
  				for(var i = 0; i < list.length; i++){
            var photo = list[i].user.photo == "" ? staticPath+'images/noPhoto_100.jpg' : list[i].user.photo;
            var rid = list[i].id, reply = list[i].reply;
  					html.push('<dl class="item fn-clear item-'+rid+'" data-id="'+rid+'" data-reply="'+reply+'">');
  					html.push('<dt><a href="'+masterDomain+'/user/'+list[i].user.id+'"><img src="'+photo+'" alt=""></a></dt>');
  					html.push('<dd>');
  					html.push('<p class="txt fn-clear"><span class="name"><a href="'+masterDomain+'/user/'+list[i].user.id+'">'+list[i].user.nickname+'</a></span><span class="comment">评论</span></p>');
  					html.push('<p class="time">'+transTimes(list[i].dtime, 1)+'</p>');
  					html.push('<p class="content">'+list[i].content+'</p>');
            // if (reply != 0) {
            if(list[i]['lower']!=undefined && list[i]['lower'].count > 0 && list[i]['lower'].list!=null){
    					html.push('<div class="reply-box">');
    					html.push('</div>');
              getReply(rid, 1);
            }
  					html.push('</dd>');
  					html.push('</dl>');
  				}
          $('.list .loading').remove();
          $('.totalCount').html(pageInfo.totalCount);
          $('.list').append(html.join(""));
          if(commentPage >= pageInfo.totalPage){
              isload = true;
              $('.list').append('<div class="loading">已加载全部数据！</div>');
            }else{
              isload = false;
            }
  			}else {
  			  $('.list .loading').html(data.info);
          $('.totalCount').html('0');
  			}
  		}
  	});
  }
  getReward();
  // 获取打赏列表
  function getReward(){
    $.ajax({
      url: "/include/ajax.php?service=tieba&action=rewardList&aid="+id,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        if(data && data.state == 100){
          var list = data.info.list, count = list.length;
          $(".amount .blue").text(count);
          var photo = '';

          var time = 0;

          if(count){
            var html = [];
            if(count <= 8){
              html.push('<div class="reward-user">');
              for(var i = 0; i < count; i++){
                photo = list[i].photo != '' ? list[i].photo : '/static/images/noPhoto_60.jpg';
                html.push('<img src="'+photo+'" alt="">');
              }
              html.push(' <a href="'+rewardUrl+'" class="more-btn"></a>')
              html.push('</div>');

            }else{
              html.push('<div class="reward-user reward-user-more fn-clear">');
              html.push(' <div class="fn-left">');
              for(var i = 0; i < 5; i++){
                photo = list[i].photo != '' ? list[i].photo : '/static/images/noPhoto_60.jpg';
                html.push('<img src="'+photo+'" alt="">');
              }
              html.push(' </div>');
              html.push(' <div class="fn-left user-more">');
              for(var i = 5; i < 10 && i < count; i++){
                photo = list[i].photo != '' ? list[i].photo : '/static/images/noPhoto_60.jpg';
                html.push('<img src="'+photo+'" class="more-'+(i-4)+'" alt="">');
              }
              html.push(' <a href="'+rewardUrl+'" class="more-btn"></a>')
              html.push(' </div>');
              html.push('</div>');

            }

            $(".reward").after(html.join(""));

            setTimeout(function(){
              $(".reward-user").addClass("show");
            },50)

            time = 50;
          }

          setTimeout(function(){
              $(".comment-count").removeClass("vh");
              getComment();
          },time)

        }

      },
      error: function(){
        getComment();
      }
    })
  }


})


function transTimes(timestamp, n){
    update = new Date(timestamp*1000);//时间戳要乘1000
    year   = update.getFullYear();
    month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
    day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
    hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
    minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
    second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
    if(n == 1){
        return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
    }else if(n == 2){
        return (year+'-'+month+'-'+day);
    }else if(n == 3){
        return (month+'-'+day);
    }else if(n == 4){
        return (hour+':'+minute);
    }else{
        return 0;
    }
}


var replyPageSize = 3;
//获取回复列表
function getReply(rid, page){
    if(page == 1){
    	$('.item-'+rid).find('.reply-box').html("<div class='load'>加载中...</div>");
    }

	$.ajax({
		url: "/include/ajax.php?service=member&action=getChildComment&sid="+rid+"&page="+page+"&pageSize="+replyPageSize,
		type: "GET",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){

				var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
				for(var i = 0; i < list.length; i++){
					html.push('<p>'+list[i].user.nickname+'&nbsp;&nbsp;回复：'+list[i].content+'</p>')
				}

        if(page == 1){
            $('.item-'+rid).find('.reply-box').html(html.join(""));
        }

        var sur = pageInfo.totalCount - page * replyPageSize;
        if(sur > 0){
            if(page == 1){
                $('.item-'+rid).find('.reply-box').append('<a href="comment.html" class="reply-more">查看剩余'+sur+'条回复 >></a>');
            }
        }else{
            $('.item-'+rid).find('.reply-box').find(".rmore").remove();
        }

			}
		}
	});
}
