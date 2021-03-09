$(function(){

	$("img").scrollLoading();

	// 焦点图
    $(".slideBox1").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});

	//分类切换显示
	// $(".category dt").bind("click", function(){
	// 	var par = $(this).closest("dl");
	// 	par.hasClass("on") ? (par.find("dd").hide(), par.removeClass("on")) : (par.find("dd").show(), par.addClass("on"));
	// });

    // 查看更多
    $(".btnMore").bind('click', function () {
        var t = $(this), page = t.attr('data-page');
        page = page == undefined ? 2 : page;
        if(t.hasClass('disabled')) return;
        t.text('拼命加载~');
        t.addClass('disabled');
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=dating&action=getNewsType&pageSize=2&page=' + page,
            dataType: 'html',
            type: 'GET',
            success: function (data) {
                if (data!=1) {
                    $(".wrap").find(".btnMore").before(data);
                    t.removeClass('disabled').text('查看更多').attr('data-page', ++page);
                }else{
                    t.text('没有更多了').addClass('disabled');
                }
            }
        })
    });

});