$(function(){

  // 我的头像-已上传

  $('.selectBottom .cancel, .selectBottom .bg').click(function(){
    $('.selectBottom').removeClass('show');
  })
  $('.selectBottom li').click(function(){
    var t = $(this), index = t.index();
    if(index == 0){

    }else if(index == 1){
      location.href = showPhotoUrl;
    }else if(index == 2){
      showMsg.confirm('删除形象照，您将无法查看他人照片，并且不能参加任何活动。同时系统所有地方将不再展示您，请慎重考虑', {
        btn: {ok:'下一步'},
        ok: function(){
          $('.selectBottom').removeClass('show');
          showMsg.alert('正在操作，请稍后', 1000);
          operaJson(masterDomain+'/include/ajax.php?service=dating&action=updateProfile', 'upType=8&photo=', function(data){
            if(data && data.state == 100){
              upPhoto.del($('#item_0 img').attr("data-url"));
              showMsg.close();
              $('#item_0').html('<img src="" alt="">');
              $('.addimg').removeClass('has').addClass('noimg').append('<div class="uploader-btn">上传头像</div>');
            }else{
              showMsg.alert(data.info, 1000);
            }
          })
        }
      })
    }

  })

  // 上传头像
  var upPhoto = new Upload({
    btn: '#filePicker1',
    bindBtn: '',
    title: 'Images',
    mod: modelType,
    params: 'type=atlas',
    atlasMax: 1,
    deltype: 'delAtlas',
    replace: true,
    fileQueued: function(file){
      
    },
    uploadSuccess: function(file, response){
      if(response.state == "SUCCESS"){
        var img = $('#item_0 img'), oldPhoto = img.attr("data-url"), sysPhoto = img.attr("data-sysUrl");
        if(oldPhoto != undefined && sysPhoto != undefined && oldPhoto != sysPhoto){
          upPhoto.del(oldPhoto);      
        }
        $('#item_0').html('<img src="'+response.turl+'" data-url="'+response.url+'" alt=""><p>更换头像</p>');
        $('.addimg').removeClass('noimg').addClass('has');
        $('.uploader-btn').remove();

        $('.selectBottom').removeClass('show');

        operaJson(masterDomain + '/include/ajax.php?service=dating&action=updateProfile', 'upType=8&photo='+response.url, function(data){
          showMsg.alert(data.info, 1000, function(){
          });
        }, true)
      }
    }
  });

  $('.addimg').click(function(){
    if($(this).hasClass('noimg')){
      $('#filePicker1 label').click();
    }else{
      $('.selectBottom').addClass('show');
    }
  })

  // 上传相册
  var upPhoto = new Upload({
    btn: '#filePicker2',
    bindBtn: '.topbox .album .null',
    title: 'Images',
    mod: modelType,
    deltype: 'delAtlas',
    params: 'type=atlas',
    fileQueued: function(file){
      
    },
    uploadSuccess: function(file, response, btn){
      if(response.state == "SUCCESS"){
        var save = [];
        $('.topbox .album .it').each(function(){
          var t = $(this), src = val = '';
          if(t.hasClass('has')){
            var img = $(this).find('img');
            src = img.attr('src');
            val = img.attr('data-val');
          }
          save.push({src:src, val:val});
        })
        $('.topbox .album .it').each(function(i){
          var t = $(this);
          if(i == 0){
            var src = response.turl;
            var url = response.url;
          }else{
            var src = save[i-1].src, val = save[i-1].val;
          }
          if(src != '' && val != ''){
            t.off().addClass('has').removeClass('null').html('<a href="'+(showPicUrl+(i+1))+'"><img src="'+src+'" data-val="'+val+'"></a>');
          }else{
            t.html('');
          }
        })

        saveImage('action=uploadAlbum&img='+response.url);
      }
    }
  });

  function saveImage(action){
    huoniao.operaJson('/include/ajax.php?service=dating', action, function(data){})
  }

})