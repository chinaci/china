$(function(){

	// 图片
	$('.highslide-gallery').slide({mainCell:".bd ul", autoPlay:true, autoPage:true,vis:5,effect:"left"});

	var commentObj = $("#commentList");
	var isLoad = 0;

	//评论登录
	$(".comment").delegate(".login", "click", function(){
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
			$("html, body").scrollTop(0);
		}
		huoniao.login();
	});

	//评论筛选【时间、热度】
	$(".c-orderby a").bind("click", function(){
		if(!$(this).hasClass("active")){
			$(".c-orderby a").removeClass("active");
			$(this).addClass("active");

			commentObj
				.attr("data-page", 1)
				.html('<div class="loading"></div>');
			$("#loadMore").removeClass().hide();

			loadComment();
		}
	});

	//加载评论
	function loadComment(){
		if(id && id != undefined){
			var page = commentObj.attr("data-page");
			var orderby = $(".c-orderby .active").attr('data-id');
			//异步获取用户信息
			$.ajax({
				url : '/include/ajax.php?service=member&action=getComment&type=huangye-detail&son=1&aid='+id+'&page='+page+'&pageSize='+pageSize,
				type: "GET",
				dataType: "json",
				success: function (data) {
					if(data && data.state == 100){

						if(commentObj.find("li").length > 0){
							commentObj.append(getCommentList(data.info.list));
						}else{
							commentObj.html(getCommentList(data.info.list));
						}

						page = commentObj.attr("data-page", (Number(page)+1));

						var pageInfo = data.info.pageInfo;
						if(Number(pageInfo.page) < Number(pageInfo.totalPage)){
							$("#loadMore").removeClass().show();
						}else{
							$("#loadMore").removeClass().hide();
						}

					}else{
						if(commentObj.find("li").length <= 0){
							commentObj.html("<div class='empty'>暂无相关评论</div>");
							$("#loadMore").removeClass().hide();
						}
					}
				},
				error: function(){
					if(commentObj.find("li").length <= 0){
						commentObj.html("<div class='empty'>暂无相关评论</div>");
						$("#loadMore").removeClass().hide();
					}
				}
			});
		}else{
			commentObj.html("Error!");
		}
	}

	//拼接评论列表
	function getCommentList(list){
		var html = [];
		for(var i = 0; i < list.length; i++){
			html.push('<li class="fn-clear" data-id="'+list[i]['id']+'">');

			var photo = list[i].user['photo'] == "" ? staticPath+'images/noPhoto_40.jpg' : huoniao.changeFileSize(list[i].user['photo'], "small");

			html.push('  <img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" data-uid="'+list[i].user['userid']+'" src="'+photo+'" alt="'+list[i].user['nickname']+'">');
			html.push('  <div class="c-body">');
			html.push('    <div class="c-header">');
			html.push('      <a href="javascript:;" data-id="'+list[i].user['userid']+'">'+list[i].user['nickname']+'</a>');
			html.push('      <span>'+list[i]['ftime']+'</span>');
			html.push('    </div>');
			html.push('    <p>'+list[i]['content']+'</p>');
			html.push('    <div class="c-footer">');

			var praise = "praise";
			if(list[i]['zan_has'] == 1){
				praise = "praise active";
			}
			html.push('      <a href="javascript:;" class="'+praise+'"><s></s>(<em>'+list[i]['zan']+'</em>)</a>');

			html.push('      <a href="javascript:;" class="reply"><s></s>回复(<em>'+(list[i]['lower']!=undefined && list[i]['lower'].count ? list[i]['lower'].count : 0)+'</em>)</a>');
			html.push('    </div>');
			html.push('  </div>');
			if(list[i]['lower']!=undefined && list[i]['lower'].count > 0 && list[i]['lower'].list!=null){
				html.push('  <ul class="children">');
				html.push(getCommentList(list[i]['lower']['list']));
				html.push('  </ul>');
			}
			html.push('</li>');
		}
		return html.join("");
	}

	//加载更多评论
	$("#loadMore").bind("click", function(){
		$(this).addClass("loading");
		loadComment();
	});

	//顶
	commentObj.delegate(".praise", "click", function(){
		var t = $(this), id = t.closest("li").attr("data-id");
		if(t.hasClass("active")) return false;
		if(id != "" && id != undefined){
			$.ajax({
				url: "/include/ajax.php?service=member&action=dingComment&type=add&id="+id,
				type: "GET",
				dataType: "json",
				success: function (data) {
					var ncount = Number(t.text().replace("(", "").replace(")", ""));
					t
						.addClass("active")
						.html('<s></s>(<em>'+(ncount+1)+'</em>)');

					//加1效果
					var $i = $("<b>").text("+1");
					var x = t.offset().left, y = t.offset().top;
					$i.css({top: y - 10, left: x + 17, position: "absolute", color: "#E94F06"});
					$("body").append($i);
					$i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
						$i.remove();
					});

				}
			});
		}
	});

	//评论回复
	commentObj.delegate(".reply", "click", function(){
		var carea = commentObj.find(".c-area");
		if(carea.html() != "" && carea.html() != undefined){
			carea.stop().slideUp("fast");
			commentObj.find(".reply").removeClass("active");
		}

		var areaObj = $(this).closest(".c-body"),
			replaytemp = $("#replaytemp").html();
		if(areaObj.find(".c-area").html() == "" || areaObj.find(".c-area").html() == undefined){
			areaObj.append(replaytemp);
			clearContenteditableFormat(areaObj.find(".c-area .textarea"));
		}
		areaObj.find(".c-area").stop().slideToggle("fast");

	});

	//提交评论回复
	$(".comment").delegate(".subtn", "click", function(){
		var t = $(this), cid = t.closest("li").attr("data-id");
		if(t.hasClass("login") || t.hasClass("loading")) return false;

		var contentObj = t.closest(".c-area").find(".textarea"),
			content = contentObj.html();

		if(content == ""){
			return false;
		}
		if(huoniao.getStrLength(content) > 200){
			alert("超过200个字了！");
		}

		if(cid == undefined){
            var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=huangye-detail&aid=' + id;
        }else{
            var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + cid;
        }
		cid = cid == undefined ? 0 : cid;

		t.addClass("loading");

		$.ajax({
			url: url,
			data: "content="+content,
			type: "POST",
			dataType: "json",
			success: function (data) {

				t.removeClass("loading");
				contentObj.html("");
				if(data && data.state == 100){

					var info = data.info;
					var list = [];

					var photo = info.userinfo['photo'] == "" ? staticPath+'images/noPhoto_40.jpg' : huoniao.changeFileSize(info.userinfo['photo'], "small");

					list.push('<li class="fn-clear colorAnimate" data-id="'+info['id']+'">');
					list.push('  <img data-uid="'+info.userinfo['userid']+'" src="'+photo+'" alt="'+info.userinfo['nickname']+'">');
					list.push('  <div class="c-body">');
					list.push('    <div class="c-header">');
					list.push('      <a href="javascript:;" data-id="'+info.userinfo['userid']+'">'+info.userinfo['nickname']+'</a>');
					list.push('      <span>'+info['ftime']+'</span>');
					list.push('    </div>');
					list.push('    <p>'+info['content']+'</p>');
					list.push('    <div class="c-footer">');
					list.push('      <a href="javascript:;" class="praise"><s></s>(<em>'+info['zan']+'</em>)</a>');
					list.push('      <a href="javascript:;" class="reply">回复(<em>'+(info['lower']!=undefined && info['lower'].count ? info['lower'].count : 0)+'</em>)</a>');
					list.push('    </div>');
					list.push('  </div>');
					list.push('</li>');

					//一级评论
					if(contentObj.attr("data-type") == "parent"){
						if(commentObj.find("li").length <= 0){
							commentObj.html("");
							$("#loadMore").removeClass().hide();
						}

						commentObj.prepend(list.join(""));

					//子级
					}else{

						t.closest(".c-area").hide();

						var children = t.closest("li").find(".children");
						//判断子级是否存在
						if(children.html() == "" || children.html() == undefined){
							t.closest("li").append('<ul class="children"></ul>');
						}

						t.closest("li").find("ul.children").prepend(list.join(""));


					}

				}

			}
		});

	});

	// tab切换
	$('.service-lead ul li').hover(function(){
		var x = $(this);
		var index = x.index();
		if(x.hasClass('selected')) return;
		showTab(index);
	})
	if($('.service-lead ul li').length == 1){
		showTab(0);
	}
	function showTab(index){
		var x = $('.service-lead ul li').eq(index);
		$('.service-txt ul li').eq(index).show().siblings().hide();
		x.addClass('selected').siblings("li").removeClass('selected');
		if(isLoad == 0 && x.next().length == 0){
			isLoad = 1;
			loadComment();
		}
	}
	// 评论
	$('.report .gocommon').click(function(){
		var index = $('.service-lead ul li').length - 1;
		showTab(index);
	})

	// 举报
	var complain = null;
	$("#report").bind("click", function(){

		var domainUrl = masterDomain;
		complain = $.dialog({
			fixed: false,
			title: "信息举报",
			content: 'url:'+domainUrl+'/complain-huangye-detail-'+id+'.html',
			width: 460,
			height: 280
		});
	});

})
hs.graphicsDir = skin + 'images/';
hs.align = 'center';
hs.transitions = ['expand', 'crossfade'];
hs.outlineType = 'rounded-white';
hs.fadeInOut = true;
hs.creditsText = "";
//hs.dimmingOpacity = 0.75;

