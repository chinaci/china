/**
 * Created by Administrator on 2018/4/26.
 */
 $(function(){
	var page=1,isload=false,objId = $(".an_main");
	var range = 100; //距下边界长度/单位px
    var totalheight = 0;
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight && !isload) {
        	page++;
            getList();
        }
    });
    getList();
    function getList(){
	    isload = true;
		$.ajax({
		    url: masterDomain+"/include/ajax.php?service=live&action=alive&type=2&page="+page+"&uid="+hiddenid+"&pageSize=10",
		    type: "GET",
		    dataType: "jsonp",
		    success: function (data) {
		        if(data && data.state != 200){
		            if(data.state == 101){
		                objId.html("<p class='loading'>暂无数据</p>");//+langData['siteConfig'][20][126]+
		            }else{
		                var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
		                //拼接列表
		                if(list.length > 0){
		                    var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";
		                    var param = t + "do=edit&id=";
		                    for(var i = 0; i < list.length; i++){
		                        var item        = [],
		                            id          = list[i].id,
		                            title       = list[i].title,
		                            url         = list[i].url,
		                            litpic      = list[i].litpic,
		                            photo      = list[i].photo,
		                            state      = list[i].state,
		                            click       = list[i].click,
									up       	= list[i].up,
		                            ftime		= list[i].ftime;
		                        html.push('<li  class="anchor_box"');
		                        html.push('<a href="'+url+'">');
		                        //var stateText = state==1 ? '直播' : '回放';
		                        var stateText = state==0 ? '未直播' : (state==1 ? '直播中' : '精彩回放');
		                        html.push('<div class="an_left"><img src="'+litpic+'" alt=""><div class="playback">'+stateText+'</div></div>');
		                        html.push(' <div class="an_right">');
		                        html.push('<h5>'+title+'</h5>');
		                        html.push('<p class="an_time"><span><img src="'+templatePath+'images/anchor_time.png" alt="">'+ftime+'</span></p>');
								var upNum = up>=10000 ? (up/10000).toFixed(2) + '万' : up;
		                        html.push('<p class="an_style"><span><img src="'+templatePath+'images/live_people.png" alt="">'+click+' </span><span class="sec_style"><img src="'+templatePath+'images/anchor_like.png" alt="">'+upNum+' </span><span data-id="'+id+'" class="dellive" id="dellive"><img src="'+templatePath+'images/anchor_del.png" alt=""></span></p>');
		                        html.push('</div></a></li>');
		                    }

		                    objId.append(html.join(""));
		                    if(page >= pageInfo.totalPage){
								isload = true;
							}else{
								isload = false;
							}

		                }else{
		                    objId.html("<p class='loading'>暂无数据</p>");
		                }
		            }
		        }else{
		            objId.html("<p class='loading'>暂无数据</p>");
		        }
		    }
		});
	}
	//用户删除直播
	$("body").delegate(".dellive","click", function(){
		var id = $(this).attr('data-id');
		$.ajax({
	      url: masterDomain + "/include/ajax.php?service=live&action=delUserLive",
	      data: "id="+id,
	      type: "GET",
	      dataType: "json",
	      success: function (msg) {
	        if(msg.state == 100){
	        	window.location.reload();
	        }else{
	        	alert(msg.info);
	        }
	      },
	      error: function(){
	      	console.log('网络错误，操作失败！');
	      }
	    });
	});
})
