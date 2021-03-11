$(function(){
	//APP端取消下拉刷新
toggleDragRefresh('off');
//点击切换
var page=1,isload=0


$('.list_left').delegate('li','click',function(){
	$(this).addClass('on').siblings('li').removeClass('on');
	$('.list_right ul').html('');
	page = 1;  //重新加载新的分类
    isload = 0;
	getlist();
});
getlist();
//滚动加载
$('.list_right').scroll(function() {
	var nDivHight2 = $(".list_right").height();
	 nScrollHight = $(this)[0].scrollHeight;
     nScrollTop = $(this)[0].scrollTop;
     if (nScrollTop + nDivHight2 >= nScrollHight) {
     	 page++;
         getlist();
     }
});


//关注
$('.list_right').delegate('.carebtn','click',function(){
		var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
			return false;
		}
		
	if($(this).hasClass('caredbtn')){
		$(this).removeClass('caredbtn').html('关注');
	}else{
		$(this).addClass('caredbtn').html('已关注');
	}
	var mediaid = $(this).attr("data-id");
	$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+mediaid);
		
	return false;
	
});




function getlist(){
    isload = 1;
	$('.list_right').append('<div class="loading"><img src="'+templets_skin+'images/loading.png"></div>')
    var type = $(".list_left li.on").data("id")||0;
    $('.loading').remove();
	$.ajax({
        url: "/include/ajax.php?service=article&action=selfmedia&ac_field="+type+"&page="+page+"&pageSize=10",
        type: "GET",
        dataType: "json", //指定服务器返回的数据类型
        crossDomain:true,
        success: function (data) {
            isload = 0;
         if(data.state == 100){
         	var datalist = data.info.list,
         	totalpage = data.info.pageInfo.totalPage;
         	var html = [];
         	for(var i=0; i<datalist.length; i++){
                var d = datalist[i];
         		html.push('<li class="media_box"><a href="'+d.url+'">');
         		html.push('<div class="left_head"><img src="'+datalist[i].photo+'"></div>')
                // 已关注
                if(d.isfollow == 1){
                    gz = '<span data-id="'+datalist[i].id+'" class="carebtn caredbtn">已关注</span>';
                }else if(d.isfollow == 0){
                    gz = '<span data-id="'+datalist[i].id+'" class="carebtn">关注</span>';
                }else{
                    gz = '<span data-id="'+datalist[i].id+'" class="carebtn disabled">关注</span>';
                }
	         	html.push(gz);
	         	html.push('<div class="right_info"><h2>'+datalist[i].name+'</h2><p class="intr">'+datalist[i].profile+'</p><p class="count"><span>文章数:<em>'+datalist[i].total_article+'</em></span><span>浏览量:<em>'+returnHumanClick(datalist[i].click)+'</em></span><span>粉丝:<em>'+returnHumanClick(datalist[i].total_fans)+'</em></span></p></div>');
	         	html.push('</a></li>');
         	}
         	
         	$('.loading').remove();
         	$('.list_right ul').append(html.join(''));
         	if(page == totalpage){
                isload = 1;
//              $('.news_box').append('<div class="loading"><span>已全部加载</span></div>');
             }
         	
         }else{
            $('.loading').remove();
            if(page > 1){
                $('.list_right').append('<div class="loading"><span>已全部加载</span></div>');
            }else{
                $('.list_right').append('<div class="loading"><span>暂无数据</span></div>');
            }
         }
        },
        error:function(err){
            isload = 0;
        	console.log('fail');
        }
     });
}

})
