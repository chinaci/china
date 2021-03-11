var pubStaticPath = (typeof staticPath != "undefined" && staticPath != "") ? staticPath : "/static/";
var pubModelType = (typeof modelType != "undefined") ? modelType : "siteConfig";

$(function(){

  var inputObj = "";
	//商品属性选择或输入：点击
	$("#fabuForm").delegate("input[type=text]", "click", function(){
		$(".popup_key").hide();
		var itemList = $(this).siblings(".popup_key");
		inputObj = $(this).attr("id");
		if(itemList.html() != undefined){
			itemList.show();;
		}
		return false;
	});

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
	$("#fabuForm").delegate(".self_inp .del_inp","click",function(){
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
	});

	$("#speList").on("keyup","td input",function(){
		var t = $(this),name = t.attr("data-type");
		var val = t.val();
		if(name=='mprice'||name=='price'){
			var nowval = val.replace(/[^\d\.]/g,'')
			t.val(nowval)
		}else if(name=='inventory'){
			var nowval = val.replace(/\D/g,'')
			t.val(nowval)
		}
	});
	$("#speList").on("blur","input",function(){
		var t = $(this),name = t.attr("data-type");
		var val = t.val();
		if((name=='mprice'||name=='price') && val!=''){
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
				$("#inventory").val(inventory)
				t.find("input").val('').hide();
				t.find(".text_tip").show()
			}
		});

	})





	//商品属性选择或输入：输入
	$("#fabuForm").delegate("input[type=text]", "input", function(){
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
		parent.siblings(".tip-inline").removeClass().addClass("tip-inline success");
		parent.hide();
	});

	$(document).click(function (e) {
		$(".popup_key").hide();
  });


  //获取运费模板详细
	function getLogisticDetail(id){
		$.ajax({
			type: "GET",
			url: "/include/ajax.php?service=shop&action=logisticTemplate&sid="+$("#store").val()+"&id="+id,
			dataType: "jsonp",
			success: function(a) {
        if(a.state == 100){
  				$("#logisticDetail small").html('<br />'+a.info);
  				$("#logisticDetail").show();
        }
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
			$("#inventory").removeAttr("disabled");
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



    getEditor("mbody");
	getEditor("body");


	//表单验证
	var regex = {

		regexp: function(t, reg, err){
			var val = $.trim(t.val()), dl = t.closest("dl"), name = t.attr("name"),
					tip = t.data("title"), etip = tip, hline = dl.find(".tip-inline"), check = true;

			if(val != ""){
				var exp = new RegExp("^" + reg + "$", "img");
				if(!exp.test(val)){
					etip = err;
					check = false;
				}
			}else{
				check = false;
			}

			if(dl.attr("data-required") == 1){
				if(val == "" || !check){
					hline.removeClass().addClass("tip-inline error").html("<s></s>"+etip);
				}else{
					hline.removeClass().addClass("tip-inline success").html("<s></s>"+tip);
				}
				return check;
			}
		}

		//名称
		,title: function(){
			return this.regexp($("#title"), ".{5,100}", langData['siteConfig'][27][90]);
		}

		//市场价
		,mprice: function(){
			return this.regexp($("#mprice"), "(?!0+(?:.0+)?$)(?:[1-9]\\d*|0)(?:.\\d{1,2})?", langData['siteConfig'][27][91]);
		}

		//一口价
		,price: function(){
			return this.regexp($("#price"), "(?!0+(?:.0+)?$)(?:[1-9]\\d*|0)(?:.\\d{1,2})?", langData['siteConfig'][27][91]);
		}

    //运费
    ,logistic: function(){
      var t = $("#logistic"), val = t.val(), dl = t.closest("dl"), tip = dl.data("title"), etip = tip, hline = dl.find(".tip-inline");
      if(val == 0){
        hline.removeClass().addClass("tip-inline error").html("<s></s>"+etip);
        return false;
      }else{
        hline.removeClass().addClass("tip-inline success").html("<s></s>"+tip);
        return true;
      }
    }

		//库存
		,inventory: function(){
			return this.regexp($("#inventory"), "[0-9]\\d*", langData['siteConfig'][27][92]);
		}

		//购买限制
		,limit: function(){
			return this.regexp($("#limit"), "[0-9]\\d*", langData['siteConfig'][27][92]);
		}


	}


	//提交发布
	$("#submit").bind("click", function(event){

		event.preventDefault();

		var t        = $(this),
			litpic   = $("#litpic").val();

	    $("#typeid").val(typeid);
	    $("#id").val(id);

		if(t.hasClass("disabled")) return;

		var offsetTop = 0;

		//自定义字段验证
		$("#proItem").find("dl").each(function(){
			var t = $(this), type = t.data("type"), required = parseInt(t.data("required")), tipTit = t.data("title"), tip = t.find(".tip-inline"), input = t.find("input").val();

			if(required == 1){
				//单选
				if(type == "radio" && offsetTop <= 0){
					if(input == ""){
						tip.removeClass().addClass("tip-inline error").html("<s></s>"+tipTit);
						offsetTop = t.position().top;
					}
				}

				//多选
				if(type == "checkbox" && offsetTop <= 0){
					if(t.find("input:checked").val() == "" || t.find("input:checked").val() == undefined){
						tip.removeClass().addClass("tip-inline error").html("<s></s>"+tipTit);
						offsetTop = t.position().top;
					}
				}

				//下拉菜单
				if(type == "select" && offsetTop <= 0){
					if(input == ""){
						tip.removeClass().addClass("tip-inline error").html("<s></s>"+tipTit);
						offsetTop = t.position().top;
					}
				}
			}

		});

		if(!regex.title() && offsetTop <= 0){
			offsetTop = $("#title").position().top;
		}

		if(!regex.mprice() && offsetTop <= 0){
			offsetTop = $("#mprice").position().top;
		}

		if(!regex.price() && offsetTop <= 0){
			offsetTop = $("#price").position().top;
		}

		if(!regex.logistic() && offsetTop <= 0){
			offsetTop = $("#logistic").position().top;
		}

	    //规格表值验证
	    if(offsetTop <= 0){
	  		$("#speList tbody").find("input").each(function(index, element) {
	        var val = $(this).val();
	  			if(!/^0|\d*\.?\d+$/.test(val)){
	  				$(document).scrollTop(Number($("#speList").offset().top)-8);
	  				$("#speList").find(".tip-inline").removeClass().addClass("tip-inline error");
	  				$("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][93]);

	  				offsetTop = $("#speList").position().top;
	  			}else{
	  				$("#speList").find(".tip-inline").removeClass().addClass("tip-inline success");
	  				$("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][94]);
	  			}
	      });
	    }

		if(!regex.inventory() && offsetTop <= 0){
			offsetTop = $("#inventory").position().top;
		}

		if(!regex.limit() && offsetTop <= 0){
			offsetTop = $("#limit").position().top;
		}

		if(litpic == "" && offsetTop <= 0){
			$.dialog.alert(langData['siteConfig'][27][78]);
			offsetTop = $("#listSection1").position().top;
		}

		//图集
		var imgli = $("#listSection2 li");
		if(imgli.length <= 0 && offsetTop <= 0){
			$.dialog.alert(langData['siteConfig'][20][436]);
			offsetTop = $(".list-holder").position().top;
		}

		ue.sync();

		if(!ue.hasContents() && offsetTop <= 0){
			$.dialog.alert(langData['shop'][4][66]);
			offsetTop = $("#body").position().top;
		}

		if(offsetTop){
			$('.main').animate({scrollTop: offsetTop + 10}, 300);
			return false;
		}

		var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url");
		data = form.serialize();

		t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");


		$.ajax({
			url: action,
			data: data,
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					var tip = langData['siteConfig'][20][341];  //发布成功
					if(id != undefined && id != "" && id != 0){
						tip = langData['siteConfig'][20][229];  //修改成功
					}

					$.dialog({
						title: langData['siteConfig'][19][287],
						icon: 'success.png',
						content: tip,
						ok: function(){

							location.href = url;
						}
					});

				}else{
					$.dialog.alert(data.info);
					t.removeClass("disabled").html(langData['siteConfig'][11][19]);
					$("#verifycode").click();
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);
				t.removeClass("disabled").html(langData['siteConfig'][11][19]);
				$("#verifycode").click();
			}
		});




	});


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

});


//生成随机数
function createRandomId() {
	return (Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
}
