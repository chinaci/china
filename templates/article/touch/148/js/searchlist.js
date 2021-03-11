$(function(){
	var page=1,isload=0
	$('.search_list').delegate('.carebtn','click',function(e){
	    e.stopPropagation();
	    var id = $(this).closest('li').attr('data-id');
		if($(this).hasClass('caredbtn')){
			$(this).removeClass('caredbtn').html('关注');
		}else{
			$(this).addClass('caredbtn').html('已关注');
		}
	    $.post("/include/ajax.php?service=member&action=followMember&for=media&id="+id);
	    return false;
	});
	
	$('.tab a').on('click',function(){
		$(this).addClass('onchose').siblings().removeClass('onchose');
		page=1;
		$('.search_list ul').html('');
		getlist();
	})
	
	getlist();
	
	//点击搜索
	$('.top_head button').click(function(){
		page=1;
		$('.search_list ul').html('');
		getlist()
	})
	
	
	//滚动加载
	$(window).scroll(function() {
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w;
		if ($(window).scrollTop() >= scroll && !isload) {
		    page++;
		    $(".onchose").attr('data-page',page);
		    getlist();
		};
	});
	
	function getlist(){
	
	    isload = 1;
	
		var keywords = $('#keywords').val();
	    var type = $(".onchose").index();
	    var page = $(".onchose").attr('data-page');
		console.log(keywords)
	    var url = type == 0 ? "/include/ajax.php?service=article&action=alist&mold=0,1&page="+page+"&pageSize=10&title="+decodeURIComponent(keywords) : "/include/ajax.php?service=article&action=selfmedia&page="+page+"&pageSize=10&title="+decodeURIComponent(keywords);
	  $('.loading').remove();
		$('.search_list').append('<div class="loading"><img src="'+templets_skin+'images/loading.png"></div>')
		$.ajax({
	        url: url,
	        type: "GET",
	        dataType: "json", //指定服务器返回的数据类型
	        crossDomain:true,
	        success: function (data) {
	            isload = 0;
	         if(data.state == 100){
	         	var datalist = data.info.list,
	         	totalpage = data.info.pageInfo.totalPage;
	         	var html = [];
	            if(type == 0){
	             	for(var i=0; i<datalist.length; i++){
	                    var d = datalist[i];
	                    // 头条
	                    if(d.mold == 0 || (d.mold == 1 && d.group_img.length < 3)){
	                        if(d.litpic){
	                            // 小图
	                            if(d.typeset == 0){
	                                html.push('<li class="libox single_img libox-'+type+'" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
	                                html.push('<div class="_right"><img src="'+datalist[i].litpic+'" /></div>');
	                                html.push('<div class="_left"><h2>'+datalist[i].title+'</h2><p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p></div>');
	                                html.push('</a></li>');
	                            // 大图
	                            }else{
	                                html.push('<li class="libox big_img libox-'+type+'" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
	                                html.push('<h2>'+datalist[i].title+'</h2>');
	                                html.push('<div class="img_box"><img src="'+datalist[i].litpic+'"/></div>');
	                                html.push('<p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
	                                html.push('</a></li>');
	                            }
	                        }else{
	                            html.push('<li class="libox no_img libox-'+type+'" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear"><h2>'+d.title+'</h2><p class="art_info"><span class="">'+d.source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+d.click+'</i></p></a></li>');
	                        }
	                    // 图集
	                    }else if(d.mold == 1){
	
	                        var pics = [];
	                        var n = 0;
	                        for(var n = 0; n < d.group_img.length && n < 3; n++){
	                          pics.push('<li><img src="'+d.group_img[n].path+'"></li>');
	                        }
	
	                        html.push('<li class="libox more_img libox-'+type+'" data-id="'+d.id+'"><a href="'+d.url+'" class="fn-clear">');
	                        html.push('<h2>'+datalist[i].title+'</h2>');
	                        html.push('<ul class="pics_box">'+pics.join("")+'</ul>');
	                        html.push('<p class="art_info"><span class="">'+datalist[i].source+' · '+returnHumanTime(d.pubdate, 3)+'</span><i>'+returnHumanClick(datalist[i].click)+'</i>  </p>');
	                        html.push('</a></li>');
	                    }
	             	}
	             }else{
	                for(var i=0; i<datalist.length; i++){
	                    html.push('<li class="media_box" data-id="'+datalist[i].id+'"><a href="'+datalist[i].url+'">');
	                    html.push('<div class="left_head"><img src="'+datalist[i].photo+'"></div>')
	                    if(datalist[i].isfollow == 1){
	                        html.push('<span class="carebtn caredbtn">已关注</span>');
	                    }else{
	                        html.push('<span class="carebtn">关注</span>');
	                    }
	                    html.push('<div class="right_info"><h2>'+datalist[i].name+'</h2><p class="intr">'+datalist[i].profile+'</p><p class="count"><span>文章数:<em>'+datalist[i].total_article+'</em></span><span>浏览量:<em>'+returnHumanClick(datalist[i].click)+'</em></span><span>粉丝:<em>'+returnHumanClick(datalist[i].total_fans)+'</em></span></p></div>');
	                    html.push('</a></li>');
	                }
	             }
	         	
	         	$('.loading').remove();
	         	$('.search_list ul.ulbox').append(html.join(''));
	         	isload=0
	         	if(page == totalpage){
	                isload = 1;
					console.log('已经全部加载')
	             }else{
	             	isload=0;
	             }
	         	
	         }else{
	            $('.loading').remove();
	            $('.search_list').append('<div class="loading"><span>暂无数据！</span></div>');
	         }
	        },
	        error:function(err){
	        	console.log('fail');
	        }
	     });
	}
	
	function G(id) {
	    return document.getElementById(id);
	}
	function in_array(needle, haystack) {
	    if(typeof needle == 'string' || typeof needle == 'number') {
	        for(var i in haystack) {
	            if(haystack[i] == needle) {
	                    return true;
	            }
	        }
	    }
	    return false;
	}
})
