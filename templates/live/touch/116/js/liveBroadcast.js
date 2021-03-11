$(function(){

 new Swiper('.banner .swiper-container', {pagination: '.banner .pagination',slideClass:'slideshow-item',loop: true,grabCursor: true,paginationClickable: true,autoplay:2000});

 $(".search-btn").click(function () {
     var key = $(".txt_search").val();
     if(key == ''){
         window.location.href = window.location.href;return;
     }
     $.ajax({
         url : masterDomain + '/include/ajax.php?service=live&action=alive',
         data : {
          'title' : key,
          'mo' : 1
         },
         type : 'get',
         dataType : 'json',
         success : function (data) {
             var html = '';

             if(data.state == 100){
                   var list = data.info.list;
                   var len = list.length;
                   $(".recommend").html('');
                    console.log(list)
                   for (var i = 0; i < len; i++){
                       var times = '';
                       var status = '';
                       var state = list[i].state;
                       if(state == 2){
                          times = list[i].times;
                       }
                       if(state == 1){
                           status = '直播中';
                       }else if(state == 2){
                           status = '回放';
                       }else{
                           status = '未直播';
                       }

                       html += '<div class="play_main">' +
                           '<a href="'+list[i].url+'">' +
                           '<div class="groom_sp">' +
                           '<img src="'+list[i].litpic+'">' +
                           '<span class="huifang">'+status+'</span>' +
                           '<div class="bofang"></div>' +
                           '<div class="bofang_icon"></div>' +
                           '<div class="zhezhao"></div>' +
                           '<p class="fn-clear"><span>'+list[i].click+'</span><span>'+times+'</span></p>' +
                           '</div>' +
                           '<p class="groom_txt">'+list[i].title+'</p>' +
                           '</a>' +
                           '</div>';
                   }

                   $(".recommend").eq(0).html(html);



               }else{
                    html = '暂无相关数据';
                 $(".recommend").eq(0).html('');
               }

         }
     })

 })
 
 
 
})