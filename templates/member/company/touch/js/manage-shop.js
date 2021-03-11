var huoniao = {
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
  var objId = $('.list'), isload = false;;

  state = state == '' ? 1 : state;

  var activeState = $(".tab li[data-id='"+state+"']");
  activeState.addClass("curr").siblings().removeClass('curr');
  $('.count li').eq(activeState.index()).show().siblings().hide();

	$(".tab li").bind("click", function(){
		var t = $(this), id = t.attr("data-id"), index = t.index();
		if(!t.hasClass("curr")){
			state = id;
			atpage = 1;
            t.addClass("curr").siblings("li").removeClass("curr");
            $('.count li').hide().eq(index).show();
            $('.list').html('');
			getList(1);
		}
	});


  //下架
	objId.delegate(".offShelf", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(confirm(langData['siteConfig'][27][116])){//确定要下架这个商品吗？
			t.siblings("a").hide();
			t.addClass("load");

			$.ajax({
				url: masterDomain+"/include/ajax.php?service=shop&action=offShelf&id="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						t.siblings("a").show();
						t.removeClass("load").html(langData['siteConfig'][27][117]);//下架成功
						setTimeout(function(){getList(1);}, 1000);
					}else{
						$.dialog.alert(data.info);
						t.siblings("a").show();
						t.removeClass("load");
					}
				},
				error: function(){
					$.dialog.alert(langData['siteConfig'][6][203]);//网络错误，请稍候重试！
					t.siblings("a").show();
					t.removeClass("load");
				}
			});
    }
  })
	//上架
	objId.delegate(".upShelf", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			t.siblings("a").hide();
			t.addClass("load");

			$.ajax({
				url: masterDomain+"/include/ajax.php?service=shop&action=upShelf&id="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						t.siblings("a").show();
						t.removeClass("load").html(langData['siteConfig'][27][118]);//上架成功
						setTimeout(function(){getList(1);}, 1000);
					}else{
						$.dialog.alert(data.info);
						t.siblings("a").show();
						t.removeClass("load");
					}
				},
				error: function(){
					$.dialog.alert(langData['siteConfig'][6][203]);//网络错误，请稍候重试！
					t.siblings("a").show();
					t.removeClass("load");
				}
			});
		}
	});


  // 下拉加载
  $(window).scroll(function() {
    var h = $('.item').height();
    var allh = $('body').height();
    var w = $(window).height();
    var scroll = allh - w - h;
    if ($(window).scrollTop() > scroll && !isload) {
      atpage++;
      getList();
    };
  });


  // 初始加载
  getList(1);
  function getList(is){

    isload = true;
  	objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');//加载中，请稍候

  	$.ajax({
  		url: masterDomain+"/include/ajax.php?service=shop&action=slist&u=1&orderby=5&state="+state+"&page="+atpage+"&pageSize="+pageSize,
  		type: "GET",
  		dataType: "jsonp",
  		success: function (data) {
  			if(data && data.state != 200){
  				if(data.state == 101){
  					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");//暂无相关信息！
  				}else{
            $('.loading').remove();
  					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

  					//拼接列表
  					if(list.length > 0){

  						var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";
  						var param = t + "do=edit&id=";
  						var urlString = editUrl + param;

  						for(var i = 0; i < list.length; i++){
  							var item      = [],
  									id        = list[i].id,
  									title     = list[i].title,
  									sta       = list[i].state,
  									url       = state == 1 ? list[i].url : "javascript:;",
  									sales     = list[i].sales,
  									comment   = list[i].comment,
  									inventory = list[i].inventory,
  									litpic    = list[i].litpic,
  									price    = list[i].price,
  									date      = huoniao.transTimes(list[i].pubdate, 1);

  							html.push('<div class="item fn-clear" data-id="'+id+'">');
  							if(litpic != ""){
  								html.push('<div class="item-img"><a href="'+url+'"><img src="'+huoniao.changeFileSize(litpic, "small")+'" /></a></div>');
  							}
  							html.push('<div class="item-txt">');
  							html.push('<a href="'+url+'" class="item-tit">'+title+'</a>');
  							html.push('<p class="price">'+echoCurrency('symbol')+'<em>'+price+'</em></p>');
  							html.push('<p class="operate"><span>'+langData['siteConfig'][19][518]+sales+'</span><span>'+langData['siteConfig'][19][525]+inventory+'</span>');//已售--库存
                if(sta == "1"){
                  html.push('<a href="javascript:;" class="offShelf">'+langData['siteConfig'][19][558]+'</a>');//下架
                }else if (sta == "2") {
                  html.push('<a href="javascript:;" class="upShelf">'+langData['siteConfig'][26][166]+'</a>');//上架
                }
  							html.push('<a href="'+urlString+id+'" class="edit">'+langData['siteConfig'][6][6]+'</a>');//编辑
  							html.push('</p>');
  							html.push('</div>');
  							html.push('</div>');

  						}

              $('.loading').remove();
  						objId.append(html.join(""));
              isload = false;

  					}else{
              if(atpage == 1){
  						  objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");//暂无相关信息！
              }else{
                objId.append("<p class='loading'>"+langData['siteConfig'][45][87]+"</p>");//已加载全部信息！               
              }
  					}

  					totalCount = pageInfo.totalCount;

  					switch(state){
  						case "0":
  							totalCount = pageInfo.gray;
  							break;
  						case "1":
  							totalCount = pageInfo.audit;
  							break;
  						case "2":
  							totalCount = pageInfo.refuse;
  							break;
  					}


  					$("#audit").html(pageInfo.audit);
  					$("#gray").html(pageInfo.gray);
  					$("#refuse").html(pageInfo.refuse);
  				}
  			}else{
  				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");//暂无相关信息！
  			}
  		}
  	});
  }


})
