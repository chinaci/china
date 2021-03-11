$(function(){

  window.addEventListener('pageshow', function(e) {
  //如果检测到页面是从“往返缓存”中读取的，刷新页面
  if (e.persisted) {
    location.reload();
  }
});

  var timer = null, timer = [];
  $(".certify .btn").click(function(){
    var t = $(this), isvoice = t.hasClass("myvoice"), page = isvoice ? "invokeRecord" : "invokeVideo", type = isvoice ? 'voice' : 'video';
    t.attr("data-time", '');
    clearTimeout(timer[type]);
    if(t.hasClass("disabled")) return;

    if(device.indexOf('huoniao') == -1){
      showMsg.alert('请在App中使用', 1000);
    }else{
      var time = t.attr("data-time");
      var now = new Date().getTime() / 1000;
      if(time == undefined || time == ''){
        time = now;
        t.attr("data-time", now);
      }
      timer[type] = setInterval(function(){
        if(now - time < 180){
          $.ajax({
            url: masterDomain+'/include/ajax.php?service=dating&action=checkUpload',
            data: 'type='+type+'&date='+time,
            type: 'post',
            // async: false,
            dataType: 'jsonp',
            success: function(data){
              if(data && data.state == 100){
                if(data.info != "not"){
                  clearTimeout(timer[type]);
                  t.attr("data-time", '');
                  var newCls = data.info.state ? 'state1' : 'state0 disabled';
                  t.removeClass("state0 state1 state2").addClass(newCls).text(data.info.info);
                  showMsg.alert(data.info.info, 1000);
                }
              }
            },
            error: function(){
              clearTimeout(timer[type]);
            }
          })
        }else{
          clearTimeout(timer[type]);
        }
      }, 500)

      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(page,  {}, function(responseData){});
      })
    }
  })

  function checkUpload(t, type, no){
    $("h3.name").text(type+':'+no);
    var date = t.attr("data-time");
    $.ajax({
      // url: masterDomain+'/include/ajax.php?service=dating&action=checkUpload',
      url: masterDomain+'/include/ajax.php?service=dating&action=checkUpload&type='+type+'&date='+date,
      data: 'type='+type+'&date='+date,
      type: 'GET',
      async: false,
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          if(data.info == "null"){
            setTimeout(function(){
              checkUpload(t, type, ++no);
            },1000)
          }else{
            t.attr("data-time", '');
            var param = '';
            if(type == 'voice'){
              param = 'upType=10&my_voice='+data.info.url;
            }else{
              param = 'upType=11&my_video='+data.info.url;
            }
            operaJson(masterDomain + '/include/ajax.php?service=dating&action=updateProfile', param, function(res){
              if(res && res.state == 100){
                showMsg.alert(data.info.info, 1000);
                var obj = $(".my"+type);
                var newCls = data.state ? 'state1' : 'state0 disabled';
                obj.removeClass("state0 state1 state2").addClass(newCls);
              }else{
                showMsg.alert(res.info, 1000);
              }
            });
          }
        }
      },
      error: function(){
        showMsg.alert('网络错误', 1000);
      }
    })
  }


  // 我的头像-已上传
  $('.myphoto').click(function(){
    if(!$(this).hasClass("null")) $('.selectBottom').addClass('show');
  })
  $('.selectBottom .cancel, .selectBottom .bg').click(function(){
    $('.selectBottom').removeClass('show');
  })
  $('.selectBottom li').click(function(){
    var t = $(this), index = t.index();
    if(index == 0){

    }else if(index == 1){
      location.href = showPicUrl;
    }else if(index == 2){
      showMsg.confirm('删除形象照，您将无法查看他人照片，并且不能参加任何活动。同时系统所有地方将不再展示您，请慎重考虑', {
        btn: {ok:'下一步'},
        ok: function(){
          $('.selectBottom').removeClass('show');
          showMsg.alert('正在操作，请稍后', 1000);
          $('#item_0').html('<img src="" alt="">');
          $('.addimg').removeClass('has').addClass('noimg').append('<div class="uploader-btn">上传头像</div>');
        }
      })
    }
  })

  // 交友开关
  $('.switch').click(function(){
    var t = $(this);
    if(t.hasClass('open')){
      showMsg.confirm('确定要关闭吗？', {
        ok: function(){
          switchOpear(0);
        }
      })
    }else{
      switchOpear(1);
    }
  })

  function switchOpear(state){
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=datingSwitch', 'state='+state, function(data){
      if(data && data.state == 100){
        showMsg.alert('操作成功', 1000);
        $('.switch').toggleClass('open');
      }else{
        showMsg.alert(data.info, 1000);
      }
    })
  }

  // 编辑联系方式
  $('.contact .edit').click(function(){
    var t = $(this), p = t.closest('.box');

    if(t.hasClass('editing')){
      p.find('input.inp').prop('readonly', true);
      t.removeClass('editing').text('+编辑');
      $('#mobile').attr("href", "javascript:;");

      var qq = $.trim($('#qq').val()), wechat = $.trim($('#wechat').val());
      operaJson(masterDomain + '/include/ajax.php?service=dating&action=updateProfile', 'upType=4&qq='+qq+'&wechat='+wechat, function(data){
        showMsg.alert(data.info, 1000);
      }, true)
    }else{
      p.find('input.inp').prop('readonly', false);
      var href = $("#mobile").attr("data-href");
      $('#mobile').attr("href", href);
      t.addClass('editing').text('保存');
    }
  })

  // 上传头像
  var upPhoto = new Upload({
    btn: '#filePicker1',
    bindBtn: '.addimg.noimg',
    title: 'Images',
    mod: modelType,
    params: 'type=atlas',
    atlasMax: 1,
    replace: true,
    fileQueued: function(file){
      
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        // 未上传
        $('#item_0').html('<img src="'+response.turl+'" alt=""><p>更换头像</p>');
        $('.addimg.noimg').off().removeClass('noimg').addClass('has');
        $(".myphoto").removeClass("null");
        $('.uploader-btn').remove();
        $('.selectBottom').removeClass('show');

        operaJson(masterDomain + '/include/ajax.php?service=dating&action=updateProfile', 'upType=8&photo='+response.url, function(data){
          showMsg.alert(data.info, 1000, function(){
          });
        }, true)
      }
    }
  });

})
