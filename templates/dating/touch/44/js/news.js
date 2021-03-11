$(function(){

  var container = $('#container'), tofoot = $('.tofoot'), page = 1, pageSize = 10, isload = false;

  getList();
  // 获取信息
  function getList(){
    if(isload) return;
    isload = true;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=news&page='+page+'&pageSize='+pageSize,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          var html = [];
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];

            html.push('<li class="item">');
            html.push(' <a href="'+d.url+'" class="fn-clear">');
            html.push('  <div class="img">');
            html.push('    <img src="'+d.litpic+'">');
            html.push('  </div>');
            html.push('  <div class="info">');
            html.push('   <div class="name">');
            html.push('    <span class="name_txt">'+d.title+'</span>');
            html.push('    <span class="name_time">'+huoniao.transTimes(d.pubdate, 3).replace('-', '/')+'</span>');
            html.push('  </div>');
            html.push('  <p class="contact">['+d.typename+']&nbsp;'+d.description+'</p>');
            html.push('  <p class="time">阅读：'+d.click+'</p>');
            html.push('  </div>');
            html.push('</a>');
            html.push('</li>');
          }
          container.append(html.join(""));
          
          if(data.info.pageInfo.totalPage > page){
            isload = false;
            tofoot.text('下拉加载更多').show();
          }else{
            tofoot.text('已加载完全部数据').show();
          }
        }else{
          tofoot.text('暂无相关数据！').show();
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试！');
      }
    })
  }

  $(window).scroll(function(){
    if(isload) return;
    var scrollH = document.documentElement.scrollHeight;
    var clientH = document.documentElement.clientHeight;
    if (scrollH == (document.documentElement.scrollTop | document.body.scrollTop) + clientH){
      //加载新数据
      page++;
      getList();
    }
  });

});
