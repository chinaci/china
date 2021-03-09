$(function(){
	var init = {
		
		//拼接分类
		printTypeTree: function(){
			var typeList = [], l=typeListArr.length;
			for(var i = 0; i < l; i++){
				(function(){
					var jsonArray =arguments[0];
					typeList.push('<li class="li0">');
					typeList.push('<div class="tr clearfix tr_'+jsonArray["id"]+'">');
					typeList.push('  <div class="row2"></div>');
					typeList.push('  <div class="row60 left"><input type="text" data-type="name" class="input-medium" data-id="'+jsonArray["id"]+'" data-level="'+jsonArray["level"]+'" value="'+jsonArray["typename"]+'" placeholder="名称"><input type="text" data-type="weather_code" class="input-small" data-id="'+jsonArray["id"]+'" value="'+jsonArray["weather_code"]+'" placeholder="城市天气ID" style="margin-left: 20px;"><a href="javascript:;" class="markditu" title="标注区域位置"><img src="/static/images/admin/markditu.jpg" /></a><input data-id="'+jsonArray["id"]+'" type="text" data-type="longitude" class="input-medium" value="'+jsonArray["longitude"]+'" placeholder="经度" id="longitude"><input data-id="'+jsonArray["id"]+'" type="text" data-type="latitude" class="input-medium" value="'+jsonArray["latitude"]+'" placeholder="纬度" style="margin-left:20px;" id="latitude"></div>');
					typeList.push('  <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
					typeList.push('  <div class="row17 left"><a href="javascript:;" class="del" title="删除">删除编辑</a></div>');
					typeList.push('</div>');
					typeList.push('</li>');
				})(typeListArr[i]);
			}
			$(".root").html(typeList.join(""));
			init.dragsort();
		}

		//树形递归分类
		,treeTypeList_: function(){
			var typeList = [];
			var l=typeListArr;
			for(var i = 0; i < l.length; i++){
				(function(){
					var jsonArray =arguments[0], jArray = jsonArray.lower;
					typeList.push('<option value="'+jsonArray["id"]+'">'+jsonArray["typename"]+'</option>');
				})(l[i]);
			}
			return typeList.join("");
		}
		
		//拖动排序
		,dragsort: function(){
			//一级
			$('.root').sortable({
	      items: '>li',
				placeholder: 'placeholder',
	      orientation: 'vertical',
	      axis: 'y',
				handle:'>div.tr',
	      opacity: .5,
	      revert: 0,
				stop:function(){
					//saveOpera(1);
					huoniao.stopDrag();
				}
	    });
		}
	};



	//二级菜单点击事件
	$("#pBtn a, #cBtn a, #dBtn a").bind("click", function(){
		var t = $(this), id = t.attr("data-id"), title = t.text();
		var parent = t.closest(".btn-group");
		parent.attr("data-id", id);
		parent.find("button").html(title+'<span class="caret"></span>');

		if(parent.attr("id") == "pBtn"){
			$("#cBtn").attr("data-id", 0).find("button").html('--城市--<span class="caret"></span>');
			$("#dBtn").attr("data-id", 0).find("button").html('--州县--<span class="caret"></span>');
		}

		if(parent.attr("id") == "cBtn"){
			$("#dBtn").attr("data-id", 0).find("button").html('--州县--<span class="caret"></span>');
		}

		//跳转
		var pid = $("#pBtn").attr("data-id"), cid = $("#cBtn").attr("data-id"), did = $("#dBtn").attr("data-id");
		location.href = "?pid="+pid+"&cid="+cid+"&did="+did;
	});
	

	//下拉菜单过长设置滚动条
	$(".dropdown-toggle").bind("click", function(){
		var height = document.documentElement.clientHeight - $(this).offset().top - $(this).height() - 30;
		$(this).next(".dropdown-menu").css({"max-height": height, "overflow-y": "auto"});
	});

	
	//拼接现有分类
	init.printTypeTree();
	

	//底部添加新分类
	$("#addNew").bind("click", function(){
		var html = [];
		
		html.push('<li class="li0">');
		html.push('  <div class="tr clearfix">');
		html.push('    <div class="row2"></div>');
		html.push('    <div class="row60 left"><input data-id="0" type="text" data-type="name" class="input-medium" data-level="0" placeholder="名称"><input data-id="0" type="text" data-type="weather_code" class="input-small" placeholder="城市天气ID" style="margin-left:20px;"><a href="javascript:;" class="markditu" title="标注区域位置"><img src="/static/images/admin/markditu.jpg" /></a><input data-id="0" type="text" data-type="longitude" class="input-medium" placeholder="经度" id="longitude"><input data-id="0" type="text" data-type="latitude" class="input-medium" placeholder="纬度" style="margin-left:20px;" id="latitude"></div>');
		html.push('    <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
		html.push('    <div class="row17 left"><a href="javascript:;" class="del">删除</a></div>');
		html.push('  </div>');
		html.push('</li>');
		
		$(this).parent().parent().prev(".root").append(html.join(""));
	});
	
	//input焦点离开自动保存
	$("#list").delegate("input", "blur", function(){
		var t = $(this), id = t.attr("data-id"), value = t.val(), type = t.data("type");
		if(id != "" && id != 0){
			huoniao.operaJson("siteAddr.php?dopost=updateType&id="+id+"&type="+type, "action=single&value="+value, function(data){
				if(data.state == 100){
					huoniao.showTip("success", data.info, "auto");
				}else if(data.state == 101){
					//huoniao.showTip("warning", data.info, "auto");
				}else{
					huoniao.showTip("error", data.info, "auto");
				}
			});
		}
	});
	
	//鼠标经过li
	$("#list").delegate(".tr", "mouseover", function(){
		$(this).parent().addClass("hover");
	});
	$("#list").delegate(".tr", "mouseout", function(){
		$(this).parent().removeClass("hover");
	});
	
	//排序向上
	$(".root").delegate(".up", "click", function(){
		var t = $(this), parent = t.parent().parent().parent(), index = parent.index(), length = parent.siblings("li").length;
		if(index != 0){
			parent.after(parent.prev("li"));
			huoniao.stopDrag();
		}
	});
	
	//排序向下
	$(".root").delegate(".down", "click", function(){
		var t = $(this), parent = t.parent().parent().parent(), index = parent.index(), length = parent.siblings("li").length;
		if(index != length){
			parent.before(parent.next("li"));
			huoniao.stopDrag();
		}
	});
	
	//删除
	$(".root").delegate(".del", "click", function(event){
		event.preventDefault();
		var t = $(this), id = t.parent().parent().find("input").attr("data-id"), type = t.parent().text();
		
		//从异步请求
		if(type.indexOf("编辑") > -1){
			$.dialog.confirm("确定要删除吗？", function(){
				huoniao.showTip("loading", "正在删除，，请稍候...");
				huoniao.operaJson("siteAddr.php?dopost=del", "id="+id, function(data){
					if(data.state == 100){
						huoniao.showTip("success", data.info, "auto");
						setTimeout(function() { 
							location.reload();
						}, 800);
					}else{
						alert(data.info);
						return false;
					}
				});
			});
			//跳转到对应删除页面
		}else{
			t.parent().parent().parent().remove();
		}

	});
	
	//保存
	$("#saveBtn").bind("click", function(){
		saveOpera("");
	});


	//批量删除
	$("#batch").bind("click", function(){
		$.dialog({
			fixed: false,
			title: "批量删除",
			content: '<div class="batch-data"><p class="muted">选择要删除的区域，多个按【ctrl+点击】选择</p><select id="category" multiple>'+init.treeTypeList_()+'</select></div>',
			width: 310,
			ok: function(){
				var ids = [];
				self.parent.$("#category option:selected").each(function(){
					ids.push($(this).val());
				});
				if(ids.length <= 0){
					alert("请选择要删除的分类");
					return false;
				}else{

					$.dialog.confirm("确定要删除吗？", function(){

						huoniao.showTip("loading", "正在删除，，请稍候...");
						huoniao.operaJson("siteAddr.php?dopost=del", "id="+ids.join(","), function(data){
							if(data.state == 100){

								huoniao.showTip("success", data.info, "auto");
								setTimeout(function() {
									location.reload();
								}, 800);
								
							}else{
								alert(data.info);
								return false;
							}
						});

					}, function(){});

				}
			},
			cancel: true
		});
	});

	//返回最近访问的位置
	huoniao.scrollTop();
	
});

//保存
function saveOpera(type){
	var first = $("ul.root>li"), json = '[';
	for(var i = 0; i < first.length; i++){
		(function(){
			var html =arguments[0], count = 0, input = $(html).find(".tr input.input-medium"), id = input.attr("data-id"), val = input.val(), weather = $(html).find(".tr input.input-small").val(),longitude =  $(html).find('#longitude').val(), latitude = $(html).find('#latitude').val();
			if(val != ""){
				json = json + '{"id": "'+id+'", "name": "'+encodeURIComponent(val)+'", "weather": "'+weather+'", "longitude": "'+longitude+'", "latitude": "'+latitude+'"},';
			}
		})(first[i]);
	}
	json = json.substr(0, json.length-1);
	json = json + ']';

	if(json == "]") return false;

	var scrolltop = $(document).scrollTop();
	var href = huoniao.changeURLPar(location.href, "scrolltop", scrolltop);

	var pid = $("#pBtn").attr("data-id"), cid = $("#cBtn").attr("data-id"), did = $("#dBtn").attr("data-id");
	
	huoniao.showTip("loading", "正在保存，请稍候...");
	huoniao.operaJson("siteAddr.php?dopost=typeAjax&pid="+pid+"&cid="+cid+"&did="+did, "data="+json, function(data){
		if(data.state == 100){
			huoniao.showTip("success", data.info, "auto");
			if(type == ""){
				//window.scroll(0, 0);
				//setTimeout(function() {
					location.href = href;
				//}, 800);
			}
		}else{
			huoniao.showTip("error", data.info, "auto");
		}
	});
}


//标注地图
$(".list").on("click", ".markditu", function(){
    var t = $(this), input = t.closest(".tr").find('.input-medium').first(), val = input.val(), level = input.attr('data-level');
    var longitude = t.closest(".tr").find('#longitude').val(), latitude = t.closest(".tr").find('#latitude').val(), addr = val, mapCity = val;
    if(longitude == "" || latitude == ""){
        var pid = $("#pBtn").attr("data-id"), cid = $("#cBtn").attr("data-id"), did = $("#dBtn").attr("data-id");
        if(level == 0 && pid == 0){
            mapCity = "";
		}
        if(pid != 0){
            mapCity = $("#pBtn").find('button').text();
        }
        if(cid != 0){
            mapCity = $("#cBtn").find('button').text();
        }
        if(did != 0){
            mapCity = $("#dBtn").find('button').text();
        }
    }
	var lnglat = latitude != "" && longitude != "" ? (longitude+","+latitude) : "";
    $.dialog({
        id: "markDitu",
        title: "标注 "+addr+" 地图位置<small>（请点击/拖动图标到正确的位置，再点击底部确定按钮。）</small>",
        content: 'url:'+adminPath+'../api/map/mark.php?mod=siteConfig&lnglat='+lnglat+"&city="+mapCity+"&address="+addr,
        width: 800,
        height: 500,
        max: true,
        ok: function(){
            var doc = $(window.parent.frames["markDitu"].document),
                lng = doc.find("#lng").val(),
                lat = doc.find("#lat").val();

            t.closest(".tr").find('#longitude').val(lng);
            t.closest(".tr").find('#latitude').val(lat);
        },
        cancel: true
    });
});
