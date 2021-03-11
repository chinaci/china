$(function(){

  var container = $('#container'), tofoot = $('.tofoot'), isload = false, page = 1;
  getList();
  // 获取信息
  function getList(){
    if(isload) return;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=myGift&page='+page+'&pageSize=10&uid='+id,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){

          var html = [];
          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];
            html.push('<li class="item">');
            html.push('  <div class="img">');
            html.push('    <a href=""><img src="'+d.member.phototurl+'" alt=""></a>'+(d.member.my_video_state ? '<span class="user_video">' : '')+'</span>');
            html.push('  </div>');
            html.push('  <div class="info">');
            html.push('    <p class="base fn-clear">');
            html.push('      <span class="name">'+d.member.nickname+'</span>');
            if(d.member.level){
              html.push('      <em class="u_level"><img src="'+d.member.levelIcon+'" alt=""></em>');
            }
            if(d.member.phoneCheck){
              html.push('      <em class="phone"></em>');
            }
            html.push('    </p>');
            html.push('    <p class="more">');
            html.push('      <span class="age">'+d.member.age+'岁</span>');
            html.push('      <span class="height">'+d.member.height+'cm</span>');
            // html.push('      <span class="distance">16km</span>');
            html.push('      </p>');
            html.push('  </div>');
            html.push(' <div class="content fn-clear">');
            html.push('    <ul>');
            for(var n = 0; n < d.gift.length; n++){
              var g = d.gift[n];
              html.push('      <li>');
              html.push('        <img src="'+g.gift.litpic+'">');
              html.push('        <p class="gift_name">'+g.gift.title+'</p>');
              html.push('        <p>×'+g.count+'</p>');
              html.push('      </li>');
            }
            html.push('    </ul>');
            html.push('  </div>');
            html.push('</li>');
          }
          container.append(html.join(""));
          

          if(data.info.pageInfo.totalPage > page){
            tofoot.text('下拉加载更多').show();
          }

        }else{
          tofoot.text(page == 1 ? '暂无相关数据！' : '已经加载完全部数据').show();
        }
      },
      error: function(){
        isload = false;
        showMsg.alert('网络错误，请重试！', 1000);
      }
    })
  }

  $(window).scroll(function(){
    var scrollH = document.documentElement.scrollHeight;
    var clientH = document.documentElement.clientHeight;
    if (!isload && scrollH == (document.documentElement.scrollTop | document.body.scrollTop) + clientH){
      //加载新数据
      page++;
      getList();
    }
  });

});
