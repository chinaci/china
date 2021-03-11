$(function(){
  $('.navtab li').click(function(){
    var t = $(this), index = t.index();
    t.addClass('active').siblings().removeClass('active');
    $('.content .item').eq(index).fadeIn().siblings().hide();
  })

  // 升级会员
  $(".level .price").click(function(){
    var t = $(this), id = t.closest('li').attr('data-id');
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=upgrade', 'check=1&id='+id, function(data){
      if(data){
        if(data.state == 100){
          location.href = masterDomain + '/include/ajax.php?service=dating&action=upgrade&id='+id;
        }else if(data.state == 101){
          showMsg.confirm(data.info, {
            ok: function(){
              location.href = masterDomain + '/include/ajax.php?service=dating&action=upgrade&id='+id;
            }
          })
        }else{
          showMsg.alert(data.info, 1000);
        }
      }
    })
  })

  
})