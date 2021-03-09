$(function(){

	var init = {

		//卸载
		del: function(id){
			huoniao.showTip("loading", "正在操作，请稍候...");
			huoniao.operaJson("plugins.php?dopost=del", "id="+id, function(data){
				if(data.state == 100){
					getList();
				}else{
					huoniao.showTip("error", "卸载失败！", "auto");
				}
			});
		}

	};

	//初始加载
	getList();

	//搜索
	$("#searchBtn").bind("click", function(){
		$("#sKeyword").html($("#keyword").val());
		$("#list").attr("data-atpage", 1);
		getList();
	});

	//搜索回车提交
  $("#keyword").keyup(function (e) {
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
      $("#searchBtn").click();
    }
  });

	$("#pageBtn, #paginationBtn").delegate("a", "click", function(){
		var id = $(this).attr("data-id"), title = $(this).html(), obj = $(this).parent().parent().parent();
		obj.attr("data-id", id);
		if(obj.attr("id") == "paginationBtn"){
			var totalPage = $("#list").attr("data-totalpage");
			$("#list").attr("data-atpage", id);
			obj.find("button").html(id+"/"+totalPage+'页<span class="caret"></span>');
			$("#list").attr("data-atpage", id);
		}else{
			obj.find("button").html(title+'<span class="caret"></span>');
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

	//获取更多插件
	$("#installNew").bind("click", function(){
		try {
			event.preventDefault();
			parent.addPage("store", "store", "商店", "siteConfig/store.php");
		} catch(e) {}
	});

	//更新状态
	$("#list").delegate(".state a", "click", function(){
		var t = $(this), id = t.closest("tr").attr("data-id"), val = t.hasClass("audit") ? 0 : 1;

		huoniao.operaJson("plugins.php?dopost=updateState", "id="+id+"&val="+val, function(data){
			if(data.state == 100){
				getList();
			}else{
				huoniao.showTip("error", data.info, "auto");
			}
		});
	});

	//单条删除
	$("#list").delegate(".delete", "click", function(){
		var t = $(this), id = t.closest("tr").attr("data-id");
		$.dialog.confirm('此操作不可恢复，您确定要卸载吗？', function(){
			init.del(id);
		});
	});

	//进入插件
	$("#list").delegate(".goin", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title"),
			href = $(this).attr("href");

		try {
			event.preventDefault();
			parent.addPage("plugins"+id, "plugins", title, href);
		} catch(e) {}
	});

});

//获取列表
function getList(){
	huoniao.showTip("loading", "正在操作，请稍候...");
	$("#list table, #pageInfo").hide();
	$("#selectBtn a:eq(1)").click();
	$("#loading").html("加载中，请稍候...").show();
	var sKeyword = encodeURIComponent($("#sKeyword").html()),
		pagestep = $("#pageBtn").attr("data-id") ? $("#pageBtn").attr("data-id") : "10",
		page     = $("#list").attr("data-atpage") ? $("#list").attr("data-atpage") : "1";

	var data = [];
		data.push("sKeyword="+sKeyword);
		data.push("pagestep="+pagestep);
		data.push("page="+page);

	huoniao.operaJson("plugins.php?dopost=getList", data.join("&"), function(val){
		var obj = $("#list"), list = [], i = 0, data = val.list;
		obj.attr("data-totalpage", val.pageInfo.totalPage);

		$("#totalCount").html("共 "+val.pageInfo.totalCount+" 条记录");
		$(".totalCount").html(val.pageInfo.totalCount);

		if(val.state == "100"){
			//huoniao.showTip("success", "获取成功！", "auto");
			huoniao.hideTip();

			for(i; i < data.length; i++){
				list.push('<tr data-id="'+data[i].id+'">');
				list.push('  <td class="row20 left">&nbsp;&nbsp;&nbsp;<a data-id="'+data[i].id+'" data-title="'+data[i].title+'" href="../../include/plugins/'+data[i].pid+'/index.php" title="进入插件" class="link goin">'+data[i].title+'</a></td>');
				list.push('  <td class="row5">'+data[i].version+'</td>');
				list.push('  <td class="row15">'+(data[i].update > 0 ? huoniao.transTimes(data[i].update, 2) : '')+'</td>');
				list.push('  <td class="row10">'+data[i].author+'</td>');
				list.push('  <td class="row15">'+huoniao.transTimes(data[i].pubdate, 2)+'</td>');
				var state = "";
				switch (data[i].state) {
					case "1":
						state = '<a href="javascript:;" class="audit">已启用</a>';
						break;
					case "0":
						state = '<a href="javascript:;" class="refuse">未启用</a>';
						break;
				}
				list.push('  <td class="row15 state">'+state+'</td>');
				list.push('  <td class="row20 left">');
				list.push('<a data-id="'+data[i].id+'" data-title="'+data[i].title+'" href="../../include/plugins/'+data[i].pid+'/index.php" title="进入插件" class="link goin">进入插件</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
				// list.push('<a data-id="'+data[i].id+'" data-title="'+data[i].title+'" href="store.php?action=updatePlugins&id='+data[i].pid+'" title="更新" class="link update">更新</a>&nbsp;&nbsp;|&nbsp;&nbsp;');
				list.push('<a href="javascript:;" title="卸载" class="link delete">卸载</a></td>');
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
