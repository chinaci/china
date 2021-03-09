$(function(){

	var foo = $('.main tbody tr').length;

	//删除按钮
	$('.main').delegate('.del', 'click', function(){
		var t = $(this), tr = t.closest('tr');
		if(confirm('确认要删除吗？')){
			tr.remove();
			$('.addBtn').show();
		}
	});

	//新增按钮
	$('.addBtn').bind('click', function(){
		var html = '<tr>';
			html += '<td><input type="text" class="input-small" name="bottomButton[name]['+foo+']" /></td>';
			html += '<td class="thumb clearfix listImgBox">';
			html += '<div class="uploadinp filePicker thumbtn uplogo" id="filePicker'+foo+'" data-type="logo"  data-count="1" data-size="'+thumbSize+'" data-imglist=""><iframe src ="/include/upfile.inc.php?mod=siteConfig&type=logo&obj=icon'+foo+'&filetype=image" scrolling="no" class="h" frameborder="0" marginwidth="0" marginheight="0" ></iframe></div>';
			html += '<ul id="listSection'+foo+'" class="listSection thumblist fn-clear"></ul>';
			html += '<input type="hidden" id="icon'+foo+'" name="bottomButton[icon]['+foo+']" class="imglist-hidden">';
			html += '</td>';
			html += '<td class="thumb clearfix listImgBox">';
			html += '<div class="uploadinp filePicker thumbtn" id="filePicker'+foo+'1" data-type="logo"  data-count="1" data-size="'+thumbSize+'" data-imglist=""><iframe src ="/include/upfile.inc.php?mod=siteConfig&type=logo&obj=icon_h'+foo+'&filetype=image" scrolling="no" class="h" frameborder="0" marginwidth="0" marginheight="0" ></iframe></div>';
			html += '<ul id="listSection'+foo+'1" class="listSection thumblist fn-clear"></ul>';
			html += '<input type="hidden" id="icon_h'+foo+'" name="bottomButton[icon_h]['+foo+']" class="imglist-hidden">';
			html += '</td>';
			html += '<td><textarea style="width: 300px;" name="bottomButton[url]['+foo+']"></textarea></td>';
			html += '<td><input type="checkbox" name="bottomButton[fabu]['+foo+']" value="1"></td>';
			html += '<td><input type="checkbox" name="bottomButton[message]['+foo+']" value="1"></td>';
			html += '<td><input type="text" class="input-small" name="bottomButton[code]['+foo+']" /></td>';
			html += '<td><a href="javascript:;" class="del"><i class="icon-trash"></i></a></td>';
			html += '</tr>';
		foo++;
		$('.main tbody').append(html);

		if($('.main tbody tr').length == 5){
			$('.addBtn').hide();
		}
	});

	//删除图片
	$('.main').delegate('.delpic', 'click', function(){
		var t = $(this), td = t.closest('td'), uploadinp = td.find('.uploadinp'), listSection = td.find('.listSection'), val = td.find('img').attr('data-val'), iframe = td.find('iframe');
		var imginp = td.find('.imglist-hidden');
		delFile(val, false, function(){
			uploadinp.show();
			listSection.hide();
			imginp.val('');
			iframe.attr('src', iframe.attr('src'));
		});
	});


	//表单提交
    $("#btnSubmit").bind("click", function(event) {
        event.preventDefault();

        //异步提交
        var post = $("#editform").serialize();

        huoniao.operaJson("?dopost=save", post, function(data){
            var state = "success";
            if(data.state != 100){
                state = "error";
            }
            huoniao.showTip(state, data.info, "auto");
        });
    });


});

//上传成功
function uploadSuccess(obj, file, filetype){
	var inp = $('#' + obj);
	inp.val(file);
	inp.siblings('.uploadinp').hide();
	inp.siblings('.listSection').html('<li><a href="'+cfg_attachment+file+'" target="_blank" title=""><img src="'+cfg_attachment+file+'" data-val="'+file+'"/></a><a class="reupload li-rm delpic" href="javascript:;">重新上传</a></li>').attr('style', 'display: inline-block');
}

//删除已上传的文件
function delFile(b, d, c) {
	var g = {
		mod: "siteConfig",
		type: "delLogo",
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
