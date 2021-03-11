var huoniao = {
  //转换PHP时间戳
	transTimes: function(timestamp, n){
		update = new Date(timestamp*1000);//时间戳要乘1000
		year   = update.getFullYear();
		month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
		day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
		hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
		minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
		second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
		if(n == 1){
			return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
		}else if(n == 2){
			return (year+'-'+month+'-'+day);
		}else if(n == 3){
			return (month+'-'+day);
		}else{
			return 0;
		}
	}
}

$(function(){

  var listObj = $('.list');

	// 下拉加载
	var isload = false, isend = false;
	$(window).scroll(function() {
		var h = $('.list .item').height();
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - h - w;
		if ($(window).scrollTop() > scroll && !isload && !isend) {
			page++;
			getList();
		};
	});

  getList();

  // 异步获取列表
  function getList(){
    isload = true;

    listObj.append('<div class="loading">加载中..</div>');

    $.ajax({
      url: "include/ajax.php?service=siteConfig&action=notice&page="+page+"&pageSize="+pageSize,
      type: "GET",
      dataType: "json",
      success: function(data){

        if (data) {
          $('.loading').remove();
          if (data.state == 100) {
            var list = data.info.list, html = [], pageInfo = data.info.pageInfo;
            for (var i = 0; i < list.length; i++) {
              var pubdate = huoniao.transTimes(list[i].pubdate, 1);

              html.push('<div class="item">');
              html.push('<a href="'+list[i].url+'">');
              var color = list[i].color ? ' style="color: '+list[i].color+'"' : '';
              html.push('<p class="title"'+color+'>'+list[i].title+'</p>');
              html.push('<p class="desc">'+list[i].description+'</p>');
              html.push('<p class="time">'+pubdate+'</p>');
              html.push('</a>');
              html.push('</div>');

            }
            listObj.append(html.join(""));

            if(page >= pageInfo.totalPage){
              isend = true;
  						$(".list").append('<div class="empty">已加载全部信息！</div>');
  					}
            isload = false;

          }else {
            isload = false;
            listObj.append('<div class="loading">'+data.info+'</div>')
          }
        }
      }
    })
  }


})
