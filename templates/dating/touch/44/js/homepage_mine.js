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
    myPhotoSwiper.slideTo(atPage, 0, false);
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
    var obj = $('.master_graph img'), old = obj.attr("data-url");
    obj.attr({'src': src, 'data-url': val});
    fixedWin.close();
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType=9&cover='+val+'&old='+old, function(data){
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
        var obj = $('.master_graph img'), old = obj.attr("data-url");
        obj.attr({'src': response.turl, 'data-url': response.url});
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType=9&cover='+response.url+'&old='+old, function(data){
          showMsg.alert(data.info, 1000);
        })
        fixedWin.close();
      }else{
        showMsg.alert('上传失败', 1000);
      }
    }
  });

  // 上传相册
  var upPhoto = new Upload({
    btn: '#filePicker2',
    bindBtn: '',
    title: 'Images',
    mod: modelType,
    params: 'type=atlas',
    // atlasMax: 1,
    msg_maxImg: '图片数量超过单次上传最大限制',
    fileQueued: function(file){
      
    },
    filesQueued: function(files){
      this.upIndex = 1;
      this.sucCount = 0;
      this.totalCount = files.length;
    },
    uploadComplete: function(){
      this.upIndex ++;
    },
    uploadProgress: function(file, percentage){
      $('#filePicker2 .webuploader-pick').text('正在上传，' + this.upIndex + '/' + this.totalCount + '：' + (parseInt(percentage) * 100) + '%')
      // showMsg.loading('正在上传，' + this.upIndex + '/' + this.totalCount + '：' + (parseInt(percentage) * 100) + '%');
    },
    uploadFinished: function(){
      if(this.sucCount == this.totalCount){
        showMsg.alert('所有图片上传成功', 1000);
      }else{
        showMsg.alert((this.totalCount - this.sucCount) + '张图片上传失败', 1000);
      }
      $('#filePicker2 .webuploader-pick').text('上传照片');
      var newAlbum = [];
      $("#albumgroup .isnew").each(function(){
        newAlbum.push($(this).attr("data-val"));
      }).removeClass("isnew");
      if(newAlbum.length){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=uploadAlbum', "img="+newAlbum.join(","), function(){
          showMsg.alert("上传照片保存成功", 1000);
        });
      }
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        this.sucCount++;
        $('#albumgroup').prepend('<li class="isnew" data-val="'+response.url+'"><i></i><img src="'+response.turl+'"></li>')
        showMsg.close();
      }
    }
  });

  // 编辑相册
  $('.front_right').click(function(){
    $('.front_item').hide();
    $('.front_choice').show();
    $('.albumList .albumgroup li i').addClass('choice');
    $('.albumFooter').show();
  });
  // 选中图片
  $("#albumgroup").delegate("li","click",function(){
    if($('.front_choice').is(':hidden')) return;
    var c = $(this);
    if(c.find('i').hasClass('choice_z')){
      c.find('i').removeClass('choice_z').addClass('choice');
    }else{
      c.find('i').removeClass('choice').addClass('choice_z');
    }
    var x = $('.choice_z').parent("li").length;
    $('.albumFooter_n').find('em').text(x);
  });
  // 取消编辑相册
  $('.front_quxiao').click(function(){
    $('.front_choice').hide();
    $('.front_item').show();
    $('.albumList .albumgroup li i').removeClass();
    $('.albumFooter').hide();
  });
  // 删除照片
  $('.albumFooter_x').click(function(){
    var ids = [];
    $('.choice_z').each(function(){
      var t = $(this), p = t.closest('li'), id = p.attr('data-id');
      ids.push(id);
      p.remove();
    })
    if(ids.length > 0){
      showMsg.confirm('确定要删除'+ids.length+'张照片',{
        ok: function(){
          $('.choice_z').parent("li").remove();
          $('.albumFooter_n').find('em').text(0);
          
          operaJson(masterDomain+'/include/ajax.php?service=dating&action=albumDel', "id="+ids.join(","));
        },
        cancel: function(){}
      });
    }else{
      showMsg.alert('您没有选中任何照片', 1000);
    }
  });
  $('.front_quanxuan').click(function(){
    var d = $(this);
    if(d.hasClass('rem')){
      $('.albumList .albumgroup li i').removeClass('choice_z').addClass('choice');
      d.removeClass('rem');
      d.css('color','#ff295b');
      $('.albumFooter_n').find('em').text(0);
    }else{
      d.css('color','#9a9999');
      $('.albumList .albumgroup li i').addClass('choice_z');
      var x = $('.choice_z').parent("li").length;
      $('.albumFooter_n').find('em').text(x);
      d.addClass('rem');
    }
  });
  
  // 删除动态
  $("#dynamicner").delegate(".shan","click",function(){
    // $('.shan').click(function(){
    var n = $(this), id = n.closest(".item").attr("data-id");
    showMsg.confirm('确定要删除这条动态吗',{
      ok: function(){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=circleOper', 'type=del&id='+id, function(data){
          showMsg.alert(data.info, 1000);
          if(data && data.state == 100){
            n.closest('.item').remove();
          }
        })
      },
      cancel: function(){}
    });
  });


  // 删除访客
  $('.container').delegate('.btns .del', 'click', function(){
    var t = $(this), p = t.parents('li'), id = p.attr("data-id");
    showMsg.confirm('确定要删除这条信息吗？', {
      ok: function(){
        operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitDel', 'id='+id, function(data){
          if(data && data.state == 100){
            p.remove();
            showMsg.alert('操作成功', 1000);
          }else{
            showMsg.alert(data.info, 1000);
          }
        })
      }
    })
  })
})

  function itemBindTouch(start){
    var container = document.querySelectorAll('.container .item');
    var expansion = null;
    var start = start ? start : 0;
    for(var i = start; i < container.length; i++){    
        var x, y, X, Y, swipeX, swipeY, tx, btnwidth;
        container[i].addEventListener('touchstart', function(event) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
            var sty = this.style.transform;
            if(sty != undefined && sty != ''){
                sty = sty.split('(');
                sty = sty[1].split(',');
                sty = sty[0];
                tx = parseInt(sty);
            }else{
                tx = 0;
            }
            swipeX = true;
            swipeY = true ;

            btnwidth = $(this).find('.btns').width();

            $(this).removeClass("tran");

            var openList = $(this).siblings('.open');
            if(openList.length){
              backDefPos(openList);
            }

        });
        container[i].addEventListener('touchmove', function(event){     
          if(!$(this).hasClass('open')){
            // event.preventDefault();
            // event.stopPropagation();
          }
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;        
            // 左右滑动
            if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
                var m = X-x;
                if(m <= 0){
                    if(tx == 0 && m >= -btnwidth){
                        this.style.transform = 'translate3d('+m+'px, 0px, 0px)';
                    }
                }else{
                    var r = tx + m;
                    if(r <= 0){
                        this.style.transform = 'translate3d('+r+'px, 0px, 0px)';
                    }
                }
                
                // 阻止事件冒泡
                event.stopPropagation();
                swipeY = false;
            }
            // 上下滑动
            if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                swipeX = false;
            }        
        });

        container[i].addEventListener('touchend', function(event){     
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;        
            // 左右滑动
            // if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){}
            if(!swipeX) return;
                var m = X-x;
                if(m <= 0){
                  if($(this).hasClass("open")){
                    return;
                  }
                  $(this).addClass("tran");
                  if(m < -btnwidth/2){
                    $(this).addClass("open");
                    this.style.transform = 'translate3d(-'+btnwidth+'px, 0px, 0px)';
                  }else{
                    $(this).removeClass("open");
                    this.style.transform = 'translate3d(0, 0px, 0px)';
                  }
                }else{
                  $(this).addClass("tran");
                  if(m < btnwidth/2){
                    $(this).addClass("open");
                    this.style.transform = 'translate3d(-'+btnwidth+'px, 0px, 0px)';
                  }else{
                    $(this).removeClass("open");
                    this.style.transform = 'translate3d(0, 0px, 0px)';
                  }
                }
        })
    }
  }

  function backDefPos(obj){
    obj.removeClass('open').addClass('tran').css({'transform':'translate3d(0px, 0px, 0px)'});
    setTimeout(function(){
      obj.removeClass('tran');
    },200)
  }