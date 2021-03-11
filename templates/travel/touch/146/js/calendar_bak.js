'use strict';

// 日期选择插件(自定义)
$(function(){
  toggleDragRefresh('off'); //禁止滑动
})
var date = function ($) {

  $.fn.hotelDate = function (options) {

    var nowdate = new Date(); // 获取当前时间
    var dateArr = new Array(); // 获取到的时间数据集合
    var btn = $(this);

    btn.on('click', initTemplate); // 初始化(显示)插件

    // 初始化模板
    function initTemplate() {
    	$('.mask').show();
      // var entertime = $('.entertime em').text();
      // var leavetime = $('.leavetime em').text();
	  var chosedDate = $(".data_swiper .date_chose").attr('data-id');
	  //console.log(chosedDate)
      var listIndex = 0;
      
      $('body').css({
        overflow: 'hidden'
      });
      // 主容器模板
      var dateTemplate = '\n        <div class =\'date container c-gray\'>\n        <div class=\'date-header\'>\n  <h4 class="tac bold">选择日期</h4>\n          <ul class=\'week border-bottom\'><li>\u65E5</li><li>\u4E00</li><li>\u4E8C</li><li>\u4E09</li><li>\u56DB</li><li>\u4E94</li><li>\u516D</li></ul>\n    </div>\n  <div class=\'date-content\'>\n   </div>\n        <div class=\'sure-btn\'>\u5b8c\u6210</div>\n   <div class=\'close-btn\'><a href="javascript:;"></a></div>\n        </div>      \n     ';
	
      $('body').append(dateTemplate); // 向body添加插件
	 
      // action容器模板
      dateArr.forEach(function (item, index) {
        var template = '\n          <div class=\'action mt10\'>\n            <div class=\'title tac c-blue\'><div class="y">' + item.getFullYear() + '</div>\u5E74<div class="m">' + (item.getMonth() + 1) + '</div>\u6708</div>\n                      <ul class=\'day f-small\'></ul>\n          </div>        \n        ';
        $('.date-content').append(template);
      });

      // 天数模板 
      $('.action').each(function (index, item) {

        var days = getDays(dateArr[index]); // 当月天数
        var nowweek = dateArr[index].getDay(); // 当月1号是星期几
        for (var i = 0; i < days + nowweek; i++) {
          var template = '';
          // 空白填充
          if (i < nowweek) {
            template = '<li></li>';
          } else if (i < nowdate.getDate() + nowweek - 1 && dateArr[index].getMonth() === nowdate.getMonth()) {
            // 当月已经过去的日期 不能点击
            listIndex++;
            template = '<li index=\'' + listIndex + '\' class=\'disable\'><span>' + (i - nowweek + 1) + '<span></p></li>';
          } else{
            listIndex++;
			var date = dateArr[index].getFullYear() + '-' + (dateArr[index].getMonth() + 1) + '-' + (i - nowweek + 1);
			var stdate = new Date(date);
			var clsname = date==chosedDate?"chosed":""
			if(specialtimejson!=''){
				var specialtime = JSON.parse(specialtimejson);//特殊时刻
				for(var o in specialtime){
					var stime = new Date(specialtime[o].stime);
					var etime = new Date(specialtime[o].etime);
					if(stdate.getTime() >= stime.getTime() && stdate.getTime() <= etime.getTime()){
						 template = '<li index=\'' + listIndex + '\' data-date="'+date+'" class="'+clsname+'"><span>' + (i - nowweek + 1) + '</span><p class="price_show"><em>'+echoCurrency("symbol")+'</em>'+(1*specialtime[o].price)+' </li>';
					}else{
						 template = '<li index=\'' + listIndex + '\' data-date="'+date+'"  class="'+clsname+'"><span>' + (i - nowweek + 1) + '</span><p class="price_show"><em>'+echoCurrency("symbol")+'</em>'+(1*price)+' </li>';
					}
				}
			}else{
				 template = '<li index=\'' + listIndex + '\' data-date="'+date+'"  class="'+clsname+'"><span>' + (i - nowweek + 1) + '</span><p class="price_show"><em>'+echoCurrency("symbol")+'</em>'+(1*price)+' </li>';
			}
			
           
          }
          $(item).find('.day').append(template);
		  
		  if(st && typeof(chosetimeArr)=="object"){
		  
			$(".action li").addClass("disable")
		  	for(let m =0 ; m<chosetimeArr.length; m++){
				var choseDate = new Date(chosetimeArr[m]);
				var cyear = choseDate.getFullYear();    //获取完整的年份(4位,1970-????)
				var cmonth = choseDate.getMonth();       //获取当前月份(0-11,0代表1月)
				var cday = choseDate.getDate(); 
				var c_date = cyear+'-'+(cmonth+1)+'-'+cday;
		  		$(".action li[data-date='"+c_date+"']").removeClass("disable")
		  	}
		  }
        }
      });

      // 事件监听
      // 关闭插件
      $('.sure-btn').on('click', function () {
      	
        // 获取入住时间
        var enterYear = $('.enter').parents('.day').siblings('.title').find('.y').text();
        var enterMonth = $('.enter').parents('.day').siblings('.title').find('.m').text();
        enterMonth.length === 1 ? enterMonth = '0' + enterMonth : false;
        var enterDay = $('.enter').text();
        enterDay.length === 1 ? enterDay = '0' + enterDay : false;
        var enterTime = enterMonth + '/' + enterDay;
        // 获取离开时间
        var leaveYear = $('.enter').parents('.day').siblings('.title').find('.y').text();
        var leaveMonth = $('.leave').parents('.day').siblings('.title').find('.m').text();
        leaveMonth.length === 1 ? leaveMonth = '0' + leaveMonth : false;
        var leaveDay = $('.leave').text();
        leaveDay.length === 1 ? leaveDay = '0' + leaveDay : false;
        var leaveTime = leaveMonth + '/' + leaveDay;
        var night = Number($('.leave').attr('index')) - Number($('.enter').attr('index'));
//      if(night>20){
//      	alert('如果超过20天，请电话咨询');
//      	$('.leave').removeClass('leave')
//      	return 0;
//      }
        $('.mask').hide();
        $('.date').remove(); // 移除插件
        $('body').css({ overflow: 'auto' });
        $('.entertime').html(enterYear + '/' +'<em>'+enterTime+'</em>'); // 显示
        $('.leavetime').html(enterYear + '/' +'<em>'+leaveTime+'</em>');
        $('.input-enter,#walktime').val(enterYear + '/' + enterTime);
        $('.input-leave,#departuretime').val(leaveYear + '/' + leaveTime);
        $('.night').text(langData['travel'][7][57].replace('1',night));   //共1晚
        $('#datein').val(night);
        priceCalculator()
      });
			
			//关闭
			$('.close-btn,.mask').click(function(){
				$('.date').remove(); // 移除插件
				$('.mask').hide();
			})
      var num = 0;
      // 时间选择
      $('.day li').on('click', function () {
		var t = $(this),date = t.attr('data-date');
        if (!$(this).hasClass('disable')) {
			t.addClass("chosed").siblings('li').removeClass("chosed");
			$(".chosedate[data-id='"+date+"']").click();
			swiper.slideTo($(".chosedate[data-id='"+date+"']").index());
			$(".mask").click();
		}
      });
    }

    function removeLeave() {
      $('.day li').removeClass('leave');
    }
		
    function removeEnter() {
      $('.day li').removeClass('enter');
    }

    // 获取num个月的时间数据
    function getDate(num) {

      var year = nowdate.getFullYear();
      var month = nowdate.getMonth() - 1;

      for (var i = 0; i < num; i++) {
        month <= 12 ? month++ : (month = 1, year++);
        var data = new Date(year, month); // 从当前月开始算 一共个2个月的数据
        dateArr.push(data);
      }
	  
    }

    // 获取当月天数
    function getDays(date) {
      //构造当前日期对象
      var date = date;
      //获取年份
      var year = date.getFullYear();
      //获取当前月份
      var mouth = date.getMonth() + 1;
      //定义当月的天数；
      var days;
      //当月份为二月时，根据闰年还是非闰年判断天数
      if (mouth == 2) {
        days = year % 4 == 0 ? 29 : 28;
      } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
        //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31;
      } else {
        //其他月份，天数为：30.
        days = 30;
      }
      return days;
    }

    function initDay() {
      var enterYear = String(nowdate.getFullYear());
      var enterMonth = String(nowdate.getMonth() + 1);
      enterMonth.length === 1 ? enterMonth = '0' + enterMonth : false;
      var enterDay = String(nowdate.getDate());
      enterDay.length === 1 ? enterDay = '0' + enterDay : false;
      var enterTime = enterMonth + '/' + enterDay;
      // 获取离开时间
      var leaveYear = String(nowdate.getFullYear());
      var leaveMonth = String(nowdate.getMonth() + 1);
      leaveMonth.length === 1 ? leaveMonth = '0' + leaveMonth : false;
      var leaveDay = String(nowdate.getDate() + 1);
      leaveDay.length === 1 ? leaveDay = '0' + leaveDay : false;
      var leaveTime = leaveMonth + '/' + leaveDay;
      $('.entertime').html(enterYear + '/' +'<em>'+enterTime+'</em>'); // 显示
      $('.leavetime').html(enterYear + '/' +'<em>'+leaveTime+'</em>');
      $('.input-enter').val(enterYear + '/' + enterTime);
      $('.input-leave').val(leaveYear + '/' + leaveTime);
    }

    getDate(3); // 获取数据 参数: 拿2个月的数据
    // initDay(); // 初始化入住和离店时间
  };
}(Zepto);
