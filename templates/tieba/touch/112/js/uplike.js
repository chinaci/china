$(function(){
	window.addEventListener("mousewheel", (e) => {
	   if (e.deltaY === 1) {
	     e.preventDefault();
	   }
	})
	//$('.btnCare').on('click',function(){
	$(".followbox ul").delegate(".btnCare","click",function(){
		var userid = $.cookie(cookiePre+"login_user");
	    if(userid == null || userid == ""){
	      location.href = masterDomain + '/login.html';
	      return false;
	    }

		var t=$(this),type=t.hasClass('cared') ? "del" : "add";
		var uid = $(this).attr('data-uid');
		$.post("/include/ajax.php?service=member&action=followMember&id="+uid, function(){
	    	if(type=="del"){
				t.removeClass('cared');
				t.html('关注');
			}else{
				t.addClass('cared');
				t.html('<i></i>已关注');
			}
	    });
	});

	var hallList = $(".followbox ul"), atpage = 1, pageSize = 9, listArr = [], totalPage = 0, isload = false;
	getList();
	function getList(){
		isload = true;
		hallList.append('<div class="loading"><i></i>加载中...</div>');
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=member&action=upList",
			data: {
				"tid": id,
				"temp": 'detail',
				"module": 'tieba',
				"type": '0',
				"page": atpage,
				"pageSize": pageSize
			},
			dataType: "json",
			success: function (data) {
				hallList.find(".loading").remove();
				if(data.state == 100){
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					for (var i = 0; i < list.length; i++) {
						var photo = (list[i].photo == "" || list[i].photo == undefined) ? staticPath+'images/noPhoto_100.jpg' : list[i].photo;
						html.push('<li class="fn-clear">');
						html.push('<div class="left"><a href="'+masterDomain+'/user/'+list[i].uid+'"><img src="'+photo+'" alt=""></a></div>');
						html.push('<div class="right"><h4>'+list[i].username+'</h4><p><span>发帖: '+list[i].tiziTotal+'</span>   <span>关注: '+list[i].followTotal+'</span></p></div>');
						if(list[i].isfollow==1){
							html.push('<a data-uid="'+list[i].uid+'" href="javascript:;" class="btnCare cared">已关注</a>');
						}else if(list[i].isfollow==0){
							html.push('<a data-uid="'+list[i].uid+'" href="javascript:;" class="btnCare">关注</a>');
						}
						html.push('</li>');
					}
	          		hallList.append(html.join(""));
	          		if(atpage >= pageInfo.totalPage){
	              		isload = true;
	              		hallList.append('<div class="loading">已加载全部数据！</div>');
	            	}else{
	              		isload = false;
	            	}
				}else{
					hallList.append('<div class="empty">暂无相关信息！</div>');
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				isload = false;
				hallList.find(".loading").remove();
			}
		});
	}

	//滚动加载
	$(window).on("touchmove", function(){
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - 300;
		if ($(window).scrollTop() + 50 > scroll && !isload) {
			atpage++;
			getList();
		};
	});

})