$(function(){
	var tabHeight = $('.navbox').offset().top;
	if($('.discrption p').text().length>50){
	 	$('.discrption p').text($('.discrption p').text().substr(0,50));
	 	$('.discrption p').addClass('text_more')
	 	$('.discrption p').append('<a href="javascript:;">全文 </a>');
	 }
	 $(window).scroll(function() {
        if ($(window).scrollTop() > tabHeight) {
            $('.navbox').addClass('topfixed');
        } else {
            $('.navbox').removeClass('topfixed');
        }

		// console.log($('.time_state').offset().top+'===='+$(window).scrollTop());
		for(var i=0;i<$('.con_box .ulbox').length;i++){
			if($('.con_box .ulbox').eq(i).offset().top<=($(window).scrollTop()+$('.navbox').height())){
				$('.navbox ul li').eq(i).addClass('active').siblings('li').removeClass('active');
			}
		}
    });

});
$('.discrption').delegate('a','click',function(){
	$('.fixedWin').addClass('fixedWin-show active');
});
$('.fixedWin-close').click(function(){
	$('.fixedWin').removeClass('fixedWin-show active');
})

$('.navbox').delegate('li','click',function(){
	$(this).addClass('active').siblings('li').removeClass('active');
	var index = $(this).index();
	var st = $('.con_box').find('.ulbox').eq(index).offset().top;
   $(window).scrollTop(st-$('.navbox').height());
});

//初始加载
var page =1, isload=0;
for(var i=0 ; i<$('.con_box .ulbox').length; i++){
    (function(i){
        setTimeout(function(){
        	getlist(i)
        }, i*1000)
    })(i)
}


//加载更多
$('.con_box').delegate('dd.more_btn','click',function(){
	var i =$(this).parents('.ulbox').index();
	$(this).text('加载中').removeClass('more_btn').addClass('loading');
	page++;
	getlist(i)
})

function getlist(id){
    var zhuanti = id == undefined ? ztid : $(".navbox li").eq(id).data("id");
	var url = "/include/ajax.php?service=article&action=alist&mold=&zhuanti="+zhuanti+"&page="+page+"&pageSize=5"

	$.ajax({
        url: url,
        type: "GET",
        dataType: "json", //指定服务器返回的数据类型
        crossDomain:true,
        success: function (data) {
         if(data.state == 100){
         	var datalist = data.info.list,
         	totalCount = data.info.pageInfo.totalCount,
         	totalpage = data.info.pageInfo.totalPage;
         	var html = [];


         	for(var i=0; i<datalist.length; i++){
         		var d = datalist[i];
 				if(d.litpic){
 					html.push('<dd class="libox single_img " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
                    html.push('<div class="_right"><img src="'+datalist[i].litpic+'" /></div>');
                    html.push('<div class="_left"><h2 style="color:'+datalist[i].color+';">'+datalist[i].title+'</h2><p class="art_info"><span class="">'+(datalist[i].source!=''?datalist[i].source:"管理员")+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p></div>');
                    html.push('</a></dd>');
 				}else{
 					html.push('<dd class="libox no_img " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear"><h2>'+d.title+'</h2><p class="art_info"><span class="">'+(datalist[i].source!=''?datalist[i].source:"管理员")+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+d.click+'</i></p></a></dd>');
 				}

//	         	if(d.mold == 0 || (d.mold == 1 && d.group_img.length < 3)){
//                  if(d.litpic){
//                      // 小图
//                      if(d.typeset == 0){
//                          html.push('<dd class="libox single_img " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
//                          html.push('<div class="_right"><img src="'+datalist[i].litpic+'" /></div>');
//                          html.push('<div class="_left"><h2 style="color:'+datalist[i].color+';">'+datalist[i].title+'</h2><p class="art_info"><span class="">'+(datalist[i].source!=''?datalist[i].source:"管理员")+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p></div>');
//                          html.push('</a></dd>');
//                      // 大图
//                      }else{
//                          html.push('<dd class="libox big_img " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
//                          html.push('<h2 style="color:'+datalist[i].color+';">'+datalist[i].title+'</h2>');
//                          html.push('<div class="img_box"><img src="'+datalist[i].litpic+'"/></div>');
//                          html.push('<p class="art_info"><span class="">'+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
//                          html.push('</a></dd>');
//                      }
//                  }else{
//                      html.push('<dd class="libox no_img " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear"><h2>'+d.title+'</h2><p class="art_info"><span class="">'+(datalist[i].source!=''?datalist[i].source:"管理员")+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+d.click+'</i></p></a></dd>');
//                  }
//              // 图集
//              }else if(d.mold == 1){
//
//                  var pics = [];
//                  for(var n = 0; n < d.group_img.length && n < 3; n++){
//                    pics.push('<li><img src="'+d.group_img[n].path+'"></li>');
//                  }
//
//                  html.push('<dd class="libox more_img " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
//                  html.push('<h2 style="color:'+datalist[i].color+';">'+datalist[i].title+'</h2>');
//                  html.push('<ul class="pics_box">'+pics.join("")+'</ul>');
//                  html.push('<p class="art_info"><span class="">'+(datalist[i].source!=''?datalist[i].source:"管理员")+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
//                  html.push('</a></dd>');
//              }else if(d.mold ==2){
//              	html.push('<dd class="libox big_img vbox " data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
//                  html.push('<h2 style="color:'+datalist[i].color+';">'+datalist[i].title+'</h2>');
//                  html.push('<div class="img_box"><img src="'+datalist[i].litpic+'"/><i class="time">'+(datalist[i].videotime_)+'</i></div>');
//                  html.push('<p class="art_info"><span class="">'+(datalist[i].source!=''?datalist[i].source:"管理员")+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
//                  html.push('</a></dd>');
//              }





         	}



         	$('.con_box .ulbox').eq(id).find('dd.loading').remove();
         	$('.con_box .ulbox').eq(id).append(html.join(''));

         	if(totalCount>5){
         		$('.con_box .ulbox').eq(id).append('<dd class="more_btn"><a href="javascript:;">展开更多</a></dd>');
         	}else if(totalCount==0){
         		console.log(id)
         		$('.con_box .ulbox').eq(id).append('<div class="loading"><a href="javascript:;">暂无数据</a></div>');
         	}

         	if(page == totalpage){
                isload = 1;
                $('.con_box .ulbox').eq(id).find('dd.more_btn').remove();
                if(page!=1){
                	$('.con_box .ulbox').eq(id).append('<div class="loading"><span>已全部加载</span></div>');
                }

            }

         }else{
         	$('.con_box .ulbox').eq(id).append('<div class="loading"><span>暂无数据</span></div>');
         }
        },
        error:function(err){
        	console.log('fail');
        }
     });
}
