$(function(){

	//验证提示弹出层
	function showTipMsg(msg){
   /* 给出一个浮层弹出框,显示出errorMsg,2秒消失!*/
    /* 弹出层 */
	  $('.protips').html(msg);
		  var scrollTop=$(document).scrollTop();
		  var windowTop=$(window).height();
		  var xtop=windowTop/2+scrollTop;
		  $('.protips').css('display','block');
		  setTimeout(function(){      
			$('.protips').css('display','none');
		  },2000);
	}


    //点击验证
	$('.btn').click(function(){
		var money = $('#money').val();
		var money_number = parseInt($('#money_number').val());

		if(!money){
			errorMsg="总金额不能为空";
	        showTipMsg(errorMsg);return;
		}else if(!money_number){
			errorMsg="红包个数不能为空";return
	        showTipMsg(errorMsg);
		}else if(money_number>100){
			errorMsg="请正确填写红包个数";return
	        showTipMsg(errorMsg);
		}
		var note = $("input[name=note]").val();
		$.ajax({
			url : masterDomain + '/include/ajax.php?service=live&action=makeHongbao',
			data : {
                liveid : liveid,
                amount : money,
                count : money_number,
                note : note,
                chatid : chatid
			},
			type : 'GET',
			dataType : 'JSON',
			success : function (data) {
				data = JSON.parse(data);
				if(data.state == 100){
					window.location.href = data.info;
				}else{
					if(data.info == '最少金额为1元'){
						alert(data.info);return;
					}
                    location.href = masterDomain + '/login.html';
                }
            }
		})


	});










})