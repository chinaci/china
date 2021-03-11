$(function(){
  
  // 获取更多会员
  $(".tofoot").click(function(){
    if($(this).hasClass('go')){
      location.href = samecityUrl;
      return;
    }
    if(initLoad || isload) return;
    page++;
    getList();
  })
  // 互动
  var container = $('#container'), tofoot = $('.tofoot'), page = 1, pageSize = 10, isload = false;
  var activeUid = 0, activeNickname = '';

  container.delegate('.btns a', 'click', function(){
    var t = $(this), p = t.closest('.item'), id = p.attr('data-id'), company = p.attr('data-company');
    var name = t.closest('.item').find('.name').text();

    // 打招呼
    if(t.hasClass('greet')){
      if(t.hasClass('active')) return;
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitOper', 'type=3&id='+id, function(data){
        if(data.state == 100){
          t.addClass('active').text('已打招呼');
          showMsg.alert('已向'+name+'打招呼', 1000);
          t.addClass('active');
        }else{
          showMsg.alert('操作失败', 1000);
        }
      })
    // 关注
    }else if(t.hasClass('follow')){
      if(t.hasClass('active')){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=cancelFollow', 'id='+id, function(data){
          if(data.state == 100){
            t.removeClass('active').text('关注');
            showMsg.alert('已取消关注'+name, 1000);
          }else{
            showMsg.alert('操作失败', 1000);
          }
        })
      }else{
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitOper', 'type=2&id='+id, function(data){
          if(data.state == 100){
            t.addClass('active').text('已关注');
            showMsg.alert('已关注'+name, 1000);
          }else{
            showMsg.alert('操作失败', 1000);
          }
        })
      }
    // 牵线
    }else if(t.hasClass('lead')){
      if(t.hasClass('active')) return;
      activeUid = id;
      activeNickname = name;
      if(leadCount){
        if(company != "0"){
          $(".thakaway").removeClass("ok");
          operaJson(masterDomain+'/include/ajax.php?service=dating&action=hnInfo', 'id='+company, function(data){
            if(data && data.state == 100){
              var info = data.info;
              if(info.phototurl){
                $(".Matchmaker_img img").attr('src', info.phototurl);
              }
              $(".list_01").text(info.nickname);
              $(".list_02 span").text(info.tel);
              if(info.company != 0){
                $(".list_03").show().children('span').text(info.store.nickname);
              }else{
                $(".list_03").hide();
              }
              $(".Matchmaker_bot p em").text(name);
              $(".thakaway").addClass("ok");
              $('.Matchmaker, .desk').addClass('show');
            }else{
              showMsg.alert('获取红娘信息错误', 1000);
            }
          })
        }else{
          // leadSure();
        }
      }else{
        location.href = leadPageUrl.replace('#1', id);
      }
    }
    
  })
  
  // 点击牵她按钮再次弹出确认框
  $('.thakaway').click(function(){
    if($(this).hasClass("ok")){
      $('.Matchmaker, .desk').removeClass('show');
      leadSure();
    }else{
      showMsg.alert('操作错误', 1000);
    }
  })
    
  $('.Matchmaker .cancel, .desk').click(function(){
    $('.Matchmaker, .desk').removeClass('show');
  })

  function leadSure(){
    if(activeUid && activeNickname){
      showMsg.confirm('确认牵线<span style="color:#f60;">'+activeNickname+'</span><br>将扣除1次牵线次数',{
        ok: function(){
          operaJson(masterDomain+'/include/ajax.php?service=dating&action=putLead', 'id='+activeUid, function(data){
            if(data && data.state == 100){
              leadCount--;
              showMsg.alert(data.info, 1000);
              $("#lead_"+activeUid).addClass("active").text("牵线中");
            }else{
              showMsg.alert(data.info, 1000);
            }
          })
        }
      })
    }
  }

  // 查看联系方式
  $(".pageFooter li").click(function(){
    var t = $(this), index = t.index(), info = t.attr("data-info");
    if(index == 0) return;

    if(index == 1){
      $('.succeed_boxNum').text(info);
      $('.succeed_box i').addClass('bg_qq');
    }else{
      $('.succeed_boxNum').text(info);
      $('.succeed_box i').addClass('bg_wx');
    }
    $(".succeed_box, .desk").show();
  })
  $(".desk, .bg_cuo").click(function(){
    $('.succeed_box').hide();
    $('.desk').hide();
    $('.succeed_box i').removeClass();
  })

  var initLoad = true;
  $(window).scroll(function(){
    if(!initLoad) return;
    var sct = $(window).scrollTop();
    if(sct + $(window).height() + 20 > $('.recommend').offset().top){
      getList();
    }
  })

  // 获取信息
  function getList(){
    initLoad = false;
    if(isload) return false;
    isload = true;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=memberList&company='+hnid+'&page='+page+'&pageSize='+pageSize,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [];
          var length = data.info.list.length;
          for(var i = 0; i < length; i++){
            var d = data.info.list[i];
            html.push('<li class="item fn-clear" data-id="'+d.id+'" data-company="'+d.company+'">');
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
            html.push('        <span class="picnum">'+d.picNum+'</span>');
            html.push('      </p>');
            html.push('      <p class="more">');
            // html.push('        <span class="age">'+d.age+'岁</span>');
            // html.push('        <span class="height">'+d.heightName+'cm</span>');
            // html.push('        <span class="distance">'+d.juli+'</span>');
            html.push('      </p>');
            html.push('      <p class="tag">');
            if(d.interests.length){
              for(var n = 0; n < d.interests.length; n++){
                html.push('        <span>'+d.interests[n]+'</span>');
              }
            }
            html.push('      </p>');
            html.push('      </a>');
            html.push('    </div>');
            html.push('  <div class="btns">');

            if(uid != d.id){
              if(d.visit){
                html.push('    <a href="javascript:;" class="greet active">已打招呼</a>');
              }else{
                html.push('    <a href="javascript:;" class="greet">打招呼</a>');
              }
              if(d.follow){
                html.push('    <a href="javascript:;" class="follow active">已关注</a>');
              }else{
                html.push('    <a href="javascript:;" class="follow">关注</a>');
              }
              if(d.company != "0"){
                if(d.leadHas){
                  if(d.leadState == "1"){
                    html.push('    <a href="javascript:;" class="lead active state_1">牵线中</a>');
                  }else if(d.leadState == "2"){
                    html.push('    <a href="javascript:;" class="lead active state_2">牵线成功</a>');
                  }else if(d.leadState == "3"){
                    html.push('    <a href="javascript:;" class="lead active state_3">牵线失败</a>');
                  }
                }else{
                  html.push('    <a href="javascript:;" class="lead" id="lead_'+d.id+'">牵线</a>');
                }
              }
            }
            html.push('  </div>');
            html.push('</li>');
          }
          container.append(html.join(""));
          showMsg.close();
          if(data.info.pageInfo.totalPage == page){
            tofoot.remove();
          }
        }else{
          showMsg.alert('暂无相关会员！', 1000);
          tofoot.addClass('go');
        }
      },
      error: function(){
        isload = false;
        showMsg.alert('网络错误，请重试！', 1000);
      }
    })
  }

})