$(function(){

    // 勾选
    $(".vote_before .xuan").click(function(){
        var t = $(this).find('.choose'), b = t.closest('.body'), g = b.closest('.item'), type = g.attr('data-type');
        if(type == 0){
            b.find('.choose').removeClass('active');
            t.addClass('active');
        }else{
            t.toggleClass('active');
        }
    })

    // 提交
    $('.container .submit').click(function(){
        if(detail.has_vote){
            alert('您已经参与过此投票！');
            return;
        }
        if(detail.state == 2){
            alert('投票已结束！');
            return;
        }
        var userid = $.cookie(cookiePre + 'login_user');
        if(userid == undefined || userid == 0 || userid == ''){
            location.href = masterDomain+'/login.html';
            return;
        }
        var t = $(this), result = [], count = 0;
        if(t.hasClass('disabled')) return;
        $('#groupList .item').each(function(index){
            var g = $(this), x = g.find('.choose'),  type = g.attr('data-type');
            var c = [];
            x.each(function(){
                var t = $(this);
                if(t.hasClass('active')){
                    c.push(t.closest('.xuan').attr('data-index'));
                }
            })
            if(!c.length || (type == 0 && c.length > 1)){
                alert('请检查第'+(index+1)+'题');
                return false;
            }
            result.push(c)
            count++;
        })
        console.log(result)
        if(count && count == result.length){
            t.addClass('disabled');
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=vote&action=vote&id='+detail.id,
                data: {"result": result},
                type: 'get',
                dataType: 'json',
                success: function(data){
                    if(data && data.state == 100){
                        $('.has_vote').show();
                        setTimeout(function(){
                            location.reload();
                        },1000)
                    }else{
                        alert(data.info);
                    }
                    t.removeClass('disabled');
                },
                error: function(){
                    alert('网络错误，请重试！');
                    t.removeClass('disabled');
                }
            })
        }
    })

})
