$(function() {

  var showUpInfo = false;
	var totalCount = $('#Gallery .swiper-slide').length;
  var mySwiper = new Swiper('.swiper-container', {
    onSlideChangeStart: function(swiper){
    	getImage(swiper.activeIndex);
    },
    onSlideChangeEnd: function(swiper){
      if(type == "album"){
        var index = mySwiper.activeIndex, li = $("#Gallery li").eq(index), zan = li.attr("data-zan");
        if(zan == "1"){
          $(".zan").addClass("active");
        }else{
          $(".zan").removeClass("active");
        }
      }
    },
    // Disable preloading of all images
    preloadImages: false,
    // Enable lazy loading
    lazyLoading: true
  });
  atPage = atPage ? atPage - 1 : atPage;
  mySwiper.swipeTo(atPage, 0, false);
  getImage(atPage);

  function getImage(index){
		var li = $(".swiper-container li:eq("+index+")"), img = li.find("img"), src = img.data("src"), lock = img.data("lock"), zan = li.attr("data-zan");

    if(lock != 1){
  		if(src != ''){
        img.attr("src", src);
      }
    }else if(!showUpInfo){
      showUpInfo = true;
      showMsg.confirm('您当前的会员等级可查看照片数量已达上限，查看更多照片请升级会员', {
        btn: {
          ok: '<a href="'+upgradeUrl+'" class="ok">充值</a>',
        }
      })
    }
		$(".count").html((index+1) + '/' + totalCount);

    if(type == "album"){
      if(zan == "1"){
        $(".zan").addClass("active");
      }else{
        $(".zan").removeClass("active");
      }
    }

	}

  $('.swiper-container').click(function(){
    if ($('.photo-head').css("display")=="none") {
      $('.photo-head,.f10,.btn-box').show();
    }else{
      $('.photo-head,.f10,.btn-box').hide();
    }
  })

  // 删除照片
  $(".del").click(function(){
    var index = mySwiper.activeIndex, li = $("#Gallery li").eq(index), id = li.attr("data-id");
    var toIndex = -1, pg = '';

            
    showMsg.confirm('确认删除这张张照片吗？', {
      ok: function(){
        huoniao.operaJson(masterDomain + '/include/ajax.php?service=dating&action=albumDel&id='+id, '', function(data){
          showMsg.alert(data.info, 1000);
          if(data && data.state == 100){
            if(totalCount > 1){
              if(index + 1 == totalCount){
                toIndex = index - 1;
              }else{
                toIndex = index + 1;
              }
            }
            totalCount--;
            mySwiper.removeSlide(index);
            if(toIndex > -1){
              mySwiper.swipeTo(toIndex);
            }
            getImage(mySwiper.activeIndex);
          }
        })
      }
    })
  })

  // 点赞
  $('.zan').click(function(){
    var t = $(this);
    if(t.hasClass("disabled")) return;
    if(type == 'circle'){
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=circleOper', 'id='+aid, function(data){
        if(data && data.state == 100){
          t.toggleClass("active");
        }else{
          showMsg.alert("操作失败", 1000);
        }
      })
    }else if(type == 'album'){
      var index = mySwiper.activeIndex, li = $("#Gallery li").eq(index), id = li.attr("data-id"), zan = li.attr("data-zan");
      huoniao.operaJson(masterDomain + '/include/ajax.php?service=dating&action=albumDing&id='+id, '', function(data){
        if(data && data.state == 100){
          t.toggleClass("active");
          if(zan == "0"){
            li.attr("data-zan", "1");
          }else{
            li.attr("data-zan", "0");
          }
        }else{
          showMsg.alert(data.info, 1000);
        }
      })
    }
  })

})
