$(function(){

	//当前已选套餐临时变量
    var packageActive = packageCurr;
    var packagePrice = 0;
    var packageItem = [];

	$('.privilege li:nth-child(2n)').css('margin-right','0');
	$('.trade li:nth-child(3n)').css('margin-right','0');


   //获取要定位元素距离浏览器顶部的距离
    var navH = $(".left_fix").offset().top;
    var botH = $(".footer").offset().top-260;

    //滚动条事件
    $(window).scroll(function(){
        //获取滚动条的滑动距离
        var scroH = $(this).scrollTop();
        //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定

        if(scroH>=navH&&scroH<botH){
            $(".left_fix").addClass('fixed');
        }else{
            $(".left_fix").removeClass('fixed');
        }
	})


    //家教详情切换
    var isClick = 0;
    //左侧导航点击
    $(".left_fix a").bind("click", function(){

        isClick = 1; //关闭滚动监听
        var t = $(this), parent = t.parent(), index = parent.index(), theadTop = $(".right_con:eq("+index+")").offset().top-10;
        parent.addClass("active").siblings("li").removeClass("active");
        $('html, body').animate({
            scrollTop: theadTop
        }, 500, function(){
            isClick = 0; //开启滚动监听
        });
    });
    //滚动监听
    $(window).scroll(function() {
        var scroH = $(this).scrollTop();
        if(isClick) return false;//点击切换时关闭滚动监听

        var theadLength = $(".right_con").length;
        $(".left_fix li").removeClass("active");

        $(".right_con").each(function(index, element) {
            var offsetTop = $(this).offset().top;
            if (index != theadLength - 1) {
                var offsetNextTop = $(".right_con:eq(" + (index + 1) + ")").offset().top - 30;
                if (scroH < offsetNextTop) {
                    $(".left_fix li:eq(" + index + ")").addClass("active");
                    return false;
                }
            } else {
                $(".left_fix ul:eq(0) li:last").addClass("active");
                return false;
            }
        });


    });
    //顶部 尊享版 自选套餐 续期
    $('body').delegate('.xu_a','click',function(e){
    	$('.ser_tip').css('display','none');
    	$('.tc_name').removeClass('more_name');
		var t = $(this);
		var tcname = t.parents('.topDiv').find('h1').text();
		var count_price = 0 ,acount = 0;
		$('.tc_name span').html(tcname);
		var time = $('.count_box .tc_time').attr('data-year');
		var price = t.attr('data-aprice');
		count_price = price;

		//自选套餐续费
        if(packageCurr == -1){
            var nameArr = [], count_price = 0;
            $('.botDiv').find('.item_li').each(function(){
                nameArr.push($(this).data('name'));
                count_price += parseFloat($(this).data('price'), 2);
            });
            packageItem = nameArr;
        }

		$('.all_price').attr('data-price',count_price);
		count_price = (parseFloat(count_price)*time).toString();
		calcPrice(count_price)
		$('.count_box').removeClass('show');
		setTimeout(function(){
			$('.count_box').addClass('show');
		},100)

        //更新当前选择的套餐
        packageActive = packageCurr;
        packagePrice = count_price;

	})

    // 立即续期 立即开通
	$('body').delegate('.a_single','click',function(e){
		$('.ser_tip').css('display','none');
		$('.tc_name').removeClass('more_name');
		var t = $(this);
		var tcname = t.parents('li').find('.com-txt').text();
		$('.tc_name span').html(tcname);
		var allprice = 0 ,time = $('.tc_time').attr('data-year');
		var price = t.parents('li').attr('data-price');
		var name = t.parents('li').attr('data-name');
		$('.all_price').attr('data-price',price);
		allprice = (parseFloat(price)*time).toString();
		calcPrice(allprice);
		$('.count_box').removeClass('show');
		setTimeout(function(){
			$('.count_box').addClass('show');
		},100)

		//更新当前选择的套餐
        packageActive = -1;
        packagePrice = allprice;
        packageItem = [name];

	});
	//一键续期 一键开通
	$('body').delegate('.all_a','click',function(e){

		var t=$(this)
		$('.tc_name').addClass('more_name');

		var par = $(this).closest('.right_con');
		var allLi = par.find('li')
		var choseNum = allLi.length;
		$('.ser_tip .num_em').text(choseNum);
		if(choseNum>=4){
			$('.ser_chose').addClass('more_li')
		}
		var firUl=par.find('ul:nth-child(1)')
		var firLi = firUl.find('li:nth-child(1)')
		var tcname =firLi.find('.com-txt').html();
		$('.tc_name span').html(tcname);

		var txt=[];
		allLi.each(function(){
			var liTxt = $(this).find('.com-txt').text();
			txt.push('<li><span></span>'+liTxt+'</li>');
		})
		$('.ser_chose ul').html(txt.join(''));
		var allprice = 0 ,time = $('.tc_time').attr('data-year');
		var price = t.attr('data-price');

		var nameArr = [], count_price = 0;

		if(t.hasClass('all_xu')){
			$('.ser_out').find('li').each(function(){
                nameArr.push($(this).data('name'));
                count_price += $(this).data('price');
            });
		}else{
			$('.no_service').find('li').each(function(){
                nameArr.push($(this).data('name'));
                count_price += $(this).data('price');
            });
		}

		$('.all_price').attr('data-price',count_price);
		count_price = (parseFloat(count_price)*time).toString();

		calcPrice(count_price);
		$('.count_box').removeClass('show');
		$('.ser_tip').css('display','none')
		setTimeout(function(){
			$('.count_box').addClass('show');
			$('.ser_tip').css('display','inline-block')
		},100)

		//更新当前选择的套餐
        packageActive = -1;
        packagePrice = count_price;
        packageItem = nameArr;
	})

	$('.close_bot').click(function(){
		$('.count_box').removeClass('show');
	});

    // 格式化数组
	function formatNum(num){
		num = num.toString();
		var qian = (num.indexOf(".")<0)?num:num.substring(0,num.indexOf("."));
		var hou = '00';
		if(num.indexOf(".")>-1){
			hou = (num.substr(num.indexOf(".")+1,2).length==2)?num.substr(num.indexOf(".")+1,2):(num.substr(num.indexOf(".")+1,2)+'0')
		}
		$('.all_price').html('<i>'+echoCurrency('symbol')+'</i><em class="p_num">'+qian+'</em>.'+hou);
	}
	// 选择时间
	$('.tc_time input').click(function(e){
		$('.time_chose').addClass('show');
		$('.time_chose li').click(function(){
			var t  = $(this)
			$('.tc_time input').val($(this).text());
			$('.tc_time').attr('data-year',t.attr('data-year'));
			var price = $('.all_price').attr('data-price');
			//formatNum((parseFloat(price)*t.attr('data-year')).toString());
			var allprice = (parseFloat(price)*t.attr('data-year')).toString();
			var time = t.attr('data-year');
			calcPrice(allprice)

			for(var n=0; n<integrals.length; n++){
				if(time>=integrals[n][0] && n<(integrals.length-1) && time<integrals[n+1][0]){
					$('.point_tip').removeClass('fn-hide');
					$('.integral_show').html(langData['business'][1][49].replace('$1',integrals[n][0]).replace('$2',integrals[n][1]));  //满1年送2积分
				}else if(time>=integrals[integrals.length-1][0]){
					$('.point_tip').removeClass('fn-hide');
					$('.integral_show').html(langData['business'][1][49].replace('$1',integrals[integrals.length-1][0]).replace('$2',integrals[integrals.length-1][1]));
				}else  if(time<integrals[0][0]){
					$('.point_tip').addClass('fn-hide');
				}
			}
		});

		$('body').one('click',function(){
			$('.time_chose').removeClass('show');
		});
		e.stopPropagation();
	});
	//计算有无优惠价
	function calcPrice(priceParam){
		for(var m = 0; m < promotions.length; m++){

			if(priceParam>=promotions[m][0] && m<(promotions.length-1) && priceParam<promotions[m+1][0] ){//实价在优惠范围内

				$('#scroll_div').hide();
				$('.hui_tip').removeClass('fn-hide');
				$('.hui_tip em.num_show').html(promotions[m][1]);
				formatNum(priceParam-promotions[m][1])

			}else if(priceParam>=promotions[promotions.length-1][0]){//实价大于最大优惠 取最大优惠值

				$('.hui_tip').removeClass('fn-hide');
				$('.hui_tip em.num_show').html(promotions[promotions.length-1][1]);
				$('#scroll_div').hide();
				formatNum(priceParam-promotions[promotions.length-1][1])

			}else if(priceParam<promotions[0][0]){ //实价小于最小优惠

				$('.hui_tip').addClass('fn-hide');
				$('#scroll_div').show();
				formatNum(priceParam)
			}
		}
	}


	// 绑定手机号的弹窗
	$('.right_btn').click(function(){

		//提交订单
		var t = $(this);
		if(t.hasClass('disabled')) return false;

		//判断是否登录
		var userid = $.cookie(cookiePre + "login_user");
		if (userid == null || userid == "") {
			window.location.href = masterDomain + '/login.html';
			return false;
		};

		if($('#time').val()==''){
			alert(langData['business'][1][48])  //请选择时间
			return false;
		}

        //自选套餐
		var packageCon = [];
		if(packageActive < 0){
			if(packageItem.length == 0){
				alert("请选择要开通的特权！");
				return false;
			}
            packageCon = packageItem;
		}

		//获取套餐信息、开通时长
		var tc_time = parseInt($('.tc_time').attr('data-year'));

		//提交订单
		t.addClass('disabled');
		t.find('a').html('提交中...');

		$.ajax({
			url: "/include/ajax.php",
			type: "post",
			data: {
				'service': 'member',
				'action': 'joinBusinessOrder',
				'package': packageActive,
				'packageItem': packageCon.join(','),
				'time': tc_time
			},
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					//提交成功，跳转到支付页面
					location.href = data.info;
				}else{
					alert(data.info);
					t.removeClass('disabled');
					t.find('a').html('重新提交');
				}
			},
			error: function(){
				alert('网络错误，请稍候重试！');
				t.removeClass('disabled');
				t.find('a').html('重新提交');
			}
		});

	});

});
