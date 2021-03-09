//实例化编辑器
/*var ue = UE.getEditor('body1');
var mue = UE.getEditor('mbody', {"term": "mobile"});*/
var aue = [], navLength = $('.cusNavCon dl').length, navIndex = navLength + 1;

var uploadCustom = {
	//旋转图集文件
	rotateAtlasPic: function(mod, direction, img, c) {
		var g = {
			mod: mod,
			type: "rotateAtlas",
			direction: direction,
			picpath: img,
			randoms: Math.random()
		};
		$.ajax({
			type: "POST",
			cache: false,
			async: false,
			url: "/include/upload.inc.php",
			dataType: "json",
			data: $.param(g),
			success: function(a) {
				try {
					c(a)
				} catch(b) {}
			}
		});
	}
}

function ueNews(index){
	if(index == 0){
		for(var i = 1; i < navLength; i++){
			var ue = UE.getEditor('body'+i);
			var mue = UE.getEditor('mbody'+i, {"term": "mobile"});
			aue.push({ue: ue,mue: mue});
		}
	}else{
		var ue = UE.getEditor('body'+index);
		var mue = UE.getEditor('mbody'+index, {"term": "mobile"});
		aue.push({ue: ue,mue: mue});
	}
}

ueNews(0);

var customerNav = '<dl class="clearfix"> <dt><label><span class="text-info folding">折叠</span> 导航&no：</label></dt> <dd> <div class="custombox"> <p class="typename"> <input class="input-large custonav" type="text" placeholder="导航名称"> <label><input type="checkbox" checked="checked" class="isshow" value="1" />启用</label> <label><input class="input-mini px" type="number" value="&px" />排序</label> <input type="button" class="btn btn-small btn-info del" value="删除" /> </p> <div class="typebody"> <ul class="nav nav-tabs" style="margin-bottom:5px;"> <li class="active"><a href="#pc&index">电脑端</a></li> <li><a href="#mobile&index">移动端</a></li> </ul> <div id="pc&index"> <script id="body&index" name="body[]" type="text/plain" style="width:85%;height:300px"></script> </div> <div id="mobile&index" class="hide"> <script id="mbody&index" name="mbody[]" type="text/plain" style="width:960px;height:300px"></script> </div> </div> </div> </dd> </dl>';

//头部导航切换
$(".config-nav button").bind("click", function(){
	var index = $(this).index(), type = $(this).attr("data-type");
	if(!$(this).hasClass("active")){
		$(".item").hide();
		$(".item:eq("+index+")").fadeIn();
	}
});

