var huoniao_ = {
    //转换PHP时间戳
    transTimes: function(timestamp, n){
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
    //获取附件不同尺寸
    ,changeFileSize: function(url, to, from){
      if(url == "" || url == undefined) return "";
      if(to == "") return url;
      var from = (from == "" || from == undefined) ? "large" : from;
      var newUrl = "";
      if(hideFileUrl == 1){
        newUrl =  url + "&type=" + to;
      }else{
        newUrl = url.replace(from, to);
      }
  
      return newUrl;
    }
}

$(function(){
    //APP端取消下拉刷新
    toggleDragRefresh('off');

     //排序
     $('.choose_li li').click(function () {
        if($('.choose_order').hasClass('active')){
              $('.choose_order').removeClass('active')
              $('.mask').hide();
              $(this).removeClass('active');
        }else{
            $('.choose_order').addClass('active')
            $('.mask').show();
            $(this).addClass('active');
        }
    });

    var mask=$('.mask')
  
    $('#choose-info').delegate("li", "click", function(){
        var $t = $(this), id = $t.attr("data-id"), val = $t.html();
        $t.addClass('active').siblings().removeClass('active');
        $('.choose_li li').find('span').text(val);
        $('.choose_li li').removeClass('active')
        $('.choose_order').removeClass('active')
        $('.orderby').attr("data-id", id);
        mask.hide();
        page = 1;
        getList();
    });
  
    //点击小箭头 收起
    $('.sort').click(function () {
        $('#choose-info').removeClass('active')
        $('.mask').hide();
        $('.choose_li li').removeClass('active');
    });

    var	isload = false;

    var detailList;
	detailList = new h5DetailList();
	setTimeout(function(){detailList.removeLocalStorage();}, 500);

	var dataInfo = {
        id: '',
        url: '',
        orderby: '',
        orderbyname: '',
        class_num:'',
        isBack: true
    };

    $('.word-list').delegate('li', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url'), typeid = $('.choose-tab .food').attr('data-id'),
				typename = $('.choose-tab .food span').text(), id = t.attr('data-id');

		var orderby     = $('.choose_order li.active').attr('data-id');
    var orderbyname = $('.choose_order li.active').text();
    var class_num = $(".class_num span").text();
		
		dataInfo.url = url;
    dataInfo.orderby = orderby;
    dataInfo.class_num = class_num;
		dataInfo.orderbyname = orderbyname;

		detailList.insertHtmlStr(dataInfo, $("#word").html(), {lastIndex: page});

		location.href = url;

    });

    //初始加载
	if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
		getList();
		window.addEventListener("mousewheel", (e) => {
			if (e.deltaY === 1) {
				e.preventDefault();
			}
		});
	}else {
		getData();
		setTimeout(function(){
			detailList.removeLocalStorage();
		}, 500)
	}
    
    function getList(){
		var data = [];
        data.push("page="+page);
        data.push("pageSize="+pageSize);
        
        $(".content_tab li").each(function(){
			if($(this).attr("data-type") != '' && $(this).attr("data-type") != null  && $(this).attr("data-id") != null){
				data.push($(this).attr("data-type") + "=" + $(this).attr("data-id"));
			}
		});

		isload = true;
        if(page == 1){
			$(".class_plan ul").html();
            $(".tip").html(langData['travel'][12][57]).show();
        }else{
            $(".tip").html(langData['travel'][12][57]).show();
		}

		$.ajax({
            url: masterDomain + "/include/ajax.php?service=education&action=wordList&"+data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                isload = false;
                if(data && data.state == 100){
					var html = [], list = data.info.list, pageinfo = data.info.pageInfo;
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li>');
                        html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
                        html.push('<div class="comp_content">');
                        html.push('<p class="com_name">'+list[i].title+'</p><p class="p2"><span class="month">'+huoniao_.transTimes(list[i].pubdate, 3)+'</span><span class="time_clock">'+huoniao_.transTimes(list[i].pubdate, 4)+'</span></p>');
                        html.push('</div>');
                        html.push('<div class="plan_time">');

                        html.push('<p><span>'+langData['education'][1][34]+'</span><span>'+list[i].subjects+'</span></p>');
                        html.push('<p><span>'+langData['education'][1][35]+'</span><span>'+list[i].price+echoCurrency('short')+langData['education'][7][20]+'</span></p>');
                        html.push('<p><span>'+langData['education'][1][36]+'</span><span>'+list[i].educationname+'</span></p>');
                        html.push('<p><span>'+langData['education'][1][37]+'</span><span>'+list[i].addrname[0]+list[i].addrname[1]+'</span></p>');
                        html.push('<p><span>'+langData['education'][1][38]+'</span><span>'+list[i].subjectstime+'</span></p>');
                        html.push('</div>');
                        html.push('</a>');
                        html.push('</li>');
					}
					if(page == 1){
                        $(".class_plan ul").html(html.join(""));
                    }else{
                        $(".class_plan ul").append(html.join(""));
                    }
                    isload = false;

                    if(page >= pageinfo.totalPage){
                        isload = true;
                        $(".tip").html(langData['travel'][0][9]).show();
                    }
				}else{
					if(page == 1){
                        $(".class_plan ul").html("");
                    }
					$(".tip").html(data.info).show();
				}
			},
            error: function(){
				isload = false;
				$(".class_plan ul").html("");
				$('.tip').text(langData['travel'][0][10]).show();//请求出错请刷新重试
            }
		});

	}

	//滚动底部加载
	$(window).scroll(function() {
        var allh = $('body').height();
        var w = $(window).height();
        var s_scroll = allh - 30 - w;
        if ($(window).scrollTop() > s_scroll && !isload) {
            page++;
            getList();
        };
	});
	
	// 本地存储的筛选条件
    function getData() {
        var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
		page = detailList.getLocalStorage()['extraData'].lastIndex;
		
        if (filter.orderbyname != '' && filter.orderbyname != null) {$('.orderby span').text(filter.orderbyname);}
        if (filter.class_num != '' && filter.class_num != null) {$('.class_num span').text(filter.class_num);}

        if (filter.orderby != '') {
            $('.orderby').attr('data-id', filter.orderby);
            $('.choose_order li[data-id="'+filter.orderby+'"]').addClass('active').siblings('li').removeClass('active');
		}
    }
    
});
