$(function(){

  // 购买牵线
  $(".list .btn").click(function(){
    var t = $(this), id = t.closest('li').index();
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=buyLead', 'check=1&id='+id, function(data){
      if(data){
        if(data.state == 100){
          location.href = masterDomain + '/include/ajax.php?service=dating&action=buyLead&id='+id;
        }else if(data.state == 101){
          showMsg.confirm(data.info, {
            ok: function(){
              location.href = masterDomain + '/include/ajax.php?service=dating&action=buyLead&id='+id;
            }
          })
        }else{
          showMsg.alert(data.info, 1000);
        }
      }
    })
  })
})