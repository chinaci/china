$(function(){
    //css 样式设置
    $('.recom_box:last-child').css('margin-right','0')
    $('.Info_Box ul li .libox:nth-child(odd)').css('border-right','solid 1px #f0f2f7')
    $('.Info_Box ul li .libox:nth-child(9)').css('padding-bottom','28px')
    $('.Info_Box ul li .libox:nth-child(10)').css('padding-bottom','28px')
    //弹出二级分类
    $(".nav-con .all_cate2").hover(function(){
        if($('.fixedpane').hasClass('fixed')){
            $('#navlist_wrap .NavList').addClass('navshow')
        }
        
    },function(){
        $('#navlist_wrap .NavList').removeClass('navshow')
    });
	
	// 焦点图
    $(".slideBox1").slide({titCell:".hd ul",mainCell:".bd .slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>"});

	// 最新发布
	$(".ViewBox").slide({mainCell:".NewList",effect:"left",autoPlay:false,vis:4,prevCell:".prev",nextCell:".next",scroll:2,pnLoop:false});


    $(".slideBox2").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>",autoPlay: true});




	function getParentName(data, index) {
    	// console.log(data)
    	// console.log(index)
    	var len = data.length;
		for(var i = 0; i < len; i++){
			if(data[i].id == index){
				return data[i].typename;
			}
		}
    }

    var  transTimes = function(timestamp, n){
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
        }else if(n == 4){
            return (hour+':'+minute);
        }else{
            return 0;
        }
    }



//点击分享链接
//点击list中的i
    var userid = typeof cookiePre == "undefined" ? null : $.cookie(cookiePre+"login_user");
	$('.new_info i').click(function(){
		if(userid==null||userid==undefined){
    		huoniao.login();
    		return false;
    	}
		var url = $(this).parents('li').find('a').attr('href');
		var chatid = $(this).attr('data-id');
		var mod = 'info';
		var title = $(this).parents('li').find('.new_title').text();
		var imgUrl = $(this).parents('li').find('.left_b img').attr('src');
		var price = $(this).parents('li').find('.new_price').text();
        var type = $(this).attr('data-type')
        imconfig = {
            'mod':'info',
            'chatid':chatid,
            'title': title,
            "price": price,
            "imgUrl": imgUrl,
            "link": url,
        }
        sendLink(type);
	});






})
