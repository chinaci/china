var ctype = "";
var keywords = '';
$(function () {

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	var init = {

		//选中样式切换
		funTrStyle: function(){
			var list = ctype == "money" ? "list" : "list_",
				selectBtn = ctype == "money" ? "selectBtn" : "selectBtn_";
			var trLength = $("#"+list+" tbody tr").length, checkLength = $("#"+list+" tbody tr.selected").length;
			if(trLength == checkLength){
				$("#"+selectBtn+" .check").removeClass("checked").addClass("checked");
			}else{
				$("#"+selectBtn+" .check").removeClass("checked");
			}
		}

		//删除
		,del: function(type){
			var list = ctype == "money" ? "list" : "list_",
				selectBtn = ctype == "money" ? "selectBtn" : "selectBtn_";
			var checked = $("#"+list+" tbody tr.selected");
			if(checked.length < 1 && type == ""){
				huoniao.showTip("warning", "未选中任何信息！", "auto");
			}else{
				huoniao.showTip("loading", "正在操作，请稍候...");
				var id = [];
				for(var i = 0; i < checked.length; i++){
					id.push($("#"+list+" tbody tr.selected:eq("+i+")").attr("data-id"));
				}

				var action = type == "all" ? "clear" : "";
				huoniao.operaJson("memberList.php?dopost=delAmount", "userid="+$("#id").val()+"&type="+ctype+"&action="+action+"&id="+id, function(data){
					huoniao.hideTip();
					if(data.state == 100){
						huoniao.showTip("success", "操作成功！", "auto");
						$("#"+selectBtn+" a:eq(1)").click();
						setTimeout(getList, 2000);
					}else if(data.state == 101){
						$.dialog.alert(data.info);
					}else{
						var info = [];
						for(var i = 0; i < $("#"+list+" tbody tr").length; i++){
							var tr = $("#"+list+" tbody tr:eq("+i+")");
							for(var k = 0; k < data.info.length; k++){
								if(data.info[k] == tr.attr("data-id")){
									info.push("▪ "+tr.find("td:eq(3)").text());
								}
							}
						}
						$.dialog.alert("<div class='errInfo'><strong>以下信息删除失败：</strong><br />" + info.join("<br />") + '</div>', function(){
							getList();
						});
					}
				});
				$("#"+selectBtn+" a:eq(1)").click();
			}
		}

		//重新上传时删除已上传的文件
		,delFile: function(b, d, c) {
			var g = {
				mod: "siteConfig",
				type: "delCard",
				picpath: b,
				randoms: Math.random()
			};
			$.ajax({
				type: "POST",
				cache: false,
				async: d,
				url: "/include/upload.inc.php",
				dataType: "json",
				data: $.param(g),
				success: function(a) {
					try {
						c(a)
					} catch(b) {}
				}
			})
		}
	};


	//会员等级
	$("#clevel li a").bind("click", function(){
		var t = $(this), id = t.data("id"), txt = t.text();
		$("#level").val(id);
		$("#clevel button").html(txt + '<span class="caret"></span>');
	});

	//手机号码区域
	$("#phoneArea").delegate("a", "click", function(){
		var id = $(this).attr("data-id"), title = $(this).text();
		$("#areaCode").val(id.replace("+", ""));
		$("#phoneArea button").html(id+'<span class="caret"></span>');
	});

	//头部导航切换
	$(".config-nav button").bind("click", function(){
		var index = $(this).index(), type = $(this).attr("data-type");
		if(!$(this).hasClass("active")){
			$(".item").hide();
			$(".item:eq("+index+")").fadeIn();
			if(index != 0){
				ctype = type;
				var oobj = "list";
				if(ctype == "point"){
					oobj = "list_";
				}
				if(ctype == "invite"){
					oobj = "list_1";
				}
				if($("#"+oobj).find("tbody").html() == ""){
					getList();
				}
			}
		}
	});


	var license = $("#licenseObj").val();
	if(license != ""){
		$("#licenseObj").siblings("iframe").hide();
		var media = '<img src="'+cfg_attachment+license+'" />';
		$("#licenseObj").siblings(".spic").find(".sholder").html(media);
		$("#licenseObj").siblings(".spic").find(".reupload").attr("style", "display:inline-block;");
		$("#licenseObj").siblings(".spic").show();
	}

	var idcardFront = $("#idcardFrontObj").val();
	if(idcardFront != ""){
		$("#idcardFrontObj").siblings("iframe").hide();
		var media = '<img src="'+cfg_attachment+idcardFront+'" />';
		$("#idcardFrontObj").siblings(".spic").find(".sholder").html(media);
		$("#idcardFrontObj").siblings(".spic").find(".reupload").attr("style", "display:inline-block;");
		$("#idcardFrontObj").siblings(".spic").show();
	}

	var idcardBack = $("#idcardBackObj").val();
	if(idcardBack != ""){
		$("#idcardBackObj").siblings("iframe").hide();
		var media = '<img src="'+cfg_attachment+idcardBack+'" />';
		$("#idcardBackObj").siblings(".spic").find(".sholder").html(media);
		$("#idcardBackObj").siblings(".spic").find(".reupload").attr("style", "display:inline-block;");
		$("#idcardBackObj").siblings(".spic").show();
	}

	//表单验证
	$("#editform").delegate("input,textarea", "focus", function(){
		var tip = $(this).siblings(".input-tips");
		if(tip.html() != undefined){
			tip.removeClass().addClass("input-tips input-focus").attr("style", "display:inline-block");
		}
	});

	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this);
		huoniao.regex(obj);
	});

	$("#editform").delegate("select", "change", function(){
		if($(this).parent().siblings(".input-tips").html() != undefined){
			if($(this).val() == 0){
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}
	});

	//出生日期
	$("#birthday").datetimepicker({format: 'yyyy-mm-dd', autoclose: true, minView: 2, language: 'ch'});
	$("#expired").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});

	$("input[name=mtype]").bind("click", function(){
		var val = $(this).val();
		if(val == 1){
			$("#companyobj").hide();
		}else{
			$("#companyobj").show();
		}
	})

	$("input[name=licenseState]").bind("click", function(){
		var val = $(this).val();
		if(val == 2){
			$(this).closest("dl").next("dl").show();
		}else{
			$(this).closest("dl").next("dl").hide();
		}
	})

	$("input[name=state], input[name=certifyState]").bind("click", function(){
		var val = $(this).val();
		if(val == 2){
			$(this).closest("dl").next("dl").show();
		}else{
			$(this).closest("dl").next("dl").hide();
		}
	})

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

	//全选、不选
	$("#selectBtn_ a").bind("click", function(){
		var id = $(this).attr("data-id");
		if(id == 1){
			$("#selectBtn_ .check").addClass("checked");
			$("#list_ tr").removeClass("selected").addClass("selected");
		}else{
			$("#selectBtn_ .check").removeClass("checked");
			$("#list_ tr").removeClass("selected");
		}
	});

	$("#list_ tbody").delegate("tr", "click", function(event){
		var isCheck = $(this), checkLength = $("#list_ tbody tr.selected").length;
		if(event.target.className.indexOf("check") > -1) {
			if(isCheck.hasClass("selected")){
				isCheck.removeClass("selected");
			}else{
				isCheck.addClass("selected");
			}
		}else{
			if(checkLength > 1){
				$("#list_ tr").removeClass("selected");
				isCheck.addClass("selected");
			}else{
				if(isCheck.hasClass("selected")){
					isCheck.removeClass("selected");
				}else{
					$("#list_ tr").removeClass("selected");
					isCheck.addClass("selected");
				}
			}
		}

		init.funTrStyle();
	});

    //删除文件
	$(".spic .reupload").bind("click", function(){
		var t = $(this), parent = t.parent(), input = parent.prev("input"), iframe = parent.next("iframe"), src = iframe.attr("src");
		init.delFile(input.val(), false, function(){
			input.val("");
			t.prev(".sholder").html('');
			parent.hide();
			iframe.attr("src", src).show();
		});
	});

	//设备查看全部
	$(".sourceSee").click(function(){
		var t = $(this);
		if(t.hasClass('disable')){
			$('.sourceclienthide').hide();
			t.removeClass('disable');
			t.html('查看全部');
		}else{
			$('.sourceclienthide').show();
			t.addClass('disable');
			t.html('收起');
		}
	});


	//余额、积分回车提交
	$("input[name='operaPoint'], input[name='operaPointInfo'], input[name='operaMoney'], input[name='operaMoneyInfo'], input[name='keywords']").keyup(function (e) {
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
				$(this).closest("dl").find(".btn").click();
			}
	});


	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		$('#addr').val($('#addrList .addrBtn').attr('data-id'));

		var t            = $(this),
			id           = $("#id").val(),
			token        = $("#token").val(),
			mtype        = $("input[name=mtype]:checked").val(),
			level        = $("#level"),
			expired      = $("#expired"),
			password     = $("#password"),
			discount     = $("#discount"),
			nickname     = $("#nickname"),
			email        = $("#email"),
			emailCheck   = $("#emailCheck").attr("checked") == "checked" ? 1 : 0,
			areaCode     = $("#areaCode"),
			phone        = $("#phone"),
			phoneCheck   = $("#phoneCheck").attr("checked") == "checked" ? 1 : 0,
			paypwd       = $("#paypwd"),
			qq           = $("#qq"),
			freeze       = $("#freeze"),
			litpic       = $("#litpic"),
			sex          = $("input[name=sex]:checked").val(),
			birthday     = $("#birthday"),
			company      = $("#company"),
			addr         = $("#addr"),
			address      = $("#address"),
			realname     = $("#realname"),
			idcard       = $("#idcard"),
			idcardFront  = $("#idcardFrontObj"),
			idcardBack   = $("#idcardBackObj"),
			certifyState = $("input[name=certifyState]:checked").val(),
			certifyInfo  = $("#certifyInfo"),
			license      = $("#licenseObj"),
			licenseState = $("input[name=licenseState]:checked").val(),
			licenseInfo  = $("#licenseInfo"),
			state        = $("input[name=state]:checked").val(),
			description  = $("#description"),
			stateinfo    = $("#stateinfo");

		//密码
		if(password.val() != ""){
			if(!huoniao.regex(password)){
				huoniao.goTop();
				return false;
			}
		};

		//打折卡号
		if(!huoniao.regex(discount)){
			// huoniao.goTop();
			// return false;
		};

		//真实姓名
		if(!huoniao.regex(nickname)){
			huoniao.goTop();
			return false;
		};

		//邮箱
		if(email.val() != "" && !huoniao.regex(email)){
			huoniao.goTop();
			return false;
		};

		//手机
		// if(phone.val() == ""){
		// 	huoniao.goTop();
		// 	return false;
		// };

		//QQ
		if(qq.val() != "" && !huoniao.regex(qq)){
			huoniao.goTop();
			return false;
		};

		//头像
		if(litpic.val() == ""){
			//$.dialog.alert("请上传头像！");
			//huoniao.goTop();
			//return false;
		};

		if(mtype == 2){
			//公司名称
			if(!huoniao.regex(company)){
				return false;
			}

			//所在区域
			if(addr.val() == 0){
				$.dialog.alert("请选择所在区域！");
				return false;
			}

			//详细地址
			if(address.val() == "" || !huoniao.regex(address)){
				$.dialog.alert("请输入公司详细地址！");
				return false;
			}
		};

		t.attr("disabled", true);

		var data = [];
		data.push("dopost=Edit");
		data.push("id="+id);
		data.push("token="+token);
		data.push("mtype="+mtype);
		data.push("level="+level.val());
		data.push("expired="+expired.val());
		data.push("password="+password.val());
		data.push("discount="+discount.val());
		data.push("nickname="+nickname.val());
		data.push("email="+email.val());
		data.push("emailCheck="+emailCheck);
		data.push("areaCode="+areaCode.val());
		data.push("phone="+phone.val());
		data.push("phoneCheck="+phoneCheck);
		data.push("paypwd="+paypwd.val());
		data.push("qq="+qq.val());
		data.push("freeze="+freeze.val());
		data.push("photo="+encodeURIComponent(litpic.val()));
		data.push("sex="+sex);
		data.push("birthday="+birthday.val());
		data.push("company="+company.val());
		data.push("addr="+addr.val());
		data.push("address="+address.val());
		data.push("realname="+realname.val());
		data.push("idcard="+idcard.val());
		data.push("idcardFront="+idcardFront.val());
		data.push("idcardBack="+idcardBack.val());
		data.push("certifyState="+certifyState);
		data.push("certifyInfo="+certifyInfo.val());
		data.push("license="+license.val());
		data.push("licenseState="+licenseState);
		data.push("licenseInfo="+licenseInfo.val());
		data.push("description="+description.val());
		data.push("state="+state);
		data.push("stateinfo="+stateinfo.val());
		data.push("submit="+encodeURI("提交"));

		$.ajax({
			type: "POST",
			url: "memberList.php",
			data: data.join("&"),
			dataType: "json",
			success: function(data){
				if(data.state == 100){
					$.dialog({
						fixed: true,
						title: "修改成功",
						icon: 'success.png',
						content: "修改成功",
						ok: function(){
							t.attr("disabled", false);
						},
						cancel: false
					});
				}else{
					$.dialog.alert(data.info);
					t.attr("disabled", false);
				};
			},
			error: function(msg){
				$.dialog.alert("网络错误，请刷新页面重试！");
				t.attr("disabled", false);
			}
		});
	});

	//帐户余额操作
	$("#operaMoney").bind("click", function(){
		var type = $("input[name=moneyOpera]:checked").val(),
			amount = $("input[name=operaMoney]").val(),
			operaMoneyInfo = $("input[name=operaMoneyInfo]").val();
		if(!/^[1-9]\d*$/.test(amount)){
			huoniao.showTip("error", "请输入正确的金额！", "auto");
		}
		if($.trim(operaMoneyInfo) == ""){
			huoniao.showTip("error", "请输入操作原因！", "auto");
		}
		var data = [];
		data.push("action=money");
		data.push("userid="+$("#id").val());
		data.push("type="+type);
		data.push("amount="+amount);
		data.push("info="+operaMoneyInfo);
		huoniao.showTip("loading", "正在操作，请稍候...");
		huoniao.operaJson("memberList.php?dopost=operaAmount", data.join("&"), function(val){
			if(val.state == "100"){
				huoniao.showTip("success", "操作成功！", "auto");
				$("input[name=operaMoney], input[name=operaMoneyInfo]").val("");
				$("#moneyObj").html(val.money.toFixed(2));
				$("#freezeObj").html(val.freeze.toFixed(2));
				$("#pointObj").html(val.point);
				setTimeout(function(){
					getList();
				}, 1000);
			}else{
				huoniao.showTip("error", val.info, "auto");
			}
		});
	});

	//帐户积分操作
	$("#operaPoint").bind("click", function(){
		var type = $("input[name=pointOpera]:checked").val(),
			amount = $("input[name=operaPoint]").val(),
			operaPointInfo = $("input[name=operaPointInfo]").val();
		if(!/^[1-9]\d*$/.test(amount)){
			huoniao.showTip("error", "请输入正确的金额！", "auto");
		}
		if($.trim(operaPointInfo) == ""){
			huoniao.showTip("error", "请输入操作原因！", "auto");
		}
		var data = [];
		data.push("action=point");
		data.push("userid="+$("#id").val());
		data.push("type="+type);
		data.push("amount="+amount);
		data.push("info="+operaPointInfo);
		huoniao.showTip("loading", "正在操作，请稍候...");
		huoniao.operaJson("memberList.php?dopost=operaAmount", data.join("&"), function(val){
			if(val.state == "100"){
				huoniao.showTip("success", "操作成功！", "auto");
				$("input[name=operaPoint], input[name=operaPointInfo]").val("");
				$("#moneyObj").html(val.money.toFixed(2));
				$("#pointObj").html(val.point);
				setTimeout(function(){
					getList();
				}, 2000);
			}else{
				huoniao.showTip("error", val.info, "auto");
			}
		});
	});

	//搜索推荐会员
	$("#operaSearch").bind("click", function(){
		keywords = $.trim($('input[name="keywords"]').val());
		getList();
	});

	//删除
	$("#delMoney, #delPoint").bind("click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});

	$("#ClearMoney, #ClearPoint").bind("click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del("all");
		});
	});

	//单条删除
	$("#list, #list_").delegate(".del", "click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});

});


