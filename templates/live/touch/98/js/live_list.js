/**
 * Created by Administrator on 2018/4/26.
 */
$(document).ready(function(){
    var range = 100; //距下边界长度/单位px
    var totalheight = 0;
    var main = $(".list_box"); //主体元素
    var page = 1,isload = false,load_btn = false;
    typeid = typeid!='' ? typeid : '';
    var loaddata = function(){
    	isload = true;
    	$.ajax({
			url: masterDomain+"/include/ajax.php?service=live&type=1&action=alive&pageSize=10"+"&page="+page+"&typeid="+typeid,
			type: "GET",
			dataType: "jsonp",
			success: function(data) {
				if (data && data.state != 200) {
					if (data.state == 101) {
						$(".list_box").html("<p class='loading'>" + data.info + "</p>");
						load_btn = false;
					} else {
						load_btn = true;
						$('.head i').removeClass('shua');
						var list = data.info.list,pageInfo = data.info.pageInfo,html = [];
						for (var i = 0; i < list.length; i++) {
								var htmlclass='';
								if(i%2==0){
									htmlclass='live_box box_left';
								}else{
									htmlclass='live_box box_right';
								}
								html.push('<li class="'+htmlclass+'"><a href="'+list[i].url+'">');
                state_ = '<div class="playback state'+list[i].state+'">'+(list[i].state == 1 ? '直播中' : '精彩回放')+'</div>';
								html.push('<div class="box_img">'+state_+'<img src="'+list[i].litpic+'" alt=""></div>');
								html.push('<div class="live_intro">');
								html.push('<div class="intro-left"><img src="'+list[i].photo+'" alt=""></div>');
								html.push('<div class="intro_right">');
								html.push('<p class="p_font1">'+list[i].title+'</p>');
								html.push('<p class="p_font2"><span class="sp_name">'+list[i].nickname+'</span><span class="img_icon"><img src="'+templatePath+'images/live_people.png"><span>'+list[i].click+'</span></span></p>');
								html.push('</div></div></a></li>');
						}
						$(".list_box").append(html.join(""));
						if(page >= data.info.pageInfo.totalPage){
							isload = true;
							$(".list_box").find('.loading').remove();
							$(".list_box").append('<div class="loading">到底啦！</div>');
						}
						if(page >= pageInfo.totalPage){
							isload = true;
						}else{
							isload = false;
						}
					}
				} else {
					$('.head i').removeClass('shua');
					$(".list_box").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function() {
				$('.head i').removeClass('shua');
				$(".list_box").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});
    }
    loaddata();
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight && !isload) {
        	page++;
			loaddata();
        }
    });
});
