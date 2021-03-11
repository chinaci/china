$(function(){

  // 购买钥匙数量
  var defCount = myGold ? parseInt(myGold / price) : 1;
  var maxCount = 0, buyCount = 0;
  if(myGold){
    var maxCount = parseInt(myGold / price);
    if(maxCount > 10){
      defCount = 10;
      buyCount = 1;
    }else{
      defCount = maxCount;
      buyCount = maxCount ? 1 : 0;
    }
  }

  if(maxCount > 0){
    var mobileSelect_number = new MobileSelect({
      trigger: '#number_select',
      title: '选择',
      connector: '',
      name: '',
      position: [defCount - 1],
      wheels: [
          {data : returnNum([])},
      ],
      transitionEnd:function(indexArr, data){
          if(indexArr[0] >= indexArr[1]){
            this.locatePostion(1, indexArr[0] + 1);
          }
      },
      callback:function(indexArr, data){
        buyCount = data[0].value;
      }
    });
  }else{
    $("#number_select").click(function(){
      showMsg.confirm('您的金币不足，请充值', {
        ok: function(){
          location.href = buyGoldUrl;
        }
      })
    })
  }

  $(".submit").click(function(){
    if(buyCount == 0){
      showMsg.confirm('您的金币不足，请充值', {
        ok: function(){
          location.href = buyGoldUrl;
        }
      })
    }else{
      showMsg.confirm('您确定要购买'+buyCount+'把聊天钥匙吗？', {
        ok: function(){
          operaJson(masterDomain+'/include/ajax.php?service=dating&action=buyKey', 'count='+buyCount, function(data){
            if(data){
              if(data.state == 100){
                showMsg.alert(data.info, 1000, function(){
                  location.reload();
                });
              }else{
                showMsg.alert(data.info, 1000);
              }
            }
          })
        }
      })
    }
  })

  function returnNum(arr){
    for(var i = 1; i <= 30; i++){
      var d = {
        id: i,
        value: i,
      }
      arr.push(d);
    }
    return arr;
  }

})