//获取列表
function getList(){
	huoniao.showTip("loading", "正在操作，请稍候...");
	var list = ctype == "money" ? "list" : (ctype == "point" ? "list_" : "list_1"),
		pageInfo = ctype == "money" ? "pageInfo" : (ctype == "point" ? "pageInfo_" : "pageInfo_1"),
		selectBtn = ctype == "money" ? "selectBtn" : (ctype == "point" ? "selectBtn_" : "selectBtn_1"),
		loading = ctype == "money" ? "loading" : (ctype == "point" ? "loading_" : "loading_1"),
		pageBtn = ctype == "money" ? "pageBtn" : (ctype == "point" ? "pageBtn_" : "pageBtn_1");

	$("#"+list+" table, #"+pageInfo).hide();
	$("#"+selectBtn+" a:eq(1)").click();
	$("#"+loading).html("加载中，请稍候...").show();

	var page = $("#"+list).attr("data-atpage") ? $("#"+list).attr("data-atpage") : "1";

	var data = [];
		data.push("type="+ctype);
		data.push("userid="+$("#id").val());
		data.push("pagestep=20");
		data.push("keywords=" + keywords);
		data.push("page="+page);

	huoniao.operaJson("memberList.php?dopost=amountList", data.join("&"), function(val){
		var obj = $("#"+list), listArr = [], i = 0, memberList = val.memberList;
		obj.attr("data-totalpage", val.pageInfo.totalPage);

		if(ctype == 'invite'){
			$('#totalInvite').html('共'+val.pageInfo.totalCount+'人，奖金' + val.pageInfo.totalMoney + '元');
		}

		if(val.state == "100"){
			huoniao.hideTip();

			for(i; i < memberList.length; i++){
				listArr.push('<tr data-id="'+memberList[i].id+'">');

				if(ctype != 'invite'){
					listArr.push('  <td class="row3"><span class="check"></span></td>');
					var type = '<span class="text-success">收入</span>';
					if(memberList[i].type == 0){
						type = '<span class="text-error">支出</span>';
					}
					listArr.push('  <td class="row15 left">'+type+'</td>');
					listArr.push('  <td class="row15 left">'+memberList[i].amount+'</td>');
					listArr.push('  <td class="row40 left">'+memberList[i].info+'</td>');
					listArr.push('  <td class="row20 left">'+memberList[i].date+'</td>');
					listArr.push('  <td class="row7"><a href="javascript:;" class="del" title="删除记录">删除</a></td>');
					listArr.push('</tr>');
				}else{
					listArr.push('  <td class="row3">&nbsp;</td>');
					listArr.push('  <td class="row20 left">'+memberList[i].nickname+'</td>');
					listArr.push('  <td class="row17 left">'+memberList[i].phone+'</td>');
					listArr.push('  <td class="row20 left">'+memberList[i].regtime+'</td>');
					listArr.push('  <td class="row40 left">'+memberList[i].money+'</td>');
					listArr.push('</tr>');
				}

			}

			obj.find("tbody").html(listArr.join(""));
			$("#"+loading).hide();
			$("#"+list+" table").show();
			huoniao.showPageInfo(list, pageInfo);
		}else{
			huoniao.showPageInfo(list, pageInfo);

			obj.find("tbody").html("");
			huoniao.showTip("warning", val.info, "auto");
			$("#"+loading).html(val.info).show();
		}
	});

};

//上传成功接收
function uploadSuccess(obj, file, filetype){
	$("#"+obj).val(file);
	var media = '<img src="'+cfg_attachment+file+'" />';
	$("#"+obj).siblings(".spic").find(".sholder").html(media);
	$("#"+obj).siblings(".spic").find(".reupload").attr("style", "display: inline-block");
	$("#"+obj).siblings(".spic").show();
	$("#"+obj).siblings("iframe").hide();
}
