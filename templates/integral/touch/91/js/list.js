$(function() {



	var dom = $('#screen'), disk = $('.mask'),
		areaScroll = infoScroll = sortScroll = jifenScroll = payScroll = subScroll = null,
		areaArr = infoArr = sortArr = moreArr = sortSecondArr = [],
		chooseScroll = function(obj){return new iScroll(obj, {vScrollbar: false, mouseWheel: true, click: true});};

	// 筛选框
	$('.choose-tab li').click(function(){
		var $t = $(this), index = $t.index(), box = $('.choose-box .choose-local').eq(index);
		if (box.css("display")=="none") {
		 	$t.addClass('active').siblings().removeClass('active');
		 	box.show().siblings().hide();dom.hide();
		 	if (index == 0 && infoScroll == null) {
        		infoScroll = chooseScroll('choose0');
		 	}
		 	if (index == 1 && sortScroll == null) {
				sortScroll = chooseScroll('sort-box');
		 	}
		 	if (index == 2 && jifenScroll == null) {
		 		jifenScroll = chooseScroll("jifen-box");
		 	}
		 	if (index == 3 && payScroll == null) {
		 		payScroll = chooseScroll("pay-box");
		 	}
		 	disk.show();
		 }else{
		 	$t.removeClass('active');
		 	box.hide();disk.hide();
		}
	});


	$('.choose-local li').click(function(){

		var $t = $(this), val = $(this).html(), local = $t.closest('.choose-local'), index = local.index(),
			id = $t.attr('data-id');

		$t.addClass('active').siblings().removeClass('active');

	    // 一级筛选 排序、积分、支付方式
	    if (!local.hasClass('fn-clear')) {
	  		id = id == undefined || id == '' || id < 0 ? 0 : id;

	  		$('.choose-tab li').eq(index).removeClass('active').attr('data-id', id).find('span').text(val);
	      	local.hide();disk.hide();
	      	getList(1);

	    // 分类 二级筛选
	    }else {
	      var par = $t.parent().parent(), lower = $t.attr('data-lower'), id = $t.attr('data-id');
	      $(".typeid").attr("data-id", id);
	      if (par.hasClass('fchoose')) {
	        if (lower == "1") {
	          par.addClass('half');
	          var sub = $t.children('.sub').html();
	          sub = sub.replace(/<p/g, '<li');
	          sub = sub.replace(/p>/g, 'li>');
	          $('#choose1').show().html('<ul>'+sub+'</ul>');

	          subScroll = chooseScroll('choose1');

	        }else {
	          $('#choose0').removeClass('half');
	          $('#choose1').hide();
	          $('.choose-tab li').eq(index).removeClass('active').attr('data-id', id).find('span').text(val);
	          local.hide();disk.hide();
	          getList(1);
	        }
	      }else {
	        $('.choose-tab li').eq(index).removeClass('active').attr('data-id', id).find('span').text(val);
	        local.hide();disk.hide();
	      }
	    }
	})

	$('#choose1').delegate('li', 'click', function(){
		var $t = $(this), local = $t.closest('.choose-local');
		$t.addClass('active').siblings().removeClass('active');
		$(".typeid").attr("data-id", $t.attr("data-id"));
		local.hide();disk.hide();

		if($t.text() == '全部'){
			$('.typeid span').text($t.attr('data-type'))
		}else{
			$('.typeid span').text($t.text());
		}
		getList(1);
	})


	// 遮罩层
	disk.on('click',function(){
		disk.hide();dom.hide();
		$('.choose-local').hide();
		$('.choose-tab li').removeClass('active');
	})

	// 遮罩层
	disk.on('touchmove',function(){
		disk.hide();dom.hide();
		$('.choose-local').hide();
		$('.choose-tab li').removeClass('active');
	})

	$('.confirm, .drop-range input').on('touchmove', function(e){
		e.preventDefault();
	})


	// 判断设备类型，ios全屏
	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('body').addClass('huoniao_iOS');
	}

	$('#search_button').click(function(){
		getList(1);
	})

	var activeType = $('#choose0 li.active');
	if(activeType.length > 0){
		activeType.click();
		$('.typeid span').text(activeType.children('span').text());
	}

	getList();

})

// 扩展zepto
$.fn.prevAll = function(selector){
    var prevEls = [];
    var el = this[0];
    if(!el) return $([]);
    while (el.previousElementSibling) {
        var prev = el.previousElementSibling;
        if (selector) {
            if($(prev).is(selector)) prevEls.push(prev);
        }
        else prevEls.push(prev);
        el = prev;
    }
    return $(prevEls);
};

$.fn.nextAll = function (selector) {
    var nextEls = [];
    var el = this[0];
    if (!el) return $([]);
    while (el.nextElementSibling) {
        var next = el.nextElementSibling;
        if (selector) {
            if($(next).is(selector)) nextEls.push(next);
        }
        else nextEls.push(next);
        el = next;
    }
    return $(nextEls);
};

var page = 1, pageSize = 10, totalPage = 0, isload = false;

function getList(first){
	if(first){
		page = 1;
		$('.shopUl ul').html('');
	}

	if(isload) return;

	var orderby = $('.orderby').attr('data-id');
	var point = $('.jifen').attr('data-id');
	var paytype = $('.payType').attr('data-id');
	var keywords = $('#search_keyword').val();

	typeid = $(".typeid").attr("data-id");

	$('.loading').html('正在获取，请稍后').show();

	isload = true;

	var data = [];
	data.push('typeid='+typeid);
	data.push('orderby='+orderby);
	data.push('point='+point);
	data.push('paytype='+paytype);
	data.push('keywords='+keywords);
	$.ajax({
		url: '/include/ajax.php?service=integral&action=slist&page='+page+'&pageSize='+pageSize,
		type: 'get',
		data: data.join('&'),
		dataType: 'json',
		success: function(data){
			if(data && data.state == 100){
				var list = data.info.list, len = list.length, html = [];
				totalPage = data.info.pageInfo.totalPage;

				if(len){
					for(var i = 0; i < len; i++){
						var obj = list[i];
						html.push('<li>');
						html.push('  <a href="'+obj.url+'">');
						html.push('    <div class="imgbox"><img src="'+obj.litpic+'" alt=""></div>');
						html.push('    <div class="txtbox">');
						html.push('      <p class="title">'+obj.title+'</p>');
						html.push('      <p class="price"><em>'+obj.price+echoCurrency('short')+'</em><span>'+obj.point+pointName+'</span></p>');
						// html.push('      <p class="bg">积分抵扣&nbsp;&nbsp;&nbsp;¥266</p>');
						html.push('    </div>');
						html.push('  </a>');
						html.push('</li>');
					}

					$('.loading').hide();
					$('.shopUl ul').append(html.join(''));

				}else{
					if(totalPage == 0){
						$('.loading').html('暂无相关商品').show();
					}else{
						$('.loading').html('已加载全部商品').show();
					}
				}

				isload = false;

			}else{
				$('.loading').html('暂无相关商品').show();
				isload = false;
			}
		},
		error: function(){
			$('.loading').html('网络错误，加载失败！').show();
			isload = false;
		}
	})
}
