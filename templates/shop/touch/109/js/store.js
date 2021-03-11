$(function(){
	getList();
	var isload =  false;

	$(document).ready(function() {
		$(window).scroll(function() {
			var allh = $('body').height();
			var w = $(window).height();
			var scroll = allh - w;
			if ($(window).scrollTop() + 50 > scroll && !isload) {
				atpage++;
				getList();
			};
		});
	});

	$("#search").click(function(){
		getList(1);
	});

	function getList(tr){
        isload = true;
        if(tr){
            $(".list-box ul").html("");
        }
        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
        data.push("page="+atpage);
        var keywords = $('#keywords').val();
		if(keywords != null && keywords != ''){
			data.push("title="+keywords);
		}
        $.ajax({
          url: "/include/ajax.php?service=shop&action=store",
          data: data.join("&"),
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            if(data.state == 100){
                $(".list-box ul .loading").remove();
                var list = data.info.list, html = [],className='';
                for(var i = 0; i < list.length; i++){
					var logo = list[i]['logo'] == '' ? staticPath+'images/blank.gif' : huoniao.changeFileSize(list[i]['logo'], "large");
                	var className = '';
                	if(list[i]['rec']==1){
						className = 'toptag';
                	}
                	html.push('<li class="shopBox '+className+'">');
						html.push('<div class="sbotop fn-clear">');
						html.push('<div class="sbleft">');
						html.push('<a href="'+list[i]['url']+'"><img src="'+logo+'" alt=""></a>');
						html.push('</div>');
						html.push('<div class="sbright">');
						html.push('<h3><a href="'+list[i]['url']+'">'+list[i]['title']+'</a></h3>');
						html.push('<p class="fn-clear"><span class="rzcon"><i></i>实名认证</span><span class="bzjcon"><i></i>保证金</span><span class="wepay"><i></i>微信支付</span></p>');
						html.push('</div>');
						html.push('</div>');
							html.push('<div class="sbomain children-'+list[i].id+'">');
							html.push('</div>');
							getPro(list[i].id);
						html.push('<div class="sbofoot">');
						html.push('<div class="sbf"><a href="tel:'+list[i]['tel']+'"><i class="contact"></i>联系商家</a></div>');
						html.push('<div class="sbf"><a href="'+list[i]['url']+'">进店逛逛 <i class="go"></i></a></div>');
						html.push('</div>');
					html.push('</li>');
                }
                $(".list-box ul").append(html.join(""));
                isload = false;

                //最后一页
                if(atpage >= data.info.pageInfo.totalPage){
                    isload = true;
                    $(".list-box ul").append('<div class="loading">'+langData['siteConfig'][18][7]+'</div>');
                }
            }else{
                isload = true;
                $(".list-box ul").append('<div class="loading">暂无相关信息</div>');
            }
          },
          error: function(){
            isload = false;
            $('.list-box ul').html('<div class="loading">'+langData['siteConfig'][20][227]+'</div>');
          }
        });
    }

    //获取商家3个商品
    function getPro(storeid){
		$.ajax({
			url: "/include/ajax.php?service=shop&action=slist&store="+storeid+"&page=1&pageSize=3",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					for(var i = 0; i < list.length; i++){
						var photo = (list[i].litpic == "" || list[i].litpic == undefined) ? staticPath+'images/blank.gif' : huoniao.changeFileSize(list[i].litpic, "o_large");
						html.push('<div class="goBox">');
						html.push('<a href="'+list[i]['url']+'">');
						html.push('<div class="good_box">');
						html.push('<img src="'+photo+'" alt="">');
						html.push('<div class="fcover"><p>'+list[i].title+'</p></div>');
						html.push('</div>');
						html.push('<div class="good_txt">'+echoCurrency('symbol')+''+list[i].price+'</div>');
						html.push('</a>');
						html.push('</div>');
					}
					$('.children-'+storeid).html(html.join(""));
				}
			}
		});
    }
})