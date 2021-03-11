$(function(){

  var delHistory = utils.getStorage("dating_del_school");
  var delHistoryArr = [];
  if(delHistory){
    delHistoryArr = delHistory.split(',');
  }else{
    delHistoryArr = [];
  }

  // 删除
  $('#container').delegate('.publisher i','click',function(){
    var p = $(this).closest('li'), id = p.attr('data-id');
    p.remove();
    var delHistory = utils.getStorage("dating_del_school");
    var str = '';
    if(delHistory){
      delHistoryArr = delHistory.split(',');
      if(!in_array(delHistoryArr, id)){
        console.log('no in')
        if(delHistoryArr.length > 100){
          delHistoryArr.pop();
        }
        delHistoryArr.unshift(id);
      }
      str = delHistoryArr.join(',');
    }else{
      str = id;
    }
    utils.setStorage("dating_del_school", JSON.stringify(str));

  });


  var container = $('#container'), tofoot = $('.tofoot'), isload = false, page = 1, pageSize = 10;
  

  getList();
  // 获取信息
  function getList(){
    if(isload) return;
    isload = true;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=school&page='+page+'&pageSize='+pageSize,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [];
          var length = data.info.list.length;
          var delCount = 0;
          for(var i = 0; i < length; i++){
            var d = data.info.list[i];

            if(!in_array(delHistoryArr, d.id)){
              html.push('<li class="item" data-id="'+d.id+'">');
              html.push('<a href="'+d.url+'">');
              html.push('  <p class="name_txt">'+d.title+'</p>');
              html.push('  <div class="name_img fn-clear">');
              if(d.pics.length){
                for(var n = 0; n < d.pics.length && n < 3; n++){
                  html.push('    <img src="'+d.pics[n]+'">');
                }
              }
              html.push('  </div>');
              html.push('</a>');
              html.push('  <div class="publisher fn-clear">');
              html.push('   <span>'+d.typename+'</span>');
              html.push('   <i></i>');
              html.push('  </div>');
              html.push('</li>');
            
            }else{
              delCount++;
            }

          }

          container.append(html.join(""));
          showMsg.close();

          if(data.info.pageInfo.totalPage > page){
            isload = false;

            // 如果存在已过滤的信息，加载下一组
            if(delCount){
              page++;
              getList();
            }else{
              tofoot.text('下拉加载更多').show();
            }
          }else{
            // 全部过滤
            if(delCount == length){
              tofoot.text(container.children('li').length == 0 ? '暂无相关数据！' : '已经加载完全部数据').show();
            }
          }
        }else{
          tofoot.text(page == 1 ? '暂无相关数据！' : '已经加载完全部数据').show();
        }
      },
      error: function(){
        isload = false;
        showMsg.alert('网络错误，请重试！');
      }
    })
  }

  $(window).scroll(function(){
    var scrollH = document.documentElement.scrollHeight;
    var clientH = document.documentElement.clientHeight;
    if (scrollH == (document.documentElement.scrollTop | document.body.scrollTop) + clientH){
      //加载新数据
      page++;
      getList();
    }
  });

  function in_array(arr, str){
    for(var i in arr){
      if(arr[i] == str){
        return true;
      }
    }
    return false;
  }

});
