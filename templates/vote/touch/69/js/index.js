$(function(){
	// 判断设备类型，ios全屏
	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('body').addClass('huoniao_iOS');
	}
	var objId = $('#listCon'), atpage = 1, totalPage = 1; pageSize = 10, isload = false, load = $('.load');

	$('.module-tab a').click(function(){
		var t = $(this), id = t.attr('data-id');
		if (!t.hasClass('active')) {
			t.addClass('active').siblings('a').removeClass('active');
			atpage = 1;
		  getList();
		}
	})

  getList(); 

  function getList(){
      isload = true;

      $.ajax({
          url: "/include/ajax.php?service=vote&action=vlist&page="+atpage+'&pageSize='+pageSize,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
              if(data){
                  if(data.state == 100){
                      var list = data.info.list, html = [];
                      var pageInfo = data.info.pageInfo;
                      if(list.length > 0){
                          for(var i = 0; i < list.length; i++){
                              var obj = list[i], item = [], state = obj.state;
															var stateTxt;
															if (state == 1) {
																stateTxt = '投票中';
															}else {
																stateTxt = '已结束';
															}
                              item.push('<div class="item">');
                              item.push('  <a href="'+obj.url+'">');
                              item.push('    <h3>'+obj.title+'</h3>');
                              item.push('    <p><span class="state state'+state+'">'+stateTxt+'</span><font>'+obj.join+'</font>人参与</p>');
                              item.push('  </a>');
                              item.push('</div>');

                              html.push(item.join(""));
                          }

                          objId.append(html.join(""));
                          if(pageInfo.totalPage == 1){
                            load.html('已加载全部信息！');
                          }else{
  													isload = false;
                          }
                      }else{
                        if(!pageInfo.totalCount){
                          load.html('暂无相关信息！');
                        }else{
                          load.html('已加载全部信息！');
                        }
                      }
                  }else{
                      load.html('暂无相关信息！');
                  }
              }
          },
          error: function(){
            load.html('网络错误，请重试！');
            isload = false;
          }
      })
  }
	// 上拉加载
	$(window).scroll(function() {
		var allh = $('.vote-list').height();
		var w = $(window).height();
		var scroll = allh  - w;
		if ($(window).scrollTop() > scroll && !isload) {
				atpage++;
				getList();
		};
	});

})
