$(function(){

  //页面自适应设置
  	$(window).resize(function(){
  		var screenwidth = window.innerWidth || document.body.clientWidth;
  		var criticalPoint = criticalPoint != undefined ? criticalPoint : 1240;
  		var criticalClass = criticalClass != undefined ? criticalClass : "w1200";
  		if(screenwidth < criticalPoint){
  			$("html").removeClass(criticalClass);
  			$("html").addClass('w1000');

  		}else{
  			$("html").addClass(criticalClass);
  			$("html").removeClass('w1000');
  		}

  	});

  //第三方登录
	$("body").delegate(".loginconnect", "click", function(e){
		e.preventDefault();
		var href = $(this).attr("href"), type = href.split("type=")[1];
		loginWindow = window.open(href, 'oauthLogin', 'height=565, width=720, left=100, top=100, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');

		//判断窗口是否关闭
    mtimer = setInterval(function(){
			if(loginWindow.closed){
				$.cookie(cookiePre+"connect_uid", null, {expires: -10, domain: masterDomain.replace("http://www", ""), path: '/'});
				clearInterval(mtimer);
				huoniao.checkLogin(function(){
					location.reload();
				});
			}else{
				if($.cookie(cookiePre+"connect_uid") && $.cookie(cookiePre+"connect_code") == type){
					loginWindow.close();
					var modal = '<div id="loginconnectInfo"><div class="mask"></div> <div class="layer"> <p class="layer-tit"><span>温馨提示</span></p> <p class="layer-con">为了您的账户安全，请绑定您的手机号<br /><em class="layer_time">3</em>s后自动跳转</p> <p class="layer-btn"><a href="'+masterDomain+'/bindMobile.html?type='+type+'">前往绑定</a></p> </div></div>';

					$("#loginconnectInfo").remove();
					$('body').append(modal);

					var t = 3;
					var timer = setInterval(function(){
						if(t == 1){
							clearTimeout(timer);
							location.href = masterDomain+'/bindMobile.html?type='+type;
						}else{
							$(".layer_time").text(--t);
						}
					},300)
				}
			}
		}, 1000);

	});


  var b = $('.subnav'), h = b.height(), offset = b.offset(), top = offset.top, bottom = $('.contact-box').outerHeight(true), d_h = $(document).height(), w_h = $(window).height();
  $(window).bind("scroll",function(){
		var d = $(document).scrollTop(), h = b.height(), s_h = d_h-bottom-h, s_b = $('.contact-box').offset().top-h-15;
		if(top < d){
			if(0>(s_h - d)){
				// b.css({'position':'absolute','top':s_b});
			}else{
				b.css({'position':'fixed','top':'0'});
			}
		}else{
			b.css({'position':'static'});
		}
	});

  $('.mobile').hover(function(){
    $(this).find('.pop').show();
  }, function(){
    $(this).find('.pop').hide();
  })

  // 导航条
  $('.slide-box h3').click(function(){
    var t = $(this), ul = t.siblings('ul'), parent = ul.parent('.slide-box'), otherT = parent.siblings('.slide-box').find('h3'), otherUl = parent.siblings('.slide-box').find('ul');
    if (ul.css('display') == "none") {
      t.addClass('on');
      ul.slideDown(300);
      otherUl.slideUp(300, function(){
        otherT.removeClass('on');
      });
    }else{
      ul.slideUp(300, function(){
        t.removeClass('on');
      });
    }
  })


  // 头部下拉框
	$('.dropdown').hover(function(){
		$(this).find('ul').show();
	},function(){
		$(this).find('ul').hide();
	})

	$('.search-nav').click(function(){

		var ul = $(this).find('ul');
		if (ul.css("display")=='none' ) {
			$(this).find('ul').slideDown();
		}
		else{
			$(this).find('ul').slideUp();
		}
	});

  $('.search-nav ul li').click(function(){

		var val = $(this).html();
		$('.search-nav span').html(val);

	})

  $(".slide-box ul").mCustomScrollbar({theme:"minimal-dark"});


  // 地区二级分类
  $("#addr dd>a").bind("click", function(){
		var t = $(this), id = t.attr("data-id"), type = t.closest("dl").attr("id");
    t.addClass('on').siblings('a').removeClass('on');

		if(type == "addr") addrid = id;
		if(id == 0 || $("#"+type+id).size() == 0){
			$("#"+type).find(".subarea").hide();
		}else{
			$("#"+type).find(".subarea").show()
			$("#"+type).find(".subarea div").hide();
			$("#"+type+id).show();
			$("#"+type+id).find("a").removeClass("on");
			$("#"+type+id).find("a:eq(0)").addClass("on");
		}
    atpage = 1;
    getList();
	});

  $(".subarea").delegate("a", "click", function(){
		var t = $(this), id = t.attr("data-id"), type = t.closest("dl").attr("id");
    t.addClass('on').siblings('a').removeClass('on');

		if(type == "addr") addrid = id;
    atpage = 1;
    getList();
	});

  // 搜索关键字
  $('.f-btn').click(function(){
    atpage = 1;
    getList();
  })

  $('.searchform').submit(function(e){
    e.preventDefault();
      atpage = 1;
      getList();
  })

  //打印分页
  function showPageInfo() {
    var info = $(".pagination");
    var nowPageNum = atpage;
    var allPageNum = Math.ceil(totalCount/pageSize);
    var pageArr = [];

    info.html("").hide();

    //输入跳转
    var redirect = document.createElement("div");
    redirect.className = "pagination-gotopage";
    redirect.innerHTML = '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
    info.append(redirect);

    //分页跳转
    info.find(".btn").bind("click", function(){
      var pageNum = info.find(".inp").val();
      if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
        atpage = pageNum;
        $('html, body').animate({scrollTop: $(".filter").offset().top}, 300);
        getList();
      } else {
        info.find(".inp").focus();
      }
    });

    var pages = document.createElement("div");
    pages.className = "pagination-pages";
    info.append(pages);

    //拼接所有分页
    if (allPageNum > 1) {

      //上一页
      if (nowPageNum > 1) {
        var prev = document.createElement("a");
        prev.className = "prev";
        prev.innerHTML = '<i></i>';
        prev.onclick = function () {
          atpage = nowPageNum - 1;
          $('html, body').animate({scrollTop: $(".filter").offset().top}, 300);
          getList();
        }
      } else {
        var prev = document.createElement("span");
        prev.className = "prev disabled";
        prev.innerHTML = '<i></i>';
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
              $('html, body').animate({scrollTop: $(".filter").offset().top}, 300);
              getList();
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
              $('html, body').animate({scrollTop: $(".filter").offset().top}, 300);
              getList();
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
                  $('html, body').animate({scrollTop: $(".filter").offset().top}, 300);
                  getList();
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
              $('html, body').animate({scrollTop: $(".filter").offset().top}, 300);
              getList();
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
          $('html, body').animate({scrollTop: $(".filter").offset().top}, 300);
          getList();
        }
      } else {
        var next = document.createElement("span");
        next.className = "next disabled";
        next.innerHTML = '下一页<i></i>';
      }
      info.find(".pagination-pages").append(next);

      info.show();

    }else{
      info.hide();
    }
  }

  // 初始加载
  getList(1);



  function getList(is){

    if(is != 1){
    }

    //获取字段
    var item = [];
    $(".filter .item").each(function(index){
      var t = $(this), id = t.attr("data-id"), value = t.find(".curr").attr("data-id");
      if(value != 0){
        item[index] = {
          "id": id,
          "value": value
        };
      }
    });
    //有效期
    var valid = $("#valid .curr").attr("data-id");
    //信息性质
    var nature = $(".sortbar .tabs .curr").attr("data-id");
    //排序
    var orderby = $(".st.curr").attr("data-sort");
    //只看有图
    var pic = $(".sort .pic").hasClass("curr") ? 1 : 0;
    //只看推荐
    var rec = $(".sort .rec").hasClass("curr") ? 1 : 0;
    //只看火急
    var fire = $(".sort .fire").hasClass("curr") ? 1 : 0;
    //只看置顶
    var top = $(".sort .top1").hasClass("curr") ? 1 : 0;
    // 关键字
    var title = $('#search_keyword').val();

    $(".theme").html("");
    // $(".failed").hide();
    $(".loading").show();

    $.ajax({
      type: "POST",
      traditional: true,
      url: "/include/ajax.php?service=info&action=ilist",
      data: {
        // "typeid": typeid,
        "addrid": addrid,
        // "item": JSON.stringify(item),
        // //"valid": valid,
        // "nature": nature,
        // "orderby": orderby,
        // "thumb": pic,
        // "rec": rec,
        // "fire": fire,
        // "top": top,
        "title": title,
        "page": atpage,
        "pageSize": pageSize
      },
      dataType: "json",
      success: function (data) {

        $(".loading").hide();

        if(data && data.state == 100){

          //列表
          var html = [], bhtml = [], list = data.info.list, pageInfo = data.info.pageInfo;
          $("#totalCount").html(pageInfo.totalCount);
          totalCount = pageInfo.totalCount;
          var tpage = Math.ceil(totalCount/pageSize);
          $(".views .tpage .atpage").html("<strong>"+atpage+"</strong>/"+tpage);

          var prev = $(".views .tpage .prev"), next = $(".views .tpage .next");
          if(atpage == 1){
            prev.addClass("diabled");
          }else{
            prev.removeClass("diabled");
          }

          if(tpage > 0 && atpage < tpage){
            next.removeClass("diabled");
          }else{
            next.addClass("diabled");
          }


          for(var i = 0; i < list.length; i++){
            var member = list[i].member;

            html.push('<li class="item" data-id="'+list[i].id+'">');
            html.push('<span class="theme-1 fn-left">');
            html.push('<a href="'+list[i].url+'" class="theme-img">');

            var litpic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";

            html.push('<img src="'+litpic+'" alt="" />');
            html.push('</a>');
            html.push('<a href="'+list[i].url+'" class="title">'+list[i].title+'</a>');

            html.push('<span class="label">')
            var num = list[i].pcount;
            if (num != 0) {
              html.push('<em class="tu">'+list[i].pcount+'图</em>');
            }

            var nature = member.userType;
            if (nature == 1) {
              nature = "个人"
            }else if (nature == 2){
              nature = "商家"
            }else {
              nature = "游客"
            };
            html.push('<em class="sj">'+nature+'</em></span>');

            html.push('<p>'+list[i].typename+'</p>');
            html.push('</span>')


            html.push('<span class="theme-2 fn-left">'+list[i].address+'</span>')

            if (member.nickname != null) {
              html.push('<span class="theme-3 fn-left">'+member.nickname+'</span>')
            }else {
              html.push('<span class="theme-3 fn-left"></span>')
            }

            var pubdate = huoniao.transTimes(list[i].pubdate, 3);
            html.push('<span class="theme-4 fn-left">'+pubdate.replace("-", "月")+'日</span>');
            html.push('</li>');


          }

          $(".theme").html(html.join(""));

          showPageInfo();

        }else{
          $(".theme").html("");
          $(".pagination").hide();

          $("#totalCount").html(0);

          $(".views .tpage .atpage").html("<strong>0</strong>/0");
          $(".views .tpage .prev").addClass("diabled");
          $(".views .tpage .next").addClass("diabled");

          $(".failed").show().find("span").html(data.info);
        }

      },
      error: function(){
        $(".theme").html("");
        $(".pagination, .loading").hide();

        $("#totalCount").html(0);

        $(".views .tpage .atpage").html("<strong>0</strong>/0");
        $(".views .tpage .prev").addClass("diabled");
        $(".views .tpage .next").addClass("diabled");

        $(".failed").show().find("span").html("网络错误，请重试！");
      }
    });

  }



})


