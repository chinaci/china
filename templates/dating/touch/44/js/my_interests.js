$(function(){
  $('.content dd span').click(function(){
    var t = $(this);
    if(t.hasClass('active')){
      t.removeClass('active');
    }else{
      var count = $('.content .active').length;
      if(count >= maxSelect){
        showMsg.alert('您最多可以选择'+maxSelect+'项', 1000);
      }else{
        t.addClass('active');
      }
    }
  })

  $('.save').click(function(){
    if($('.content .active').length == 0){
      showMsg.confirm('您没有选择任何项目，确定吗？', {
        btn: {
          cancel: '<span class="cancel">再想想</span>',
        },
        ok: function(){
          save();
        }
      })
    }else{
      save();
    }
  })

  function save(){
    var config = [];
    $('.content .active').each(function(){
      config.push($(this).attr('data-id'));
    })
    operaJson(masterDomain+'/include/ajax.php', 'service=dating&action=updateProfile&upType=7&interests='+config.join(","), function(data){
     if(data && data.state == 100){
      showMsg.alert(data.info, 1000, function(){
        window.history.go(-1);
      })
     }else{
      showMsg.alert(data.info, 1000);
     }
    })
  }
})