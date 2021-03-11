var slider1, slider;
//多语言包
if(typeof langData == "undefined"){
    document.head.appendChild(document.createElement('script')).src = '/include/json.php?action=lang';
}

var pubStaticPath = (typeof staticPath != "undefined" && staticPath != "") ? staticPath : "/static/";
var pubModelType = (typeof modelType != "undefined") ? modelType : "siteConfig";

huoniao.rowspan = function(t, colIdx) {
  return t.each(function() {
      var that;
      $('tr', this).each(function(row) {
          $('td:eq(' + colIdx + ')', this).filter(':visible').each(function(col) {
              if (that != null && $(this).html() == $(that).html()) {
                  rowspan = $(that).attr("rowSpan");
                  if (rowspan == undefined) {
                      $(that).attr("rowSpan", 1);
                      rowspan = $(that).attr("rowSpan");
                  }
                  rowspan = Number(rowspan) + 1;
                  $(that).attr("rowSpan", rowspan);
                  $(this).hide();
              } else {
                  that = this;
              }
          });
      });
  });
}

$(function(){
$(".checkbox input[type=checkbox]").click(function(){
		var t = $(this);
		t.parent('label').toggleClass("curr");
})

    //APP端取消下拉刷新
    toggleDragRefresh('off');

  slider = new Swiper('#slider .swiper-container', {pagination : '.pagination'});
  slider1 = new Swiper('#slider1 .swiper-container', {
  	pagination : '.pagination',
  	onSlideChangeEnd:function(swiper){

  		$('#drag img').eq(swiper.activeIndex).addClass('curr').siblings('img').removeClass('curr');
  	}
  });
  if(id && $('.pagination span').length) $('.pagination').show();


  try{
		var upType1 = upType;
	}catch(e){
		var upType1 = 'atlas';
	}

// 库存计数
$(".radiobox .radio span").click(function(){
	var t = $(this);
	var val = t.attr("data-id");
	t.addClass("curr").siblings("span").removeClass("curr");
	$("#inventoryCount").val(val);
})


// 商品规格
/* 清除不相关的s */

$(".sure_add").html('+自定义值');
$('#specification dl').each(function(){
	var t = $(this);
	if(t.find('dd').attr("data-title")=='颜色'){
		t.addClass("color_dl");
	}
	t.find('.self_box').append(t.find(".sure_add"));
	t.find('.self_box .inp').addClass("binp")
	t.find('.self_add').remove();


})
/* 清除不相关的e */

// 新增自定义值
	var pii = 1;
	$("#specification").delegate(".sure_add","click",function(){
		var t = $(this),dd = t.closest('dd');
		//var par = t.parents('.self_add');
		var selfadd = t.parents(".self_box");
		var id = dd.attr('data-id');
		if(dd.attr("data-title")=="颜色"){

			var len = $(".self_inp").size();
			t.before('<div class="self_inp color_inp fn-clear"><input class="fn-hide"  type="checkbox" name="speCustom'+id+'[]"  title="" value=""><input type="text" class="inp" size="12" value="" placeholder="请输入自定义值"><i class="del_inp"></i><div class="img_box"></div><div class="upimg filePicker1" id="filePicker0'+pii+'" data-type="des">选择图片</div><div class="del_img fn-hide">删除图片</div><input class="spePic" type="hidden" name="speCustomPic'+id+'[]" value="" /></div>');
			renderbtn();
			pii++;
		}else{
			t.before('<div class="self_inp fn-clear"><input class="fn-hide"  type="checkbox" name="speCustom'+id+'[]"  title="" value="0"><input type="text" class="inp"  size="20" value="" placeholder="请输入自定义值" /><i class="del_inp"></i></div>')
		}
		t.prev(".self_inp").find("input").focus();
		// createSpecifi()
	});


// 删除自定义
$("#specificationForm").delegate(".del_inp","click",function(){
	var t = $(this),par = t.parents(".self_inp"),del_img = par.find(".del_img");
	del_img.click();
	par.remove();
	createSpecifi()
});

// 监听input是否有值~~~~自定义规格名称同步
$("#specificationForm").on("input propertychange",".self_inp .inp",function(){
	var t = $(this),check = t.siblings("input[type='checkbox']");
	var id = t.closest('dd').attr('data-id');
	check.val('custom_'+id+'_'+t.val()).attr("title",t.val())
	if(t.val()!="" && t.val()!=undefined){
		t.addClass("binp");
		check.attr("checked","checked");
	}else{
		t.removeClass("binp");
		check.removeAttr("checked");
	}
});

// 监听input是否有值
$("#specificationForm").on("blur",".self_inp .inp",function(){
	var t = $(this),check = t.siblings("input[type='checkbox']");
	var p = t.parents(".self_box");
	var val = t.val();
	var num = 0 ;
	p.find(".self_inp").each(function(){
		var inp = $(this).find(".inp");
		var val1 = inp.val();
		if(val1==val && val!=""){
			num = num + 1;
		}
	});
	if(num>1){
		t.focus().addClass("err");
		showErr("输入的值重复")
		return false;
	}
	createSpecifi();
});

$('.self_dl').on("blur",".self_div h2 .inp",function(){
		adddl();
	})
// 自定义属性
$(".self_dl").on("input propertychange",".self_div li .inp",function(){
	var t = $(this) , par_li = t.parents("li") , par_ul = t.parents("ul");
	t.removeClass("err");
	setTimeout(function(){
		if(t.val()!="" && t.val()!=undefined ){
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
	},100)

});

// 自定义属性值
$(".self_add, .self_box, .self_div h2").on("input propertychange",".inp",function(){
	var t = $(this);
	if(t.val()!=''&&t.val()!=undefined){
		t.val(t.val().replace(/[,./<>?;':"\\|!@#$%^&*()=+~`｛｝【】；‘’：“”，。《》、？！￥……（）]/g, ''));
	}
});

$(".self_dl").on("blur",".self_div li .inp",function(){
	var t = $(this) , par_li = t.parents('li'),par_ul = t.parents('ul'),p = t.parents(".self_div");
	var val = t.val(),sx_name = p.find('h2 .inp').val();
	var num = 0;
	if(val!=''){
		par_ul.find('li').each(function(){
			var val1 = $(this).find(".inp").val();
			if(val==val1 && val!=''){
				num = num + 1;
			}
		});
		if(num>1){
			showErr("输入的值重复");
			t.focus();
			return false;
		}
		adddl();   //遍历自定义属性
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

// 新增自定义属性
$(".self_dl").delegate(".adddiv","click",function(){
		$(".adddiv").before('<div class="self_div"><h2 class="fn-clear"><input type="text" class="inp" size="22" maxlength="50" placeholder="输入属性名称"> <a href="javascript:;" class="del_dd"></a></h2><ul class="fn-clear propbox"><li class="fn-clear propli"><input type="text" class="inp" size="22" maxlength="50" placeholder="请输入属性值"><i class="del_prop "></i></li></ul></div>');
});


// 删除自定义属性
	$(".self_dl").delegate(".del_dd","click",function(){
		var t = $(this);
		//if($(".self_dl .self_div").size()>1){
			t.parents(".self_div").remove();
			adddl();
		//}else{
		//	showErr("已经不能再删除啦~")
		//}
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
					sxval.push('<div class="self_inp fn-clear"><input class="fn-hide" checked="checked" type="checkbox"  name="speNew['+sx_name+'][]" title="'+sx_val[i]+'" value="'+sx_val[i]+'"><input type="text" class="inp" size="20" value="'+sx_val[i]+'"><i class="del_inp"></i></div>')
				}

				html.push('<dl class="fn-clear dl"><dt>'+sx_name+'：</dt><dd data-title="'+sx_name+'" data-id="'+fid+'">'+sxval.join('')+'</dd></dl>')
			}
			$('#speList').before(html.join(''))
		});

		createSpecifi();
	}


// 查看图片
$("#specificationForm").delegate(".img_box","click",function(){
	var t = $(this) , img = t.find("img");
	// alert("1111")
	 url = img.attr("data-url");
	 src = img.attr("src");
	 $(".layer-img").show();
	 $(".layer-img img").attr("src",src);
	 showWin();
	$(".layer-img .del_Img").click(function(){
		t.siblings(".del_img").click();
		$(".layer-img img").attr("src","");
		$(".layer-img").hide();
		showWin('close');
	})
});


$(".layer-img .confirm").click(function(){
	$(".layer-img").hide();
	// showWin('close');
})

// 批量上传
$(".pl_btn").click(function(){
	$(".mask_pop,.pop_box").show();
});

$(".pop_box .cancel_btn").click(function(){
	$(".mask_pop,.pop_box").hide();
});
$(".pop_box .sure_btn").click(function(){
	var flag = 1;
	var kucun = '',mprice = '', price =''
	$(".pop_box li").each(function(){
		var datatype = $(this).find("input").attr('name'),
		val = $(this).find("input").val();
		if(val !="" && val!=undefined){
			flag = 0;
			if(datatype=="pl_mprice"){
				$(".inp.oprice").val(val)
			}else if(datatype=="pl_price"){
				$(".inp.nprice").val(val)
			}else{
				$(".inp.countkc").val(val)
			}
		}
	});
	if(flag){
		showErr("请至少输入一个值");
	}else{
		$(".mask_pop,.pop_box").hide();
		inventory = 0;
		$("#speList").find("input").each(function(index, element) {
		  var val = Number($(this).val()), type = $(this).attr("data-type");
		  if(type == "inventory" && val){
		    inventory = Number(inventory + val);
		  }
		});
		$("#inventory").val(parseInt(inventory));

	}

});



$(".pop_box").on("keyup",".pl_ul input",function(){
	var t = $(this),name = t.attr("name");
	var val = t.val();
	if(name=='pl_mprice'||name=='pl_price'){
		var nowval = val.replace(/[^\d\.]/g,'')
		t.val(nowval)
	}else if(name=='pl_kucun'){
		var nowval = val.replace(/\D/g,'')
		t.val(nowval)
	}
});
$(".pop_box").on("blur",".pl_ul input",function(){
	var t = $(this),name = t.attr("name");
	var val = t.val();
	if((name=='pl_mprice'||name=='pl_price') && val!=''){
		var nowval = val.replace(/[^\d\.]/g,'')*1
		t.val(nowval.toFixed(2))
	}
})

$(".speTab").on("keyup",".inp_box .inp",function(){
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
$(".speTab").on("blur",".inp_box .inp",function(){
	var t = $(this),name = t.attr("data-type");
	var val = t.val();
	if((name=='mprice'||name=='price') && val!=''){
		var nowval = val.replace(/[^\d\.]/g,'')*1
		t.val(nowval.toFixed(2))
	}
})

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
          showErr(etip);
        }
        return check;
      }
    }

    //名称
    ,title: function(){
      return this.regexp($("#title"), ".{5,50}", langData['siteConfig'][27][90]);
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
        showErr(etip);
        return false;
      }else{
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

  var inputObj = "";
  //商品属性选择或输入：点击
  $("#proItem input[type=text]").focus(function(){
    var itemList = $(this).siblings(".popup_key");
    inputObj = $(this).attr("id");
    if(itemList.html() != undefined){
      itemList.show();
	  $(this).parents("dd").removeClass("slideup");
	  $(this).parents("dd").addClass("slidedown");
    }
    return false;
  }).blur(function(){
	  var t = $(this);
		setTimeout(function(){
			$(".popup_key").hide();
			 t.parents("dd").removeClass("slidedown");
			 t.parents("dd").addClass("slideup");
		},200)
  });
 $("#proItem dl").each(function(){
	 if($(this).find(".popup_key").size()>0){
		 $(this).children("dd").addClass("slideup")
	 }
 })
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
	var t = $(this);
    var id = $(this).attr("data-id"), val = $(this).attr("title"), parent = $(this).parent().parent();
    if(id && val){
      parent.siblings("input[type=text]").val(val);
	  t.addClass("select").siblings("li").removeClass("select");
    }
    parent.hide();
  });
  $("#proItem").on("input",".inp",function(){
	  var t = $(this);
	  var sib = t.siblings(".popup_key");
	  sib.find('li').each(function(){
		  if(t.val()!=$(this).attr("title"));
		  $(this).removeClass("select");
	  })
  })

  // 商品属性单选
  $("#proItem .radio span").click(function(){
    var t = $(this), id = t.data('id');
    t.addClass('curr').siblings('span').removeClass('curr').siblings('input').val(id);
  })

  //商品运费模板
  $('#logistic').scroller(
    $.extend({
      preset: 'select',
      // group: true
    })
  );
  //获取运费模板详细
  function getLogisticDetail(id){
    $.ajax({
      type: "GET",
      url: "/include/ajax.php?service=shop&action=logisticTemplate&sid="+$("#store").val()+"&id="+id,
      dataType: "jsonp",
      success: function(a) {
        if(a.state == 100){
          $("#logisticDetail").html(a.info).show();
        }
      }
    });
  }
  $("#logistic").change(function(){
    var id = $(this).val();
    if(id == 0){
      $("#logisticDetail").hide();
    }else{
      getLogisticDetail(id);
    }
  });

  //发布商品选择品牌
  $('.demo-select-opt').scroller(
  	$.extend({
      preset: 'select',
      group: true
    })
  );

	//错误提示
  var showErrTimer;
  function showErr(txt){
      showErrTimer && clearTimeout(showErrTimer);
      $(".popErr").remove();
      $("body").append('<div class="popErr"><p>'+txt+'</p></div>');
      $(".popErr p").css({"margin-left": -$(".popErr p").width()/2, "left": "50%"});
      $(".popErr").css({"visibility": "visible"});
      showErrTimer = setTimeout(function(){
          $(".popErr").fadeOut(300, function(){
              $(this).remove();
          });
      }, 1500);
  }




$('.filePicker').each(function(){
  var pid = $(this).attr('data-id');
  //上传凭证
	var $list = $('#fileList'+pid),
		uploadbtn = $('.uploadbtn'),
			ratio = window.devicePixelRatio || 1,
			fileCount = 0,
			thumbnailWidth = 100 * ratio,   // 缩略图大小
			thumbnailHeight = 100 * ratio,  // 缩略图大小
			uploader;

	fileCount = $list.find(".thumbnail").length;

	// 初始化Web Uploader
	uploader = WebUploader.create({
		auto: true,
		swf: staticPath + 'js/webuploader/Uploader.swf',
		server: '/include/upload.inc.php?mod='+modelType+'&type='+upType1,
		pick: '#filePicker'+pid,
		fileVal: 'Filedata',
		accept: {
			title: 'Images',
			extensions: 'jpg,jpeg,gif,png',
			mimeTypes: 'image/jpeg,image/png,image/gif'
		},
		compress: {
			width: 750,
	    height: 750,
	    // 图片质量，只有type为`image/jpeg`的时候才有效。
	    quality: 90,
	    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
	    allowMagnify: false,
	    // 是否允许裁剪。
	    crop: false,
	    // 是否保留头部meta信息。
	    preserveHeaders: true,
	    // 如果发现压缩后文件大小比原来还大，则使用原来图片
	    // 此属性可能会影响图片自动纠正功能
	    noCompressIfLarger: false,
	    // 单位字节，如果图片大小小于此值，不会采用压缩。
	    compressSize: 1024*200
		},
		fileNumLimit: atlasMax,
		fileSingleSizeLimit: atlasSize
	});


	//删除已上传图片
	var delAtlasPic = function(b){
		var g = {
			mod: modelType,
			type: "delAtlas",
			picpath: b,
			randoms: Math.random()
		};
		$.ajax({
			type: "POST",
			url: "/include/upload.inc.php",
			data: $.param(g)
		})
	};

	//更新上传状态
	function updateStatus(){
		if(fileCount == 0){
			$('.imgtip').show();
		}else{
			$('.imgtip').hide();
			if(atlasMax > 1 && $list.find('.litpic').length == 0){
				$list.children('li').eq(0).addClass('litpic');
			}
		}
		$(".uploader-btn .utip").html(langData['siteConfig'][20][303].replace('1',(atlasMax-fileCount)));//还能上传1张图片
	}

	// 负责view的销毁
	function removeFile(file) {
		//console.log(file)
		var $li = $('#'+file.id);
		fileCount--;
		delAtlasPic($li.find("img").attr("data-val"));
		$li.remove();
		updateStatus();
	}

	//从队列删除
	$('body').off("click").delegate(".del", "click", function(){
		var t = $(this), li = t.closest(".thumbnail"), slide = t.closest('.swiper-slide'), index = slide.index();
		var file = [];

		slider1.removeSlide(index);
		file['id'] = $("#slider .swiper-slide").eq(index).attr("id");
		removeFile(file);
		updateStatus();
		setTimeout(function(){
			getDelImg();
		},500)
	});

  //宝贝描述删除图片
  $('body').delegate(".cancel", "click", function(){
    var t = $(this), li = t.closest(".thumbnail"), slide = t.closest('.desc-box'), index = slide.index();
    var file = [];
    file['id'] = slide.attr("id");

    removeFile(file);
    updateStatus();
  });

	// 切换litpic
	if(atlasMax > 1){
		$list.delegate(".item img", "click", function(){
			var t = $(this).parent('.item');
			if(atlasMax > 1 && !t.hasClass('litpic')){
				t.addClass('litpic').siblings('.item').removeClass('litpic');
			}
		});
	}

	// 当有文件添加进来时执行，负责view的创建
	function addFile(file) {
    if (pid == 1) {
  		var $li   = $('<div class="swiper-slide" id="' + file.id + '"><div class="thumbnail"><img></div></div>'),
  				$btns = $('<div class="file-panel"><span class="cancel"></span></div>').appendTo($li),
  				$img = $li.find('img');
    }else {
      var $li = $('<div class="desc-box" id="' + file.id + '"><div class="thumbnail"><img></div></div>'),
          $btns = $('<span class="cancel"></span>').appendTo($li),
          $img = $li.find('img');
    }

		// 创建缩略图
		uploader.makeThumb(file, function(error, src) {
				if(error){
					$img.replaceWith('<span class="thumb-error">'+langData['siteConfig'][6][203]+'</span>');//不能预览
					return;
				}
				$img.attr('src', src);
			}, thumbnailWidth, thumbnailHeight);

			$('body').delegate('.cancel', 'click', function(){
				uploader.removeFile(file, true);
			});

      $('body').delegate('.del', 'click', function(){
				uploader.removeFile(file, true);
			});

      if (pid == 1) {
        $('.slider').addClass('active');
        $('.slider .pagination').show();
        slider.appendSlide($li);
		slider.slideTo($li.index())
        scrollbox();
      }else {
        $('.desc-container').append($li);
      }
	}

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {

		//先判断是否超出限制
		if(fileCount == atlasMax){
			showErr(langData['siteConfig'][20][305]);//图片数量已达上限
			return false;
		}

		fileCount++;
		addFile(file);
		updateStatus();
	});

	// 文件上传过程中创建进度条实时显示。
	uploader.on('uploadProgress', function(file, percentage){
		var $li = $('#'+file.id),
		$percent = $li.find('.progress span');

		// 避免重复创建
		if (!$percent.length) {
			$percent = $('<p class="progress"><span></span></p>')
				.appendTo($li)
				.find('span');
		}
		$percent.css('width', percentage * 100 + '%');
	});

	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on('uploadSuccess', function(file, response){
		var $li = $('#'+file.id);
		if(response.state == "SUCCESS"){
			$li.find("img").attr("data-val", response.url).attr("data-url", response.turl).attr("src", response.turl);
		}else{
			removeFile(file);
			showErr(langData['siteConfig'][44][88]);//上传失败！
		}
	});

	// 文件上传失败，现实上传出错。
	uploader.on('uploadError', function(file){
		removeFile(file);
		showErr(langData['siteConfig'][44][88]);//上传失败！
	});

	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on('uploadComplete', function(file){
		$('#'+file.id).find('.progress').remove();
	});

	//上传失败
	uploader.on('error', function(code){
		var txt = langData['siteConfig'][44][88];//上传失败！
		switch(code){
			case "Q_EXCEED_NUM_LIMIT":
				txt = langData['siteConfig'][20][305];//图片数量已达上限
				break;
			case "F_EXCEED_SIZE":
				txt = langData['siteConfig'][20][307].replace('1',(atlasSize/1024/1024));//图片大小超出限制，单张图片最大不得超过1MB
				break;
			case "F_DUPLICATE":
				txt = langData['siteConfig'][20][308];//此图片已上传过
				break;
		}
		alert(txt);
	});

})

  // 隐藏弹出层
  $('.back-btn').click(function(){
    $(this).closest('.layer').hide();
  })

  // 图片排序弹出层显示
  $('#slider').delegate('.swiper-slide', 'click', function(){
    $('.layer-slider').show();
    getSliderImg();
    showWin();
  })

  // 首页幻灯片变化
  var sliderImg = [], dragHtml = [];
  function getSliderImg(){
    sliderImg = [];
    dragHtml = [];
    $('#slider .swiper-slide').each(function(){
      var t = $(this), imgsrc = t.find('img')[0].src, id = t.attr('id');
      sliderImg.push(imgsrc);
    });

    slider1.removeAllSlides();
    for (var i = 0; i < sliderImg.length; i++) {
    	var cla = i == 0?'curr':'';
      dragHtml.push('<img src="'+sliderImg[i]+'" class="'+cla+'">');
      slider1.appendSlide('<div class="swiper-slide" id="'+id+'"><div class="thumbnail"><img src="'+sliderImg[i]+'"><span class="del"></span></div></div>');
    }
    $('#drag').html(dragHtml.join(''));

  }

  // 弹出层编辑图片删除操作
  var delImg = [], dragHtml1 = [];
  function getDelImg(){
    delImg = [];
    dragHtml1 = [];
    $('#slider1 .swiper-slide').each(function(){
      var t = $(this), imgsrc = t.find('img')[0].src;
      delImg.push(imgsrc);
    });

    slider.removeAllSlides();
    if (delImg.length > 0) {
      for (var i = 0; i < delImg.length; i++) {
        dragHtml1.push('<img src="'+delImg[i]+'">');
        slider.appendSlide('<div class="swiper-slide"><div class="thumbnail"><img src="'+delImg[i]+'"></div></div>');
      }
    }else {
      $('.layer-slider').hide();
      $('#slider').removeClass('active');
      $('.slider .pagination').hide();
      showWin('close');
    }
    $('#drag').html(dragHtml1.join(''));
  }





  // 图片拖拽排序
  var drag = document.getElementById("drag");
  new Sortable(drag);

  var winSct = 0;
  function showWin(type){
    var type = type ? type : 'open';
    if(type == 'open'){
      $('html').addClass('openwin');
      winSct = $(window).scrollTop();
      $('.header').hide();
      $(window).scrollTop(0);

    }else{
      $(window).scrollTop(winSct);
      $('.header').show();
      $('html').removeClass('openwin');
    }
  }

  // 商品规格弹出层显示
  $('.guige-btn').click(function(){
    $('.layer-size').show();
    showWin();
    scrollbox();
  })

  if($('#category').length){
    var config = [];
    $('#category').children().each(function(i){
      var t = $(this), val, txt, id = t.data('id'), pid = t.data('pid');
      if(!id) return;
      if(t.is('optgroup')){
        val = t.attr('label').split('|--')[1];
        if(config[id] == undefined){
          config[id] = {
            typename: val,
            list: []
          };
        }
      }else if(t.is('option')){
        var val = t.attr("value"), txt = t.text().split('|--')[1];
        if(val){
          var selected = t.attr('selected') ? 1 : 0;
          if(pid == undefined){
            config[id] = {
              typename: txt,
              list: [{id: val, 'typename': txt, selected: selected}]
            }
          }else{
            config[pid]['list'].push({id: val, 'typename': txt, selected : selected});
          }
        }
      }
    })

    var html = [];
    for(var i in config){
      var d = config[i];
      html.push('<dl class="fn-clear">');
      html.push('  <dt>');
      html.push('    <label>'+d.typename+'：</label></dt>');
      html.push('  <dd>');
      html.push('    <div class="fn-clear checkbox">');
      for(var s = 0; s < d.list.length; s++){
        if(d.list[s].selected){
          html.push('      <label class="active"><input type="checkbox" name="category[]" value="'+d.list[s].id+'" checked="checked">'+d.list[s].typename+'</label>');
        }else{
          html.push('      <label><input type="checkbox" name="category[]" value="'+d.list[s].id+'">'+d.list[s].typename+'</label>');
        }
      }
      html.push('    </div>');
      html.push('  </dd>');
      html.push('</dl>');
    }

    $('#category').parent().html(html.join(""));

  }

  // 分类弹出层
  $('.storetype-btn').click(function(){

    $('.layer-storetype').show();
    showWin();
    scrollbox();
  })

  // 选择分类
  $("#storeType").delegate("input[type=checkbox]", "click", function(){
    var t = $(this);
    if(!t.is(":checked")){
      t.parent().removeClass('active');
    }else{
      t.parent().addClass('active');
    }
  });
  // 商品确定分类
  $('.layer-storetype .confirm').click(function(){
    var res = [];
    $("#storeType").find("input").each(function(index, element) {
      var t = $(this), txt = t.parent().text();
      if(t.is(":checked")){
        res.push(txt);
      }
    });
    $('#storeTypeCon .selgroup p').text(res.length ? res.join(",") : langData['siteConfig'][20][119]);
    $('.layer-storetype').hide();
    showWin('close');
  })

  // 确定商品详情
  $('.layer-desc .confirm').click(function(){
    $('.layer-desc').hide();
    showWin('close');
  })

    // 关闭图片幻灯
    $('.layer-slider .confirm').click(function(){
        $('.layer-slider').hide();
        showWin('close');
    })


  //选择规格
 	var fth;
 	$("#specification").delegate("input[type=checkbox]", "click", function(){
    var t = $(this);
    if(!t.is(":checked")) t.parent().removeClass('active');
 		createSpecifi();
 	});

 	if(specifiVal.length > 0){
 		createSpecifi();
 	}

 	//规格选择触发
 	function createSpecifi(){
 		if($("#specification").size()==0) return false;
 		var checked = $("#specification input[type=checkbox]:checked");
 		if( checked.length > 0){

 			$("#inventory").val("0").attr("disabled", true);

 			//thead
 			var thid = [], thtitle = [], th1 = [],
 				th2 = '<th>'+langData['siteConfig'][45][101]+' <font color="#f00">*</font></th><th>'+langData['siteConfig'][42][30]+' <font color="#f00">*</font></th><th>'+langData['siteConfig'][19][525]+' <font color="#f00">*</font></th>';//原价 -- 价格 -- 库存
 			for(var i = 0; i < checked.length; i++){
 				var t = checked.eq(i),
 					title = t.parents("dd").attr("data-title"),
 					id = t.parents("dd").attr("data-id");

 				if(thid.indexOf(id) < 0){
 					thid.push(id);
 					thtitle.push(title);
 				}
 			}
 			for(var i = 0; i < thtitle.length; i++){
 				th1.push('<th>'+thtitle[i]+'</th>');
 			}
 			$("#speList thead").html(th1.join('')+th2);

 			//tbody 笛卡尔集
 			var th = new Array(), dl = $("#specification dl");
 			for(var i = 0; i < dl.length - 1; i++){
 				var tid = [];

 				//取得已选规格
 				dl.eq(i).find("input[type=checkbox]:checked").each(function(index, element) {
          var id = $(this).val(), val = $(this).attr("title");
          $(this).closest('label').addClass('active');
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
				// console.log(fth)
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
			var html = [];
			var inventory = 0;
			for(var i = 0; i < fth.length; i++){
				var fthItem = fth[i].split("***"), id = [], val = [];
				if(i!=0 && (fth[i].split("###")[0]==fth[i-1].split("###")[0])){
				}else{
					html.push('<ul>')
				}

				html.push('<li class="item_div"><h4>')
				for(var f = 0 ; f<fthItem.length; f++){
					var proid = fthItem[f].split("###")[0];
					var proname = fthItem[f].split("###")[1];
					id.push(proid);
					val.push(proname);
					if((f+1)==fthItem.length){
						html.push(proname)
					}else{
						html.push(proname+'+')
					}
				}

				html.push('</h4>');
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
				html.push('<div class="inp_box">');
				html.push('<input type="text" id="f_mprice_'+id.join("-")+'" name="f_mprice_'+id.join("-")+'" data-type="mprice" value="'+mprice+'" class="inp oprice" placeholder="输入原价" /><input type="text" id="f_price_'+id.join("-")+'" name="f_price_'+id.join("-")+'" data-type="price" class="inp nprice" value="'+price+'" placeholder="输入现价" /><input type="text" id="f_inventory_'+id.join("-")+'" name="f_inventory_'+id.join("-")+'" data-type="inventory" class="inp countkc" placeholder="输入库存" value="'+f_inventory+'" />')
				html.push('</div></li>');
				if((i+1)<fth.length && (fth[i].split("###")[0] == fth[i+1].split("###")[0])){

				}else{
					html.push('</ul>')
				}
			}
			if(specifiVal.length > 0){
				$("#inventory").val(inventory);
			}
			$("#speList .speTab").html(html.join(""))
			$("#speList").show();
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

  // 商品规格验证
  $('.layer-size .confirm').click(function(){
    if(guigeCheck()){
      $("#speList").find(".tip-inline").hide();
      $('.layer-size').hide();
      showWin('close');
    }else{
		showErr("请补全价格和库存，字段类型为数字！")
      $("#speList").find(".tip-inline").html(langData['siteConfig'][27][93]).show();//
      $("#specification").scrollTop(999);
    }
  })

  // 宝贝描述弹出层出现
  $('.describe-btn').click(function(){
    $('.layer-desc').show();
    showWin();
    scrollbox();
  })

  // 弹出层中间滑动部分
  function scrollbox(drift){
    var headerHeight = $('.header').height(), footHeight = $('.footer').height(),
        winHeight = $(window).height();
    $('.scrollbox').not('#mainBox').css('height', winHeight - headerHeight - footHeight - 20);
  }
  scrollbox();

  function guigeCheck(){

    var r = true;
    //规格表值验证
    $("#speList").find("input").each(function(index, element) {
      var val = $(this).val();
      if(!/^0|\d*\.?\d+$/.test(val)){
        // $(window).scrollTop(Number($("#speList").offset().top)-8);
        $("#speList").find(".tip-inline").removeClass().addClass("tip-inline tip-error");
        $("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][93]);
        r = false;
      }else{
        $("#speList").find(".tip-inline").removeClass().addClass("tip-inline success");
        $("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][94]);
      }
    });

    return r;
  }

  // 提交
  $('.fabubtn').click(function(){
    var btn = $(this);
    var litpic   = '', imglist  = [];
    var empty = false;

    if(btn.hasClass("disabled")) return;

    $("#typeid").val(typeid);
    $("#id").val(id);

    var body = $('.desc-container').html();
    body = body.replace(/WU_FILE_/g, 'WU_FILE_LAST_', body);
    $('#body').val(body);

    $('#slider .swiper-slide').each(function(i){
      var val = $(this).find('img').attr('data-val');
      if(i == 0){
        litpic = val;
      }else{
        imglist.push(val);
      }
    })
    $('#litpic').val(litpic);
    $('#imglist').val(imglist.join(","));


    // var data = [];
    // $('#storeType .active input').each(function(){
    //   var t = $(this);
    //   t.attr('checked', true);
    //   data.push(t.prop('outerHTML'));
    // })
    // $('.layer-size input:checked').each(function(){
    //   data.push($(this).prop('outerHTML'));
    // })
    // $('#storetype_data').html(data.join("")+$('#speList .speTab').html());

    var offsetTop = 0;
    //自定义字段验证
    $("#proItem").find("dl").each(function(){
      var t = $(this), type = t.data("type"), required = parseInt(t.data("required")), tipTit = t.data("title"), tip = t.find(".tip-inline"), input = t.find("input").val();

      if(required == 1){
        //单选
        if(type == "radio"){
          if(input == ""){
            tip.removeClass().addClass("tip-inline tip-error").html("<s></s>"+tipTit);
            if(offsetTop <= 0) offsetTop = t.offset().top;
            empty = true;
          }
        }

        //多选
        if(type == "checkbox"){
          if(t.find("input:checked").val() == "" || t.find("input:checked").val() == undefined){
            tip.removeClass().addClass("tip-inline tip-error").html("<s></s>"+tipTit);
            empty = true;
          }
        }

        //下拉菜单
        if(type == "select"){
          if(input == ""){
            tip.removeClass().addClass("tip-inline tip-error").html("<s></s>"+tipTit);
            if(offsetTop <= 0) offsetTop = t.offset().top;
            empty = true;
          }
        }
      }
    });
    if(empty){
      $('#mainBox').scrollTop(offsetTop - $('.header').height());
      return false;
    }

    if(!regex.title()){
      offsetTop = $("#title").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.mprice()){
      offsetTop = $("#mprice").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.price()){
      offsetTop = $("#price").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.logistic()){
      offsetTop = $("#logistic").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    //规格表值验证
    if(!guigeCheck()){
      $('.guige-btn').click();
      offsetTop = $("#speList").offset().top;
      $('#specification').scrollTop(999);
      return false;
    }

    if(!regex.inventory()){
      offsetTop = $("#inventory").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.limit()){
      offsetTop = $("#limit").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(litpic == ""){
      showMsg(langData['siteConfig'][27][78]);
      $(window).scrollTop(0);
      return false;
    }

    //图集
    if(imglist.length <= 0){
      showMsg(langData['siteConfig'][20][436]);
      $(window).scrollTop(0);
      return false;
    }

    if(body == ''){
      showMsg(langData['shop'][4][66]);
      $('.describe-btn').click();
      return false;
    }

    var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url");
    data = form.serialize();
    $('.layer-storetype input:checked').each(function(){
      var inp = $(this), name = inp.attr('name'), val = inp.attr('value');
      data += '&'+name+'='+val;
    })

    if($('#specificationForm').length){
      var specification = $('#specificationForm').serialize();
      if(specification != '='){
        data += '&' + specification;
      }
    }
    btn.addClass("disabled").html(langData['siteConfig'][6][35]+"...");
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

          showErr(tip);
          setTimeout(function(){
            location.href = url;
          }, 1000)
        }else{
          showErr(data.info);
          btn.removeClass("disabled").html(langData['siteConfig'][11][19]);
          //$("#verifycode").click();
        }
      },
      error: function(){
        showErr(langData['siteConfig'][20][183]);
        btn.removeClass("disabled").html(langData['siteConfig'][11][19]);
        //$("#verifycode").click();
      }
    });
  })
  $("#fabuForm").submit(function(e){
    e.preventDefault();
    $('.fabubtn').click();
  })


	// 上传的颜色
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
					$list.find('img').attr('data-url',response.url).attr('data-src',response.turl)
					$list.siblings(".spePic").val(response.url)
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
				img_box.siblings(".spePic").val('');
			}
		})
	});

})

//点击弹出层拖拽的图片 大图切换
function dragImgClick(dragel){
	var siIndex = $(dragel).index();
	slider1.slideTo(siIndex);
	$(dragel).addClass('curr').siblings('img').removeClass('curr');
}


// 弹出层图片排序
var sortImg = [];
function getImgSort(){
  sortImg = [];
  $('#drag img').each(function(){
    var t = $(this), imgsrc = t[0].src;
    sortImg.push(imgsrc);
  });

  slider.removeAllSlides();
  slider1.removeAllSlides();
  for (var i = 0; i < sortImg.length; i++) {
    slider.appendSlide('<div class="swiper-slide"><div class="thumbnail"><img src="'+sortImg[i]+'"></div></div>');
    slider1.appendSlide('<div class="swiper-slide"><div class="thumbnail"><img src="'+sortImg[i]+'"><span class="del"></span></div></div>');
  }
}
// 错误提示
function showMsg(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}


function in_array(arr, str){
  for(var i in arr){
    if(arr[i] == str) return true;
  }
  return false
}


//生成随机数
function createRandomId() {
	return (Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
}
