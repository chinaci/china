$(function(){

	//头部导航切换
	$(".config-nav button").bind("click", function(){
		var index = $(this).index(), type = $(this).attr("data-type");
		if(!$(this).hasClass("active")){
			$(".item").hide();
			$(".item:eq("+index+")").fadeIn();
		}
	});


	//增加一行
	$(".addPrice").bind("click", function(){
		$(this).closest('table').find("tbody:eq(0)").append($("#" + $(this).data("type")).html().replace(/__/g, $('.config-nav .active').data('type') + '_'));
	});

	//删除
	$("table").delegate(".del", "click", function(){
		var t = $(this);
		$.dialog.confirm("确定要删除吗？", function(){
			t.closest("tr").remove();
		});
	});

	//计算智能刷新折扣、单价、优惠
	function computeRefreshSmart(par, obj){
		var refreshNormalPrice = parseFloat($('#' + obj).val());
		if(!refreshNormalPrice) return;
		par.find('.refreshSmartTable tbody:eq(0)').find('tr').each(function(){
			var t = $(this), times = parseFloat(t.find('.times').val()), price = parseFloat(t.find('.price').val());
			if(times && price){
				var discount = ((price / (refreshNormalPrice * times)) * 10).toFixed(1);
				var unit = (price / times).toFixed(2);
				var offer = ((refreshNormalPrice * times) - price).toFixed(2);
				t.find('.discount').html(discount < 10 && discount > 0 ? discount + '折' : '无');
				t.find('.unit').html(unit + '元');
				t.find('.offer').html(offer + '元');
			}
		});
	}
	$('#editform .item').each(function(){
		computeRefreshSmart($(this), $(this).find('.refreshNormalPrice').attr('id'));
	});

	$('.refreshSmartTable').delegate('input', 'input', function(){
		var par = $(this).closest('.item');
		computeRefreshSmart(par, par.find('.refreshNormalPrice').attr('id'));
	});

	//普通刷新价格变化
	$('#info_refreshNormalPrice').bind('input', function(){
		computeRefreshSmart($(this).closest('.item'), 'info_refreshNormalPrice');
	});


	//计算普通置顶折扣、优惠
	function computeTopNormal(par){
		var unitPrice = 0;
		par.find('.topNormalTable tbody:eq(0)').find('tr').each(function(index){
			var t = $(this), day = parseInt(t.find('.day').val()), price = parseFloat(t.find('.price').val());
			if(day && price){

				//取第一条单价
				if(index == 0){
					unitPrice = (price/day).toFixed(2);
				}else{
					var discount = ((price / (unitPrice * day)) * 10).toFixed(1);
					var offer = ((unitPrice * day) - price).toFixed(2);
					t.find('.discount').html(discount < 10 && discount > 0 ? discount + '折' : '无');
					t.find('.offer').html(offer + '元');
				}

			}
		});
	}
	$('#editform .item').each(function(){
		computeTopNormal($(this));
	});

	$('.topNormalTable').delegate('input', 'input', function(){
		computeTopNormal($(this).closest('.item'));
	});


	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();

		//异步提交
		var post = $("#editform").find("input, select, textarea").serialize();
		huoniao.operaJson("refreshTop.php", post + "&token="+$("#token").val(), function(data){
			var state = "success";
			if(data.state != 100){
				state = "error";
			}
			huoniao.showTip(state, data.info, "auto");
		});
	});

});