// Add the controlbar
hs.addSlideshow({
	//slideshowGroup: 'group1',
	interval: 5000,
	repeat: false,
	useControls: true,
	fixedControls: 'fit',
	overlayOptions: {
		opacity: .75,
		position: 'bottom center',
		hideOnMouseOut: true
	}
});


//百度地图
if(site_map == "baidu"){
	var obj_xyz = {'x':lnglat[0],'y':lnglat[1]};
	var city_ = address.split(">"), icity = $.trim(city_[city_.length-1]);
	var zb_style = 0;
	var zb_style_arr = [{'key':'公交','img':'gongjiao.gif'},{'key':'超市','img':'chaoshi.gif'},{'key':'学校','img':'xuexiao.gif'},{'key':'医院','img':'yiyuan.gif'}];
	var map = new BMap.Map("allmap",{enableMapClick:false}),mPoint;
	map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
	map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
	map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));
	if(!obj_xyz.x||!obj_xyz.y||obj_xyz.x==='0'||obj_xyz.y==='0'){
		map.centerAndZoom(icity , 13);
	}else{
		mPoint = new BMap.Point(obj_xyz.x,obj_xyz.y);
		map.centerAndZoom(mPoint, 16);
		var icon = new BMap.Icon(skin+'images/markerred.gif', new BMap.Size(20, 20),{anchor: new BMap.Size(10, 10)});
		var mkr = new BMap.Marker(mPoint,{icon:icon});
		map.addOverlay(mkr);
		var myLabel = new BMap.Label(title,{offset:new BMap.Size(14,-9),position:mPoint});
		myLabel.setStyle({fontSize:"12px",border:"1px solid #36c"});
		map.addOverlay(myLabel);                             //把label添加到地图上
		//检索初始化
		var local = new BMap.LocalSearch(map, options);
		local.searchNearby(zb_style_arr[0].key,mPoint,500);

		$('.mapr-l li').click(function(e){
			$('#marpr-list').empty();
			$(this).addClass('yop').siblings('li').removeClass('yop');
			zb_style = parseInt($(this).attr('data-val'));
			local.searchNearby(zb_style_arr[zb_style].key,mPoint,500);
		});
	}

