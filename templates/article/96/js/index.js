	$(function(){
	// 焦点图
	$(".slideBox1").slide({titCell:".hd ul",mainCell:".bd .slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
	
	//当新闻列表无图片时，间距高度为0
	$(".news_list ul li .news_pic").each(function(){
		var i = $(this).find("img").length;
		if(i==0){
			$(this).css("height","0");
		}else{
			$(this).css("height","115px");
		}
	});
	
	
	//	首页新闻ajax请求
	$.fn.getAjax({
		page:1,
		pageSize:10,

		container:'.nhc'
	})


	
	$.ajax({
		url: masterDomain+'/include/ajax.php?service=article&action=type&son=1',
		type: 'GET',
		dataType: 'jsonp',
		beforeSend:function(){
			$('.new_loading').show();
		},
		success: function (respon) {
			var datas=respon.info;
			var oneh=''
			for(var i=0;i<datas.length;i++){
				var erji=datas[i].lower;
				var erjih='';
				for(var l=0;l<erji.length;l++){
					var sanji=erji[l].lower;
					var sanjih=''
					
					var sanjiBox=''
					for(var k=0;k<sanji.length;k++){
						var siji=sanji[k].lower;
						var sijih=''
						for(var s=0;s<siji.length;s++){
							sijih+=`
								<a href="${siji[s].url}" target="_blank" >${siji[s].typename}</a>
							`
						}

						sanjih+=`<a href="${sanji[k].url}"  target="_blank" class="second-on">${sanji[k].typename}</a>`;
						sanjiBox+=`<dd class="fn-clear sonMenu"><div class="subitem">${sijih}</div></dd>`;

					}
					erjih+=`<dl>
								<dt><h2 class="title">
									<a href="${erji[l].url}" target="_blank"  class="hover-on">${erji[l].typename}</a>
									<span>${sanjih}</span>
								</h2>
							</dt>
							${sanjiBox}
						</dl>`
				}

				oneh+=`<li class="">
						<a href="${datas[i].url}"  target="_blank" class="name">${datas[i].typename}</a>
						<div class="sub-category">
							${erjih}
						
				</div>
			</li>`

			}

			
				
			
			
			$('.NavList>ul').append(oneh)
			$('.NavList>ul li:lt(7)').css('display','block')
			$('.new_loading').hide();

			//左侧信息分类导航
	$(".NavList").hover(function(){
		$(this).find("li").show();
		$(this).find(".more").hide();
		$(this).find("li").each(function(){
			var index = $(this).index();
			if(index == 7){
				$(this).removeClass('bbnone');
			}
		});
	}, function(){
		$(this).find("li").each(function(){
			var index = $(this).index();
			if(index > 8){
				$(this).hide();
			}
			if(index == 8){
				$(this).addClass('bbnone');
			}
		});
		$(this).find(".more").show();
		$('.sonMenu').hide();
		// $('.sonMenu').eq(0).show();
		$('.NavList>ul>li:gt(6)').hide();
	});
	$(".NavList li").hover(function(){
		var t = $(this);
		if(!t.hasClass("active")){
			t.parent().find("li").removeClass("active");
			t.addClass("active");

			setTimeout(function(){
				if(t.find(".subitem").html() == undefined){
					var dlh = t.find("dl").height(), ddh = dlh - 55, ocount = parseInt(ddh/32), aCount = t.find("dd a").length;
					t.find("dd").css("height", ddh+"px");
					t.find(".sub-category").css({"width": Math.ceil(aCount/ocount) * 120 + "px"});
					t.find("dd a").each(function(i){ t.find("dd a").slice(i*ocount,i*ocount+ocount).wrapAll("<div class='subitem'>");});
				}
			}, 1);

		}
	}, function(){
		$(this).removeClass("active");
	});
	$('.NavList>ul>li:gt(6)').hide();
	//显示四级菜单
	$('.sonMenu').hide();
	// $('.sonMenu').eq(0).show();
	$(".NavList li dl").each(function(index,val){
		$(this).find("dt span a").on("hover",function(){
			var index = $(this).index();
			$('.sonMenu').hide();
			$('.sonMenu').eq(index).show();
			
		})

	});



	$(".news_list_switch .switchTit ul li").hover(function(){
		var index=$(this).index();
		$(".news_list_switch .switchTit ul li").eq(index).addClass("focus").siblings().removeClass("focus");
		$(".news_list_switch .switchList ul").eq(index).addClass("active").siblings().removeClass("active");
	})
		}
	})


})