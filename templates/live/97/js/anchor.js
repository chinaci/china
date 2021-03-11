/**
 * Created by Administrator on 2018/5/8.
 */
$(function(){
	function follow(id){
		$.post("/include/ajax.php?service=live&action=followMember&id="+id, function(){
		});
	}
	//关注切换
	$(".anchorfollow").click(function () {
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
		}

		var t = $(this),id=t.attr('data-id');
		if (t.hasClass('btnCare1')) {
			t.removeClass('btnCare1').addClass('btnCare').text('关注');
			follow(id);
		}else{
			t.removeClass('btnCare').addClass('btnCare1').text('已关注');
			follow(id);
		}
	});
	// 关注/取消关注 主播的粉丝/主播关注的人
	$('.fans_box').delegate('.isfollow', 'click', function(){
		console.log('click')
		var t = $(this), id = t.attr('data-id');
		follow(id);
		if(t.hasClass('fans_care1')){
			t.text('关注').removeClass('fans_care1').addClass('fans_care');
		}else{
			t.text('已关注').removeClass('fans_care').addClass('fans_care1');
		}
		t.toggleClass('isfollow');
	})
	var atpage = 1, totalCount = 0, pageSize = 20;
    getList('live');
    //主播列表切换
	$(".con_tab ul li").click(function(){
		var index=$(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$(".conList").eq(index).addClass("show_list").siblings().removeClass("show_list");
		atpage=1;
		totalCount=0;
		var type = $(this).attr('data-action');
		getList(type);
	});
    function getList(type){
	    var active = $('.con_tab ul li.active'), action = active.attr('data-action'), url,id=$('#hiddenid').val();
	    if (action == "live") {
	    	pageSize=20;
	        url = masterDomain + "/include/ajax.php?service=live&action=alive&type=3&page=" + atpage +"&uid="+id+ "&pageSize="+pageSize;
	    }else if (action == "fans") {
	    	pageSize=64;
	        url = masterDomain + "/include/ajax.php?service=live&action=follow&page=" + atpage +"&uid="+id+ "&pageSize="+pageSize;
	    }else if (action == "care") {
	    	pageSize=64;
	        url = masterDomain + "/include/ajax.php?service=live&action=follow&type=follow&page=" + atpage +"&uid="+id+ "&pageSize="+pageSize;
	    }

	    $.ajax({
	        url: url,
	        type: "GET",
	        dataType: "jsonp",
	        success: function(data){
	            if (data && data.state != 200) {
	                if (data.state == 101) {
	                    $('.con_list.show_list ul').append('<div class="loadmore">已加载全部数据</div>');
	                }else {
	                    var list = data.info.list, pageInfo = data.info.pageInfo,liveHtml = [],careHtml = [], fansHtml = [] ;
	                    var totalPage = data.info.pageInfo.totalPage;active.attr('data-totalPage', totalPage);
	                    for (var i = 0; i < list.length; i++) {
	                        var lr = list[i];
	                        // 直播模块
	                        if (action == "live") {
	                            liveHtml.push('<li>');
	                            liveHtml.push('<a href="'+lr.url+'">');
															state_ = '<div class="playback state'+lr.state+'">'+(lr.state == 1 ? '直播中' : '精彩回放')+'</div>';
	                            liveHtml.push('<div class="box_img">'+state_+'<img src="' + lr.litpic + '" alt=""></div>');
	                            liveHtml.push('<div class="live_intro">');
	                            liveHtml.push('<div class="intro-left"><img src="' + lr.photo + '" alt=""></div>');
	                            liveHtml.push('<div class="intro_right"><p class="p_font1">' + lr.title + '</p><p class="p_font2"><span class="sp_name">'+lr.nickname+'</span><span class="img_icon"><img src="'+templatePath+'images/live_people.png"><span>' + lr.click + '</span></span></p></div>');
	                            liveHtml.push('</div></a></li>');
	                            // 粉丝模块
	                        }else if (action == "fans") {
	                            fansHtml.push('<li class="box_info">');
	                            fansHtml.push('<a href="'+lr.userurl+'">');
	                            fansHtml.push('<div class="fans_img"><img src="'+lr.photo+'"></div>');
	                            fansHtml.push('<p>'+lr.nickname+'</p>');
	                            fansHtml.push('</a>');
	                            //var isstate = lr.isfollow==1 ? '已关注' : '关注' ;
	                            //fansHtml.push('<button class="fans_care">'+isstate+'</button>');
	                            if(lr.isfollow==1){
									fansHtml.push('<button data-id="'+lr.uid+'" class="isfollow fans_care1">已关注</button>');
	                            }else{
									fansHtml.push('<button data-id="'+lr.uid+'" class="isfollow fans_care">关注</button>');
	                            }
	                            fansHtml.push('</li>');
	                            // 关注模块
	                        }else if (action == "care") {
	                            careHtml.push('<li class="box_info">');
	                            careHtml.push('<a href="'+lr.userurl+'">');
	                            careHtml.push('<div class="fans_img"><img src="'+lr.photo+'"></div>');
	                            careHtml.push('<p>'+lr.nickname+'</p>');
	                            careHtml.push('</a>');
	                            //var isstate = lr.isfollow==1 ? '已关注' : '关注' ;
	                            //careHtml.push('<button class="fans_care1">'+isstate+'</button>');
	                            if(lr.isfollow==1){
									careHtml.push('<button data-id="'+lr.uid+'" class="isfollow fans_care1">已关注</button>');
	                            }else{
									careHtml.push('<button data-id="'+lr.uid+'" class="isfollow fans_care">关注</button>');
	                            }
	                            careHtml.push('</li>');

	                        }
	                    }

	                    $('.live').html(liveHtml.join(""));
	                    $('.fans').html(fansHtml.join(""));
	                    $('.care').html(careHtml.join(""));


	                    totalCount = pageInfo.totalCount;
	                    showPageInfo(type);
	                    if(data.info.pageInfo.totalPage == atpage && atpage == 1){
	                        $('.show_list ul').append('<div class="loadend">已加载全部数据</div>');
	                    }

	                }
	            }
	        }
	    })
	}
	//打印分页
	function showPageInfo(type) {
	    var info = $(".pagination"+type);
	    var nowPageNum = atpage;
	    var allPageNum = Math.ceil(totalCount/pageSize);
	    var pageArr = [];
	    info.html("").hide();
	    var pages = document.createElement("div");
	    pages.className = "pagination-pages";
	    info.append(pages);
	    //拼接所有分页
	    if (allPageNum > 1) {
	        //上一页
	        if (nowPageNum > 1) {
	            var prev = document.createElement("a");
	            prev.className = "prev";
	            prev.innerHTML = "上一页";
	            prev.onclick = function () {
	                atpage = nowPageNum - 1;
	                getList(type);
	            }
	            info.find(".pagination-pages").append(prev);
	        }
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
	                        getList(type);
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
	                        getList(type);
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
	                                getList(type);
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
	                        getList(type);
	                    }
	                    info.find(".pagination-pages").append(page);
	                }
	            }
	        }
	        //下一页
	        if (nowPageNum < allPageNum) {
	            var next = document.createElement("a");
	            next.className = "next";
	            next.innerHTML = "下一页";
	            next.onclick = function () {
	                atpage = nowPageNum + 1;
	                getList(type);
	            }
	            info.find(".pagination-pages").append(next);
	        }
	        info.show();
	    }else{
	        info.hide();
	    }
	}
});
