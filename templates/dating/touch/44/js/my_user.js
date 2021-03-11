$(function(){

  var container = $('#container'), tofoot = $('.tofoot'), page = 1, pageSize = 10, isload = false;
  var keywrods = "";

  // 搜索框
  $('.searchWrap .keywords').focus(function(){
    $(this).parent().addClass('hasfocus');
  }).blur(function(){
    var t = $(this);
    if(t.val() == ''){
      t.parent().removeClass('hasfocus');
    }
  })
  $('.searchWrap .keywords').on('input propertychange', function(){
    var t = $(this);
    keywrods = $.trim(t.val());
    getList(1);
  })

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(!isload && sct + $(window).height() >= tofoot.offset().top){
      page++;
      getList();
    }
  })

  // 获取信息
  function getList(tr){
    if(tr){
      page = 1;
      container.html('');
      tofoot.hide();
    }
    isload = true;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=memberList&company='+searchUId+'&page='+page+'&pageSize='+pageSize+'&nickname='+keywrods,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [];
          var length = data.info.list.length;
          for(var i = 0; i < length; i++){
            var d = data.info.list[i];
            html.push('<div class="item fn-clear">');
            html.push('    <div class="img"><a href="'+d.url+'"><img src="'+d.photo+'" alt="">'+(d.my_video_state ? '<i class="user_video"></i>' : '')+'</a></div>');
            html.push('    <div class="info">');
            html.push('      <a href="'+d.url+'">');
            html.push('      <p class="base fn-clear">');
            html.push('        <span class="name">'+d.nickname+'</span>');
            if(d.level){
              html.push('        <em class="u_level"><img src="'+d.levelIcon+'" alt=""></em>');
            }
            if(d.phoneCheck){
              html.push('        <em class="phone"></em>');
            }
            html.push('        <em class="sex sex'+d.sex+'"></em>');
            html.push('      </p>');
            html.push('      <p class="more">');
            html.push('        <span class="age">'+d.age+'岁</span>');
            html.push('        <span class="height">'+d.heightName+'</span>');
            // html.push('        <span class="distance">'+d.juli+'</span>');
            html.push('      </p>');
            html.push('      </a>');
            html.push('    </div>');
            html.push('</div>');
          }
          container.append(html.join(""));
          showMsg.close();
          if(data.info.pageInfo.totalPage == page){
            tofoot.text('已加载完全部数据').show();
          }else{
            isload = false;
            tofoot.show();
          }
        }else{
            showMsg.alert('暂无相关信息', 1000);
          tofoot.text('暂无相关信息！').show();
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试！', 1000);
      }
    })
  }

  getList();

})