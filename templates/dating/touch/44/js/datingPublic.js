var showMsg = {
  time: null,
  loading: function(content, time, type){
    var that_ = this;
    that_.close();
    var type = type ? type : 0;
    var time = time ? time : 0;
    var content = content ? content : 'loading...';
    var html = '';
    html += '<div class="modelWrap model_loading skin_'+type+'">';
    html += '  <div class="model-bg"></div>';
    html += '  <div class="model-box">';
    if(type == 1){
      html += '    <div class="k-ring-2">';
      html += '      <div class="k-ball-holder">';
      html += '        <div class="k-ball1a"></div>';
      html += '      </div>';
      html += '    </div>';
    }
    html += '    <div class="txt">'+content+'</div>';
    html += '  </div>';
    html += '</div>';
    $('body').append(html);

    if(time){
      clearTimeout(this.time);
      this.time = setTimeout(function(){
        that_.close();
      }, time)
    }
  },
  alert: function(content, time, callback){
    $('.modelWrap').remove();
    var time = time ? time : 0;
    var html = '', content = content || 'loading...';
    html += '<div class="modelWrap model_alert">';
    html += '  <div class="model-bg"></div>';
    html += '  <div class="model-box">';
    html += '    <div class="txt">'+content+'</div>';
    html += '  </div>';
    html += '</div>';

    $('body').append(html);

    if(time){
      clearTimeout(this.time);
      this.time = setTimeout(function(){
        $('.modelWrap').remove();
        typeof callback == "function" && callback();
      }, time)
    }

  },
  confirm: function(content, option){
    var that_ = this;
    clearTimeout(that_.time);
    that_.close();
    var def = {
      lock: false,
      cls: '',
      btn: {
        ok: '确定',
        cancel: '取消'
      },
      ok: function(){},
      cancel: function(){},
      click: function(){},
    }
    var config = $.extend(true, {}, def, option);

    var html = '', content = content || '确定要进行此操作吗？';
    html += '<div class="modelWrap model_confirm'+(config.lock ? ' model_lock' : '')+config.cls+'">';
    html += '  <div class="model-bg"></div>';
    html += '  <div class="model-box">';
    html += '    <div class="title"></div>';
    html += '    <div class="txt">'+content+'</div>';
    html += '    <div class="btns">';
    if(config.btn.cancel){
      if(config.btn.cancel.indexOf('<a') >= 0){
        html += config.btn.cancel;
      }else{
        html += '     <a href="javascript:;" class="cancel">'+config.btn.cancel+'</a>';
      }
    }
    if(config.btn.ok){
      if(config.btn.ok.indexOf('<a') >= 0){
        html += config.btn.ok;
      }else{
        html += '     <a href="javascript:;" class="ok">'+config.btn.ok+'</a>';
      }
    }
    html += '    </div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    $('body').append(html);

    $(".modelWrap a").click(function(){
      var t = $(this);
      that_.close(true);
      config.click();
      if(t.hasClass("ok")){
        config.ok();
      }else{
        config.cancel();
      }
    })
    $(".modelWrap .model-bg").click(function(){
      that_.close(true);
      config.cancel();
    })
  },
  close: function(type){
    var not = type === true ? 'abcdefg' : '.model_lock';
    $('.modelWrap').not(not).remove();
  }
}

// 验证是否登录
function checkLogin(go){
  var userid = $.cookie(cookiePre+'login_user');
  if(userid == undefined || userid == null || userid == 0 || userid == ''){
    if(go){
      location.href = masterDomain + '/login.html';
    }
    return false;
  }else{
    return true;
  }
}

function operaJson(url, action, callback, showErr){
  $.ajax({
    url: url,
    data: action,
    type: "get",
    dataType: "jsonp",
    success: function (data) {
      typeof callback == "function" && callback(data);
    },
    error: function(){
      if(showErr){
        if(Boolean(showErr)){
          showMsg.alert('网络错误，请重试！', 1000);
        }else{
          typeof callback == "function" && callback(data);
        }
      }
    }
  });
}

  // showMsg.confirm('确定要删除吗？',{
  //   ok: function(){
  //     console.log('ok')
  //   },
  //   cancel: function(){
  //     console.log('cancel')
  //   },
  //   click: function(){
  //     console.log('click')
  //   }
  // });