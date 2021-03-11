//更多导航栏展开，关闭
$('.more_nav').click(function(){
	$('.nav_all').animate({'bottom':'0'},200);
});
$('.close_btn').click(function(){
	$('.nav_all').animate({'bottom':'-100%'},200);
});

$('.nav_all').delegate('li','click',function(){
	$(this).addClass('nav_on');
	$('.nav_all').animate({'bottom':'-100%'},200);
});

$('.f_nav').delegate('li','click',function(){
	$(this).addClass('active').siblings('li').removeClass('active');
	var scroll =$(this).offset().left+$(this).width()
//	console.log($(this).offset().left+'==='+.03*$(window).width())
	if(scroll>.9*$(window).width()){
		 $('.f_nav').scrollLeft($(this).offset().left)
	}else if($(this).offset().left<.03*$(window).width()){
		$('.f_nav').scrollLeft(scroll)
	}
})


//分站导航显示
$('body').delegate('.s_nav a i','click',function(e){
	$('.s_box').show();
	$(document).click(function(){
		$('.s_box').hide();
	})
	e.stopPropagation(); 
});

$('body').delegate('.s_box li ','click',function(e){
	var txt = $(this).text();
	$(this).addClass('s_active').siblings().removeClass('s_active')
	$('.s_nav').find('a').html(txt+'<i></i>')
});


//关注
$('.news_box').on('click','.carebtn',function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
		}
		
		if($(this).hasClass('caredbtn')){
			$(this).html('关注');   //关注
			$(this).removeClass('caredbtn')
		}else{
			$(this).html('已关注');  //已关注
			$(this).addClass('caredbtn')
		}

		var mediaid = $(this).attr("data-id");

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+mediaid);

	});
//关注
	$('.news_box').delegate('.care','click',function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
		}
		
		if($(this).hasClass('cared')){
			$(this).html('关注');   //关注
			$(this).removeClass('cared')
		}else{
			$(this).html('已关注');  //已关注
			$(this).addClass('cared')
		}

		var mediaid = $(this).attr("data-id");

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+mediaid);
		return false;
	});
	
var page=1,isload=0;
getdata();

//滚动加载
$(window).scroll(function() {
	var allh = $('body').height();
	var w = $(window).height();
	var scroll = allh - w;
	
	if ($(window).scrollTop() >= scroll&& !isload) {
		console.log(111)
	    page++;
	    getdata_gz(page)
	    getdata();
	};
});
function getdata(){
	$('.news_box').append('<div class="loading"><img src="'+templets+'images/loading.png"></div>')
	$.ajax({
        url: "/include/ajax.php?service=article&action=alist&mold=0&page="+page+"&pageSize=5",
        type: "GET",
        dataType: "json", //指定服务器返回的数据类型
        crossDomain:true,
        success: function (data) {
         if(data.state == 100){
         	var datalist = data.info.list,
         	totalpage = data.info.pageInfo.totalPage;
         	var html = [];
         	for(var i=0; i<datalist.length; i++){
         		if(i%3==0){
         			html.push('<div class="libox single_img">');
         			html.push('<div class="media_info fn-clear"><div class="media_name"><span><img src="'+templets+'upfile/img_3.png"></span>'+datalist[i].source+'</div><a href="javascript:;" class="carebtn">关注</a></div>');
         			html.push('<a href="'+datalist[i].url+'" class="fn-clear">');
	         		html.push('<div class="_right"><img src="'+datalist[i].litpic+'" /></div>');
	         		html.push('<div class="_left"><h2>'+datalist[i].title+'</h2><p class="art_info"><span class="">'+huoniao.transTimes(datalist[i].pubdate,3)+'</span><i>'+datalist[i].click+'</i>  </p></div>');
	         		html.push('</a></div>');
         		}else if(i%3==1){
         			html.push('<div class="libox more_img">');
         			html.push('<div class="media_info fn-clear"><div class="media_name"><span><img src="'+templets+'upfile/img_3.png"></span>'+datalist[i].source+'</div><a href="javascript:;" class="carebtn">关注</a></div>');
         			html.push('<a href="'+datalist[i].url+'" class="fn-clear">');
	         		html.push('<h2>'+datalist[i].title+'</h2>');
	         		html.push('<ul class="pics_box"><li><img src="'+datalist[i].litpic+'"></li><li><img src="'+templets+'upfile/img_4.png"></li><li><img src="'+templets+'upfile/img_5.png"></li></ul>');
	         		html.push('<p class="art_info"><span>'+huoniao.transTimes(datalist[i].pubdate,3)+'</span><i>'+datalist[i].click+'</i>  </p>');
	         		html.push('</a></div>');
         		}else if(i%3==2){
         			html.push('<div class="libox big_img">');
         			html.push('<div class="media_info fn-clear"><div class="media_name"><span><img src="'+templets+'upfile/img_3.png"></span>'+datalist[i].source+'</div><a href="javascript:;" class="carebtn">关注</a></div>');
         			html.push('<a href="'+datalist[i].url+'" class="fn-clear">');
	         		html.push('<h2>'+datalist[i].title+'</h2>');
	         		html.push('<div class="img_box"><img src="'+datalist[i].litpic+'"/></div>');
	         		html.push('<p class="art_info"><span class="">'+huoniao.transTimes(datalist[i].pubdate,3)+'</span><i>'+datalist[i].click+'</i>  </p>');
	         		html.push('</a></div>');
         		}
         		
         	}
         	
         	$('.loading').remove();
         	$('.news_box').append(html.join(''));
         	if(page == totalpage){
//              console.log('true')
                isload = 1;
                $('.news_box').append('<div class="loading"><span>已全部加载</span></div>');
             }
         	
         }
        },
        error:function(err){
        	console.log('fail');
        }
     });
}	
	
	
	
//推荐关注
function getdata_gz(page){
	$.ajax({
        url: "/include/ajax.php?service=article&action=alist&mold=0&page="+page+"&pageSize=5",
        type: "GET",
        dataType: "json", //指定服务器返回的数据类型
        crossDomain:true,
        success: function (data) {
         if(data.state == 100){
         	var datalist = data.info.list;
         	var html = [];
         	for(var i=0; i<datalist.length; i++){
         		html.push('<li class="dbox"><a href="#">');
         		html.push('<div class="headimg"><img src="'+datalist[i].litpic+'"></div>');
         		html.push('<div class="media_info"><h2>'+datalist[i].writer+'</h2><p class="art_text">10年拍摄摄影剪辑经验_分享 </p><span data-id="'+datalist[i].id+'" class="care">关注</span></div>');
         		html.push('</a></li>');
         	}
         	$('.news_box').append('<div class="mediabox"><h1>大家都关注 <a href="#" class="more">更多</a></h1><ul class="dlbox">'+html.join('')+'</ul></a></div>	');
         }
        },
        error:function(err){
        	console.log('fail');
        }
     });
}
	
	
	
	
	
	
	
	
	
	
//判断登录
function checkLogin(){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
        window.location.href = masterDomain+'/login.html';
        return false;
    }
}


