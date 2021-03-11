// 判断设备类型，ios全屏
var device = navigator.userAgent;
if (device.indexOf('__iOS') > -1) {
  $('body').addClass('__iOS');
  $('.head .close').hide();
}
var huoniao = {
  transTimes: function(timestamp, n){
		update = new Date(timestamp*1000);//时间戳要乘1000
		year   = update.getFullYear();
		month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
		day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
		hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
		minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
		second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
		if(n == 1){
			return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
		}else if(n == 2){
			return (year+'-'+month+'-'+day);
		}else if(n == 3){
			return (month+'-'+day);
		}else{
			return 0;
		}
	}
  //获取附件不同尺寸
	,changeFileSize: function(url, to, from){
		if(url == "" || url == undefined) return "";
		if(to == "") return url;
		var from = (from == "" || from == undefined) ? "large" : from;
		var newUrl = "";
		if(hideFileUrl == 1){
			newUrl =  url + "&type=" + to;
		}else{
			newUrl = url.replace(from, to);
		}

		return newUrl;

	}

}
var history_search = 'index_history_search';
$(function(){ 
	
	var loadMoreLock = false, page = 1, isend = false;
	//点击搜索按钮
  $('.btn-go').click(function(){
  	var keywords = $('#keywords').val()
  	
	$('.textIn-box ').submit();
	
  });
	//点击搜索记录时搜索
	$('.search-history,.search-hot').delegate('li','click',function(){
		var keywords= $(this).find('a').text();
		$('#keywords').val(keywords);
//		alert($('#keywords').val())
		$('.textIn-box ').submit();
		
	})
		
		
	//切换导航
	$('.slideNav a').click(function(){
		$(this).addClass('slide-on').siblings().removeClass('slide-on');
		$('#action').val($('.slide-on').attr('data-action'));
	});
	$('.slideNav a').first().click();
	


	//加载历史记录
	var hlist = [];
	var history = utils.getStorage(history_search);
	if(history){
		history.reverse();
		for(var i = 0; i < history.length; i++){
			hlist.push('<li><a href="javascript:;">'+history[i]+'</a></li>');
		}
		$('.search-history ul').html(hlist.join(''));
		$('.all_shan, .search-history').show();
	}

	
	

	//清空
	$('.all_shan').bind('click', function(){
		utils.removeStorage(history_search);
		$('.all_shan, .search-history').hide();
		$('.search-history ul').html('');
	});
	
	
	
	
})

$('.textIn-box').submit(function(e){
	var keywords = $('#keywords').val(); 
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
	var hlist = [];
		for(var i = 0; i < history.length; i++){
			hlist.push('<li><a href="javascript:;">'+history[i]+'</a></li>');
		}
		$('.search-history ul').html(hlist.join(''));
		$('.all_shan, .search-history').show();

	utils.setStorage(history_search, JSON.stringify(history));
})
