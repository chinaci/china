$(function(){

    //原生APP后退回来刷新页面
    pageBack = function(data) {
        setupWebViewJavascriptBridge(function(bridge) {
        	bridge.callHandler("pageRefresh", {}, function(responseData){});
        });
    }

  // 展开下拉式选项
  $(".dropdown").click(function(){
    var t = $(this), box = $("#"+t.attr("data-drop"));
    if(t.hasClass("arrow-down")){
      t.removeClass("arrow-down");
      box.removeClass("fade-in");
    }else{
      t.addClass("arrow-down");
      box.addClass("fade-in");
      box.trigger('dropdown');
    }
  })

  //经营类目
  $('#typeid').change(function(){
      var typeid = $('#typeid').val();
      $.post('/include/ajax.php?service=business&action=updateStoreConfig&typeid='+typeid);
  });

  //联系电话
  $('#tel').blur(function(){
      var tel = $('#tel').val();
      $.post('/include/ajax.php?service=business&action=updateStoreConfig&tel='+tel);
  });

  //保存
  $('.fabuBtn').bind('click', function(){
    var areaCode = $('#areaCode').val();
    var typeid = $('#typeid').val();
    var tel = $('#tel').val();

    $.post('/include/ajax.php?service=business&action=updateStoreConfig&areaCode='+areaCode+'&tel='+tel+'&typeid='+typeid);

    alert('保存成功！');
  });

  // $('#circle_choose').on('dropdown', function(){
  //   $.ajax({
  //     url: masterDomain + '/include/ajax.php?service=siteConfig&action=getCircle&cid='+detail.cityid+'&qid='+detail.addrid,
  //     type: 'get',
  //     dataType: 'jsonp',
  //     success: function(data){

  //     }
  //   })
  // })


  // 选择标签
  $(".p-tags span").click(function(){
    var t = $(this), p = t.parent();
    if(p.attr("data-once") == "1"){
      t.addClass("active").siblings().removeClass("active");
    }else if(!p.hasClass('shopTags')){
      t.toggleClass("active");
    }

    // 商圈
    if(p.hasClass('circleTags')){
      var data = [];
      p.children('span').each(function(){
        var d = $(this), id = d.attr('data-id');
        if(d.hasClass('active')){
          data.push(id);
        }
      })
      $.post('/include/ajax.php?service=business&action=updateStoreConfig&circle='+data.join(','));
    // 特色标签
    }else if(p.hasClass('serverTags')){
      var data = [];
      p.children('span').each(function(){
        var d = $(this), txt = d.children('em').text();
        if(d.hasClass('active')){
          data.push(txt);
        }
      })
      $.post('/include/ajax.php?service=business&action=updateStoreConfig&tag='+data.join('|'));
    }
  })

  // 新增店铺标签
  $('#addTag').click(function(){
    if($('.addinp').val() != ''){
      saveTag(1);
    }else{
      $('.addinp').show().focus();
    }
  })

  $(".addinp").on("input keyup",function(e){
    if(e.keyCode == 13){
      saveTag(1);
    }
  })
  $(".addinp").blur(function(e){
     saveTag(1);
  })
  $(".addinp").on("input propertychange",function(){
    saveTag();
  })
  $('.shopTags').delegate('.rm', 'click', function(){
    $(this).parent().remove();
    updateStoreTag();
  })
  function saveTag(enter){
    var t = $('.addinp'), val = t.val(), res = '';
    if(val != ''){
      val = val.replace(/^\s*/,"");
      val = val.replace(/,/g,"");
      t.val(val);
      if(val.indexOf(' ') > 0){
        res = val.split(' ')[0];
      }else if(enter){
        res = val;
      }
      if(res != ''){
        $('.addinp').hide().val('').before('<span class="tag active"><em>'+res+'</em><i class="rm">×</i></span>');
        if(enter){
          $('#addTag').click();
        }
        updateStoreTag();
      }
    }
  }
  // 保存店铺标签
  function updateStoreTag(){
    var str = [], html = [];
    $('.shopTags span').each(function(){
      var t = $(this), txt = t.children("em").text();
      str.push(txt);
    })
    var val = str.join("|");

    $.post('/include/ajax.php?service=business&action=updateStoreConfig', 'tag_shop='+val);

  }

  // 上传LOGO
  var upPhoto = new Upload({
    btn: '#up_logo',
    bindBtn: '',
    title: 'Images',
    mod: 'business',
    params: 'type=atlas',
    atlasMax: 1,
    deltype: 'delAtlas',
    replace: true,
    fileQueued: function(file){

    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        var dt = $('#up_logo').closest("dl").children("dt");
        var img = dt.children('img');
        if(img.length){
          var old = img.attr('data-url');
          upPhoto.del(old);
        }
        dt.html('<img src="'+response.turl+'" data-url="'+response.url+'" alt="">');
        $("#logo").val(response.url)

        $.post('/include/ajax.php?service=business&action=updateStoreConfig&logo='+response.url);
      }
    },
    showErr: function(info){
      showErr(info);
    }
  });
  // 上传微信二维码
  var upWeixin = new Upload({
    btn: '#up_wechatqr',
    bindBtn: '',
    title: 'Images',
    mod: 'business',
    params: 'type=atlas',
    atlasMax: 1,
    deltype: 'delAtlas',
    replace: true,
    fileQueued: function(file){

    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        var dt = $('#up_wechatqr').closest("dl").children("dt");
        var img = dt.children('img');
        if(img.length){
          var old = img.attr('data-url');
          upPhoto.del(old);
        }
        dt.html('<img src="'+response.turl+'" data-url="'+response.url+'" alt="">');
        $("#wechatqr").val(response.url);

        $.post('/include/ajax.php?service=business&action=updateStoreConfig&wechatqr='+response.url);
      }
    },
    uploadError: function(){

    },
    showErr: function(info){
      showErr(info);
    }
  })

  // 上传店铺幻灯
  var upslideShow = new Upload({
    btn: '#up_slideShow',
    bindBtn: '',
    title: 'Images',
    mod: 'business',
    params: 'type=atlas',
    atlasMax: 5,
    deltype: 'delAtlas',
    replace: true,
    fileQueued: function(file){
      $("#up_slideShow").parent().append('<li id="'+file.id+'"><a href="javascript:;" class="close">×</a></li>');
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        $('#'+file.id).html('<img src="'+response.turl+'" data-url="'+response.url+'" alt=""><a href="javascript:;" class="close">×</a>');
      }
    },
    uploadFinished: function(){
      if(this.sucCount == this.totalCount){
        // showErr('所有图片上传成功');
      }else{
        showErr((this.totalCount - this.sucCount) + langData['siteConfig'][44][19].replace('1',''));//1张图片上传失败
      }

      updateBanner();
    },
    uploadError: function(){

    },
    showErr: function(info){
      showErr(info);
    }
  });
  $('.slideshow').delegate('.close', 'click', function(){
    var t = $(this), val = t.siblings('img').attr('data-url');
    upslideShow.del(val);
    t.parent().remove();
    updateBanner();
  })
  function updateBanner(){
    var banner = [];
    $("#slideShow_choose li").each(function(i){
      if(i > 0){
        var src = $(this).children('img').attr('data-url');
        banner.push(src);
      }
    })
    $.post('/include/ajax.php?service=business&action=updateStoreConfig&banner='+banner.join(','));
  }

  // 上传店铺视频
  var upvideoShow = new Upload({
    btn: '#up_videoShow',
    bindBtn: '',
    title: 'Video',
    mod: 'business',
    params: 'type=thumb&filetype=video',
    atlasMax: 1,
    deltype: 'delVideo',
    replace: true,
    fileQueued: function(file){
      var has = $("#up_videoShow").next();
      if(has.length){
        has.find('.close').click();
        has.remove();
      }
      $("#up_videoShow").after('<li id="'+file.id+'"><a href="javascript:;" class="close">×</a></li>');
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        $('#'+file.id).html('<video src="'+response.turl+'" data-url="'+response.url+'" /><a href="javascript:;" class="close">×</a>');
      }
    },
    uploadFinished: function(){
      if(this.sucCount == this.totalCount){
        // showErr('所有图片上传成功');
      }else{
        showErr((this.totalCount - this.sucCount) + langData['siteConfig'][44][20].replace('1',''));//1个视频上传失败
      }

      updateVideo();
    },
    uploadError: function(){

    },
    showErr: function(info){
      showErr(info);
    }
  });
  $('.videoshow.video').delegate('.close', 'click', function(){
    var t = $(this), val = t.siblings('video').attr('data-url');
    upvideoShow.del(val);
    t.parent().remove();
    updateVideo();
  })
  function updateVideo(){
    var video = [];
    $("#videoShow_choose .video li").each(function(i){
      if(i == 1){
        var src = $(this).children('video').attr('data-url');
        video.push(src);
      }
    })
    $.post('/include/ajax.php?service=business&action=updateStoreConfig&video='+video.join(','));
  }
  // 视频封面
  var upvideopicShow = new Upload({
    btn: '#up_videoPicShow',
    bindBtn: '',
    title: 'Images',
    mod: 'business',
    params: 'type=atlas',
    atlasMax: 1,
    deltype: 'delAtlas',
    replace: true,
    fileQueued: function(file, activeBtn){
      var has = $("#up_videoPicShow").next();
      if(has.length){
        has.find('.close').click();
        has.remove();
      }
      $("#up_videoPicShow").after('<li id="'+file.id+'"><a href="javascript:;" class="close">×</a></li>');
    },
    uploadSuccess: function(file, response, btn){
      if(response.state == "SUCCESS"){
        $('#'+file.id).html('<img src="'+response.turl+'" data-url="'+response.url+'" /><a href="javascript:;" class="close">×</a>');
        $.post('/include/ajax.php?service=business&action=updateStoreConfig&video_pic='+response.url);
      }
    },
    uploadFinished: function(){
      if(this.sucCount == this.totalCount){
        // showErr('所有图片上传成功');
      }else{
        // showErr((this.totalCount - this.sucCount) + '张图片上传失败');
      }

    },
    uploadError: function(){

    },
    showErr: function(info){
      showErr(info);
    }
  });
  $('.videoshow.pic').delegate('.close', 'click', function(){
    var t = $(this), val = t.siblings('img').attr('data-url');
    upvideopicShow.del(val);
    t.parent().remove();
  })

  // 上传全景图片
  var upqjShow = new Upload({
    btn: '#up_qj',
    bindBtn: '#qjshow_box .addbtn_more',
    title: 'Images',
    mod: 'business',
    params: 'type=atlas',
    atlasMax: 6,
    deltype: 'delAtlas',
    replace: false,
    fileQueued: function(file, activeBtn){
      var btn = activeBtn ? activeBtn : $("#up_qj");
      var p = btn.parent(), index = p.index();
      console.log(file)
      $("#qjshow_box li").each(function(i){
        if(i >= index){
          var li = $(this), t = li.children('.addbtn'), img = li.children('.img');
          if(img.length == 0){
            t.after('<div class="img" id="'+file.id+'"><a href="javascript:;" class="close">×</a></div>');
            return false;
          }
        }
      })
    },
    uploadSuccess: function(file, response, btn){
      if(response.state == "SUCCESS"){
        $('#'+file.id).html('<img src="'+response.turl+'" data-url="'+response.url+'" /><a href="javascript:;" class="close">×</a>');
      }
    },
    uploadFinished: function(){
      if(this.sucCount == this.totalCount){
        // showErr('所有图片上传成功');
      }else{
        showErr((this.totalCount - this.sucCount) + langData['siteConfig'][44][19].replace('1',''));//1张图片上传失败
      }

      updateQj();
    },
    uploadError: function(){

    },
    showErr: function(info){
      showErr(info);
    }
  });
  $('.qjshow').delegate('.close', 'click', function(){
    var t = $(this), val = t.siblings('img').attr('data-url');
    upqjShow.del(val);
    t.parent().remove();
    updateQj('del');
  })

  $('#qj_file').blur(function(){
    updateQj();
  })

  function updateQj(){
    var qj_type = $('[name=qj_type]:checked').val();
    var qj_file = [];
    if(qj_type == 0){
      $("#qjShow_choose li").each(function(i){
        var img = $(this).find('img');
        if(img.length){
          var src = img.attr('data-url');
          qj_file.push(src);
        }else{
          qj_file.push('');
        }
      })
    }else{
      qj_file.push($('#qj_file').val());
    }
    $.post('/include/ajax.php?service=business&action=updateStoreConfig&qj_type='+qj_type+'&qj_file='+qj_file.join(','));
  }

  // 切换全景类型
  $(".tab-nav label").click(function(){
    var t = $(this), index = t.index(), box = t.parent().next('.tab-body');
    box.children('div').eq(index).fadeIn(100).siblings().hide();
  })
  //国际手机号获取
    getNationalPhone();
    function getNationalPhone(){
        $.ajax({
            url: "/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   var listLen = list.length;
                   var codeArea = list[0].code;
                   if(listLen == 1 && codeArea == 86){//当数据只有一条 并且这条数据是大陆地区86的时候 隐藏区号选择
                        $('.areacode_span').closest('dl').hide();
                        return false;
                   }
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li><span>'+list[i].name+'</span><em class="fn-right">+'+list[i].code+'</em></li>');
                   }
                   $('.layer_list ul').append(phoneList.join(''));
                }else{
                   $('.layer_list ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                    $('.layer_list ul').html('<div class="loading">加载失败！</div>');
                }

        })
    }
    // 打开手机号地区弹出层
    $(".areacode_span").click(function(){
        $('.layer_code').show();
        $('.mask-code').addClass('show');
    })
    // 选中区域
    $('.layer_list').delegate('li','click',function(){
        var t = $(this), txt = t.find('em').text();
        $(".areacode_span em").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

})

// 错误提示
function showErr(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}
