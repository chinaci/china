$(function(){

	var atpage = 1, isload = false, pageSize = 10;

	var detailList;
    detailList = new h5DetailList();
	setTimeout(function(){detailList.removeLocalStorage();}, 500);
	
	var dataInfo = {
        id: '',
        url: '',
        typeid: '',
        isBack: true
    };

	$('.mediaBox').delegate('li', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url'), mainHtml = $("#mediaBox").html();

		var typeid = $('.medianav .active a').attr('data-id');
        
        dataInfo.url = url;
        dataInfo.typeid = typeid;
		detailList.insertHtmlStr(dataInfo, mainHtml, {lastIndex: atpage});

		setTimeout(function(){location.href = url;}, 500);
	})

	

	//导航栏切换
	$('body').on('click', 'nav.nav li',function(){
		$(this).addClass('active').siblings('li').removeClass('active');
		//数据筛选 或者切换
		getList(1);
	})

	$(window).scroll(function() {
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w;
		if ($(window).scrollTop() + 50 > scroll && !isload) {console.log(11);
			atpage++;
			getList();
		};
	});

	$('#myform').submit(function(e) {
        e.preventDefault();
        getList(1);
	})
	
	//初始加载
	if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
        getList(1);
    }else {
        getData();
        setTimeout(function(){
            detailList.removeLocalStorage();
        }, 500)
    }


	function getList(tr){
		isload = true;

        if(tr){
            atpage = 1;
            $(".mediaBox ul").html("");
        }

        $(".mediaBox ul").append('<div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>'+langData['siteConfig'][20][184]+'</span></div>');
		$(".mediaBox ul .loading").remove();
		
		//请求数据
        var data = [];
        data.push("pageSize="+pageSize);
		data.push("page="+atpage);

		var type = $('.nav ul .active a').attr('data-id');
		if(type != undefined && type != '' && type != null){
			data.push("type="+type);
		}

		if($('#keywords').val()!=''){
			data.push("title="+$('#keywords').val());
		}

		$.ajax({
            url: "/include/ajax.php?service=article&action=selfmedia",
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
				if (data && data.state == 100) {
					$(".loading").remove();
                    var list = data.info.list, pageInfo = data.info.pageInfo, page = pageInfo.page, html = [];
                    for (var i = 0, lr; i < list.length; i++) {
						lr = list[i];
						var click = lr.click > 10000 ? parseInt(lr.click/10000) + '万' : lr.click;
						html.push('<li class="liBox">');
						html.push('<a href="javascript:;" data-url="' + lr.url + '">');
						html.push('<div class="liMedia">');
						html.push('<div class="_left"><img src="'+(lr.photo ? lr.photo : (staticPath + 'images/noPhoto_60.jpg') )+'" /></div>');
						html.push('<div class="_right"><h2>'+ lr.name +'</h2><p><span>文章数 <em class="total">'+ lr.total_article +'</em></span><span>阅读量 <em class="total">'+ click +'</em></span><span> 粉丝  <em class="total">'+ lr.total_fans +'</em></span></p></div>');
						html.push('</div>');
						html.push('</a>');
						html.push('</li>');
					}
					$(".mediaBox ul").append(html.join(""));
                    isload = false;
                    //最后一页
                    if(atpage >= data.info.pageInfo.totalPage){
                        isload = true;
                        $(".mediaBox ul .loading").remove();
                        $(".mediaBox ul").append('<div class="loading"><span>'+langData['siteConfig'][18][7]+'</span></div>');
                    }
				}else{
					isload = true;
                    $(".loading").remove();
                    $(".mediaBox ul").append('<div class="loading"><span>'+data.info+'</span></div>');
				}
			},
            error: function(XMLHttpRequest, textStatus, errorThrown){
               isload = false;
               $(".mediaBox ul").html('<div class="loading"><span>'+langData['siteConfig'][20][184]+'</span></div>');
            }
		});

	}

	// 本地存储的筛选条件
	function getData() {

		var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
		atpage = detailList.getLocalStorage()['extraData']['lastIndex'];

		if (filter.typeid != '') {
            $('.medianav li[data-id="'+filter.typeid+'"]').addClass('active').siblings('li').removeClass('active');
        }
	}

});