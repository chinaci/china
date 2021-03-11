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


var page = 1,isload=0;
//初始加载
getdata();

//滚动加载
$(window).scroll(function() {
	var allh = $('body').height();
	var w = $(window).height();
	var scroll = allh - w;
	
	if ($(window).scrollTop() >= scroll&& !isload) {
		console.log(111)
	    page++;
	    getdata();
	};
});
function getdata(){
	$('.news_box').append('<div class="loading"><img src="'+templets_skin+'images/loading.png"></div>')
	$.ajax({
        url: "/include/ajax.php?service=article&action=alist&mold=2&page="+page+"&pageSize=10",
        type: "GET",
        dataType: "json", //指定服务器返回的数据类型
        crossDomain:true,
        success: function (data) {
         if(data.state == 100){
         	var datalist = data.info.list,
         	totalpage = data.info.pageInfo.totalPage;
         	var html = [];
         	for(var i=0; i<datalist.length; i++){
         		html.push('<li class="libox big_img vbox"><a href="'+datalist[i].url+'" class="fn-clear">');
         		html.push('<h2>'+datalist[i].title+'</h2>')
	         	html.push('<div class="img_box"><img src="'+datalist[i].litpic+'" /><i class="time">'+(datalist[i].videotime_)+'</i></div>');
	         	html.push('<p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(datalist[i].pubdate,3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
	         	html.push('</a></li>');
         	}
         	
         	$('.loading').remove();
         	$('.news_box .ulbox').append(html.join(''));
         	if(page == totalpage){
                isload = 1;
                $('.news_box').append('<div class="loading"><span>已全部加载</span></div>');
             }
         	
         }else{
          $('.loading').remove();
          $('.news_box').append('<div class="loading"><span>暂无数据</span></div>');
         }
        },
        error:function(err){
        	console.log('fail');
        }
     });
}