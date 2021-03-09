$(function(){
  var atpage = 1, pageSize = 10, totalCount = 0, container = $('#list'), mainTop = $('.main').offset().top - 50;

  // 全部/我的
  $('.menu li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    getList(1);
  })
  // 关注
  container.delegate('.follow', 'click', function(){
    var t = $(this), p = t.closest('.item'), uid = p.attr('data-uid');
    if(t.hasClass('active')){
      var url = '/include/ajax.php?service=dating&action=cancelFollow';
      t.removeClass('active').find('span').text('关注');
    }else{
      var url = '/include/ajax.php?service=dating&action=visitOper';
      t.addClass('active').find('span').text('已关注');
    }
    $.post(url, 'type=2&id='+uid);
  })
  // 打招呼
  container.delegate('.greet', 'click', function(){
    var t = $(this), p = t.closest('.item'), uid = p.attr('data-uid');
    if(t.hasClass('active')){
      return false;
    }else{
      var url = '/include/ajax.php?service=dating&action=visitOper';
      t.addClass('active').text('已打招呼');
      $.post(url, 'type=3&id='+uid);
    }
  })
  // 点赞
  container.delegate('.zan', 'click', function(){
    var t = $(this), p = t.closest('.item'), id = p.attr('data-id'), count = parseInt(t.text());
    if(t.hasClass('active')){
      t.removeClass('active').html('<i></i>'+(--count));
    }else{
      t.addClass('active').html('<i></i>'+(++count));
    }
    $.post('/include/ajax.php?service=dating&action=circleOper', 'id='+id);
  })

  // 删除
  container.delegate('.del', 'click', function(){
    var t = $(this), p = t.closest('.item');
    $('.desk').fadeIn(100);
    $('.hello-popup').show().data('item', p);
  })
  // 关闭
  $('.hello-popup-delete, .hello-btn .cancel').click(function(){
    $('.desk').hide();
    $('.hello-popup').hide();
  })
  // 确认删除
  $('.hello-popup .sure').click(function(){
    $('.desk').hide();
    $('.hello-popup').hide();
    var item = $('.hello-popup').data('item'),
        id = item.attr('data-id');
    item.slideUp(200, function(){
      if(item.siblings().length == 0){
        getList(1);
      }else{
        item.remove();
      }
    });
    $.post('/include/ajax.php?service=dating&action=circleOper&type=del&id='+id);
  })

  container.delegate(".player", "click", function(){
    var t = $(this), video = t.siblings('video');
    video[0].play();
    video.prop({"controls":"controls"});
    video[0].onpause = function(){
      t.show();
    }
    video[0].onplaying = function(){
      t.hide();
    }
  })
  // 动态视频播放按钮
  container.delegate(".player", "click", function(){
    var t = $(this), video = t.siblings('video');
    video[0].play();
    t.hide();
  })

  function getList(tr){
    if(tr){
        atpage = 1;
    }
    var init = true;
    if(container.find('.item').length){
      init = false;
    }
    container.html('<div class="loading">正在获取，请稍后</div>');
    $(".pagination").hide();

    var data = [];
    data.push('page='+atpage);
    data.push('pageSize='+pageSize);

    var menu = $('.menu li.active').data('param');
    if(menu){
      data.push(menu);
    }

    // if(lng >= 0){
    //     data.push('lng='+lng);
    //     data.push('lat='+lat);
    // }

    $('.addrBtn').each(function(){
        var t = $(this), id = t.attr('data-id');
        id = id == undefined ? '' : id;
        t.parent().attr('data-id', id);
    })
    $('.father-li').not('.lock').each(function(){
        var t = $(this), type = t.data('type'), id = t.attr('data-id');
        if(id != undefined){
            data.push(type+'='+id);
        }
    })
    totalCount = 0;
    showPageInfo();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=circleList',
      type: 'get',
      data: data.join('&'),
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [];
          totalCount = data.info.pageInfo.totalCount;

          for(var i = 0; i < data.info.list.length; i++){
            var d = data.info.list[i];
            var u = d.user;
            var cls = u.id == user.id ? 'item self' : 'item';
            var photo = u.photo ? ('<img src="'+u.photo+'" alt="" />') : ('<img src="' + staticPath + 'images/noPhoto_100.jpg" class="nophoto" alt="" />');
            html.push('<div class="'+cls+'" data-id="'+d.id+'" data-uid="'+u.id+'">');
            html.push('  <div class="user fn-clear">');
            html.push('    <div class="photo">');
            html.push('      <a href="'+u.url+'" target="_blank">'+photo+'</a>');
            html.push('    </div>');
            html.push('    <div class="info">');
            html.push('      <p class="name"><a href="'+u.url+'" target="_blank">'+u.nickname+'</a></p>');
            html.push('      <p class="base">'+u.sex == "1" ? "男" : "女"+'&nbsp;&nbsp;'+u.age+'岁&nbsp;&nbsp;<span class="distance"></span></p>');
            html.push('    </div>');
            html.push('    <div class="btn">');
            if(d.follow){
              html.push('      <a href="javascript:;" class="follow active"><i></i><span>已关注</span></a>');
            }else{
              html.push('      <a href="javascript:;" class="follow"><i></i><span>关注</span></a>');
            }
            if(d.visit){
              html.push('      <a href="javascript:;" class="greet active">已打招呼</a>');
            }else{
              html.push('      <a href="javascript:;" class="greet">打招呼</a>');
            }
            if(u.id == user.id){
              html.push('      <a href="javascript:;" class="del">删除</a>');
            }
            html.push('    </div>');
            html.push('  </div>');
            html.push('  <div class="content">');
            html.push('    <p class="text">'+d.content+'</p>');
            if(d.file.length){
              var cls = d.type == 2 ? 'pics' : 'video';
              html.push('    <ul class="file '+cls+' fn-clear">');
              if(d.type == 2){
                for(var n = 0; n < d.file.length; n++){
                  html.push('<li class="pic"><a href="'+d.file[n]+'"><img src="'+d.file[n]+'" alt=""></a></li>')
                }
              }else{
                html.push('      <li><video src="'+d.file[0]+'" id="video_'+d.id+'"></video><a href="javascript:;" class="player"></a></li>');
              }
              html.push('    </ul>');
            }
            html.push('  </div>');
            html.push('  <p class="other">');
            html.push('    <span class="time">'+d.time+'</span>');
            if(d.zan_has){
              html.push('    <a href="javascript:;" class="zan active"><i></i>'+d.zan+'</a>');
            }else{
              html.push('    <a href="javascript:;" class="zan"><i></i>'+d.zan+'</a>');
            }
            html.push('  </p>');
            html.push('</div>');
          }
          container.html(html.join(''));
          $('#list .pic a').abigimage();
          if(!init){
            $('html,body').animate({scrollTop:mainTop}, 500);
          }
          showPageInfo();
        }else{
          container.html('<div class="loading">暂无相关信息</div>');
        }
      },
      error: function(){
        container.html('<div class="loading">网络错误，请重试</div>');
      }
    })
  }

  // 打印分类
  function showPageInfo() {
      var info = $(".pagination");
      var nowPageNum = atpage;
      var allPageNum = Math.ceil(totalCount / pageSize);
      var pageArr = [];

      info.html("").hide();

      //输入跳转
      // var redirect = document.createElement("div");
      // redirect.className = "pagination-gotopage";
      // redirect.innerHTML =
      //     '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
      // info.append(redirect);

      // //分页跳转
      // info.find(".btn").bind("click", function () {
      //     var pageNum = info.find(".inp").val();
      //     if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
      //         atpage = pageNum;
      //         getList();
      //     } else {
      //         info.find(".inp").focus();
      //     }
      // });

      var pages = document.createElement("div");
      pages.className = "page pagination-pages fn-clear";
      info.append(pages);

      //拼接所有分页
      if (allPageNum > 1) {

          //上一页
          if (nowPageNum > 1) {
              var prev = document.createElement("a");
              prev.className = "prev";
              prev.innerHTML = '上一页';
              prev.onclick = function () {
                  atpage = nowPageNum - 1;
                  getList();
              }
          } else {
              var prev = document.createElement("span");
              prev.className = "prev disabled";
              prev.innerHTML = '上一页';
          }
          info.find(".pagination-pages").append(prev);

          //分页列表
          if (allPageNum - 2 < 1) {
              for (var i = 1; i <= allPageNum; i++) {
                  if (nowPageNum == i) {
                      var page = document.createElement("span");
                      page.className = "curr";
                      page.innerHTML = i;
                  } else {
                      var page = document.createElement("a");
                      page.innerHTML = i;
                      page.onclick = function () {
                          atpage = Number($(this).text());
                          getList();
                      }
                  }
                  info.find(".pagination-pages").append(page);
              }
          } else {
              for (var i = 1; i <= 2; i++) {
                  if (nowPageNum == i) {
                      var page = document.createElement("span");
                      page.className = "curr";
                      page.innerHTML = i;
                  } else {
                      var page = document.createElement("a");
                      page.innerHTML = i;
                      page.onclick = function () {
                          atpage = Number($(this).text());
                          getList();
                      }
                  }
                  info.find(".pagination-pages").append(page);
              }
              var addNum = nowPageNum - 4;
              if (addNum > 0) {
                  var em = document.createElement("span");
                  em.className = "interim";
                  em.innerHTML = "...";
                  info.find(".pagination-pages").append(em);
              }
              for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
                  if (i > allPageNum) {
                      break;
                  } else {
                      if (i <= 2) {
                          continue;
                      } else {
                          if (nowPageNum == i) {
                              var page = document.createElement("span");
                              page.className = "curr";
                              page.innerHTML = i;
                          } else {
                              var page = document.createElement("a");
                              page.innerHTML = i;
                              page.onclick = function () {
                                  atpage = Number($(this).text());
                                  getList();
                              }
                          }
                          info.find(".pagination-pages").append(page);
                      }
                  }
              }
              var addNum = nowPageNum + 2;
              if (addNum < allPageNum - 1) {
                  var em = document.createElement("span");
                  em.className = "interim";
                  em.innerHTML = "...";
                  info.find(".pagination-pages").append(em);
              }
              for (var i = allPageNum - 1; i <= allPageNum; i++) {
                  if (i <= nowPageNum + 1) {
                      continue;
                  } else {
                      var page = document.createElement("a");
                      page.innerHTML = i;
                      page.onclick = function () {
                          atpage = Number($(this).text());
                          getList();
                      }
                      info.find(".pagination-pages").append(page);
                  }
              }
          }

          //下一页
          if (nowPageNum < allPageNum) {
              var next = document.createElement("a");
              next.className = "next";
              next.innerHTML = '下一页';
              next.onclick = function () {
                  atpage = nowPageNum + 1;
                  getList();
              }
          } else {
              var next = document.createElement("span");
              next.className = "next disabled";
              next.innerHTML = '下一页';
          }
          info.find(".pagination-pages").append(next);

          info.show();

      } else {
          info.hide();
      }
  }

  getList();

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(sct >= $('.main-right').offset().top){
      !$('.putbox').hasClass('fixed') && $('.putbox').addClass('fixed');
    }else{
      $('.putbox').removeClass('fixed');
    }
  })

  $('.fabu').click(function(){
    $(".desk").fadeIn();
    $(".dialog_circle").show().addClass("scaleOut");
    setTimeout(function(){
      $(".dialog_circle").removeClass("scaleOut");
    }, 30000)
  })
  $(".dialog .close, .desk").click(function(){
    var dialog = $('.dialog:visible');
    if(!dialog.length) return;
    $(".desk").fadeOut();
    var dialog_ = dialog;
    dialog_.addClass("scaleIn");
    setTimeout(function(){
      dialog_.hide().removeClass("scaleIn");
    }, 300)
  })
  $('.dialog .authority-body a').click(function(){
    $('.dialog .close').click();
  })

  var fileBox = $('#fileBox');

  var upPic = new Upload({
    btn: '#upPic',
    bindBtn: '',
    title: 'Images',
    mod: 'dating',
    params: 'type=atlas',
    atlasMax: atlasMax,
    deltype: 'delAtlas',
    replace: false,
    fileQueued: function(file){
      var $li = $('<li class="pic" id="'+file.id+'"><img /><a href="javascript:;" class="remove"></a></li>');
      var $img = $li.find('img');
      var $btns = $li.find('.remove');
      fileBox.append($li);
      // 创建缩略图
      upPic.uploader.makeThumb(file, function(error, src) {
        if(error){
          $img.replaceWith('<p class="thumb-error">上传中...</p>');
          return;
        }
        $img.attr('src', src);
      }, upPic.config.upPic, upPic.config.thumbnailHeight);
      $btns.on('click', function(){
        upPic.uploader.cancelFile( file );
        upPic.uploader.removeFile(file, true);
      });
      $('#upVideo').hide();
      dialogAutoPos();
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        var li = $('#'+file.id), isface = li.attr("data-face");
        if(isface == 1){
          $('#'+file.id).html('<img src="'+response.turl+'" data-url="'+response.url+'" alt=""><a href="javascript:;" class="remove"></a>');
        }else{
          $('#'+file.id).html('<img src="'+response.turl+'" data-url="'+response.url+'" alt=""><a href="javascript:;" class="remove"></a>');
        }
      }
    },
    uploadError: function(){

    }
  });

  var upVideo = new Upload({
    btn: '#upVideo',
    bindBtn: '',
    title: 'Video',
    mod: 'dating',
    params: 'filetype=video',
    atlasMax: 1,
    deltype: 'delVideo',
    replace: false,
    msg_maxImg: '视频数量已达上限',
    fileQueued: function(file){
      var $li = $('<li class="video" id="'+file.id+'"><p class="thumb-error">上传中...</p><a href="javascript:;" class="remove"></a></li>');
      var $video = $li.find('video');
      var $btns = $li.find('.remove');
      fileBox.append($li);

      $btns.on('click', function(){
        upVideo.uploader.cancelFile( file );
        upVideo.uploader.removeFile(file, true);
      });
      dialogAutoPos();
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        var li = $('#'+file.id);
        $('#'+file.id).html('<video src="'+response.turl+'" data-url="'+response.url+'" alt=""></video><a href="javascript:;" class="remove"></a><a href="javascript:;" class="player"></a>');
        dialogAutoPos();
      }
    },
    uploadError: function(){
      dialogAutoPos();
    }
  });
  fileBox.delegate('.remove', 'click', function(){
    var t = $(this), p = t.closest('li'), val;
    if(t.siblings('img').length){
      val = t.siblings('img').attr('data-url');
      upPic.del(val);
      
    }else{
      val = t.siblings('video').attr('data-url')
      upVideo.del(val);
    }
    t.parent().remove();
    dialogAutoPos();
  })

  function dialogAutoPos(){
    var h = $('.dialog_circle').height();
    $('.dialog_circle').css({'margin-top':-h/2});
    if(fileBox.find('.pic').length == 0){
      $('#upVideo').show();
    }else{
      $('#upVideo').hide();
    }
    if(fileBox.find('.video').length == 0){
      $('#upPic').show();
    }else{
      $('#upPic').hide();
    }
  }

  // 提交发布动态
  $('.dialog_circle .submit').click(function(){
    var t = $(this),
        content = $('#content'),
        type = 1,
        file = [];
    if(t.hasClass('disabled')) return;
    fileBox.children('li').each(function(){
      var i = $(this);
      if(i.hasClass('video')){
        type = 3;
        file[0] = i.children('video').attr('data-url');
        return;
      }else{
        type = 2;
        file.push(i.children('img').attr('data-url'))
      }
    })
    if(type == 1 && content.val() == ''){
      content.focus();
      return;
    }

    $.ajax({
      url: '/include/ajax.php?service=dating&action=putCircle',
      type: 'post',
      data: 'type='+type+'&content='+encodeURIComponent(content.val())+'&file='+file.join(','),
      dataType: 'json',
      success: function(data){
        if(data && data.state == 100){
          $('.dialog_circle .info').html('<p>'+data.info+'</p>');
          setTimeout(function(){
            $('.dialog .close').click();
            fileBox.html('');
            content.val('');
            dialogAutoPos();
            $('.dialog_circle .info').html('');
            getList(1);
          },1000)
        }else{
          $('.dialog_circle .info').html(data.info);
        }
        t.removeClass('disabled');
      },
      error: function(){
        $('.dialog_circle .info').html('网络错误，请重试');
        setTimeout(function(){
          $('.dialog_circle .info').html('');
          t.removeClass('disabled');
        }, 2000)
      }

    })

  })
})
  function Upload(option){
    var upBtn = $(option.btn);
    var ratio = window.devicePixelRatio || 1;

    var def = {
      deltype: 'delImage',
      msg_maxImg: '图片数量已达上限',
      replace: false, //上传单张图片时可以继续上传以便替换 atlasMax = 1
      extensions : upBtn.attr('data-extensions'),
      mimeTypes : upBtn.attr('data-mimeTypes'),
      thumbnailWidth : 100,
      thumbnailHeight : 100,
      has : 0,
      atlasMax : window.atlasMax ? atlasMax : 1,
      fileQueued: function(file){},
      filesQueued: function(files){},
      uploadStart: function(files){},
      uploadError: function(){},
      uploadComplete: function(){},
      uploadFinished: function(){},
      uploadProgress: function(file, percentage){
        var $li = $('#'+file.id),
        $percent = $li.find('.progress span');

        // 避免重复创建
        if (!$percent.length) {
          $percent = $('<p class="progress"><span></span></p>')
            .appendTo($li)
            .find('span');
        }
        $percent.css('width', percentage * 100 + '%');
      },
      uploadSuccess: function(file, response, activeBtn){
        var $li = $('#'+file.id);
        if(response.state == "SUCCESS"){
          $li.find("img").attr("data-val", response.url).attr("src", "/include/attachment.php?f="+response.url);
        }
      },
      showErr: function(info){
        $('.dialog_circle .info').text(info);
        setTimeout(function(){
          $('.dialog_circle .info').text('');
        }, 2000)
      }
    }
    var config = $.extend(true, {}, def, option);
    this.activeBtn = null;
    this.config = config;
    this.uploader = null;
    this.fileCount = config.has;
    this.init(config);
  }

  Upload.prototype = {
    // 初始化
    init: function(config){
      var that_ = this;
      that_.uploader = WebUploader.create({
        auto: true,
        swf: staticPath + 'js/webuploader/Uploader.swf',
        server: '/include/upload.inc.php?mod='+config.mod+'&'+config.params,
        pick: config.btn,
        fileVal: 'Filedata',
        accept: {
          title: config.title,
          extensions: config.extensions,
          mimeTypes: config.mimeTypes
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
        },
        // fileNumLimit: (config.atlasMax ? config.atlasMax : atlasMax),
        // fileSingleSizeLimit: atlasSize
      });
      // 当有文件添加进来的时候
      that_.uploader.on('fileQueued', function(file) {
        //先判断是否超出限制
        if(that_.fileCount >= config.atlasMax){
          that_.uploader.cancelFile( file );

          that_.config.showErr(config.msg_maxImg, 1000);
          return false;
        }
        if(config.atlasMax > 1 || !config.replace){
          that_.fileCount++;
        }
        config.fileQueued(file, that_.activeBtn);
      });
      // 当有文件添加进来的时候
      that_.uploader.on('filesQueued', function(files) {
        config.filesQueued(files, that_.activeBtn);
      });
      // 某个文件开始的时候
      that_.uploader.on('uploadStart', function(file) {
        config.uploadStart(file);
      });
      // 文件上传过程中创建进度条实时显示。
      that_.uploader.on('uploadProgress', function(file, percentage){
        config.uploadProgress(file, percentage);
      });

      // 文件上传成功，给item添加成功class, 用样式标记上传成功。
      that_.uploader.on('uploadSuccess', function(file, response){
        // config.uploadSuccess(file, response, that_.activeBtn);
        config.uploadSuccess.call(that_, file, response, that_.activeBtn);
        if(response.state != "SUCCESS"){
          $("#"+file.id).remove();
          that_.fileCount--;
          that_.config.showErr(response.state, 1000);
        }
      });

      // 文件上传失败，显示上传出错。
      that_.uploader.on('uploadError', function(file){
        config.uploadError();
        that_config.showErr(langData['siteConfig'][20][306]);
        setTimeout(function(){that_.activeBtn = null},200);
      });

      // 完成上传完了，成功或者失败，先删除进度条。
      that_.uploader.on('uploadComplete', function(file){
        //清空队列
        //  that_.uploader.reset();
        config.uploadComplete();
        setTimeout(function(){that_.activeBtn = null},200);
      });

      // 所有文件上传成功后调用
      that_.uploader.on('uploadFinished', function () {
        //清空队列
        that_.uploader.reset();
        config.uploadFinished();
        setTimeout(function(){that_.activeBtn = null},200);
      });

      if(config.bindBtn){
        $(document).delegate(config.bindBtn, "click", function(){
          that_.activeBtn = $(this);
          $(config.btn + ' label').click();
        })
      }
    },
    del: function(path){
      var g = {
        mod: this.config.mod,
        type: this.config.deltype,
        picpath: path,
        randoms: Math.random()
      };
      $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: "/include/upload.inc.php",
        dataType: "json",
        data: $.param(g),
        success: function() {}
      });
      this.fileCount--;
    }
  }
