$(function(){
	
	var defaultBtn = $("#delBtn, #batchAudit, #moveBtn"),
		checkedBtn = $("#stateBtn"),
		init = {
		
			//选中样式切换
			funTrStyle: function(){
				var trLength = $("#list tbody tr").length, checkLength = $("#list tbody tr.selected").length;
				if(trLength == checkLength){
					$("#selectBtn .check").removeClass("checked").addClass("checked");
				}else{
					$("#selectBtn .check").removeClass("checked");
				}
				
				if(checkLength > 0){
					defaultBtn.css('display', 'inline-block');
					checkedBtn.hide();
				}else{
					defaultBtn.hide();
					checkedBtn.css('display', 'inline-block');
				}
			}
			
			//删除
			,del: function(){
				var checked = $("#list tbody tr.selected");
				if(checked.length < 1){
					huoniao.showTip("warning", "未选中任何信息！", "auto");
				}else{
					huoniao.showTip("loading", "正在操作，请稍候...");
					var id = [];
					for(var i = 0; i < checked.length; i++){
						id.push($("#list tbody tr.selected:eq("+i+")").attr("data-id"));
					}
					
					huoniao.operaJson("datingAlbum.php?dopost=del", "userid="+userid+"&id="+id, function(data){
						if(data.state == 100){
							huoniao.showTip("success", data.info, "auto");
							$("#selectBtn a:eq(1)").click();
							setTimeout(function() { 
								getList();
							}, 800);
						}else{
							var info = [];
							for(var i = 0; i < $("#list tbody tr").length; i++){
								var tr = $("#list tbody tr:eq("+i+")");
								for(var k = 0; k < data.info.length; k++){
									if(data.info[k] == tr.attr("data-id")){
										info.push("▪ "+tr.find("td:eq(1) a").text());
									}
								}
							}
							$.dialog.alert("<div class='errInfo'><strong>以下信息删除失败：</strong><br />" + info.join("<br />") + '</div>', function(){
								getList();
							});
						}
					});
					$("#selectBtn a:eq(1)").click();
				}
			}
			
			//更新信息状态
			,updateState: function(type){
				huoniao.showTip("loading", "正在操作，请稍候...");
				$("#smartMenu_state").remove();
				
				var checked = $("#list tbody tr.selected");
				if(checked.length < 1){
					huoniao.showTip("warning", "未选中任何信息！", "auto");
				}else{
					var state = "";
					if(type == "待审核"){
						state = 0;
					}else if(type == "已审核"){
						state = 1;
					}else if(type == "拒绝审核"){
						state = 2;
					}
					
					huoniao.showTip("loading", "正在操作，请稍候...");
					var id = [];
					for(var i = 0; i < checked.length; i++){
						id.push($("#list tbody tr.selected:eq("+i+")").attr("data-id"));
					}
					huoniao.operaJson("datingAlbum.php?dopost=updateState", "userid="+userid+"&id="+id+"&state="+state, function(data){
						if(data.state == 100){
							huoniao.showTip("success", data.info, "auto");
							setTimeout(function() { 
								getList();
							}, 800);
						}else{
							var info = [];
							for(var i = 0; i < $("#list tbody tr").length; i++){
								var tr = $("#list tbody tr:eq("+i+")");
								for(var k = 0; k < data.info.length; k++){
									if(data.info[k] == tr.attr("data-id")){
										info.push("▪ "+tr.find("td:eq(1) a").text());
									}
								}
							}
							$.dialog.alert("<div class='errInfo'><strong>以下信息修改失败：</strong><br />" + info.join("<br />") + '</div>', function(){
								getList();
							});
						}
					});
					$("#selectBtn a:eq(1)").click();
				}
			}
			
		};
	
	//初始加载
	getList();
	
	//分类筛选
	$(".selectedTags").delegate("span a", "click", function(){
		var parent = $(this).parent(), id = parent.attr("data-id");
		parent.siblings("span").removeClass("selected");
		if(parent.hasClass("selected")){
			parent.removeClass("selected")
			$("#sType").html("");
		}else{
			parent.addClass("selected")
			$("#sType").html(id);
		}
		getList();
	});
	
	//新增分类
	$("#addNewType").bind("click", function(){
		var input = $(".selectedTags").find("input");
		if(input){
			var iid = input.attr("data-id"), val = input.val();
			if(iid){
				input.before('<span data-id="'+iid+'"><a href="javascript:;" class="name">'+val+'</a><i class="icon-pencil icon-white" title="修改"></i><i class="icon-minus icon-white" title="删除"></i></span>');
				input.remove();
			}
		}
		var input = '<input type="text" class="input-small typeName" style="vertical-align:top;" placeholder="请输入分类名" title="回车提交" />';
		$(this).before(input);
		$(this).prev("input").focus();
		$(this).hide();
	});
	
	//分类回车提交
    $(".selectedTags").delegate(".typeName", "keyup", function (e) {
        if (!e) {
            var e = window.event;
        }
        if (e.keyCode) {
            code = e.keyCode;
        }
        else if (e.which) {
            code = e.which;
        }
        if (code === 13) {
			var t = $(this), name = t.val(), id = t.attr("data-id");
			if($.trim(name) == ""){
				huoniao.showTip("error", "请输入分类名！", "auto");
			}else{
				huoniao.showTip("loading", "请稍候...");
				huoniao.operaJson("datingAlbum.php?dopost=updateType", "userid="+userid+"&name="+name+"&id="+(id == undefined ? "" : id), function(data){
					if(data.state == 100){
						huoniao.showTip("success", data.info, "auto");
						t.before('<span data-id="'+(id == undefined ? data.id : id)+'"><a href="javascript:;" class="name">'+name+'</a><i class="icon-pencil icon-white" title="修改"></i><i class="icon-minus icon-white" title="删除"></i></span>');
						t.remove();
						$("#addNewType").show();
					}else{
						huoniao.showTip("error", data.info, "auto");
					}
				});
			}
        }
    });
	
	//修改分类
	$(".selectedTags").delegate(".icon-pencil", "click", function(){
		var parent = $(this).parent(), id = parent.attr("data-id"), name = $(this).prev("a").text();
		if(id && name){
			
			var input = $(".selectedTags").find("input");
			if(input){
				var iid = input.attr("data-id"), val = input.val();
				if(iid){
					input.before('<span data-id="'+iid+'"><a href="javascript:;" class="name">'+val+'</a><i class="icon-pencil icon-white" title="修改"></i><i class="icon-minus icon-white" title="删除"></i></span>');
				}else{
					$("#addNewType").show();
				}
				input.remove();
			}
			
			parent.before('<input type="text" data-id="'+id+'" class="input-small typeName" style="vertical-align:top;" placeholder="请输入分类名" title="回车提交" value="'+name+'" />');
			parent.prev("input").focus();
			parent.remove();
		}
	});
	
	//删除分类
	$(".selectedTags").delegate(".icon-minus", "click", function(){
		var parent = $(this).parent(), id = parent.attr("data-id");
		if(id){
			$.dialog.confirm("删除分类将同时删除所属的照片<br />此操作不可恢复，确定要删除吗？", function(){
				huoniao.showTip("loading", "请稍候...");
				huoniao.operaJson("datingAlbum.php?dopost=delType", "userid="+userid+"&id="+id, function(data){
					huoniao.hideTip();
					if(data.state == 100){
						huoniao.showTip("success", data.info, "auto");
						parent.remove();
						setTimeout(function(){
							getList();
						}, 500);
					}else{
						huoniao.showTip("error", data.info, "auto");
					}
				});
			})
		}
	});
	
	//二级菜单点击事件
	$("#stateBtn, #pageBtn, #paginationBtn").delegate("a", "click", function(){
		var id = $(this).attr("data-id"), title = $(this).html(), obj = $(this).parent().parent().parent();
		obj.attr("data-id", id);
		if(obj.attr("id") == "paginationBtn"){
			var totalPage = $("#list").attr("data-totalpage");
			$("#list").attr("data-atpage", id);
			obj.find("button").html(id+"/"+totalPage+'页<span class="caret"></span>');
			$("#list").attr("data-atpage", id);
		}else{
			
			if(obj.attr("id") != "propertyBtn"){
				obj.find("button").html(title+'<span class="caret"></span>');
			}
			$("#list").attr("data-atpage", 1);
		}
		getList();
	});

	//下拉菜单过长设置滚动条
	$(".dropdown-toggle").bind("click", function(){
		if($(this).parent().attr("id") != "typeBtn" && $(this).parent().attr("id") != "addrBtn"){
			var height = document.documentElement.clientHeight - $(this).offset().top - $(this).height() - 30;
			$(this).next(".dropdown-menu").css({"max-height": height, "overflow-y": "auto"});
		}
	});
	
	//全选、不选
	$("#selectBtn a").bind("click", function(){
		var id = $(this).attr("data-id");
		if(id == 1){
			$("#selectBtn .check").addClass("checked");
			$("#list tr").removeClass("selected").addClass("selected");
			
			defaultBtn.css('display', 'inline-block');
			checkedBtn.hide();
		}else{
			$("#selectBtn .check").removeClass("checked");
			$("#list tr").removeClass("selected");
			
			defaultBtn.hide();
			checkedBtn.css('display', 'inline-block');
		}
	});
	
	//上传照片
	$("#addNew").bind("click", function(){
		var href = $(this).attr("href");
			
		try {
			event.preventDefault();
			parent.addPage("datingAlbumAdd"+userid, "dating", "上传照片", "dating/"+href);
		} catch(e) {}
	});
	
	//评论
	$("#list").delegate(".common", "click", function(event){
		var id = $(this).attr("data-id"),
			href = $(this).attr("href");
			
		try {
			event.preventDefault();
			parent.addPage("datingAlbumCommon"+id, "dating", "照片评论", "dating/"+href);
		} catch(e) {}
	});
	
	//编辑
	$("#list").delegate(".note", "click", function(event){
		var id = $(this).attr("data-id"), content = $(this).parent().siblings(".content");
		if(id){
			$.dialog({
				id: "picNote",
				fixed: false,
				title: "修改照片描述",
				content: '<div class="content"><textarea class="input-xlarge" style="width:430px;" rows="5" name="content" id="content" placeholder="请输入图片描述">'+content.html()+'</textarea></div>',
				width: 450,
				okVal: "确定",
				ok: function(){
					
					huoniao.showTip("loading", "请稍候...");
					var note = parent.$("#content").val();
					huoniao.operaJson("datingAlbum.php?dopost=editNote", "userid="+userid+"&id="+id+"&note="+note, function(data){
						huoniao.hideTip();
						if(data.state == 100){
							huoniao.showTip("success", data.info, "auto");
							content.html(note);
						}else{
							huoniao.showTip("error", data.info, "auto");
						}
					});
					
				},
				cancelVal: "关闭",
				cancel: true
			});
		}
	});
	
	//删除
	$("#delBtn").bind("click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});
	
	//单条删除
	$("#list").delegate(".delete", "click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});
	
	//移动
	$("#moveBtn").bind("click", function(){
		var checked = $("#list tbody tr.selected");
		if(checked.length < 1){
			huoniao.showTip("warning", "未选中任何信息！", "auto");
		}else{
			var id = [];
			for(var i = 0; i < checked.length; i++){
				id.push($("#list tbody tr.selected:eq("+i+")").attr("data-id"));
			}
			
			var selectHTML = [];
			$(".selectedTags").find("span").each(function(index, element) {
                var id = $(this).attr("data-id"), name = $(this).find("a").html();
				if(id && name){
					selectHTML.push('<option value="'+id+'">'+name+'</option>');
				}
            });
			
			if(selectHTML.length < 1){
				huoniao.showTip("warning", "暂无分类！", "auto");
				return false;
			}
			
			$.dialog({
				id: "picNote",
				fixed: false,
				title: "移动照片",
				content: '<div style="text-align:center"><select id="selectObj" class="input-large" style="margin:30px auto;"><option value="0">选择要移动到的分类</option>'+selectHTML.join("")+'</select></div>',
				width: 450,
				okVal: "确定",
				ok: function(){
					
					var mid = parent.$("#selectObj").val();
					if(mid != 0){
						huoniao.showTip("loading", "正在操作，请稍候...");
						huoniao.operaJson("datingAlbum.php?dopost=move", "userid="+userid+"&id="+id+"&mid="+mid, function(data){
							if(data.state == 100){
								huoniao.showTip("success", data.info, "auto");
								$("#selectBtn a:eq(1)").click();
								setTimeout(function() { 
									getList();
								}, 800);
							}else{
								huoniao.showTip("error", data.info, "auto");
							}
						});
						$("#selectBtn a:eq(1)").click();
					}else{
						alert('请选择要移动到的分类');
						return false;
					}
					
				},
				cancelVal: "关闭",
				cancel: true
			});			
			
		}
	});
	
	//批量审核
	$("#batchAudit a").bind("click", function(){
		init.updateState($(this).text());
	});
	
	//单选
	$("#list tbody").delegate("tr", "click", function(event){
		var isCheck = $(this), checkLength = $("#list tbody tr.selected").length;
		if(event.target.className.indexOf("check") > -1) {
			if(isCheck.hasClass("selected")){
				isCheck.removeClass("selected");
			}else{
				isCheck.addClass("selected");
			}
		}else if(event.target.className.indexOf("edit") > -1 || event.target.className.indexOf("revert") > -1 || event.target.className.indexOf("del") > -1) {
			$("#list tr").removeClass("selected");
			isCheck.addClass("selected");
		}else{
			if(checkLength > 1){
				$("#list tr").removeClass("selected");
				isCheck.addClass("selected");
			}else{
				if(isCheck.hasClass("selected")){
					isCheck.removeClass("selected");
				}else{
					$("#list tr").removeClass("selected");
					isCheck.addClass("selected");
				}
			}
		}
		
		init.funTrStyle();
	});
	
	//拖选功能
	$("#list tbody").selectable({
		distance: 3,
		cancel: '.check, a',
		start: function(){
			$("#smartMenu_state").remove();
		},
		stop: function() {
			init.funTrStyle();
		}
	});
	
	//审核状态更新
	$("#list").delegate(".more", "click", function(event){
		event.preventDefault();
		
		var t = $(this), top = t.offset().top - 5, left = t.offset().left + 15, obj = "smartMenu_state";
		if($("#"+obj).html() != undefined){
			$("#"+obj).remove();
		}
		
		t.parent().parent().removeClass("selected").addClass("selected");
			
		var htmlCreateStateMenu = function(){
			var htmlMenu = [];
			htmlMenu.push('<div id="'+obj+'" class="smart_menu_box">');
			htmlMenu.push('  <div class="smart_menu_body">');
			htmlMenu.push('    <ul class="smart_menu_ul">');
			htmlMenu.push('      <li class="smart_menu_li"><a href="javascript:" class="smart_menu_a">待审核</a></li>');
			htmlMenu.push('      <li class="smart_menu_li"><a href="javascript:" class="smart_menu_a">已审核</a></li>');
			htmlMenu.push('      <li class="smart_menu_li"><a href="javascript:" class="smart_menu_a">拒绝审核</a></li>');
			htmlMenu.push('    </ul>');
			htmlMenu.push('  </div>');
			htmlMenu.push('</div>');

			return htmlMenu.join("");
		}

		$("body").append(htmlCreateStateMenu());

		$("#"+obj).find("a").bind("click", function(event){
			event.preventDefault();
			init.updateState($(this).text());
		});

		$("#"+obj).css({
			top: top,
			left: left - $("#"+obj).width()/2
		}).show();
		
		return false;
	});
	
	$(document).click(function (e) {
		var s = e.target;
		if ($("#smartMenu_state").html() != undefined) {
			if (!jQuery.contains($("#smartMenu_state").get(0), s)) {
				if (jQuery.inArray(s, $(".smart_menu_body")) < 0) {
					$("#smartMenu_state").remove();
				}
			}
		}
	});

});

//获取列表
function getList(){
	huoniao.showTip("loading", "正在操作，请稍候...");
	$("#list table, #pageInfo").hide();
	$("#selectBtn a:eq(1)").click();
	$("#loading").html("加载中，请稍候...").show();
	var sType    = $("#sType").html(),
		state    = $("#stateBtn").attr("data-id") ? $("#stateBtn").attr("data-id") : "",
		pagestep = $("#pageBtn").attr("data-id") ? $("#pageBtn").attr("data-id") : "10",
		page     = $("#list").attr("data-atpage") ? $("#list").attr("data-atpage") : "1";
		
	var data = [];
		data.push("sType="+sType);
		data.push("state="+state);
		data.push("pagestep="+pagestep);
		data.push("page="+page);
	
	huoniao.operaJson("datingAlbum.php?dopost=getList&userid="+userid, data.join("&"), function(val){
		var obj = $("#list"), list = [], i = 0, datingAlbum = val.datingAlbum;
		obj.attr("data-totalpage", val.pageInfo.totalPage);
			
		$(".totalCount").html(val.pageInfo.totalCount);
		$(".totalGray").html(val.pageInfo.totalGray);
		$(".totalAudit").html(val.pageInfo.totalAudit);
		$(".totalRefuse").html(val.pageInfo.totalRefuse);

		if(val.state == "100"){
			//huoniao.showTip("success", "获取成功！", "auto");
			huoniao.hideTip();
			
			for(i; i < datingAlbum.length; i++){
				list.push('<tr data-id="'+datingAlbum[i].id+'">');
				list.push('  <td class="row3"><span class="check"></span></td>');
				list.push('  <td class="row10 left"><a href="'+cfg_attachment+datingAlbum[i].path+'" target="_blank"><img src="'+cfg_attachment+datingAlbum[i].path+'&type=small" class="litpic" /></a></td>');
				list.push('  <td class="row15 left">'+datingAlbum[i].zan+'</td>');
				list.push('  <td class="row25 left content">'+datingAlbum[i].note+'</td>');
				var state = "";
				switch (datingAlbum[i].state) {
					case "0":
						state = '<span class="gray">待审核</span>';
						break;
					case "1":
						state = '<span class="audit">已审核</span>';
						break;
					case "2":
						state = '<span class="refuse">审核拒绝</span>';
						break;
				}
				list.push('  <td class="row12 state">'+state+'<span class="more"><s></s></span></td>');
				list.push('  <td class="row15">'+datingAlbum[i].date+'</td>');
				list.push('  <td class="row20">');
				// list.push('<a data-id="'+datingAlbum[i].id+'" data-title="照片评论" href="datingAlbumCommon.php?aid='+datingAlbum[i].id+'" title="照片评论" class="link common">评论</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
				list.push('<a data-id="'+datingAlbum[i].id+'" data-title="修改描述" href="javascript:;" title="修改描述" class="link note">编辑</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
				list.push('<a href="javascript:;" title="删除" class="link delete">删除</a></td>');
				list.push('</tr>');
			}
			
			obj.find("tbody").html(list.join(""));
			$("#loading").hide();
			$("#list table").show();
			huoniao.showPageInfo();
		}else{
			
			obj.find("tbody").html("");
			huoniao.showTip("warning", val.info, "auto");
			$("#loading").html(val.info).show();
		}
	});
	
};