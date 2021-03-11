var history_search = 'wm_history_search';


//提交搜索
function check(){
	var keywords = $.trim($("#keywords").val());

	//记录搜索历史
	var history = utils.getStorage(history_search);
	history = history ? history : [];
	if(history && history.length >= 10 && $.inArray(keywords, history) < 0){
		history = history.slice(1);
	}

	// 判断是否已经搜过
	if($.inArray(keywords, history) > -1){
		for (var i = 0; i < history.length; i++) {
			if (history[i] === keywords) {
				history.splice(i, 1);
				break;
			}
		}
	}
	history.push(keywords);

	utils.setStorage(history_search, JSON.stringify(history));
}


$(function(){
	$("#keywords").focus();
  
	//加载历史记录
	var hlist = [];
	var history = utils.getStorage(history_search);
	console.log(history)
	if(history){
		history.reverse();
		for(var i = 0; i < history.length; i++){
			hlist.push('<li><a href="javascript:;">'+history[i]+'</a></li>');
		}
		$('.history ul').html(hlist.join(''));
		$('.all_shan, .history').show();
	}

	//点击历史记录
	$('.history a').bind('click', function(){
		var t = $(this), txt = t.text();
		$('#keywords').val(txt);
		$('#searchForm').submit();
	});

	//清空
	$('.all_shan').bind('click', function(){
		utils.removeStorage(history_search);
		$('.all_shan, .history').hide();
		$('.history ul').html('');
	});

});
