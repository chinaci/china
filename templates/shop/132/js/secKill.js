$(function () {
    //导航全部分类
    // $(".lnav").find('.category-popup').hide();
    //
    // $(".lnav").hover(function(){
    //     $(this).find(".category-popup").show();
    // }, function(){
    //     $(this).find(".category-popup").hide();
    // });

    //鼠标经过
    $('.miaoshabox').on('mouseover','.contbox',function () {
        $(this).find('.mstart').hide();
        $(this).find('.daojishi').show();
    });
    $('.miaoshabox').on('mouseleave','.contbox',function () {
        $(this).find('.mstart').show();
        $(this).find('.daojishi').hide();
    });

	var clearTime=0;
	// 倒计时
	function countDown(id){
		timer = setInterval(function(){
	        var end = $('.mnostart').find(id).attr("data-time")*1000;  //点击的结束抢购时间的毫秒数
	        var newTime = Date.parse(new Date());  //当前时间的毫秒数
	        var youtime = end - newTime; //还有多久时间结束的毫秒数
	        var seconds = youtime/1000;//秒
	        var minutes = Math.floor(seconds/60);//分
	        var hours = Math.floor(minutes/60);//小时
	        var days = Math.floor(hours/24);//天
	        var CDay= days ;
	        var CHour= hours % 24 ;
	        var CMinute= minutes % 60;
	        var CSecond= Math.floor(seconds%60);//"%"是取余运算，可以理解为60进一后取余数
	        var c=new Date();
	        var millseconds=c.getMilliseconds();
	        var Cmillseconds=Math.floor(millseconds %100);
	        if(CSecond<10){//如果秒数为单数，则前面补零
	          CSecond="0"+CSecond;
	        }
	        if(CMinute<10){ //如果分钟数为单数，则前面补零
	          CMinute="0"+CMinute;
	        }
	        if(CHour<10){//如果小时数为单数，则前面补零
	          CHour="0"+CHour;
	        }
	        if(CDay<10){//如果天数为单数，则前面补零
	          CDay="0"+CDay;
	        }
	        if(Cmillseconds<10) {//如果毫秒数为单数，则前面补零
	          Cmillseconds="0"+Cmillseconds;
	        }

	       	$(id).find("span.day").html(CDay);
	        $(id).find("span.hour").html(CHour);
	        $(id).find("span.minute").html(CMinute);
            $(id).find("span.second").html(CSecond);

            $(id).find("span.d").html(CDay);
	        $(id).find("span.h").html(CHour);
	        $(id).find("span.m").html(CMinute);
	        $(id).find("span.s").html(CSecond);

		}, 1000);
	}

	$('.miaoshabox').delegate('.contbox', 'click', function(){
		var t = $(this), url = t.attr('data-url');
		setTimeout(function(){window.open(url);}, 200);
	});

	getList();
	function getList(tr){
		if(tr){
   			$(".miaoshabox").html("");
   		}
   		$(".miaoshabox .loading").remove();
   		//请求数据
		var data = [];
		var now = Date.parse(new Date())/1000;  //当前时间的毫秒数
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);
        $(".miaoshabox").append('<div class="loading">加载中，请稍后...</div>');
   		$.ajax({
	      url: masterDomain+"/include/ajax.php?service=shop&action=slist&limited=5",
	      data: data.join("&"),
	      type: "GET",
	      dataType: "jsonp",
	      success: function (data) {
	        if(data.state == 100){
	        	$(".miaoshabox .loading").remove();
				var list = data.info.list, html = [],className='';
				for(var i = 0; i < list.length; i++){

				    if(list[i].ketime == '0' || list[i].kstime == '0'){
                        continue;
                    }
					if(list[i].ketime < now){
						className = 'disabled';
					}else if(list[i].kstime > now){
						className = 'mnostart';
					}else if(list[i].kstime < now && list[i].ketime > now){
                        className = 'mnostart';
                    }else{
						className = '';
					}
					html.push('<div data-url="'+list[i].url+'" class="contbox '+className+'">');
                    html.push('<div class="mend"></div>');
					html.push('<div class="bocover"></div>');
					html.push('<div class="mainbox fn-clear">');
					html.push('<div class="imgbox"><img src="'+staticPath+'images/blank.gif" data-url="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" alt=""></div>');
					html.push('<div class="txtbox">');
					html.push('<h3>'+list[i].title+'</h3>');
                    html.push('<p class="pprice"><span class="nprice"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</span> <span class="yprice"><em>'+echoCurrency('symbol')+'</em> '+list[i].mprice+'</span></p>');

                    html.push('<span class="xianl">限量 <em>'+list[i].inventory+'</em>件</span>');
                    if(list[i].ketime < now){
                        html.push('<span class="state">秒杀已结束~</span>');
                    }else if(list[i].kstime < now){
                        html.push('<span class="state mstart">秒杀已开始!</span>');
                        html.push('<div id="jsTime'+list[i].id+'" data-time="'+list[i].ketime+'" class="daojishi jsTime">距结束 <span class="d">00</span>:<span class="h">00</span>:<span class="m">00</span>:<span class="s">00</span></div>');
                    }else if(list[i].kstime > now) {
                    	html.push('<div id="jsTime'+list[i].id+'" class="jsTime fn-clear" data-time="'+list[i].kstime+'">距开始 <span class="day">00</span><em>:</em><span class="hour">00</span><em>:</em><span class="minute">00</span><em>:</em><span class="second">00</span></div>');
                    }
					html.push('</div>');
					html.push('</div>');
					html.push('</div>');
				}
                $(".miaoshabox").append(html.join(""));
                $("img").scrollLoading();

                totalCount = data.info.pageInfo.totalCount;
                showPageInfo();

				//引入倒计时效果
				$('.jsTime').each(function() {
					var id = $(this).attr('id');
					countDown('#'+id);
				});

	        }else{
                $(".miaoshabox").append('<div class="loading">暂无相关信息</div>');
                $("#mod-item .pagination").html("").hide();
	        }
	      },
		  error: function(){
			$('.miaoshabox').html('<div class="loading">'+langData['siteConfig'][20][227]+'</div>');
		  }
	    });
	}



    //打印分页
    function showPageInfo() {
        var info = $("#mod-item .pagination");
        var nowPageNum = atpage;
        var allPageNum = Math.ceil(totalCount/pageSize);

        var pageArr = [];

        info.html("").hide();

        var pageList = [];
        //上一页
        if(atpage > 1){
            pageList.push('<a href="javascript:;" class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></a>');
        }else{
            pageList.push('<span class="pg-prev"><i class="trigger"></i><span class="text">上一页</span></span>');
        }

        //下一页
        if(atpage >= allPageNum){
            pageList.push('<span class="pg-next"><span class="text">下一页</span><i class="trigger"></i></span>');
        }else{
            pageList.push('<a href="javascript:;" class="pg-next"><span class="text">下一页</span><i class="trigger"></i></a>');
        }

        //页码统计
        pageList.push('<span class="sum"><em>'+atpage+'</em>/'+allPageNum+'</span>');

        $("#bar-area .pagination").html(pageList.join(""));

        var pages = document.createElement("div");
        pages.className = "pagination-pages fn-clear";
        info.append(pages);

        //拼接所有分页
        if (allPageNum > 1) {

            //上一页
            if (nowPageNum > 1) {
                var prev = document.createElement("a");
                prev.className = "prev";
                prev.innerHTML = '上一页';
                prev.setAttribute('href','#');
                prev.onclick = function () {
                    atpage = nowPageNum - 1;
                    $("#mod-item .miaoshabox").empty();
                    getList();
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
                        page.setAttribute('href','#');
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            $("#mod-item .miaoshabox").empty();
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
                        page.setAttribute('href','#');
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            $("#mod-item .miaoshabox").empty();
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
                                page.setAttribute('href','#');
                                page.onclick = function () {
                                    atpage = Number($(this).text());
                                    $("#mod-item .miaoshabox").empty();
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
                        page.setAttribute('href','#');
                        page.onclick = function () {
                            atpage = Number($(this).text());
                            $("#mod-item .miaoshabox").empty();
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
                next.innerHTML = '下一页';
                next.setAttribute('href','#');
                next.onclick = function () {
                    atpage = nowPageNum + 1;
                    $("#mod-item .miaoshabox").empty();
                    getList();
                }
                info.find(".pagination-pages").append(next);
            }

            //输入跳转
            var insertNum = Number(nowPageNum + 1);
            if (insertNum >= Number(allPageNum)) {
                insertNum = Number(allPageNum);
            }

            var redirect = document.createElement("div");
            redirect.className = "redirect";
            redirect.innerHTML = '<i>到</i><input id="prependedInput" type="number" placeholder="页码" min="1" max="'+allPageNum+'" maxlength="4"><i>页</i><button type="button" id="pageSubmit">确定</button>';
            info.find(".pagination-pages").append(redirect);

            //分页跳转
            info.find("#pageSubmit").bind("click", function(){
                var pageNum = $("#prependedInput").val();
                if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
                    atpage = Number(pageNum);
                    $("#mod-item .miaoshabox").empty();
                    getList();
                } else {
                    $("#prependedInput").focus();
                }
            });

            info.show();

        }else{
            info.hide();
        }
    }

});