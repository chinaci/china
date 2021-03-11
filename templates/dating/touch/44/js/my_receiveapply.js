$(function(){
  // tab左右切换模块
  var navtab = $('.navtab');
  var container = $('#container');
  var loadMoreLock = false;
  var page = 1;
  var pageSize = 10;

  $(".navtab li").on('click',function(e){
    var t = $(this);
    t.addClass('active').siblings().removeClass('active');
    loadMoreLock = false;
    getData(1);
  });

  container.delegate(".btn", "click", function(){
    var t = $(this), id = t.closest('.item').attr('data-id');
    if(!t.hasClass("active")){
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=applyOper', 'type='+type+'&id='+id, function(data){
        showMsg.alert(data.info, 1000);
        if(data && data.state == 100){
          t.addClass("active").text('已联系');
        }
      })
      
    }
  })

  function getData(tr){
    if(tr){
      page = 1;
      container.html("");
    }
    if(loadMoreLock) return;
    var index = $(".navtab li.active").index();
    var sex = index > 0 ? (index == 1 ? '&sex=1' : '&sex=0') : '';
    loadMoreLock = true;
    showMsg.loading();
    $(".tofoot").hide();
    $(".navtab li em").hide();
    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=applyList&type='+type+'&autoread=1&page='+page+'&pageSize='+pageSize+sex,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          var html = [], list = data.info.list, len = list.length;
          var pageInfo = data.info.pageInfo;
          for(var i = 0; i < len; i++){
            var d = list[i];
            html.push('<div class="item" data-id="'+d.id+'">');
            html.push('  <div class="base fn-clear">');
            html.push('    <div class="img">');
            html.push('      <a href="'+d.ufrom.url+'">');
            html.push('        <img src="'+d.ufrom.phototurl+'" alt="">');
            if(d.ufrom.my_video_state){
              html.push('        <span class="user_video"></>');
            }
            html.push('      </a>');
            html.push('    </div>');
            html.push('    <div class="info">');
            html.push('      <p class="base fn-clear">');
            html.push('        <a href="'+d.ufrom.url+'" class="name">'+d.ufrom.nickname+'</a>');
            if(d.ufrom.level){
              html.push('        <em class="u_level"><img src="'+d.ufrom.levelIcon+'" alt=""></em>');
            }
            if(d.ufrom.phoneCheck){
              html.push('        <em class="phone"></em>');
            }
            if(d.ufrom.online){
              html.push('        <span class="online active">在线</span>');
            }else{
              html.push('        <span class="online">离线</span>');
            }
            html.push('        <em class="sex sex'+d.sex+'"></em>');
            html.push('        <span class="picnum">'+huoniao.transTimes(d.pubdate, 2).replace(/-/g, '/')+'</span></p>');
            html.push('      <p class="more">手机号码：'+d.mobile+'</p>');
            html.push('      <p class="more">工作城市：'+d.city+'</p>');
            html.push('      <p class="more">月薪范围：'+d.money+'</p>');
            html.push('      <div class="btns fn-clear">');
            if(d.state == 0){
              html.push('        <span class="btn">标记已联系</span>');
            }else{
              html.push('        <span class="btn active">已联系</span>');
            }
            html.push('      </div>');
            html.push('    </div>');
            html.push('  </div>');
            html.push('</div>');
          }

          container.append(html.join(""));

          if(pageInfo.totalPage > page){
            loadMoreLock = false;
          }else{
            $('.tofoot').text('已加载完全部数据').show();
          }
          if(pageInfo.boyCount){
            $(".navtab li:eq(1)").find("em").show().text(pageInfo.boyCount);
          }
          if(pageInfo.girlCount){
            $(".navtab li:eq(2)").find("em").show().text(pageInfo.girlCount);
          }
        }else{
          $(".tofoot").text("暂无相关信息！").show();
        }
      },
      error: function(){
        ShowMsg.alert('网络错误，请重试！', 1000);
      }
    })

  }

  $(window).scroll(function(){
    if(loadMoreLock) return;
    var sct = $(window).scrollTop();
    var last = con.children(".item:last-child");
    if(sct + $(window).height() + 20 > $(".tofoot").offset().top){
      getData();
    }
  })

  getData();

})