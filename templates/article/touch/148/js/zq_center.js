$(function(){
	var swiper = new Swiper('.banner', {
		 pagination:{
   	    	el:'.pagenum'
   	    	},
   	    autoplay:{
   	    	delay:2000,
   	    	disableOnInteraction: false,
   	    },
    	direction: 'horizontal',
	    loop: true,
	    centeredSlides : true
    });
new Swiper('.nav_box .swiper-container', {pagination: '', paginationClickable: true, loop: false,  slidesPerView: 4,});
$('.mediaBox').on('click','.btn_care',function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
		}

		if($(this).hasClass('cared')){
			$(this).html('<s></s>关注');   //关注
			$(this).removeClass('cared')
		}else{
			$(this).html('<s></s>已关注');  //已关注
			$(this).addClass('cared')
		}

		var mediaid = $(this).attr("data-id");

		$.post("/include/ajax.php?service=member&action=followMember&for=media&id="+mediaid);

});


var page = 1,isload=0, media_arctype = 0;
//初始加载
getdata();

$(".nav_box li a").click(function(){
    var t = $(this), id = t.data("id");
    $(".nav_box li a").removeClass('active');
    if(t.attr("href").indexOf("javascript") == 0){
        t.addClass('active');
        media_arctype = id;
        getdata(1);
    }
})

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


function getdata(tr){
    if(tr){
        $('.fabu_box .ulbox').html('');
        page = 1;
    }
    isload = 1;
	$('.fabu_box').append('<div class="loading"><img src="'+templets_skin+'images/loading.png"></div>')
	$.ajax({
        url: "/include/ajax.php?service=article&action=alist&mold=&media="+mediaid+"&media_arctype="+media_arctype+"&page="+page+"&pageSize=5",
        type: "GET",
        dataType: "json", //指定服务器返回的数据类型
        crossDomain:true,
        success: function (data) {
         if(data.state == 100){
            isload = 0;
         	var datalist = data.info.list,
         	totalpage = data.info.pageInfo.totalPage;
         	var html = [];
         	for(var i=0; i<datalist.length; i++){
                var d = datalist[i];

                // 头条
                if(d.mold == 0){
                    if(d.litpic){
                        // 小图
                        if(d.typeset == 0){
                            html.push('<li class="libox single_img" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
                            html.push('<div class="_right"><img src="'+datalist[i].litpic+'" /></div>');
                            html.push('<div class="_left"><h2>'+datalist[i].title+'</h2><p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p></div>');
                            html.push('</a></li>');
                        // 大图
                        }else{
                            html.push('<li class="libox big_img" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
                            html.push('<h2>'+datalist[i].title+'</h2>');
                            html.push('<div class="img_box"><img src="'+datalist[i].litpic+'"/></div>');
                            html.push('<p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
                            html.push('</a></li>');
                        }
                    }else{
                        html.push('<li class="libox no_img" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear"><h2>'+d.title+'</h2><p class="art_info"><span class="">'+d.source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+d.click+'</i></p></a></li>');
                    }
                // 图集
                }else if(d.mold == 1){
                    html.push('<li class="libox more_img" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
                    html.push('<h2>'+datalist[i].title+'</h2>');
                    html.push('<ul class="pics_box">');
					var pics = [];
					for (var n = 0; n < datalist[i].group_img.length && n < 3; n++) {
						pics.push('<li><img src="' + datalist[i].group_img[n].path + '" /></li>');
					}
					html.push(pics.join(""));
					html.push('</ul>');
                    html.push('<p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
                    html.push('</a></li>');
                }else if(d.mold==2){
                	html.push('<li class="libox big_img vbox " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
                    html.push('<h2 style="color:'+datalist[i].color+';">'+datalist[i].title+'</h2>');
                    html.push('<div class="img_box"><img src="'+datalist[i].litpic+'"/><i class="time">'+(datalist[i].videotime_)+'</i></div>');
                    html.push('<p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
                    html.push('</a></li>');
                }

         	}

         	$('.loading').remove();
         	$('.fabu_box .ulbox').append(html.join(''));
            if(tr){
                // $(window).scrollTop($('.fabu_box').offset().top);
                // setTimeout(function(){
                //     isload = 0;
                // }, 1000)
            }
         	if(page == totalpage){
//              console.log('true')
                isload = 1;
                $('.fabu_box').append('<div class="loading"><span>已全部加载</span></div>');
             }

         }else{
            $('.loading').remove();
            if(page > 1){
                $('.fabu_box .ulbox').append('<div class="loading"><span>已全部加载</span></div>');
            }else{
                $('.fabu_box .ulbox').append('<div class="loading"><span>暂无数据</span></div>');
            }
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

})
