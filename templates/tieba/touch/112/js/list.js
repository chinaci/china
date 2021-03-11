function transTimes(timestamp, n){
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
    }else if(n == 4){
      return (hour+':'+minute);
    }else{
      return 0;
    }
}
$(function () {
	// 选择帖子板块
  $('.seconedTab ul li').click(function(){
    var t = $(this);
    t.addClass('active').siblings('li').removeClass('active');
    typeid = t.data('id');
    atpage = 1;
    getList();
  });

  //加载帖子列表
  var hallList = $(".conlist"), atpage = 1, pageSize = 20, totalPage = 0, isload = false;
  function getList(){
    var active = $('.seconedTab .active'), action = active.attr('data-id'), url;
    var page = active.attr('data-page');

   isload = true;
   if(atpage == 1){
     hallList.html('');
     totalPage = 0;
   }

   hallList.find(".loading, .empty").remove();
   hallList.append('<div class="loading">加载中...</div>');

   $.ajax({
     url: masterDomain+"/include/ajax.php?service=tieba&action=tlist",
     data: {
       "typeid": typeid,
       "page": atpage,
       "pageSize": pageSize
     },
     dataType: "jsonp",
     success: function (data) {
       hallList.find(".loading").remove();
       if(data && data.state == 100){
         if(data.state == 100){
           var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
           for (var i = 0, lr; i < list.length; i++) {
                lr = list[i];
                var photo = lr.photo == "" ? staticPath+'images/noPhoto_100.jpg' : lr.photo;
                    html.push('<li class="fn-clear"  data-id="'+lr.id+'">');
                    html.push('<a href="'+lr.url+'">');
                    html.push('<div class="rtop fn-clear">');
                    html.push('<div class="rpic"><img src="'+photo+'" alt=""></div>');
                    html.push('<div class="rinfo">');
                    html.push('<h4>'+lr.username+' <span class="rtime">'+transTimes(lr.pubdate, 1)+'</span></h4>');
                    html.push('<p><span class="rstyle">'+lr.typename+'</span> <span class="rpos">'+lr.ipAddress+'</span></p></div>');
                    html.push('</div>');
                    html.push('<div class="rmain">');
                    html.push('<div class="mtext"><p>'+lr.title+'');
                    if(lr.top == "1"){
                        html.push('<span class="mtop">置顶</span>');
                    }
                    if(lr.jinghua == "1"){
                        html.push('<span class="jinghua">精华</span>');
                    }
                    html.push('</p></div>');
                    // 图集
                    if(lr.imgGroup && lr.imgGroup.length > 0){
                        html.push('<div class="mmpic">');
                        if(lr.imgGroup.length > 3){
                             html.push('<span class="picNum">'+lr.imgGroup.length+'张</span>');
                        }


                        if(lr.imgGroup.length == 1){
                          html.push('<div class="picbox" style="height:2.5rem;">');
                          for(var g = 0; g < lr.imgGroup.length; g++){
                             if(g < lr.imgGroup.length){
                                 html.push('<img src="'+lr.imgGroup[g]+'" style="max-width:60%;height:2.5rem;" alt="">');
                              }
                          }
                          html.push('</div>');
                        }else if(lr.imgGroup.length == 2){
                          html.push('<div class="picbox" style="height:2rem;">');
                          for(var g = 0; g < lr.imgGroup.length; g++){
                             if(g < lr.imgGroup.length){
                                 html.push('<img src="'+lr.imgGroup[g]+'" style="max-width:49%;height:2rem;" alt="">');
                              }
                          }
                          html.push('</div>');
                        }else{
                          html.push('<div class="picbox" style="height:1.67rem;">');
                          for(var g = 0; g < lr.imgGroup.length; g++){
                             if(g < lr.imgGroup.length){
                                 html.push('<img src="'+lr.imgGroup[g]+'" style="max-width:32.3%;height:1.67rem;"  alt="">');
                              }
                          }
                          html.push('</div>');
                        }
                        html.push('</div>');

                    }else{
                        html.push('<div class="textbox">'+lr.content+'</div>');
                    }
                    // 视频显示
                    // if(lr.video){
                    //     html.push('<video width="100%" height="100%" controls="" x5-video-player-type="h5" x5-playsinline playsinline webkit-playsinline controlslist="nodownload noremote footbar" src="http://www.weaver.com.cn/mobile/About/Audio/profileld2017.mp4" poster="{#$templets_skin#}upfile/vposter.png"></video>');
                    // }
                    html.push('</div>');
                    html.push('<div class="rbottom fn-clear"><p>'+lr.click+'人阅读</p>');
                    html.push('<p><span class="comNum"><i></i>'+lr.reply+'</span><span class="upNum"><i></i>'+lr.up+'</span></p>');
                    html.push('</div>');
                    html.push('</a></li>');
            }
           hallList.append(html.join(""));
           // baiduShare();

         }else{

           if(atpage == 1){
             hallList.append('<div class="empty">暂无相关信息！</div>');
           }

         }

         if(pageInfo && atpage >= pageInfo.totalPage){
           isload = true;
           hallList.append('<div class="loading">已加载全部数据！</div>');
         }else{
           isload = false;
         }
       }
     },
     error: function(XMLHttpRequest, textStatus, errorThrown){
       isload = false;
       hallList.find(".loading").remove();
     }
   });

  }
  getList();

  // 滚动加载
  $(window).on("scroll", function(){
    var allh = $('body').height();
    var w = $(window).height();
    var scroll = allh - w - 300;
    if ($(window).scrollTop() > scroll && !isload) {
      atpage++;
      getList();
    };
  });

  /*调起大图 S*/
   var mySwiper = new Swiper('.bigSwiper', {pagination: {el:'.bigPagination',type: 'fraction',},loop: false})
    $(".conlist").delegate('.picbox img', 'click', function() {
        var imgBox = $(this).parents(".picbox").find("img");
        var i = $(imgBox).index(this);
        $(".bigBoxShow .swiper-wrapper").html("");
        for(var j = 0 ,c = imgBox.length; j < c ;j++){
         $(".bigBoxShow .swiper-wrapper").append('<div class="swiper-slide"><div class="swiper-img"><img src="' + imgBox.eq(j).attr("src") + '" / ></div></div>');
        }
        mySwiper.update();
        $(".bigBoxShow").css({
            "z-index": 999999,
            "opacity": "1"
        });
        mySwiper.slideTo(i, 0, false);
        return false;
    });

    $(".bigBoxShow").delegate('.vClose', 'click', function() {
        $(this).closest('.bigBoxShow').css({
            "z-index": "-1",
            "opacity": "0"
        });

    });
  /*调起大图 E*/

})
