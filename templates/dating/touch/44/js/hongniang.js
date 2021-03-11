$(function(){


  var container = $('#container'), tofoot = $('.tofoot'), lng = lat = 0, page = 1, pageSize = 10, isload = false;

  getList();

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(!isload && sct + $(window).height() >= tofoot.offset().top){
      page++;
      getList();
    }
  })

  // 获取信息
  function getList(){
    if(isload) return;
    isload = true;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=hnlist&page='+page+'&pageSize='+pageSize,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          var html = [], list = data.info.list, len = list.length;
          for(var i = 0; i < len; i++){
            var d = list[i];
            html.push('<div class="item">');
            html.push('  <a href="'+d.url+'" class="fn-clear">');
            html.push('    <div class="img"><img src="'+(d.photo ? d.photo : templets_skin + 'images/photo_girl.png')+'" alt=""></div>');
            html.push('    <div class="info">');
            html.push('      <h3 class="name">'+d.nickname+'<span>'+d.year+'年经验</span></h3>');
            html.push('      <p class="des"><span>红娘主页</span>'+d.advice+'</p>');
            html.push('      <p class="case">'+d.case+'对成功案例</p>');
            html.push('    </div>');
            html.push('  </a>');
            html.push('</div>');
          }
          container.append(html.join(""));
          
          if(data.info.pageInfo.totalPage > page){
            isload = false;
            $(".tofoot").text('上拉加载更多~').show();
          }else{
            $(".tofoot").text('已加载完全部数据').show();
          }
        }else{
          if(page > 1){
            $(".tofoot").text('已加载完全部数据').show();
          }else{
            $(".tofoot").text('暂无相关信息！').show();
          }
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试！', 1000);
      }
    })
  }
})