
var device = navigator.userAgent;
if(device.indexOf('huoniao') > -1){
  $('.areaChose').bind('click', function(e){
    e.preventDefault();
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler('goToCity', {'module': 'article'}, function(){});
    });
  });
} 
var swiper = new Swiper('.banner', {
		 pagination:{
   	    	el:'.swiper-pagination'
   	    	},
   	    autoplay:{
   	    	delay:2000,
   	    	disableOnInteraction: false,
   	    },
   	   
    	direction: 'horizontal',
      	spaceBetween : 4,
	    loop: true,
	    slidesPerView : 1.22,
	    centeredSlides : true
    });

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

//滚动加载
//触底加载数据
var page = 1,isload = 0;
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


//初始加载
getdata();

//列表加载

function getdata(){
    isload = 1;
	$('.news_box').append('<div class="loading"><img src="'+templets_skin+'images/loading.gif"><span>加载中</span></div>')
	$.ajax({
        url: "/include/ajax.php?service=article&action=alist&mold=0,1&zhuanti=is&page="+page+"&pageSize=5",
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
         		html.push('<li class="libox single_img tbox"><a href="'+datalist[i].url+'" class="fn-clear">');
	         	html.push('<div class="_right"><img src="'+datalist[i].litpic+'" /></div>');
	         	html.push('<div class="_left"><h2>'+datalist[i].title+'</h2><p class="art_info"><span class="">'+datalist[i].writer+' · '+returnHumanTime(datalist[i].pubdate,3)+'</span><i>'+datalist[i].click+'</i>  </p></div>');
	         	html.push('</a></li>');
         	}
         	
         	$('.loading').remove();
         	$('.tlist_box ul').append(html.join(''));
         	if(page == totalpage){
//              console.log('true')
                isload = 1;
                $('.tlist_box').append('<div class="loading"><span>已全部加载</span></div>');
             }
         	
         }
        },
        error:function(err){
            isload = 0;
        	console.log('fail');
        }
     });
}

$('.formatTime').not('.change').each(function(){
    var t = $(this), time = t.attr('data-time');
    if(!time) return;
    var r = returnHumanTime(parseInt(time), 3);
    t.html(r);
    t.addClass('change');
})