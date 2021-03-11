$(function(){
    /*调起大图 S*/
    $.fn.bigImage({
        artMainCon:".uknow-con",  //图片所在的列表标签
    });

	//收藏
	$(".collect").bind("click", function(){
		var t = $(this), type = "add", html = t.html();

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain+'/login.html';
			return false;
		}

		if(!t.hasClass("has")){
			t.addClass("has");
			html = html.replace('_no', '_has').replace('收藏', '已收藏');
		}else{
			type = "del";
			t.removeClass("has");
			html = html.replace('_has', '_no').replace('已收藏', '收藏');
		}
		t.html(html);

		$.post("/include/ajax.php?service=member&action=collect&module=tuan&temp=detail&type="+type+"&id="+detailID);

	});


	$('.h-menu').click(function(){
		if ($('.menu-box').css("display") == "none") {
			$('.menu-box').show();
		}
		else{
			$('.menu-box').hide();
		}
	})

	$(window).on('touchmove',function(){
		$('.menu-box').hide();
	})

	var now = date[0], stime = date[1], etime = date[2];
	//还未开始
	if(now < stime){
		$(".shop-buy").html("还未开始").addClass("disabled");

	//已结束
	}else if(now > etime){
		$(".shop-buy").html("已结束").addClass("disabled");

	//正常
	}else {
		$(".shop-buy").attr("href", $(".shop-buy").data("href")).removeAttr("data-href");
	}


	//查看图文详细
	$("#showDetail").bind("click", function(){
		$(this).hide();
		$("#bodyDetail .uknow-con").html($("#tuanDetail").val());
		$("#bodyDetail").show();
	});


	var isLoad = 0;

	//页面打开时默认不加载，当滚动条到达评论区域的时候再加载
	$(window).scroll(function(){
		var commentStop = $(".judge").offset().top;
		var windowStop = $(window).scrollTop();
		var windowHeight = $(window).height();
		if(windowStop + windowHeight >= commentStop && !isLoad){
			isLoad = 1;
			getComments();
		}
	});


	var imgLoad = function (url, obj) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
			$("#"+obj).attr("data-size", img.width+"x"+img.height);
    } else {
      img.onload = function () {
				$("#"+obj).attr("data-size", img.width+"x"+img.height);
        img.onload = null;
      };
    };
	};


	//评论列表
	var imgArr = [];
	function getComments(){
		var data = [];
		data.push('aid='+detailID);
		data.push('page=1');
		data.push('pageSize=5');

		$.ajax({
			url: "/include/ajax.php?service=member&action=getComment&type=tuan-order",
			data: data.join("&"),
			type: "GET",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){

					var list = data.info.list,
							pageinfo = data.info.pageInfo,
							html = [];

					totalCount = pageinfo.totalCount;
					for(var i = 0; i < list.length; i++){

						var photo = list[i].user.photo == "" ? staticPath+'images/noPhoto_40.jpg' : list[i].user.photo;

						html.push('<div class="judge-user">');
						html.push('	<div class="user-tit">');
						html.push('		<dl class="fn-clear">');
						html.push('			<dt><a href="'+masterDomain+'/user/'+list[i].user.id+'"><img src="'+photo+'"></a></dt>');
						html.push('			<dd class="user-name"><a href="'+masterDomain+'/user/'+list[i].user.id+'">'+list[i].user.nickname+'</a></dd>');
						html.push('			<dd>');
						html.push('				<div class="shop-star">');
						html.push('					<i class="icon-star"><s style="width: '+(list[i].rating * 20)+'%;"></s></i>');
						html.push('					<span>'+huoniao.transTimes(list[i].dtime, 2)+'</span>');
						html.push('				</div>');
						html.push('			</dd>');
						html.push('		</dl>');
						html.push('	</div>');
						html.push('	<div class="user-comment">');
						html.push('		<p>'+list[i].content+'</p>');

						//图集
						var pics = list[i].pics;
						if(pics.length > 0){
							html.push('		<div class="my-gallery">');
							for(var p = 0; p < pics.length; p++){

								imgArr.push([pics[p], "pic"+i+"_"+p]);
								//imgLoad(pics[p], "pic"+i+"_"+p);

								html.push('			<figure itemprop="associatedMedia">');
								html.push('				<a href="'+pics[p]+'" id="pic'+i+'_'+p+'" data-size="100%x100%">');
								html.push('					<img src="'+huoniao.changeFileSize(pics[p], "small")+'" />');
								html.push('				</a>');
								html.push('			</figure>');
							}
							html.push('		</div>');
						}

						html.push('	</div>');
						html.push('</div>');

					}

					$("#common").html(html.join(""));
					$(".more-comment").show();
					initPhotoSwipeFromDOM('.my-gallery');

					for(var i = 0; i < imgArr.length; i++){
						imgLoad(imgArr[i][0], imgArr[i][1]);
					}

				}else{
					$("#common").html('<div class="loading">暂无评价信息</div>');
				}
			},
			error: function(){
				$("#common").html('<div class="loading">网络错误，加载失败！</div>');
			}
		});
	}


})
