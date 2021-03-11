$(function(){

  // 上传封面
  
  var totalCount = 0;
  var myPhotoSwiper;
  
  $('.upbtn').click(function(){
    fixedWin.show('#setFaceWin');
    if($(".piclist").html() == ""){
      showMsg.loading();
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=coverList', '', function(data){
        showMsg.close();
        if(data && data.state == 100){
          var picHtml = [];
          var picHtml2 = [];
          for(var i = 0; i < data.info.length; i++){
            var d = data.info[i];
            picHtml.push('<li class="swiper-slide"><img src="'+d.large+'" data-val="'+d.litpic+'" alt="" class="swiper-lazy"></li>');
            picHtml2.push('<li><img src="'+d.small+'" data-val="'+d.litpic+'" alt=""></li>');
          }
          $(".piclist").html(picHtml2.join(""));
          $("#Gallery").html(picHtml.join(""));
          totalCount = data.info.length;
          myPhotoSwiper = new Swiper('.photoBox .swiper-container', {
            onSlideChangeStart: function(swiper){
              getImage(swiper.activeIndex);
            },
            // Disable preloading of all images
            preloadImages: false,
            // Enable lazy loading
            lazyLoading: true
          });
        }
      })

    }
  })

  $("#setFaceWin").delegate(".piclist li", "click", function(){
    fixedWin.show('#showBigPic');
    var atPage = $(this).index();
    myPhotoSwiper.swipeTo(atPage, 0, false);
    getImage(atPage);
  })

  function getImage(index){
    var li = $(".swiper-container li:eq("+index+")"), img = li.find("img"), src = img.data("src");

    $(".photoBox .count").html((index+1) + '/' + totalCount);
  }

  $('.swiper-container').click(function(){
    if ($('.photo-head').css("display")=="none") {
      $('.photo-head,.f10,.btn-box').show();
    }else{
      $('.photo-head,.f10,.btn-box').hide();
    }
  })

  // 设为封面
  $(".setface").click(function(){
    var index = myPhotoSwiper.activeIndex, img = $(".piclist li").eq(index).find('img'), src = img.attr('src'), val = img.attr("data-val");
    var obj = $('.master_graph .bg img'), old = obj.attr("data-url");
    obj.attr({'src': src, 'data-url': val});
    fixedWin.close();
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType=37&cover='+val+'&old='+old, function(data){
      showMsg.alert(data.info, 1000);
    })
  })

  // 自定义封面
  var backFace = new Upload({
    btn: '#filePicker1',
    bindBtn: '',
    title: 'Images',
    mod: modelType,
    params: 'type=atlas',
    atlasMax: 1,
    replace: 1,
    fileQueued: function(file){
      
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        var obj = $('.master_graph .bg img'), old = obj.attr("data-url");
        obj.attr({'src': response.turl, 'data-url': response.url});
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType=37&cover='+response.url+'&old='+old, function(data){
          showMsg.alert(data.info, 1000);
        })
        fixedWin.close();
      }else{
        showMsg.alert('上传失败', 1000);
      }
    }
  });

  // 更换头像
  var backFace = new Upload({
    btn: '#filePicker2',
    bindBtn: '',
    title: 'Images',
    mod: modelType,
    params: 'type=atlas',
    atlasMax: 1,
    deltype: 'delAtlas',
    fileQueued: function(file){
      
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        var img = $('#filePicker2 img'), old = img.attr("data-url");
        $('#filePicker2 img').attr('src', response.turl);
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType=39&photo='+response.url, function(data){
          showMsg.alert(data.info, 1000);
          if(old){
            backFace.del(old);
          }
        })
      }else{
        showMsg.alert('上传失败', 1000);
      }
    }
  });

  // 头部信息编辑
  $(".editbox").on("input propertychange",function(){
    var t = $(this).children('input');
    t.siblings('.placehold').children('span').text(t.val());
  })

  // 输入框失去焦点自动保存
  $(".master_graph .info input").blur(function(){
    var t = $(this), id = t.attr('id'), upType = t.attr('data-upType'), val_ = val = t.val();
    if(val != ''){
      if(id == 'case' || id == 'year'){
        if(isNaN(val)){
          val = 0;
        }else{
          val = parseInt(val);
        }
        if(val !== val_){
          t.val(val);
          t.siblings('.placehold').children('span').text(val)
        }
      }
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType='+upType+'&'+id+'='+val, function(data){
        showMsg.alert(data.info, 1000);
      })
    }
  })

  $('.editbtn').click(function(){
    var t = $(this), p = t.closest('.box'), area = p.find('.edit, .inp'), text = p.find('.show');

    // 擅长领域
    if(t.hasClass('goodBtn')){
      // 确定
      if(p.hasClass('editing')){
        p.removeClass('editing');
        t.text('编辑');
        updateTag();
      }else{
        p.addClass('editing');
        t.text('确定');
        setEditTag();
      }

    // 联系方式、简介和荣誉
    }else{
      // 确定
      if(p.hasClass('editing')){
        p.removeClass('editing');
        area.prop('readonly', true);
        t.text('编辑');
        var val = area.val();
        text.text(val);
        var upType = 0, name = '';
        if(p.hasClass('profile')){
          upType = 33;
          name = 'profile';
        }else if(p.hasClass('honor')){
          upType = 34;
          name = 'honor';
        }else if(p.hasClass('advice')){
          upType = 36;
          name = 'advice';
        }
        var data = '&'+name+'='+val;

        if(p.hasClass('contact')){
          var tel = $("#telinp").val(), qq = $("#qq").val(), wechat = $("#wechat").val();
          if(tel == ''){
            showMsg.alert('请输入电话号码', 1000);
            return false;
          }
          upType = 38;
          data = '&tel='+tel+'&qq='+qq+'&wechat='+wechat;
        }

        operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType='+upType+data, function(data){
          showMsg.alert(data.info, 1000);
        })

      // 开始编辑
      }else{
        p.addClass('editing');
        area.prop('readonly', false);
        if(area.hasClass('edit')){
          area.val(text.text());
        }
        t.text('确定');
      }
    }
  })

  // 新增标签
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
  $(".addinp").on("input propertychange",function(){
    saveTag();
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
        $('.addinp').hide().val('').before('<span><a href="javascript:;" class="tg">'+res+'</a><em class="rm">×</em></span>');
        if(enter){
          $('#addTag').click();
        }
      }
    }
  }

  // 删除标签
  $('#goodEdit').delegate('.rm', 'click', function(){
    $(this).parent().remove();
  })

  // 保存标签
  function updateTag(){
    var str = [], html = [];
    $('#goodEdit span').each(function(){
      var a = $(this).children('a'), txt = a.text();
      str.push(txt);
      html.push(a.prop('outerHTML'));
    })
    var val = str.join(",");
    $('#good').val(val);
    $('#goodShow').html(html.join(" "));

    operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType=35&tags='+val, function(data){
      showMsg.alert(data.info, 1000);
    })

  }
  // 更新编辑状态下的标签
  function setEditTag(){
    var html = [];
    $('#goodShow a').each(function(){
      var a = $(this), txt = a.text();
      html.push('<span><a href="javascript:;" class="tg">'+txt+'</a><em class="rm">×</em></span>');
    })
    $('#goodEdit span').remove();
    $('.addinp').before(html.join(""));
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
    var that = this;
    if($('.fixedWin-show.active').length){
      $('.fixedWin-show.active').addClass('active-last').removeClass('active');
    }
    var con = $(id);
    if(con.length){
      con.addClass("fixedWin-show active");
      con.find('.fixedWin-close').off().on("click", function(){
        that.close(true);
      })
    }
    $('html').addClass('md_fixed');
  },
  close: function(id){
    if(id){
      if(Boolean(id)){
        $(".fixedWin-show.active").removeClass("fixedWin-show active");
      }else{
        $(id).removeClass("fixedWin-show active");
      }
      if($('.fixedWin-show.active-last').length){
        setTimeout(function(){
          $('.fixedWin-show.active-last').addClass('active').removeClass('active-last');
        }, 250)
      }
    }else{
      $('.fixedWin').removeClass('fixedWin-show active active-last');
    }
    $('html').removeClass('md_fixed');
  }
}