$(function () {

	huoniao.parentHideTip();

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	var treeLevel = 1;
	var init = {
		//树形递归分类
		treeTypeList: function(type){
			var typeList = [], cl = "", level = 0;
			if(type == "addr"){
				var l=addrListArr;
				typeList.push('<option value="">选择地区</option>');
			}else{
				var l=typeListArr;
				typeList.push('<option value="">选择分类</option>');
			}
			for(var i = 0; i < l.length; i++){
				(function(){
					var jsonArray =arguments[0], jArray = jsonArray.lower, selected = "";
					if((type == "type" && typeid == jsonArray["id"]) || (type == "addr" && addr == jsonArray["id"])){
						selected = " selected";
					}
					if(jsonArray['lower'] != "" && type == "type"){
						typeList.push('<optgroup label="'+cl+"|--"+jsonArray["typename"]+'"></optgroup>');
					}else{
						typeList.push('<option value="'+jsonArray["id"]+'"'+selected+'>'+cl+"|--"+jsonArray["typename"]+'</option>');
					}
					if(type == "addr" && level >= treeLevel){
						cl = "";
						level = 0;
						return;
					}
					for(var k = 0; k < jArray.length; k++){
						cl += '    ';
						var selected = "";
						if((type == "type" && typeid == jArray[k]["id"]) || (type == "addr" && addr == jArray[k]["id"])){
							selected = " selected";
						}
						if(jArray[k]['lower'] != ""){
							level++;
							arguments.callee(jArray[k]);
						}else{
							level = 0;
							typeList.push('<option value="'+jArray[k]["id"]+'"'+selected+'>'+cl+"|--"+jArray[k]["typename"]+'</option>');
						}
						if(jsonArray["lower"] == null){
							cl = "";
							level = 0;
						}else{
							cl = cl.replace("    ", "");
						}
					}
				})(l[i]);
			}
			return typeList.join("");
		}

		//重新上传时删除已上传的文件
		,delFile: function(b, d, c) {
			var g = {
				mod: "siteConfig",
				type: "delThumb",
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

	// 修改配色
	$('#peise').change(function(){
		var t = $(this).val();
		$('#peiseshow').removeClass().addClass('type_'+t);
	})

	//发布时间
	$("#valid").datetimepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: 'ch',
		todayBtn: true,
		minView: 2
	});

	//标注地图
	$("#mark").bind("click", function(){
		$.dialog({
			id: "markDitu",
			title: "标注地图位置<small>（请点击/拖动图标到正确的位置，再点击底部确定按钮。）</small>",
			content: 'url:'+adminPath+'../api/map/mark.php?mod=huangye&lnglat='+$("#lnglat").val()+"&city="+mapCity+"&addr="+$("#addr").val(),
			width: 800,
			height: 500,
			max: true,
			ok: function(){
				var doc = $(window.parent.frames["markDitu"].document),
					lng = doc.find("#lng").val(),
					lat = doc.find("#lat").val(),
					addr = doc.find("#addr").val();
				$("#lnglat").val(lng+","+lat);
				if($("#addr").val() == ""){
					$("#addr").val(addr);
				}
				huoniao.regex($("#addr"));
			},
			cancel: true
		});
	});


	var cusnavList = $('.cusNavList');
	// 增加导航
	$('#addNav').click(function(){
		navLength++;
		// var len = cusnavList.children('dl').length + 1;
		var no = cusnavList.children('dl').length + 1;
		var px = [];
		$('.cusNavList .px').each(function(){
			px.push(parseInt($(this).val()));
		})
		px = px.sort(sortNumber);
		var newpx = 0, len = px.length, min = px[0], max = px[len-1];
		if(min > 1){
			newpx = 1;
		}else{
			for(var i = (min+1); i < max; i++){
				if(!px.in_array(i)){
					newpx = i;
					break;
				}
			}
		}
		newpx = newpx == 0 ? (max+1) : newpx;

		cusnavList.append(customerNav.replace(/&index/g,navLength).replace('&no', no).replace('&px', newpx));
		ueNews(navLength);
	})
	// 删除导航
	$('.cusNavList').delegate('.del', 'click', function (e) {
		var t = $(this), dl = t.closest('dl'), index = dl.index();
		if(confirm('确定要删除此导航吗？')){
			dl.slideDown(1,function(){
				dl.remove();
			})

			aue[index].ue.destroy();
			aue[index].mue.destroy();
			aue.splice(index,1);
			navSetIndex();
		}
	})
	// 全部折叠
	$('#allfolding').click(function(){
		var t = $(this), s = t.val(), o = $('.cusNavList .typebody'), b = $('.cusNavList .folding');
		if(s == '全部折叠'){
			o.slideUp(100);
			t.val('全部展开');
			b.text('展开');
		}else{
			o.slideDown();
			t.val('全部折叠');
			b.text('折叠');
		}
	})

	//平台切换
	$('.cusNavList').delegate('.nav-tabs a', 'click', function (e) {
		e.preventDefault();
		var t = $(this), obj = $(this).attr("href").replace("#", "");
		if(!t.parent().hasClass("active")){
			t.parent('li').addClass("active").siblings().removeClass("active");

			t.closest('.typebody').find(">div").hide();
			cfg_term = obj;
			$("#"+obj).show();
		}
	})

	//填充栏目分类
	$("#typeid").html(init.treeTypeList("type"));

	//填充地区
	$("#addr").html(init.treeTypeList("addr"));

	//表单验证
	$("#editform").delegate("input,textarea", "focus", function(){
		var tip = $(this).siblings(".input-tips");
		if(tip.html() != undefined){
			tip.removeClass().addClass("input-tips input-focus").attr("style", "display:inline-block");
		}
	});

	$("#editform").delegate("input[type='radio'], input[type='checkbox']", "click", function(){
		if($(this).attr("data-required") == "true"){
			var name = $(this).attr("name"), val = $("input[name='"+name+"']:checked").val();
			if(val == undefined){
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}
	});

	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this), tip = obj.siblings(".input-tips");
		if(obj.attr("data-required") == "true"){
			if($(this).val() == ""){
				tip.removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				tip.removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}else{
			huoniao.regex(obj);
		}
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

	$(".color_pick").colorPicker({
		callback: function(color) {
			var color = color.length === 7 ? color : '';
			$("#color").val(color);
			$(this).find("em").css({"background": color});
		}
	});

	var weixinQr = $("#weixinQrObj").val();
	if(weixinQr != ""){
		$("#weixinQrObj").siblings("iframe").hide();
		var media = '<img src="'+cfg_attachment+weixinQr+'" />';
		$("#weixinQrObj").siblings(".spic").find(".sholder").html(media);
		$("#weixinQrObj").siblings(".spic").find(".reupload").attr("style", "display:inline-block;");
		$("#weixinQrObj").siblings(".spic").show();
	}

	//跳转表单交互
	$("input[name='flags[]']").bind("click", function(){
		if($(this).val() == "t"){
			if(!$(this).is(":checked")){
				$("#rDiv").hide();
			}else{
				$("#rDiv").show();
			}
		}
	});

	// 折叠导航
	$('.cusNavCon').delegate('.folding','click',function(){
		var t = $(this), s = t.text(), o = t.closest('dl').find('.typebody');
		if(s == '折叠'){
			o.slideUp(100);
			t.text('展开');
		}else{
			o.slideDown(100);
			t.text('折叠');
		}
	})

	function changePame(index){
		$('.config-nav .btn:eq('+index+')').click();
	}

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

	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
        $('#addr').val($('.addrBtn').attr('data-id'));
        var addrids = $('.addrBtn').attr('data-ids').split(' ');
        $('#cityid').val(addrids[0]);
		var t            = $(this),
			id           = $("#id").val(),
			typeid       = $("#typeid").val(),
			addr         = $("#addr").val(),
			title        = $("#title"),
			lnglat       = $("#lnglat").val(),
			weight       = $("#weight"),
			tj           = true;


		//分类
		if(typeid == "" || typeid == "0"){
			$("#typeList").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			tj = false;
			changePame(0);
			huoniao.goTop();
			return false;
		}else{
			$("#typeList").siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
		}

		//标题
		if(!huoniao.regex(title)){
			tj = false;
			changePame(0);
			huoniao.goTop();
			return false;
		};

		//排序
		if(!huoniao.regex(weight)){
			tj = false;
			changePame(0);
			huoniao.goTop();
			return false;
		}

		//地区
		if(addr == "" || addr == "0"){
			$("#addrList").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			tj = false;
			changePame(0);
			huoniao.goTop();
			return false;
		}else{
			$("#addrList").siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
		}

		if(lnglat == ""){
			$.dialog.alert("请标注联系地址坐标！");
			return false;
		}

		if($("#tel").val() == ""){
			changePame(0);
			$.dialog.alert("请输入联系电话！");
			return false;
		}

		var haveBody = false, detail = '';
		$('.cusNavList dl').each(function(i){
			aue[i].ue.sync();
			aue[i].mue.sync();
			var t = $(this), nav = t.find('.custonav'), body = aue[i].ue.getContent(), mbody = aue[i].mue.getContent(), show = 0, weight = 0;
			if(nav.val() != '' || body != ''){
				if(body == ''){
					tj = false;
					changePame(1);
					$.dialog.alert('请填写导航'+(i+1)+'的详细内容');
					return false;
				}
				else if(nav.val() == ''){
					tj = false;
					changePame(1);
					nav.focus();
					$.dialog.alert('请填写导航'+(i+1)+'的名称');
					return false;
				}
				if(t.find('.isshow').is(":checked")){
					haveBody = true;
					show = 1;
				}
				weight = t.find('.px').val();
				weight = weight < 0 ? 0 : weight;
				detail += 'nav::::::'+encodeURIComponent(nav.val())+',,,,,,show::::::'+show+',,,,,,weight::::::'+weight+',,,,,,body::::::'+encodeURIComponent(body)+',,,,,,mbody::::::'+encodeURIComponent(mbody)+';;;;;;';
			}
		})

		detail = detail.substr(0,detail.length-6);
		$('textarea[name="body[]"], textarea[name="mbody[]"]').remove();

		if(tj){
			t.attr("disabled", true).html("提交中...");
			$.ajax({
				type: "POST",
				url: "huangyeAdd.php?action="+action,
				data: $(this).parents("form").serialize() + "&detail=" + detail + "&submit=" + encodeURI("提交"),
				dataType: "json",
				success: function(data){
					if(data.state == 100){
						if($("#dopost").val() == "save"){

							huoniao.parentTip("success", "信息发布成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
							huoniao.goTop();
							location.href = "huangyeAdd.php?typeid="+$("#typeid").val();

						}else{

							huoniao.parentTip("success", "信息修改成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
							t.attr("disabled", false).html("确认提交");

						}
					}else{
						$.dialog.alert(data.info);
						t.attr("disabled", false).html("确认提交");
					};
				},
				error: function(msg){
					$.dialog.alert("网络错误，请刷新页面重试！");
					t.attr("disabled", false).html("确认提交");
				}
			});
		}
	});

	//模糊匹配会员
	$("#user").bind("input", function(){
		$("#userid").val("0");
		$("#userPhone").html("").hide();
		var t = $(this), val = t.val();
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("../inc/json.php?action=checkUser", "key="+val, function(data){
				t.removeClass("input-loading");
				if(!data) {
					$("#userList, #userPhone").html("").hide();
					return false;
				}
				var list = [];
				for(var i = 0; i < data.length; i++){
					list.push('<li data-id="'+data[i].id+'" data-phone="'+data[i].phone+'">'+data[i].username+'</li>');
				}
				if(list.length > 0){
					var pos = t.position();
					$("#userList")
						.css({"left": pos.left, "top": pos.top + 36, "width": t.width() + 12})
						.html('<ul>'+list.join("")+'</ul>')
						.show();
				}else{
					$("#userList, #userPhone").html("").hide();
				}
			});

		}else{
			$("#userList, #userPhone").html("").hide();
		}
    });

    $("#userList").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id"), phone = $(this).attr("data-phone");
		$("#user").val(name);
		$("#userid").val(id);
		$("#userList").html("").hide();
		$("#tel").val(phone);
		$("#user").siblings(".input-tips").removeClass().addClass("input-tips input-ok");
		return false;
	});

	$(document).click(function (e) {
        var s = e.target;
        if (!jQuery.contains($("#userList").get(0), s)) {
            if (jQuery.inArray(s.id, "user") < 0) {
                $("#userList").hide();
            }
        }
    });

	$("#user").bind("blur", function(){
		var t = $(this), val = t.val(), flag = false;
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("../inc/json.php?action=checkUser", "key="+val, function(data){
				t.removeClass("input-loading");
				if(data) {
					for(var i = 0; i < data.length; i++){
						if(data[i].username == val){
							flag = true;
							$("#userid").val(data[i].id);
							if($('#person').val() == ''){
								$("#person").val(data[i].username);
							}
							if($('#tel').val() == ''){
								$("#tel").val(data[i].phone);
							}
							if($('#email').val() == ''){
								$("#email").val(data[i].email);
							}
							break;
						}
					}
				}
				if(flag){
					t.siblings(".input-tips").removeClass().addClass("input-tips input-ok");
				}else{
					t.siblings(".input-tips").removeClass().addClass("input-tips input-error");
				}
			});
		}else{
			t.siblings(".input-tips").removeClass().addClass("input-tips input-error");
		}
	});

	function navSetIndex(){
		$('.cusNavList dl').each(function(i){
			var dt = $(this).find('dt'), html = dt.html();
			dt.html(html.replace(/\d+/g,++i));
		})
	}


});

Array.prototype.in_array = function(e){
	for(i=0;i<this.length && this[i]!=e;i++);
	return !(i==this.length);
}
function sortNumber(a, b){
	return a - b;
}

$('head').append('<style>.editform textarea[name="body[]"], .editform textarea[name="mbody[]"] {display:none;}</style>')


//上传成功接收
function uploadSuccess(obj, file, filetype){
	$("#"+obj).val(file);
	var media = '<img src="'+cfg_attachment+file+'" />';
	$("#"+obj).siblings(".spic").find(".sholder").html(media);
	$("#"+obj).siblings(".spic").find(".reupload").attr("style", "display: inline-block");
	$("#"+obj).siblings(".spic").show();
	$("#"+obj).siblings("iframe").hide();
}