//google地图
}else if(site_map == "google"){


	//加载地图事件
	function initialize() {
		var map = new google.maps.Map(document.getElementById('allmap'), {
			zoom: 14,
			center: new google.maps.LatLng(lnglat[1], lnglat[0]),
			zoomControl: true,
			mapTypeControl: false,
			streetViewControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			}
		});

		var infowindow = new google.maps.InfoWindow({
          content: '<div style="font-weight: 700; font-size: 16px;">' + title + '</div>' + '<p style="line-height: 3em;">详细地址：' + addressdet + '</p>'
        });

		var marker = new google.maps.Marker({
			position: {lat: lnglat[1], lng: lnglat[0]},
			map: map,
			title: title
		});
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}

	google.maps.event.addDomListener(window, 'load', initialize);

}else if (site_map == "amap") {

		var mapObj,toolBar,MGeocoder,mar;

		//初始化地图对象，加载地图
		mapObj = new AMap.Map("allmap",{
	      //二维地图显示视口
	      view: new AMap.View2D({
	          center: new AMap.LngLat(lnglat[0],lnglat[1]),//地图中心点
	          zoom: 13 //地图显示的缩放级别
	      })
	  });

		//在地图中添加ToolBar插件
		mapObj.plugin(["AMap.ToolBar"],function(){
				toolBar = new AMap.ToolBar({position: 'RB'});
				toolBar.show();
				toolBar.showDirection();
				toolBar.hideRuler();
				mapObj.addControl(toolBar);
		});

		//添加地图类型切换插件
	    mapObj.plugin(["AMap.MapType"],function(){
	        //地图类型切换
	        var mapType= new AMap.MapType({
	            defaultType:0//默认显示地图
	        });
	        mapObj.addControl(mapType);
	    });

		//配置marker图标
		var markerOption = {
			map: mapObj,
				draggable:true,   //点标记可拖拽
				cursor:'move',    //鼠标悬停点标记时的鼠标样式
				raiseOnDrag:true, //鼠标拖拽点标记时开启点标记离开地图的效果
				offset:new AMap.Pixel(-32,-64), //标记显示位置偏移量

			icon:new AMap.Icon({  //复杂图标
							size:new AMap.Size(64,64),  //图标大小
							image:"/static/images/mark_ditu.png" //图标地址
					})
		};

		//自定义地图配置
		//如果经、纬度都为0则设置城市名为中心点
		if(lnglat[0] == 0 && lnglat[1] == 0){

			//根据地址解析
			if(city != ""){
				var address = city;
				if(addr != "") address = addr;

				//加载地理编码插件
			    mapObj.plugin(["AMap.Geocoder"], function() {       
			        MGeocoder = new AMap.Geocoder({
			            city: city
			        });
			        //返回地理编码结果
			        AMap.event.addListener(MGeocoder, "complete", geocoder_CallBack);
			        //地理编码
			        MGeocoder.getLocation(address);
			    });

			//如果城市为空，地图默认显示用户当前城市范围
			}else{
				mapObj = new AMap.Map("allmap");

			}

		}else{
			addmarker(lnglat[0], lnglat[1]);
		}

	    
		function addmarker(lngX, latY) {
			mar ? mar.setMap(null) : "";  //清除地图上已有的marker
				markerOption.position = new AMap.LngLat(lngX, latY); //设置marker的坐标位置
				mar = new AMap.Marker(markerOption);   //向地图添加marker
				new AMap.LngLat(lngX, latY);
				//mapObj.setZoom(14);
		}

}else if (site_map == "qq") {

	var mapOptions = {
		zoom: 14,
		center: new qq.maps.LatLng(lnglat[1], lnglat[0]),
		zoomControl: true,
		zoomControlOptions: {
			style: qq.maps.ZoomControlStyle.SMALL,
			position: qq.maps.ControlPosition.RIGHT_BOTTOM
		},
		panControlOptions: {
			position: qq.maps.ControlPosition.RIGHT_BOTTOM
		}
	};

	var map = new qq.maps.Map(document.getElementById("allmap"), mapOptions);
	var anchor = new qq.maps.Point(32, 64);
	var size = new qq.maps.Size(64, 64);
	var origin = new qq.maps.Point(0, 0);
	var myIcon = new qq.maps.MarkerImage('/static/images/mark_ditu.png', size, origin, anchor);

	var marker = new qq.maps.Marker({
		icon: myIcon,
		position: mapOptions.center,
		animation: qq.maps.MarkerAnimation.DROP,
		map: map
	});

	function initialize() {

		//如果经、纬度都为0则设置城市名为中心点
		if(lnglat[0] == 0 && lnglat[1] == 0){

			//根据地址解析
			if(city != ""){
				var address = city;
				if(addr != "") address = address + addr;
				var geocoder = new qq.maps.Geocoder({
					complete : function(result){
						var location = result.detail.location;
						map.setCenter(location);
						mapOptions.center = new qq.maps.LatLng(location.lat, location.lng);
						setMark();
					}
				});
				geocoder.getLocation(address);

			//如果城市为空，则定位当前城市
			}else{
				var citylocation = new qq.maps.CityService({
					complete : function(result){
						var location = result.detail.latLng;
						map.setCenter(location);
						mapOptions.center = new qq.maps.LatLng(location.lat, location.lng);
						setMark();
					}
				});
				citylocation.searchLocalCity();
			}

		}else{
			// setMark();
		}

	}

	initialize();

}

// 分享代码
var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];
