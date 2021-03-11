$(function(){

  var container = $('#container'), tofoot = $('.tofoot'), page = 1, pageSize = 10, isload = false;

  // 打开搜索框
  $('.screen').click(function(){
    $('.searchWrap, .desk').addClass('show');
    $('html').addClass('md_fixed');
  })
  // 关闭搜索框
  $('.searchWrap .cancel, .desk, .searchWrap .submit').click(function(){
    var t = $(this);
    $('.searchWrap, .desk').removeClass('show');
    $('html').removeClass('md_fixed');
    if(t.hasClass('submit')){
      getList(1);
    }
  })
  // 搜索框
  $('.searchWrap .keywords').focus(function(){
    $(this).parent().addClass('hasfocus');
  }).blur(function(){
    var t = $(this);
    if(t.val() == ''){
      t.parent().removeClass('hasfocus');
    }
  })
  // 选择搜索类别
  $('.searchWrap .typeBox span').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  })

  // 提现
  $('.withdrawBtn').click(function(){
    $('.withdrawWrap, .desk').addClass('show');
  })
  $('.withdrawWrap .close, .desk').click(function(){
    $('.withdrawWrap, .desk').removeClass('show');
  })

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(isload && sct + $(window).height() >= tofoot.offset().top){
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
      $(".withdraw font").text(0);
    }
    showMsg.loading();
    var category = $(".typeBox .active").attr("data-id");
    category = category == undefined ? '' : category;
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=incomeList&type=1&spec=in&autoread=1&page='+page+'&pageSize='+pageSize+'&category='+category,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          var html = [], list = data.info.list, len = list.length;
          if(len){
            $(".withdraw font").text(data.info.pageInfo.totalMoney);
            for(var i = 0; i < len; i++){
              var d = list[i];
              html.push('<div class="item fn-clear" data-id="'+d.id+'">');
              html.push('    <div class="img"><a href="'+d.user.url+'"><img src="'+d.user.photo+'" alt=""></a></div>');
              html.push('    <div class="info">');
              // html.push('      <a href="">');
              html.push('      <p class="base fn-clear">');
              html.push('        <span class="name">'+d.user.nickname+'</span>');
              html.push('        <em class="sex sex'+d.user.sex+'"></em>');
              html.push('        <span class="picnum">'+huoniao.transTimes(d.pubdate, 2).replace(/-/g, '/')+'</span>');
              html.push('      </p>');
              html.push('      <p class="more">');
              html.push('        <span class="age">'+d.user.age+'岁</span>');
              html.push('        <span class="height">'+d.user.heightName+'</span>');
              html.push('        <span class="distance fn-hide"></span>');
              html.push('      </p>');
              html.push('      <div class="order">');
              html.push('        <p class="title">服务：'+d.title+'<span>+'+d.extMoney+'</span></p>');
              html.push('        <p class="number">订单号：'+d.ordernum+'<span>提成'+d.extRatio+'%</span></p>');
              html.push('      </div>');
              // html.push('      </a>');
              html.push('    </div>');
              html.push('</div>');
            }
            container.append(html.join(""));
            
            if(data.info.pageInfo > page){
              isload = false;
              tofoot.text('下拉加载更多').show();
            }else{
              tofoot.text('已加载完全部数据').show();
            }
          }else{
            if(data.info.pageInfo == 0){
              tofoot.text('暂无相关信息！').show();
            }else{
              tofoot.text('已加载完全部数据').show();
            }
          }
        }else{
          tofoot.text(page > 1 ? '已加载完全部数据' : '暂无相关信息！').show();
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试', 1000);
      }
    })
  }

  getList();

})