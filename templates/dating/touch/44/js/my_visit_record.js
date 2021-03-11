$(function(){

  // 点击导航切换
  $('.headerFa-address span').click(function(){
    var a = $(this);
    if(!a.hasClass('active')){
      a.addClass('active');
      a.siblings().removeClass('active');
      page = 1;
      isload = false;
      getList(1);
    }
  });

  //点击关注和互相关注
  $(".container").delegate(".btns", "click", function(){
    var b = $(this), id = b.closest("li").attr("data-id");
    if(b.hasClass('follow_no')){
      operaJson(masterDomain + '/include/ajax.php?service=dating&action=visitOper', 'type=2&id='+id, function(data){
        if(data && data.state == 100){
          b.removeClass('follow_no');
          b.addClass('follow_yes');
          b.text('已关注');
        }else{
          showMsg.alert(data.info);
        }
      })
    }else if(b.hasClass('follow_yes') || b.hasClass('follow_all')){
      operaJson(masterDomain + '/include/ajax.php?service=dating&action=cancelFollow', 'type=2&id='+id, function(data){
        if(data && data.state == 100){
          b.removeClass('follow_yes follow_all');
          b.addClass('follow_no');
          b.text('关注');
        }else{
          showMsg.alert(data.info);
        }
      })
    }
  })


  var container = $('#container'), tofoot = $('.tofoot'), isload = false, page = 1, pageSize = 10;

  function getList(tr){
    if(isload) return;
    isload = true;
    if(tr){
      container.html("");
    }
    showMsg.loading();
    var index = $(".headerFa-address .active").index();
    
    if(index == 0){
      var url = masterDomain + '/include/ajax.php?service=dating&action=visit&autoread=1&oper=visit&act=in&page='+page+'&pageSize='+pageSize;
    }else if(index == 1){
      var url = masterDomain + '/include/ajax.php?service=dating&action=visit&autoread=1&oper=follow&act=in&page='+page+'&pageSize='+pageSize;
    }else if(index == 2){
      var url = masterDomain + '/include/ajax.php?service=dating&action=visit&autoread=1&oper=follow&act=out&page='+page+'&pageSize='+pageSize;
    }else if(index == 3){
      var url = masterDomain + '/include/ajax.php?service=dating&action=friendList&page='+page+'&pageSize='+pageSize;
    }

    $.ajax({
      url: url,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          totalPage = data.info.pageInfo.totalPage
          if(index == 3){
            var list = data.info.list, len = list.length, html = [];
            for(var i = 0; i < len; i++){
              var d = list[i];
              html.push('<li class="fn-clear" data-id="'+d.id+'">');
              html.push('  <div class="fans_img"><a href="'+d.url+'"><img src="'+d.photo+'"></a></div>');
              html.push('  <div class="fans_txt">');
              html.push('    <p>'+d.nickname+'</p>');
              html.push('    <p>'+d.profile+'</p>');
              html.push('  </div>');
              html.push('  <span class="btns follow_all">互相关注</span>');
              html.push('</li>');
            }
          }else{
            var list = data.info.list, len = list.length, html = [];
            for(var i = 0; i < len; i++){
              var d = list[i];
              html.push('<li class="fn-clear" data-id="'+d.member.id+'">');
              html.push('  <div class="fans_img"><a href="'+d.member.url+'"><img src="'+d.member.phototurl+'"></a></div>');
              html.push('  <div class="fans_txt">');
              html.push('    <p>'+d.member.nickname+'</p>');
              html.push('    <p>'+d.member.profile+'</p>');
              html.push('  </div>');
              if(d.follow && d.followby){
                html.push('  <span class="btns follow_all">互相关注</span>');
              }else if(d.follow){
                html.push('  <span class="btns follow_yes">已关注</span>');
              }else{
                html.push('  <span class="btns follow_no">关注</span>');
              }
              html.push('</li>');
            }
          }
          container.append(html.join(""));
          showMsg.close();
          if(totalPage > page){
            page++;
            tofoot.show();
            isload = false;
          }else{
            // tofoot.text('已加载完全部数据').show();
          }
        }else{
          showMsg.alert(data.info, 1000);
          // tofoot.text('暂无相关数据！').show();
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试', 1000);
      }
    })
  }

  $(window).scroll(function(){
    var scrollH = document.documentElement.scrollHeight;
    var clientH = document.documentElement.clientHeight;
    console.log(scrollH)
    if (scrollH == (document.documentElement.scrollTop | document.body.scrollTop) + clientH){
      //加载新数据
        getList();
    }
  });

  getList();

});
