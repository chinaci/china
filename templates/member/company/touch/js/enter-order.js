$(function(){

     //套餐详情
     $('.open-wrap li').click(function(){
         var t = $(this), title = t.data('title'), privilege = t.data('privilege'), store = t.data('store');
         $('.mask_pop').show();
         $('.all-choo').html(title);

         var list = [];
         if(privilege){
             list.push('<dl class="fn-clear">');
             list.push('<dt>'+langData['siteConfig'][49][46]+'</dt>');  //商家特权
             list.push('<dd>'+privilege+'</dd>');
             list.push('</dl>');
         }
         if(store){
             list.push('<dl class="fn-clear">');
             list.push('<dt>'+langData['siteConfig'][49][46]+'</dt>');  //商家特权
             list.push('<dd>'+store+'</dd>');
             list.push('</dl>');
         }

         $('.timeList').html(list.join(''));

         $('.tl_box').animate({"bottom":'0'}, 200);
     });

     // 取消按钮
 	$('.cancel').click(function(){
 		var t = $(this);
 		t.parents('.pop_box').animate({"bottom":'-88%'},200);
 		$('.mask_pop').hide();
 	});

    //隐藏弹出层
	$('.mask_pop').click(function(){
		$(this).hide();
		$('.pop_box').animate({"bottom":'-88%'},200);
	});

})
