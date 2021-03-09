$(function(){

	var init = {
		//选中样式切换
		funTrStyle: function(){
			var trLength = $("#list tbody tr").length, checkLength = $("#list tbody tr.selected").length;
			if(trLength == checkLength){
				$("#selectBtn .check").removeClass("checked").addClass("checked");
			}else{
				$("#selectBtn .check").removeClass("checked");
			}
		}
	};

	var isOper = false;

	//拼接列表
	if(domainArr.length > 0){
		var list = [];
		for(var i = 0; i < domainArr.length; i++){
			list.push('<tr data-id="'+domainArr[i].aid+'" data-lid="'+domainArr[i].id+'" data-name="'+domainArr[i].name+'" data-type="'+domainArr[i].type+'" data-domain="'+domainArr[i].domain+'">');
			list.push('<td class="row3"><span class="check"></span></td>');
			list.push('<td class="row5">'+domainArr[i].aid+'</td>');
			list.push('<td class="row17 left"><strong>'+domainArr[i].name+'</strong><label style="display:inline-block; margin-left:10px;"><input type="checkbox" class="hot" value="1"'+(domainArr[i].hot == 1 ? ' checked' : '')+'>热门</label></td>');
			list.push('<td class="row10 left">'+getSelect(domainArr[i].type)+'</td>');
			list.push('<td class="row25 left">'+getInput(domainArr[i].type, domainArr[i].domain)+'</td>');

			var def = '设为默认城市';
			if(domainArr[i].default == 1){
				def = '<font color="#ff0000">取消默认城市</font>';
			}

			list.push('<td class="row40 left"><a href="javascript:;" class="link save">保存</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="link delete">删除</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="link business">商圈</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="link default">'+def+'</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="link advanced">高级设置</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="link status" data-status="'+domainArr[i].state+'">'+(domainArr[i].state == 1 ? '停用' : '<font color="#ff0000">启用</font>')+'</a></td>');
			list.push('</tr>');
		}
		$("#list tbody").html(list.join(""));
	}else{
		$("#list tbody td").html('请先开通城市！');
	}

	//类型切换改变域名规则
	$("#list").delegate("select", "change", function(){
		var t = $(this), par = t.closest("tr"), id = t.find("option:selected").val(), domain = par.attr("data-domain");
		par.find("td:eq(4)").html(getInput(id, domain));
	});

	//批量修改
	$(".operBtn a").bind("click", function(){
		var id = parseInt($(this).attr("data-id"));
		if(id < 3){
			$("#list").find("tr").each(function(){
				$(this).find("select option:eq("+(id)+")").attr("selected", true);
				$(this).find("select").change();
			});
		}else{
			//启用
			if(id == 3){

				var ids = [];
				$('#list').find('.selected').each(function(){
					ids.push($(this).attr('data-lid'));
				});

				if(ids.length > 0){
					$.dialog.confirm("确定要启用吗？", function(){
						huoniao.showTip("loading", "正在启用，请稍候...");
						huoniao.operaJson("siteCity.php?dopost=status&state=1", "id="+ids.join(','), function(data){
							if(data.state != 100){
								$.dialog.alert(data.info);
							}else{
			                    huoniao.showTip("success", "启用成功！");
								setTimeout(function(){
									location.reload();
								}, 1000);
							}
						});
					});
				}

			//停用
			}else if(id == 4){

				var ids = [];
				$('#list').find('.selected').each(function(){
					ids.push($(this).attr('data-lid'));
				});

				if(ids.length > 0){
					$.dialog.confirm("确定要停用吗？", function(){
						huoniao.showTip("loading", "正在停用，请稍候...");
						huoniao.operaJson("siteCity.php?dopost=status&state=0", "id="+ids.join(','), function(data){
							if(data.state != 100){
								$.dialog.alert(data.info);
							}else{
			                    huoniao.showTip("success", "停用成功！");
								setTimeout(function(){
									location.reload();
								}, 1000);
							}
						});
					});
				}

			//删除
			}else if(id == 5){

				var ids = [];
				$('#list').find('.selected').each(function(){
					ids.push($(this).attr('data-lid'));
				});

				if(ids.length > 0){
					$.dialog.confirm("确定要删除吗？", function(){
						huoniao.showTip("loading", "正在删除，请稍候...");
						huoniao.operaJson("siteCity.php?dopost=del", "id="+ids.join(','), function(data){
							if(data.state != 100){
								$.dialog.alert(data.info);
							}else{
			                    huoniao.showTip("success", "删除成功！");
								setTimeout(function(){
									huoniao.hideTip();
								}, 2000);
								$('#list').find('.selected').remove();
							}
						});
					});
				}

			}
		}

	});

	//全部保存
	$(".btn-success").bind("click", function(){
	    var t = $(this);
		$.dialog.confirm('确定要修改吗？', function(){

		    //重复区域
            if(t.attr('id') == 'save'){

                var state = $('input[name=state]:checked').val(),
                    title = $.trim($('#tit').val());
                if(state == '' || state == undefined || state == null){
                    $.dialog.alert('请选择状态');
                    return false;
                }
                huoniao.operaJson("siteConfig.php?action=sameAddr", "&addr_state="+state+"&token="+token, function(data){
                    $.get("siteClearCache.php?action=do");
                    huoniao.showTip("success", "保存成功", "auto");
                });


            }else {

                //保存
                $("#list").find("tr").each(function () {
                    $(this).find(".save").click();
                });
            }

		});
	});

	//全选、不选
	$("#selectBtn a").bind("click", function(){
		var id = $(this).attr("data-id");
		if(id == 1){
			$("#selectBtn .check").addClass("checked");
			$("#list tr").removeClass("selected").addClass("selected");
		}else{
			$("#selectBtn .check").removeClass("checked");
			$("#list tr").removeClass("selected");
		}
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
		}else if(event.target.className.indexOf("link") > -1) {
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

	//保存
	$("#list").delegate(".save", "click", function(){
		var t = $(this), par = t.closest("tr"), type = par.find("select option:selected").val(), domain = par.find("input[type=text]").val();
		var id = par.attr("data-id"), oType = par.attr("data-type"), oDomain = par.attr("data-domain");

		//判断是否有变化
		if(oType == type && oDomain == domain) return false;

		if(t.html() != "保存" && t.html() != "保存失败，点击重试！") return false;
		t.html("<img src='/static/images/loadgray.gif' style='width: auto; height: auto;' />");

		var data = [];
		data.push("id="+id);
		data.push("type="+type);
		data.push("domain="+domain);
		data.push("token="+token);

		huoniao.operaJson("siteCity.php?dopost=update", data.join("&"), function(data){
			if(data.state != 100){
				t.html("保存").removeClass().addClass("save refuse");
				$.dialog.alert(data.info);
				setTimeout(function(){
					t.html("保存").addClass("link save");
				}, 2000);
			}else{
                $.get("siteClearCache.php?action=do");
				par.attr("data-domain", domain);
				par.attr("data-type", type);
				t.html("<span class='text-success'>保存</span>").removeClass();
				setTimeout(function(){
					t.html("保存").addClass("link save");
				}, 2000);
			}
		});

	});

	//删除
	$("#list").delegate(".delete", "click", function(){
		var t = $(this), par = t.closest("tr"), id = par.attr("data-lid");

		if(t.html() != "删除") return false;

		$.dialog.confirm("确定要删除吗？", function(){
			t.html("<img src='/static/images/loadgray.gif' style='width: auto; height: auto;' />");
			huoniao.operaJson("siteCity.php?dopost=del", "id="+id, function(data){
				if(data.state != 100){
					t.html("删除").removeClass().addClass("save refuse");
					$.dialog.alert(data.info);
					setTimeout(function(){
						t.html("删除").addClass("link save");
					}, 2000);
				}else{
                    $.get("siteClearCache.php?action=do");
					par.remove();
				}
			});
		});
	});

	//启用/停用
	$("#list").delegate(".status", "click", function(){
		var t = $(this), par = t.closest("tr"), id = par.attr("data-lid"), status = parseInt(t.attr('data-status'));

		var tit = status == 0 ? '启用' : '停用';
		var state = status == 0 ? 1 : 0;

		$.dialog.confirm("确定要"+tit+"吗？", function(){
			huoniao.showTip("loading", "正在"+tit+"，请稍候...");
			huoniao.operaJson("siteCity.php?dopost=status&state="+state, "id="+id, function(data){
				if(data.state != 100){
					$.dialog.alert(data.info);
				}else{
					huoniao.showTip("success", tit+"成功！");
					setTimeout(function(){
						location.reload();
					}, 1000);
				}
			});
		});

	});

	//商圈
	$("#list").delegate(".business", "click", function(){
		var t = $(this), tr = t.closest("tr"), name = tr.data("name"), id = tr.data("id");
		parent.addPage("siteCityBusiness"+id, "siteConfig", name+"商圈", "siteConfig/siteCityBusiness.php?cid="+id);
	});

    //高级设置
    $("#list").delegate(".advanced", "click", function(){
        var t = $(this), tr = t.closest("tr"), name = tr.data("name"), id = tr.data("id");
        parent.addPage("siteCityAdvanced"+id, "siteConfig", name+"分站设置", "siteConfig/siteCityAdvanced.php?cid="+id);
    });


	//默认城市
	$(".list").delegate(".default", "click", function(){
		var t = $(this), id = t.closest("tr").attr("data-id"), type = 'set';
		if(t.text() == '取消默认城市'){
			type = 'clear';
		}
		huoniao.operaJson("siteCity.php?dopost=setDefaultCity", "&type="+type+"&cid="+id+"&token="+token, function(data){
            $.get("siteClearCache.php?action=do");
			location.reload();
		});

	});


	//开通城市
	$(".btn-primary").bind("click", function(){
		$.dialog({
			fixed: true,
			title: '开通分站城市',
			content: $("#addCity").html(),
			width: 570,
			init: function(){

				parent.$("#pBtn").change(function(){
					var id = $(this).val(), pinyin = $(this).find("option:selected").data("pinyin");
					if(id != 0 && id != ""){
						parent.$("#domain").val(pinyin);
						getCity(id);
					}else{
						parent.$("#cBtn").html('<option value="0">--城市--</option>');
						parent.$("#xBtn").html('<option value="0">--区县--</option>');
					}
				});

				parent.$("#cBtn").change(function(){
					var id = $(this).val(), pinyin = $(this).find("option:selected").data("pinyin");
					if(id != 0 && id != ""){
						parent.$("#domain").val(pinyin);
						getCounty(id);
					}else{
						parent.$("#xBtn").html('<option value="0">--区县--</option>');
					}
				});

				parent.$("#xBtn").change(function(){
					var id = $(this).val(), pinyin = $(this).find("option:selected").data("pinyin");
					if(id != 0 && id != ""){
						parent.$("#domain").val(pinyin);
					}else{
						parent.$("#xBtn").html('<option value="0">--区县--</option>');
					}
				});


				//开启、关闭交互
				parent.$("input[name=domaintype]").bind("click", function(){
					var t = $(this), input = parent.$("#domain");
					if(t.val() == 0){
						input.removeClass().addClass("input-large");
						input.prev(".add-on").html("http://");
						input.next(".add-on").hide();
					}else if(t.val() == 1){
						input.removeClass().addClass("input-mini");
						input.prev(".add-on").html("http://");
						input.next(".add-on").html("."+subdomain.replace('www.', '')).show();
					}else{
						input.removeClass().addClass("input-mini");
						input.prev(".add-on").html("http://"+subdomain+"/");
						input.next(".add-on").hide();
					}
				});

			},
			ok: function(){

				var cid = 0, xBtn = parent.$("#xBtn").val(), cBtn = parent.$("#cBtn").val(), pBtn = parent.$("#pBtn").val(),
						type = parent.$("input[name=domaintype]:checked").val(),
						domain = $.trim(parent.$("#domain").val());
				if(xBtn != "" && xBtn != 0){
					cid = xBtn;
				}else if(cBtn != "" && cBtn != 0){
					cid = cBtn;
				}else if(pBtn != "" && pBtn != 0){
					cid = pBtn;
				}

				if(cid == 0){
					alert("请选择要开通的城市！");
					return false;
				}

				if(domain == ""){
					alert("请输入要绑定的域名");
					return false;
				}

				var data = [],
				t = this;
				data.push("cid="+cid);
				data.push("type="+type);
				data.push("domain="+domain);

				huoniao.operaJson("siteCity.php?dopost=add", data.join("&"), function(data){
					if(data && data['state'] == 100){
                        $.get("siteClearCache.php?action=do");
						t.close();
						location.reload();
					}else{
						alert(data.info);
					}
				});
				return false;

			}
		});
	});

	//热门
	$("#list").delegate(".hot", "click", function(){
		var t = $(this), par = t.closest("tr"), id = par.attr("data-id"), state = t.is(":checked") ? 1 : 0;

		huoniao.operaJson("siteCity.php?dopost=hot", "id="+id+"&state="+state, function(data){
			if(data.state != 100){
				huoniao.showTip("error", data.info, "auto");
			}else{
                $.get("siteClearCache.php?action=do");
				huoniao.showTip("success", data.info, "auto");
			}
		});
	})


	function getCity(id){
		huoniao.operaJson("siteSubway.php?dopost=getCity", "id="+id, function(data){
			if(data){
				var li = [];
				for(var i = 0; i < data.length; i++){
					li.push('<option value="'+data[i].id+'" data-pinyin="'+data[i].pinyin+'">'+data[i].typename+'</option>');
				}
				parent.$("#cBtn").html('<option value="0">--城市--</option>'+li.join(""));
				parent.$("#xBtn").html('<option value="0">--区县--</option>');
			}else{
				parent.$("#cBtn").html('<option value="0">--城市--</option>');
				parent.$("#xBtn").html('<option value="0">--区县--</option>');
			}
		});
	}


	function getCounty(id){
		huoniao.operaJson("siteSubway.php?dopost=getCity", "id="+id, function(data){
			if(data){
				var li = [];
				for(var i = 0; i < data.length; i++){
					li.push('<option value="'+data[i].id+'" data-pinyin="'+data[i].pinyin+'">'+data[i].typename+'</option>');
					parent.$("#xBtn").html('<option value="0">--区县--</option>'+li.join(""));
				}
			}
		});
	}


	//域名类型
	function getSelect(id){
		var l = [];
		l.push('<select class="input-small">');
		l.push('<option value="0"'+(id == 0 ? 'selected' : "")+'>主域名</option>');
		l.push('<option value="1"'+(id == 1 ? 'selected' : "")+'>子域名</option>');
		l.push('<option value="2"'+(id == 2 ? 'selected' : "")+'>子目录</option>');
		l.push('</select>');
		return l.join("");
	}

	//域名配置表单
	function getInput(id, name){
		var i = [];
		i.push('<div class="input-prepend input-append" style="margin:0;">');

		//主域名
		if(id == 0){
			i.push('<span class="add-on">http://</span>');
			i.push('<input class="input-large" type="text" value="'+name+'">');

		//子域名
		}else if(id == 1){
			i.push('<span class="add-on">http://</span>');
			i.push('<input class="input-small" type="text" value="'+name+'">');
			i.push('<span class="add-on">.'+subdomain.replace('www.', '')+'</span>');

		//子目录
		}else if(id == 2){
			i.push('<span class="add-on">http://'+subdomain+'/</span>');
			i.push('<input class="input-small" type="text" value="'+name+'">');
		}
		return i.join("");
	}

});
