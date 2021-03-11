$(function(){

  var container = $('#container'), tofoot = $('.tofoot'), lng = lat = 0, isload = false, page = 1, pageSize = 10;
  var activeUid = 0, activeNickname = '';

  var scrboxh = $('#scrollerWrap').height();
  $('#scrollerWrap').scroll(function(){
    if(isload) return;
    var listh = $('#scroller').height();
    var sct = $('#scrollerWrap').scrollTop();
    if(sct + scrboxh >= listh){
      page++;
      getList();
    }
  })
  getList();

  // 互动
  container.delegate('.btns a', 'click', function(){
    var t = $(this), p = t.closest('.item'), id = p.attr("data-id"), uid = p.attr("data-uid"), name = p.find('.name').text(), company = p.attr("data-company");

    // 打招呼
    if(t.hasClass('greet')){
      if(t.hasClass('active')) return;
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitOper', 'type=3&id='+uid, function(){
        t.addClass('active').text('已打招呼');
        showMsg.alert('已向'+name+'打招呼', 1000);
      })
    // 关注
    }else if(t.hasClass('follow')){
      t.addClass('active').text('已关注');
      showMsg.alert('已关注'+name, 1000);
      t.addClass('active');
    // 点赞
    }else if(t.hasClass('good')){
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=circleOper', 'id='+id, function(){
        var count = parseInt(t.text());
        if(t.hasClass('active')){
          t.removeClass('active').text(--count);
        }else{
          t.addClass('active').text(++count);
          showMsg.alert('已为'+name+'点赞', 1000);
        }
      })
    // 牵线
    }else if(t.hasClass('lead')){
      if(t.hasClass('active')) return;

      if(leadCount){
        activeUid = uid, activeNickname = name;
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
        location.href = leadPageUrl.replace('#1', uid);
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
  // 发布
  var fabuType = 0, create1 = null;
  $(".fabu").click(function(){
    if(checkLogin(true)){
      // 有发布权限
      if(putAuth){
        if(device.indexOf('huoniao') == -1){
          $("#filePicker1").text("上传");
          if(userAgent.match(/MicroMessenger/i) != "micromessenger"){
            if(create1 == null){
              create1 = 1;
              $("#filePicker1").unbind().bind('click', function(){
                $("#filePicker2 label").click();
              })
            }
          }
        }else{
          $("#filePicker1").unbind().bind('click', function(){
            setupWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('invokePostDateDynamic',  {}, function(responseData){});
            })
          })
        }
        $('.selectBottom').addClass('show');

      // 无发布权限
      }else{
        $('.authority').show();
      }
    }
  })
  $('.selectBottom .cancel, .selectBottom .bg').click(function(){
    $('.selectBottom').removeClass('show');
  })

  // 取消发布认证
  $('.authority .bg').click(function(){
    $('.authority').hide();
  })

  // 获取信息
  function getList(){
    showMsg.loading();
    isload = true;
    tofoot.text('正在加载，请稍后').show();

    $.ajax({
      url: masterDomain+'/include/ajax.php?service=dating&action=circleList&juli=1&page='+page+'&pageSize='+pageSize,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [], list = data.info.list, len = list.length;
          for(var i = 0; i < len; i++){
            var d = list[i];
            html.push('<li class="item" data-id="'+d.id+'" data-uid="'+d.uid+'" data-company="'+d.user.company+'">');
            html.push('  <div class="img">');
            html.push('    <a href="'+d.user.url+'"><img src="'+d.user.photo+'" alt=""></a>'+(d.my_video_state ? '<span class="user_video"></span>' : ''));
            html.push('  </div>');
            html.push('  <div class="info">');
            html.push('    <p class="base fn-clear">');
            html.push('      <span class="name">'+d.user.nickname+'</span>');
            if(d.user.level > 1){
              html.push('      <em class="u_level">');
              html.push('        <img src="'+d.user.levelIcon+'" alt=""></em>');
            }
            if(d.user.phoneCheck){
              html.push('      <em class="phone"></em>');
            }
            html.push('      <span class="time">'+d.time+'</span></p>');
            html.push('    <p class="more">');
            html.push('      <span class="age">'+d.user.age+'岁</span>');
            html.push('      <span class="height">'+d.user.heightName+'</span>');
            html.push('      <span class="distance">'+d.juli+'</span></p>');
            html.push('      <div class="content">');
            html.push('        <div class="txt">'+d.content+'</div>');
            if(d.file.length){
              if(d.type == 2){
                var url = picPageUrl.replace('#aid', d.id);
                html.push('        <div class="pics">');
                for(var n = 0; n < d.file.length; n++){
                  if(n < 8){
                    html.push('          <a href="'+url.replace('#atpage', (n+1))+'"><img src="'+d.file[n]+'" alt=""></a>');
                  }else if(n == 8){
                    html.push('          <a href="'+url.replace('#atpage', (n+1))+'"><img src="'+d.file[n]+'" alt=""><span class="picnum">'+d.file.length+'</span></a>');
                  }
                }
                html.push('        </div>');
              }else if(d.type == 3){
                var url = videoPageUrl.replace('#aid', d.id);
                html.push('        <div class="video">');
                // html.push('          <a href="'+url+'"><video src="'+d.file[0]+'"></video></a>');
                html.push('          <a href="'+url+'" id="video_'+d.id+'" data-src="'+d.file[0]+'"><img src="'+staticPath+'images/blank.gif" alt="" /></a>');
                html.push('        </div>');
              }
            }
            html.push('      </div>');
            html.push('    <div class="btns">');
            if(d.zan_has){
              html.push('      <a href="javascript:;" class="good active">'+d.zan+'</a>');
            }else{
              html.push('      <a href="javascript:;" class="good">'+d.zan+'</a>');
            }
            if(uid != d.uid){
              if(d.visit){
                html.push('      <a href="javascript:;" class="greet active">已打招呼</a>');
              }else{
                html.push('      <a href="javascript:;" class="greet">打招呼</a>');
              }
              // if(d.follow){
              //   html.push('      <a href="javascript:;" class="follow hide">关注</a>');
              // }else{
              //   html.push('      <a href="javascript:;" class="follow hide">关注</a>');
              // }
              if(d.user.company != "0"){
                if(d.lead == 1){
                  html.push('      <a href="javascript:;" class="lead active state_'+d.lead+'">牵线中</a>');
                }else if(d.lead == 2){
                  html.push('      <a href="javascript:;" class="lead active state_'+d.lead+'">牵线成功</a>');
                }else if(d.lead == 3){
                  html.push('      <a href="javascript:;" class="lead active state_'+d.lead+'">牵线失败</a>');
                }else{
                  html.push('      <a href="javascript:;" class="lead" id="lead_'+d.uid+'">牵线</a>');
                }
              }
            }
            html.push('    </div>');
            html.push('  </div>');
            html.push('</li>');
          }

          container.append(html.join(""));

          showMsg.close();
          if(data.info.pageInfo.totalPage > page){
            tofoot.text('下拉加载更多').show();
            isload = false;
          }else{
            tofoot.text('已加载完全部数据').show();
          }
        }else{
          showMsg.close();
          tofoot.text('暂无相关信息！').show();
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试！', 1000);
      }
    })
  }

  // 发布说说
  $('.fabuSay').click(function(){
    fabuType = 1;
    var t = $(this);
    $('#content, #fabuWin .uploadbtn').hide();
    fixedWin.show('#fabuWin');
    $('.selectBottom .cancel').click();
  })
  // 从手机相册选择
  $('.fabuUpload').click(function(){
    var t = $(this);
    $('#content').show();
  })

  // 发布
  $("#fabuWin .submit").click(function(){
    var t = $(this), des = $.trim($('#des').val());
    var file = [];
    var type = fabuType;
    if(t.hasClass('disabled')) return;
    if(type == 1){
      if(des == ''){
        showMsg.alert('请填写内容', 1000);
        return false;
      }
    }else{
      $("#content .thumbnail").each(function(){
        var t = $(this);
        if(type == 2){
          file.push(t.find('img').attr('data-val'));
        }else{
          file.push(t.find('video').attr('data-val'))
        }
        if(type == 3){
          return false;
        }
      })
      // 没有上传图片按说说类型提交
      if(file.length == 0){
        if(des == ''){
          showMsg.alert('请填写内容', 1000);
          return false;
        }else{
          type = 1;
        }
      }
    }

    t.addClass('disabled');
    showMsg.loading('正在提交');

    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=putCircle&type='+type+'&content='+des+'&file='+file.join(","),
      type: 'post',
      dataType: 'jsonp',
      success: function(data){
        t.removeClass('disabled');
        showMsg.alert(data.info, 1000);
        if(data && data.state == 100){
          $("#content").html("");
          $("#des").val("");
          $('.selectBottom').removeClass('show');
          fixedWin.close();
          location.reload();
        }
      },
      error: function(){
        t.removeClass('disabled');
        showMsg.alert('网络错误，请重试！', 1000);
      }
    })

  })




  var userAgent = navigator.userAgent.toLowerCase();

  wx.config({
    debug: false,
    appId: wxconfig.appId,
    timestamp: wxconfig.timestamp,
    nonceStr: wxconfig.nonceStr,
    signature: wxconfig.signature,
    jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage','startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice']
  });

  if (userAgent.match(/MicroMessenger/i) == "micromessenger") {
    atlasMax = atlasMax > 9 ? 9 : atlasMax;

    var fileCount = 0;

    //微信上传图片
    wx.ready(function() {

      $('#filePicker2, #filePicker1').unbind().bind('click', function(){

        $('.selectBottom .cancel').click();
        $("#fabuWin").removeClass("fabuType_1 fabuType_2 fabuType_3").addClass("fabuType_"+fabuType);
        if(!$('#fabuWin').hasClass('active')){
          fixedWin.show('#fabuWin');
        }

        fabuType = 2;

        var localIds = [];
        wx.chooseImage({
          count: atlasMax,
          success: function (res) {
            localIds = res.localIds;
            syncUpload();
          },
          fail: function(err){
          },
          complete: function(){
          }
        });

        function syncUpload() {
          if (!localIds.length) {
            // alert('上传成功!');
          } else {
            for(var i = 0; i < localIds.length; i++){
              var localId = localIds[i];
              wx.uploadImage({
                localId: localId,
                success: function(res) {
                  var serverId = res.serverId;


                  //先判断是否超出限制
                  if(fileCount >= atlasMax){
                    showErr('图片数量已达上限');
                    return false;
                  }


                  $.ajax({
                    url: '/api/weixinImageUpload.php',
                    type: 'POST',
                    data: {"service": "siteConfig", "action": "uploadWeixinImage", "module": modelType, "media_id": serverId},
                    dataType: "json",
                    async: false,
                    success: function (data) {

                      if (data.state == 100) {
                        var fid = data.fid, url = data.url, turl = data.turl, time = new Date().getTime(), id = "wx_upload" + time;
                        // uploadbtn.after('<li id="' + id + '" class="thumbnail"><img src="'+turl+'" data-val="'+fid+'"><div class="file-panel"><span class="cancel">×</span></div></li>');
                        var html = '<div id="' + id + '" class="thumbnail">';
                        html += '<img src="'+turl+'" data-val="'+fid+'">';
                        html += '<div class="file-panel"><span class="cancel">×</span></div>';
                        html += '</div>';


                        $('#content').append(html);

                      }else {
                        alert(data.info);
                      }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                      alert(XMLHttpRequest.status);
                      alert(XMLHttpRequest.readyState);
                      alert(textStatus);
                    }
                  });

                  fileCount++;
                  updateStatus();

                  syncUpload();
                },
              });
            }
          }
        }
      });

      $("#content").delegate(".cancel", "click", function(){
        var p = $(this).closest(".thumbnail"), img = p.find("img").attr("data-val");
        delAtlasPic(img);
        p.remove();
        fileCount--;
      })

    });


  //默认上传
  }else if(device.indexOf('huoniao') == -1){

    createUploader(2);
  }


  // 上传设置
  var hasCreatId = '|';
  function createUploader(id) {
    hasCreatId += id+'|';
    var extension = $('#filePicker'+id).attr('data-extensions'), title, mimeTypes = $('#filePicker'+id).attr('data-mimeTypes');

    //上传凭证
    var $list = $('#content'), uploadbtn = $('#fabuWin .uploadbtn'),
        ratio = window.devicePixelRatio || 1,
        fileCount = $list.children('.thumbnail').length,
        thumbnailWidth = 100 * ratio,   // 缩略图大小
        thumbnailHeight = 100 * ratio,  // 缩略图大小
        uploader,
        serverUrl;

      // 初始化Web Uploader
    uploader = WebUploader.create({
      auto: true,
      swf: staticPath + 'js/webuploader/Uploader.swf',
      server: '/include/upload.inc.php?mod=dating',
      pick: '#filePicker'+id,
      fileVal: 'Filedata',
      accept: {
        title: title,
        extensions: extension,
        mimeTypes: mimeTypes
      },
      compress: {
        width: 750,
        height: 750,
        // 图片质量，只有type为`image/jpeg`的时候才有效。
        quality: 90,
        // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
        allowMagnify: false,
        // 是否允许裁剪。
        crop: false,
        // 是否保留头部meta信息。
        preserveHeaders: true,
        // 如果发现压缩后文件大小比原来还大，则使用原来图片
        // 此属性可能会影响图片自动纠正功能
        noCompressIfLarger: false,
        // 单位字节，如果图片大小小于此值，不会采用压缩。
        compressSize: 1024*200
      }
      // fileNumLimit: atlasMax,
      // fileSingleSizeLimit: atlasSize
    });

    //删除已上传视频
    var delAtlasVideo = function(b){
      var g = {
        mod: "dating",
        type: "delVideo",
        picpath: b,
        randoms: Math.random()
      };
      $.ajax({
        type: "POST",
        url: "/include/upload.inc.php",
        data: $.param(g)
      })
    };

    // 负责view的销毁
    function removeFile(file) {
      var $li = $('#'+file.id);
      if (fabuType == "2") {
        delAtlasPic($li.find("img").attr("data-val"));
      }else if (fabuType == "3"){
        delAtlasVideo($li.find("source").attr("data-val"));
      }
      $li.off().find('.file-panel').off().end().remove();
      fileCount = $('#content .thumbnail').length;
      if(fileCount == 0){
        fabuType = 0;
      }
    }

    //从队列删除
    $list.delegate(".cancel", "click", function(){
      var t = $(this), li = t.closest(".thumbnail");
      var file = [];
      file['id'] = li.attr("id");
      if (fabuType == "3") {
        uploadbtn.show();
      }
      removeFile(file);
    });


    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
      $('.selectBottom .cancel').click();
      if (fabuType == "2") {
        $('#fabuWin .uploadbtn').show();
        var $li   = $('<div id="' + file.id + '" class="thumbnail"><img></div>'),
            $btns = $('<div class="file-panel"><span class="cancel">×</span></div>').appendTo($li),
            $img = $li.find('img');
        // 创建缩略图
        uploader.makeThumb(file, function(error, src) {
          if(error){
            $img.replaceWith('<span class="thumb-error">不能预览</span>');
            return;
          }
          // $('#content .textarea').css('height','auto');
          $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);
      }else if (fabuType == "3") {
        $('#fabuWin .uploadbtn').hide();
        var $li   = $('<div id="' + file.id + '" class="thumbnail"><video><source src="" type="video/mp4"></video></div>'),
            $btns = $('<div class="file-panel"><span class="cancel">×</span></div>').appendTo($li),
            $img = $li.find('video');
      }

      $btns.bind('click', '.cancel', function(){
        uploader.removeFile(file, true);
      });

      $("#fabuWin").removeClass("fabuType_1 fabuType_2 fabuType_3").addClass("fabuType_"+fabuType);

      $list.append($li);

      if(!$('#fabuWin').hasClass('active')){
        fixedWin.show('#fabuWin');
        if(hasCreatId.indexOf('|2|') == -1){
          createUploader(2);
        }
      }
    }

    // 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
    uploader.on('beforeFileQueued', function(file) {
      fixedWin.show('#fabuWin');
      var title = serverUrl = '';
      if(file.type.indexOf('image') >= 0){
        if(fabuType == 3){
          // 删除之前的内容
          if(id == 1){
            $('#content .cancel').click();
          }else{
            showMsg.alert('无法同时上传视频和图片', 1000);
            return false;
          }
        }
        fabuType = 2;
        title = 'Images';
        serverUrl = 'type=atlas';
      }else {
        // 删除之前的内容
        if(id == 1){
          $('#content .cancel').click();
        }else{
          if(fabuType == 2){
            showMsg.alert('无法同时上传视频和图片', 1000);
            return false;
          }else if(fabuType == 3){
            showMsg.alert('只能上传一个视频', 1000);
            return false;
          }
        }
        fabuType = 3;
        title = 'Video';
        serverUrl = 'type=thumb&filetype=video';
      }
      uploader.option( 'server', '/include/upload.inc.php?mod=dating&'+serverUrl);
      uploader.option( 'accept', {
        title: 'title',
      });

    })

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function(file) {
      //先判断是否超出限制
      if((fabuType == 2 && fileCount == atlasMax) || (fabuType == 3 && fileCount == 1)){
        showErr('数量已达上限');
        return false;
      }
      fileCount = $("#content .thumbnail").length + 1;
      addFile(file);

    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function(file, percentage){
      var $li = $('#'+file.id),
      $percent = $li.find('.progress span');

      // 避免重复创建
      if (!$percent.length) {
        $percent = $('<p class="progress"><span></span></p>')
          .appendTo($li)
          .find('span');
      }
      $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function(file, response){
      var $li = $('#'+file.id);
      if(response.state == "SUCCESS"){
        $li.find("img").attr("data-val", response.url).attr("src", "/include/attachment.php?f="+response.url);

        var video = [];
        if (fabuType == "3") {
          var $li   = $('#'+file.id);
          $li.html('<video src="/include/attachment.php?f='+response.url+'" data-val="'+response.url+'" webkit-playsinline="true" poster="'+response.poster+'"></video><source data-val="'+response.url+'" type="video/mp4">');
          var $btns = $('<div class="file-panel"><span class="cancel">×</span></div>').appendTo($li);
        }
      }else{
        removeFile(file);
        showErr(response.state);
      }
    });

    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function(file){
      removeFile(file);
      showErr('上传失败2');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function(file){
      $('#'+file.id).find('.progress').remove();
    });

    //上传失败
    uploader.on('error', function(code, file){
      var txt = "请上传正确的文件格式";
      switch(code){
        case "Q_EXCEED_NUM_LIMIT":
          txt = "图片数量已达上限";
          break;
        case "F_EXCEED_SIZE":
          txt = "大小超出限制，单张图片最大不得超过"+atlasSize/1024/1024+"MB";
          break;
        case "F_DUPLICATE":
          txt = "此图片已上传过";
          break;
      }
      showErr(txt+'-'+code);
    });

  }

    //删除已上传图片
  var delAtlasPic = function(b){
    var g = {
      mod: "dating",
      type: "delAtlas",
      picpath: b,
      randoms: Math.random()
    };
    $.ajax({
      type: "POST",
      url: "/include/upload.inc.php",
      data: $.param(g)
    })
  };

  function showErr(txt){
    showMsg.alert(txt, 1000);
  }

})

var fixedWin = {
  init: function(ids){
    var that = this;
    $(ids).click(function(){
      var id = $(this).attr('id');
      that.show("#"+id+'Win');
    })
  },
  show: function(id){
    if($('.fixedWin-show.active').length){
      $('.fixedWin-show.active').addClass('active-last').removeClass('active');
    }
    var con = $(id);
    if(con.length){
      con.addClass("fixedWin-show active");
      con.find('.fixedWin-close').click(function(){
        con.removeClass('fixedWin-show active');
      })
    }
  },
  close: function(id){
    if(id){
      $(id).removeClass("fixedWin-show active");
      if($('.fixedWin-show.active-last').length){
        $('.fixedWin-show.active-last').addClass('active').removeClass('active-last');
      }
    }else{
      $('.fixedWin').removeClass('fixedWin-show active active-last');
    }
  }
}
