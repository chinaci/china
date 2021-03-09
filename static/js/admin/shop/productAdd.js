//实例化编辑器
var ue = UE.getEditor('body');
var mue = UE.getEditor('mbody', {"term": "mobile"});

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

$(function(){

	huoniao.parentHideTip();

	//库存计数提示
	$('.inventoryTips').tooltip();

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	$(".chosen-select").chosen();

	//平台切换
	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		var obj = $(this).attr("href").replace("#", "");
		if(!$(this).parent().hasClass("active")){
			$(".nav-tabs li").removeClass("active");
			$(this).parent().addClass("active");

			$(".nav-tabs").parent().find(">div").hide();
			cfg_term = obj;
			$("#"+obj).show();
		}
	})

	//重新选择分类
	$("#editType").bind("click", function(event){
		event.preventDefault();
		var href = $(this).attr("href"), id = $("#id").val();
		if(id == ""){
			$("body",parent.document).find('#body-productAddphp').attr("src", "shop/"+href);
		}else{
			$("body",parent.document).find('#body-productEdit'+id).attr("src", "shop/"+href);
		}
	});

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

	var inputObj = "";
	//商品属性选择或输入：点击
	$("#proItem").delegate("input[type=text]", "click", function(){
		$(".popup_key").hide();
		var itemList = $(this).siblings(".popup_key");
		inputObj = $(this).attr("id");
		if(itemList.html() != undefined){
			itemList
				.css({"width": $(this).width() + 12})
				.show();;
		}
		return false;
	});

	//商品属性选择或输入：输入
	$("#proItem").delegate("input[type=text]", "input", function(){
		var itemList = $(this).siblings(".popup_key"), val = $(this).val(), sLength = 0;
		itemList.find("li").hide();
		itemList.hide();
		itemList.find("li").each(function(index, element) {
			var txt = $(this).attr("title");
			if(txt.indexOf(val) > -1){
				sLength++;
				$(this).show();
			}
		});
		if(sLength > 0){
			itemList.show();
		}
	});

	//商品属性选择完成关闭浮动层
	$(".popup_key").delegate("li", "click", function(){
		var id = $(this).attr("data-id"), val = $(this).attr("title"), parent = $(this).parent().parent();
		if(id && val){
			parent.siblings("input[type=text]").val(val);
		}
		parent.siblings(".input-tips").removeClass().addClass("input-tips input-ok");
		parent.hide();
	});

	$(document).click(function (e) {
        var s = e.target;
		if(inputObj != ""){
			if (!jQuery.contains($("#"+inputObj).siblings(".popup_key").get(0), s)) {
				if (jQuery.inArray(s.id, inputObj) < 0) {
					$(".popup_key").hide();
					$("#"+inputObj).siblings(".popup_key").find("li").show();
				}
			}
		}
    });

	//选择所属店铺
	if($("#id").val() != ""){
		createStoreType($("#store").val());
	}
	$("#store").bind("change", function(){
		var id = $(this).val();
		if(id == 0){
			$("#category").html("");
			$("#categoryObj").hide();
		}else{
			createStoreType(id);
			createStoreLogisticTemplate(id);
		}
	});

	function createStoreType(id){
		huoniao.operaJson("productAdd.php?dopost=getStoreType", "id="+$("#id").val()+"&sid="+id, function(data){
			if(data != null && data.state == 100){
				$("#category").html(data.list);
				$("#categoryObj").show();
			}else{
				$("#category").html("");
				$("#categoryObj").hide();
			}
		});
	}

	function createStoreLogisticTemplate(id){
		huoniao.operaJson("logisticTemplate.php", "do=ajax&sid="+id, function(data){
			if(data != null && data.state == 100){

				var arr = [], list = data.list;
				arr.push('<option value="0">请选择运费模板</option>');
				for(var i = 0; i < list.length; i++){
					arr.push('<option value="'+list[i].id+'">'+list[i].title+'</option>');
				}
				$("#logistic").html(arr.join(""));
				$("#logisticDetail").hide();

			}else{
				$("#logistic").html('<option value="0">请选择运费模板</option>');
				$("#logisticDetail").hide();
			}
		});
	}

	//一口价输入完填充到规格表中未填写的价格框
	$("#mprice").bind("blur", function(){
		var price = $(this).val();
		if(price != ""){
			$("#speList").find("input").each(function(index, element) {
				var val = $(this).val(), type = $(this).attr("data-type");
				if(val == "" && type == "mprice"){
					$(this).val(price);
				}
			});
		}
	});

	//一口价输入完填充到规格表中未填写的价格框
	$("#price").bind("blur", function(){
		var price = $(this).val();
		if(price != ""){
			$("#speList").find("input").each(function(index, element) {
				var val = $(this).val(), type = $(this).attr("data-type");
				if(val == "" && type == "price"){
					$(this).val(price);
				}
			});
		}
	});

	//全选触发规格
	$("#editform").delegate(".checkAll", "click", function(){
		createSpecifi();
	});


	//获取运费模板详细
	function getLogisticDetail(id){
		$.ajax({
			type: "GET",
			url: "logisticTemplate.php?dopost=detail&sid="+$("#store").val()+"&id="+id,
			dataType: "html",
			success: function(a) {
				$("#logisticDetail small").html('<br />'+a);
				$("#logisticDetail").show();
			}
		});
	}

	var logistic = $("#logistic").val();
	if(logistic != 0){
		getLogisticDetail(logistic);
	}

	$("#logistic").change(function(){
		var id = $(this).val();
		if(id == 0){
			$("#logisticDetail small").html("");
			$("#logisticDetail").hide();
		}else{
			getLogisticDetail(id);
		}
	});

	//限时抢
	$("input[name='flag[]']").bind("click", function(){
		$("input[name='flag[]']").each(function(){
			if($(this).val() == 3 || $(this).val() == 4){
				if($(this).is(":checked")){
					if($(this).val() == 3){
						$("#panicbuy").show();
					}else if($(this).val() == 4){
						$("#secondkill").show();
					}
				}else{
					if($(this).val() == 3){
						$("#panicbuy").hide();
					}else if($(this).val() == 4){
						$("#secondkill").hide();
					}
				}
			}
		});
	});

	//选择时间
	$("#btime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});
	$("#etime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});
	$("#kstime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});
	$("#ketime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});



	//自定义规格名称同步
	$('#specification').delegate('.self_box .inp', 'input', function(){
		var t = $(this), val = t.val(), id = t.closest('dd').attr('data-id');
		t.siblings('input[type=checkbox]').val('custom_'+id+'_'+val).attr('title', val);
		createSpecifi()
	});

	// 新增自定义值
	var pii = 1;
	$("#specification").delegate(".sure_add","click",function(){
		var t = $(this),dd = t.closest('dd');
		var par = t.parents('.self_add');
		var selfadd = par.siblings(".self_box");
		var inp = par.find("input[type=text]");
		var imgsrc =  par.find(".img_box img").attr('src');
		var imgurl =  par.find(".img_box img").attr('data-url');
		if(inp.val()==''||inp.val()==undefined) return false;

		var flag = 1;
		dd.find(".self_inp").each(function(){
			var sinp = $(this).find(".inp");
			if(sinp.val() == inp.val()){
				console.log("已经填写过这个值");
				flag = 0;
				return false;
			}
		});
		if(!flag) return false;

		var id = dd.attr('data-id');

		if(dd.attr("data-title")=="颜色"){
			var img = imgurl?"<img src='"+imgsrc+"' data-url='"+imgurl+"'>":"";
			var hide1 = imgurl?"fn-hide":"";
			var hide2 = imgurl?"":"fn-hide";
			var len = $(".self_inp").size();
			selfadd.append('<div class="self_inp color_inp fn-clear"><input class="fn-hide" checked="checked" type="checkbox" name="speCustom'+id+'[]" title="'+inp.val()+'" value="custom_'+id+'_'+inp.val()+'"><input type="text" class="inp" size="12" value="'+inp.val()+'"><i class="del_inp"></i><div class="img_box">'+img+'</div><div class="upimg filePicker1 '+hide1+'" id="filePicker'+pii+'">选择图片</div><div class="del_img '+hide2+'">删除图片</div><input class="spePic" type="hidden" name="speCustomPic'+id+'[]" value="'+imgurl+'" /></div>');
			renderbtn($('#filePicker'+pii))
			pii++;
		}else{
			selfadd.append('<div class="self_inp fn-clear"><input class="fn-hide" checked="checked" type="checkbox" name="speCustom'+id+'[]" title="'+inp.val()+'" value="custom_'+id+'_'+inp.val()+'"><input type="text" class="inp"  size="22" value="'+inp.val()+'" /><i class="del_inp"></i></div>')
		}
		inp.val('');
		par.find(".img_box").html('');
		par.find('.del_img').addClass("fn-hide");
		par.find('.upimg').removeClass("fn-hide");
		createSpecifi()
	});

	// 预览图片
	$("#specification").delegate(".img_box","click",function(){
		var t = $(this);
		if(t.find("img").size()>0){
			var src = t.find("img").attr("src")
			$('.img_mask,.img_show').show();
			$(".img_show .imgbox img").attr("src",src);
		}
	});

	$('.img_mask,.img_show .close_btn').click(function(){
		$('.img_mask,.img_show').hide();
	})



	// 删除自定义
	$("#editform").delegate(".self_inp .del_inp","click",function(){
		var t = $(this);
		t.parents('.self_inp').remove();
		createSpecifi();
	});


	// 新增自定义属性
	$(".self_dl").delegate(".adddiv","click",function(){
		$(".self_tip").before('<div class="self_div"><h2 class="fn-clear"><input type="text" class="inp" size="22" maxlength="50" placeholder="输入属性名称"> <a href="javascript:;" class="del_dd">删除</a></h2><ul class="fn-clear"><li class="fn-clear"><input type="text" class="inp" size="22" maxlength="50" placeholder="请输入属性值"><i class="del_prop"></i></li></ul></div>');
	});

	// 删除自定义属性
	$(".self_dl").delegate(".del_dd","click",function(){
		var t = $(this);
		// if($(".self_dl .self_div").size()>1){
			t.parents(".self_div").remove();
		// }else{
		// 	console.log("已经不能再删除啦~")
		// }
		adddl();
	})

	// 自定义属性值
	$(".self_dl").on("input propertychange",".self_div li .inp",function(){
		var t = $(this),par_li = t.parents('li'),par_ul = t.parents('ul');
		t.removeClass("err")
		if(t.val()!=''&&t.val()!=undefined){
			par_li.find(".del_prop").show();
			t.val(t.val().replace(/[,./<>?;':"\\|!@#$%^&*()=+~`｛｝【】；‘’：“”，。《》、？！￥……（）]/g, ''));
			if(par_ul.find('li:last-child').children('input').val()!=''){
				par_li.after('<li class="fn-clear"><input type="text" class="inp" size="22" maxlength="50" placeholder="请输入属性值"><i class="del_prop"></i></li>');
			}
		}else{
			par_li.find(".del_prop").hide();
			if(par_ul.find('li').size()>1){
				par_li.remove();
			}
			adddl();

		}
	});

	// 自定义属性值
	$(".self_add, .self_box, .self_div h2").on("input propertychange",".inp",function(){
		var t = $(this);
		if(t.val()!=''&&t.val()!=undefined){
			t.val(t.val().replace(/[,./<>?;':"\\|!@#$%^&*()=+~`｛｝【】；‘’：“”，。《》、？！￥……（）]/g, ''));
		}
	});

	// 删除自定义属性值
	$(".self_dl").delegate(".del_prop","click",function(){
		var t = $(this),pdiv = t.parents(".self_div");
		if(pdiv.find('li').size()>1){
			t.parents("li").remove();
		}
		adddl()
	});

	// 判断属性值是否重复
	$(".self_dl").on("blur",".self_div li .inp",function(){
		var t = $(this) , par_li = t.parents('li'),par_ul = t.parents('ul'),p = t.parents(".self_div");
		var val = t.val(),sx_name = p.find('h2 .inp').val();
		var num = 0;
		par_ul.find('li').each(function(){
			var val1 = $(this).find(".inp").val();
			if(val==val1){
				num = num + 1;
			}
		});
		if(num>1){
			t.focus().addClass("err");
			return false;
		}
		adddl();   //遍历自定义属性

	});

	$('.self_dl').on("blur",".self_div h2 .inp",function(){
		adddl();
	})

	adddl();
	function adddl(){
		$('.dl').remove()
		$('.self_div').each(function(){
			var html = [];
			var t = $(this);
			var index_ = t.index()
			sx_name = t.find('h2 .inp').val();
			var sx_val = [];
			t.find('li').each(function(){
				var tval = $(this).find(".inp").val();
				if(tval!=''){
					sx_val.push(tval);
				}
			})

			var fid = createRandomId();

			if(sx_name!=''&& sx_val!=[]){
				var sxval = []
				for(var i=0;i<sx_val.length;i++){
					sxval.push('<div class="self_inp fn-clear"><input class="fn-hide" checked="checked" type="checkbox" name="speNew['+sx_name+'][]" title="'+sx_val[i]+'" value="'+sx_val[i]+'"><input type="text" class="inp" size="22" value="'+sx_val[i]+'"><i class="del_inp"></i></div>');
				}

				html.push('<dl class="fn-clear dl" data-tit=><dt>'+sx_name+'：</dt><dd data-title="'+sx_name+'" data-id="'+fid+'">'+sxval.join('')+'</dd></dl>');
			}
			$('#speList').before(html.join(''));
		});

		createSpecifi();
	}


	// 批量输入
	$("#speList").delegate(".pl_fill .text_tip","click",function(){
		var t = $(this);
		t.hide();
		t.siblings("input").show().focus();
	});

	$("#speList").on("blur",".pl_fill input",function(){
		var t = $(this);
		if(t.val()==''){
			t.hide();
			t.siblings(".text_tip").show().focus();
		}
	});

	$("#speList").on("keyup",".pl_fill input",function(){
		var t = $(this),name = t.attr("name");
		var val = t.val();
		if(name=='pl_price1'||name=='pl_price2'){
			var nowval = val.replace(/[^\d\.]/g,'')
			t.val(nowval)
		}else if(name=='pl_kc'){
			var nowval = val.replace(/\D/g,'')
			t.val(nowval)
		}
	});
	$("#speList").on("blur",".pl_fill input",function(){
		var t = $(this),name = t.attr("name");
		var val = t.val();
		if((name=='pl_price1'||name=='pl_price2') && val!=''){
			var nowval = val.replace(/[^\d\.]/g,'')*1
			t.val(nowval.toFixed(2))
		}
	})

	$(".piliang").click(function(){
		var inventory = 0;
		$(".pl_fill").each(function(){
			var t = $(this),p = t.parent('th');
			var index = p.index()
			if(t.find("input").val()!='' && t.find("input").val()!=undefined){
				$(".speTab table tr").each(function(){
					var m = $(this).find('td').eq(index);
					m.find('input').val(t.find("input").val());
					if(m.find('input').attr("data-type")=="inventory"){
						inventory = inventory + Number(m.find('input').val());
					}
				});
				$("#inventory").val(inventory);
				t.find("input").val('').hide();
				t.find(".text_tip").show()
			}
		})
	})

	//计算库存
		$("#speList").delegate("input", "blur", function(){
			var inventory = 0;
			$("#speList").find("input").each(function(index, element) {
	      var val = Number($(this).val()), type = $(this).attr("data-type");
				if(type == "inventory" && val){
					inventory = Number(inventory + val);
				}
	    });
			$("#inventory").val(parseInt(inventory));
		});


	  //选择规格
		var fth;
		$("#specification").delegate("input[type=checkbox]", "click", function(){
			createSpecifi();
		});

		if(specifiVal.length > 0){
			createSpecifi();
		}

		//规格选择触发
		function createSpecifi(){
			if($("#specification").size()==0) return false;
			var checked = $("#specification input[type=checkbox]:checked");
			if(checked.length > 0){
				$("#inventory").val("0").attr("disabled", true);
				//thead
				var thid = [], thtitle = [], th1 = [],
					th2 = '<th><div class="pl_fill"><div class="text_tip">'+langData['waimai'][5][23]+' <font color="#f00">*</font></div><input type="text" name="pl_price1"/></div></th><th><div class="pl_fill"><div class="text_tip">'+langData['siteConfig'][26][159]+' <font color="#f00">*</font></div><input type="text" name="pl_price2"/></div></th><th><div class="pl_fill"><div class="text_tip">'+langData['siteConfig'][19][525]+' <font color="#f00">*</font></div><input type="text" name="pl_kc"/></div></th>';
				for(var i = 0; i < checked.length; i++){
					var t = checked.eq(i),
						// title = t.parent().parent().parent().attr("data-title"),
						title = t.parents('dd').attr("data-title"),
						id = t.parents('dd').attr("data-id");
						// id = t.parent().parent().parent().attr("data-id");

					if(!thid.in_array(id)){
						thid.push(id);
						thtitle.push(title);
					}
				}
				for(var i = 0; i < thid.length; i++){
					th1.push('<th>'+thtitle[i]+'</th>');
				}
				$("#speList thead").html(th1+th2);

				//tbody 笛卡尔集
				var th = new Array(), dl = $("#specification dl");
				for(var i = 0; i < dl.length - 1; i++){
					var tid = [];

					//取得已选规格
					dl.eq(i).find("input[type=checkbox]:checked").each(function(index, element) {
	                    var id = $(this).val(), val = $(this).attr("title");
						tid.push(id+"###"+val);
	                });

					//已选规格分组
					if(tid.length > 0){
						th.push(tid);
					}
				}
				if(th.length > 0){
					fth = th[0];
					for (var i = 1; i < th.length; i++) {
						descartes(th[i]);
					}

					//输出
					createTbody(fth);
				}

			}else{
				$("#inventory").val("").attr("disabled", false);
				$("#speList thead, #speList tbody").html("");
				$("#speList").hide();
			}
		}

		//输出规格内容
		function createTbody(fth){
			if(fth.length > 0){
				var tr = [], inventory = 0;
				for(var i = 0; i < fth.length; i++){
					var fthItem = fth[i].split("***"), id = [], val = [];
					for(var k = 0; k < fthItem.length; k++){
						var items = fthItem[k].split("###");
						id.push(items[0]);
						val.push(items[1]);
					}
					if(id.length > 0){
						tr.push('<tr>');

						var name = [];
						for(var k = 0; k < id.length; k++){
							tr.push('<td>'+val[k]+'</td>');
							name.push(id[k]);
						}

						var price = $("#price").val();
						var mprice = $("#mprice").val();
						var f_inventory = "";
						if(specifiVal.length > 0 && specifiVal.length > i){
							value = specifiVal[i].split("#");
							mprice = value[0];
							price = value[1];
							f_inventory = value[2];
							inventory = inventory + Number(f_inventory);
						}

						tr.push('<td><input class="inp" type="text" id="f_mprice_'+name.join("-")+'" name="f_mprice_'+name.join("-")+'" data-type="mprice" value="'+mprice+'" /></td>');
						tr.push('<td><input class="inp" type="text" id="f_price_'+name.join("-")+'" name="f_price_'+name.join("-")+'" data-type="price" value="'+price+'" /></td>');
						tr.push('<td><input class="inp" type="text" id="f_inventory_'+name.join("-")+'" name="f_inventory_'+name.join("-")+'" data-type="inventory" value="'+f_inventory+'" /></td>');
						tr.push('</tr>');
					}
				}

				if(specifiVal.length > 0){
					$("#inventory").val(inventory);
				}
				$("#speList tbody").html(tr.join(""));
				$("#speList").show();

				//合并相同单元格
				var th = $("#speList thead th");
				for (var i = 0; i < th.length-3; i++) {
					huoniao.rowspan($("#speList"), i);
				};
			}
		}

		//笛卡尔集
		function descartes(array) {
	    var ar = fth;
	    fth = new Array();
	    for (var i = 0; i < ar.length; i++) {
	      for (var j = 0; j < array.length; j++) {
	        var v = fth.push(ar[i] + "***" + array[j]);
	      }
	    }
	  }


	  	renderbtn()
	  	function renderbtn(){

	  		$('.filePicker1').each(function() {

	  			  var picker = $(this), type = picker.data('type'), type_real = picker.data('type-real'), atlasMax = count = picker.data('count'), size = picker.data('size') * 1024, upType1, accept_title, accept_extensions = picker.data('extensions'), accept_mimeTypes = picker.data('mime');
	  				serverUrl = '/include/upload.inc.php?mod='+pubModelType+'&filetype=image&type=atlas&utype='+type;
	  				accept_title = 'Images';
	  				accept_extensions = 'jpg,jpeg,gif,png';
	  				accept_mimeTypes = 'image/*';


	  				//上传凭证
	  			    var i = $(this).attr('id').substr(10);
	  				var $list = picker.siblings('.img_box'),
	  					ratio = window.devicePixelRatio || 1,
	  					fileCount = 0,
	  					thumbnailWidth = 100 * ratio,   // 缩略图大小
	  					thumbnailHeight = 100 * ratio,  // 缩略图大小
	  					uploader;


	  				// 初始化Web Uploader
	  				uploader = WebUploader.create({
	  					auto: true,
	  					swf: pubStaticPath + 'js/webuploader/Uploader.swf',
	  					server: serverUrl,
	  					pick: '#filePicker' + i,
	  					fileVal: 'Filedata',
	  					accept: {
	  						title: accept_title,
	  						extensions: accept_extensions,
	  						mimeTypes: accept_mimeTypes
	  					},
	  		            chunked: true,//开启分片上传
	  		            // threads: 1,//上传并发数
	  					fileNumLimit: count,
	  					fileSingleSizeLimit: size
	  				});

	  				uploader.on('fileQueued', function(file) {
	  					// 创建缩略图
	  					uploader.makeThumb(file, function(error, src) {
	  							if(error){
	  								$list.removeClass("fn-hide");
	  								$list.html('<span class="thumb-error">'+langData['siteConfig'][6][177]+'...</span>');//上传中
	  								return;
	  							}
	  						$list.append('<img src="'+src+'">');
	  						}, thumbnailWidth, thumbnailHeight);
	  				});

	  				uploader.on('uploadSuccess', function(file,response) {
	  					$list.find('img').attr('data-url',response.url).attr('src',response.turl)
	  					$list.siblings(".spePic").val(response.url);
	  					$list.siblings(".del_img").removeClass("fn-hide");
	  					picker.addClass("fn-hide");
	  				});


	  				// 所有文件上传成功后调用
	  				uploader.on('uploadFinished', function () {
	  					//清空队列
	  					 uploader.reset();
	  				});



	  			//错误提示
	  		  function showErr(error, txt){
	  		    var obj = error.next('.upload-tip').find('.fileerror');
	  		    obj.html(txt);
	  		    setTimeout(function(){
	  		      obj.html('');
	  		    },2000)
	  		  }

	  		});
	  	}



	  	// 删除图片
	  	$("#specification").delegate(".del_img","click",function(){
	  		var del = $(this);
	  		var img_box = del.siblings(".img_box");
	  		var upimg = del.siblings(".upimg");
	  		upimg.removeClass("fn-hide");
	  		del.addClass("fn-hide");
	  		var picpath = img_box.find("img").attr('data-url');
	  		var g = {
	  			mod: pubModelType,
	  			type: "delatlas",
	  			picpath: picpath,
	  			randoms: Math.random()
	  		};
	  		$.ajax({
	  			type: "POST",
	  			url: "/include/upload.inc.php",
	  			data: $.param(g),
	  			success: function(a) {
	  				img_box.html('');
	  			}
	  		})
	  	});



	//保存
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t            = $(this),
			id           = $("#id").val(),
			title        = $("#title"),
			mprice       = $("#mprice"),
			price        = $("#price"),
			logistic     = $("#logistic"),
			inventory    = $("#inventory"),
			litpic       = $("#litpic"),
			sort       = $("#sort"),
			tj           = true;

		//属性
		$("#proItem").find("input, select").each(function() {
            var type = $(this).attr("type"),
				name = $(this).attr("name"),
				tip  = $(this).parent().siblings(".input-tips");
			if(type == "text"){
				tip = $(this).siblings(".input-tips");
			}
			if($(this).attr("data-required") == "true"){
				if(type == "checkbox"){
					if($("input[name='"+name+"']:checked").val() == "" || $("input[name='"+name+"']:checked").val() == undefined){
						huoniao.goInput($(this));
						tj = false;
						$.dialog.alert(tip.text());
						return false;
					}
				}else{
					if($(this).val() == ""){
						huoniao.goInput($(this));
						tip.removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
						tj = false;
						return false;
					}else{
						tip.removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
					}
				}
			}
        });

		if(!tj) return false;

		//标题
		if(!huoniao.regex(title)){
			tj = false;
			huoniao.goInput(title);
			return false;
		};

		//市场价
		if(!huoniao.regex(mprice)){
			mprice.parent().next(".input-tips").removeClass().addClass("input-tips input-error");
			mprice.parent().next(".input-tips").html('<s></s>字段为数字型！');
			tj = false;
			huoniao.goInput(mprice);
			return false;
		}else{
			mprice.parent().next(".input-tips").removeClass().addClass("input-tips input-ok");
			mprice.parent().next(".input-tips").html('<s></s>输入0表示面议');
		};

		//一口价
		if(!huoniao.regex(price)){
			price.parent().next(".input-tips").removeClass().addClass("input-tips input-error");
			price.parent().next(".input-tips").html('<s></s>字段为数字型！');
			tj = false;
			huoniao.goInput(price);
			return false;
		}else{
			price.parent().next(".input-tips").removeClass().addClass("input-tips input-ok");
			price.parent().next(".input-tips").html('<s></s>输入0表示面议');
		};

		//物流费
		// if(!huoniao.regex(logistic)){
		// 	logistic.parent().next(".input-tips").removeClass().addClass("input-tips input-error");
		// 	logistic.parent().next(".input-tips").html('<s></s>字段为数字型！');
		// 	tj = false;
		// 	huoniao.goInput(logistic);
		// 	return false;
		// }else{
		// 	logistic.parent().next(".input-tips").removeClass().addClass("input-tips input-ok");
		// 	logistic.parent().next(".input-tips").html('<s></s>输入0表示免运费');
		// };

		//规格表值验证
		$("#speList tbody").find("input").each(function(index, element) {
            var val = $(this).val();
			if(!/^0|\d*\.?\d+$/.test(val)){
				$(document).scrollTop(Number($("#speList").offset().top)-8);
				$("#speList").find(".input-tips").removeClass().addClass("input-tips input-error");
				$("#speList").find(".input-tips").html('<s></s>价格和库存不得为空，类型为数字！');
				tj = false;
				return false;
			}else{
				$("#speList").find(".input-tips").removeClass().addClass("input-tips input-ok");
				$("#speList").find(".input-tips").html('<s></s>请补全价格和库存！');
			}
        });

		if(!tj) return false;

		//库存
		if(!huoniao.regex(inventory)){
			inventory.parent().next(".input-tips").removeClass().addClass("input-tips input-error");
			inventory.parent().next(".input-tips").html('<s></s>字段为数字型！');
			tj = false;
			huoniao.goInput(inventory);
			return false;
		}else{
			inventory.parent().next(".input-tips").removeClass().addClass("input-tips input-ok");
			inventory.parent().next(".input-tips").html('<s></s>输入0表示不限量');
		};

		//代表图片
		if(litpic.val() == ""){
			huoniao.goInput(litpic);
			$.dialog.alert("请上传商品代表图片！");
			tj = false;
			return false;
		}

		//排序
		if(!huoniao.regex(sort)){
			tj = false;
			huoniao.goInput(sort);
			return false;
		};

		//图集
		var imgli = $("#listSection2 li");
		if(imgli.length <= 0){
			huoniao.goInput($("#listSection2"));
			$.dialog.alert("请上传商品图集！");
			tj = false;
			return false;
		}

		ue.sync();

		if(tj){
			t.attr("disabled", true);
			huoniao.operaJson("productAdd.php?action=productAdd", $(this).parents("form").serialize() + "&submit=" + encodeURI("提交"), function(data){
				if(data.state == 100){
					if($("#dopost").val() == "save"){

						huoniao.parentTip("success", "商品添加成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
						huoniao.goTop();
						location.reload();

					}else{

						huoniao.parentTip("success", "商品修改成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
						t.attr("disabled", false);

					}
				}else{
					$.dialog.alert(data.info);
					t.attr("disabled", false);
				};
			}, function(){
				$.dialog.alert("网络错误，请刷新页面重试！");
				t.attr("disabled", false);
			});
		}

	});

	//视频预览
	$("#videoPreview").delegate("a", "click", function(event){
		event.preventDefault();
		var href = $(this).attr("href"),
			id   = $(this).attr("data-id");

		window.open(href+id, "videoPreview", "height=500, width=650, top="+(screen.height-500)/2+", left="+(screen.width-650)/2+", toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
	});

	//删除文件
	$(".spic .reupload").bind("click", function(){
		var t = $(this), parent = t.parent(), input = parent.prev("input"), iframe = parent.next("iframe"), src = iframe.attr("src");
		delFile(input.val(), false, function(){
			input.val("");
			t.prev(".sholder").html('');
			parent.hide();
			iframe.attr("src", src).show();
		});
	});

});
//上传成功接收
function uploadSuccess(obj, file, filetype, fileurl){
	$("#"+obj).val(file);
	$("#"+obj).siblings(".spic").find(".sholder").html('<a href="/include/videoPreview.php?f=" data-id="'+file+'">预览视频</a>');
	$("#"+obj).siblings(".spic").find(".reupload").attr("style", "display: inline-block");
	$("#"+obj).siblings(".spic").show();
	$("#"+obj).siblings("iframe").hide();
}
//删除已上传的文件
function delFile(b, d, c) {
	var g = {
		mod: "info",
		type: "delVideo",
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

//生成随机数
function createRandomId() {
	return (Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
}
