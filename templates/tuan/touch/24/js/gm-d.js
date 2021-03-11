$(function(){
	total();
	$('.num-rec').click(function(){
		var account = Number($('.num-account').val());
		if (account>1) {
			account --;
			$('.num-account').val(account);
			total();
		}
	})
	$('.num-add').click(function(){
		var account = Number($('.num-account').val());
		if (account<5) {
			if (account<3) {
				account++;
				$('.num-account').val(account);
				total();
			}else{
				alert('每人限购3件')
			}

		}else{
			alert('库存仅剩5件')
		}

	})

	$('.num-account').bind('input propertychange', function(){
		total();
	})

	// 返回
	$('.header-l').click(function(){
		history.go(-1);
	})

})

function total(){
	var num = Number($('.num-account').val());
	var unit = Number($('.order-name .name-r em').html());
	var total = Number(num*unit).toFixed(2);
	$('.order-price .name-r em').html(total);
}