function AddFavorite(sURL, sTitle) {
      sURL = encodeURI(sURL);
  try{
      window.external.addFavorite(sURL, sTitle);
  }catch(e) {
      try{
          window.sidebar.addPanel(sTitle, sURL, "");
      }catch (e) {
          alert("加入收藏失败，请使用Ctrl+D进行添加,或手动在浏览器里进行设置.");
      }
  }
}


//单点登录执行脚本
function ssoLogin(info){

	$(".navLogin").remove();

	//已登录
	if(info){
		$(".header-r .navul").prepend('<li>你好，<a href="javascirpt:;" class="login">'+info['nickname']+'</a></li><li><a href="'+masterDomain+'/logout.html" class="loginout">安全退出</a></li>');
		$.cookie(cookiePre+'login_user', info['uid'], {expires: 365, domain: channelDomain.replace("http://", ""), path: '/'});

	//未登录
	}else{
		$(".header-r .navul").prepend('<li>你好，<a href="'+masterDomain+'/login.html" class="login" id="login">请登录</a></li><li><a href="'+masterDomain+'/register.html">免费注册</a><em>|</em></li><li><a class="loginconnect" href="'+masterDomain+'/api/login.php?type=qq" target="_blank">QQ登录</a><em>|</em></li><li><a class="loginconnect" href="'+masterDomain+'/api/login.php?type=wechat" target="_blank">微信登录</a><em>|</em></li>');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain.replace("http://", ""), path: '/'});

	}

}
