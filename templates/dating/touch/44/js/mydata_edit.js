$(function(){

  $('.demo-test-date').scroller(
    $.extend({preset: 'date', dateFormat: 'yy-mm-dd', startYear: new Date().getFullYear() - 55})
  );
  // 统计已完善数据
  $(".choose-box").each(function(){
    var t = $(this), total = t.children('.ml4r').not('.title').length, not = t.find('.null').length;
    t.find('.title span').text('（'+(total-not)+'/'+total+'）');
  })
  // 通过select关联数据
  $('.dom_kj').each(function(){
    var t = $(this), id = t.attr('id'), sel = t.siblings('.dom_kj_data'), title = t.siblings('label').text(), select = t.attr("data-select") || '';
    sel.attr("disabled", true);
    if(sel.length > 0){
      var data = [];
      sel.children('option').each(function(i){
        var o = $(this);
        data.push({
          id: o.attr('value'),
          value: o.text()
        })
        if(select != ''){
          if(o.attr("data-id") == select){
            select == i;
          }
        }else{
          select = 0;
        }
      })
      if(id == "language_select"){
        new MobileSelect({
          trigger: '#'+id,
          title: title,
          skin: 'skin_fix_option',
          valBox: 'span',
          wheels: [
              {data : data},
          ],
          multi: 1,
          position: [select],
          optionClick: function (theLi, index, sliderIndex) {
            var t = $(theLi), p = t.parent(), max = 5, has = t.siblings('.active').length;
            if(t.hasClass('active')){
              t.removeClass('active');
            }else{
              if(has >= max){
                showMsg.alert('您最多可选5项',1000);
              }else{
                t.addClass("active");
              }
            }
            
          },
        })
      }else{
        new MobileSelect({
          trigger: '#'+id,
          title: title,
          position: [select],
          wheels: [
              {data : data},
          ]
        })
      }
      
    }
  })

  if(type){
    var sct = $('#box_'+type).offset().top - $('.header').height();
    sct = sct > 0 ? sct : 0;
    setTimeout(function(){
      $('html,body').scrollTop(sct);
      $('.gz-address').addClass('show');
    }, 0)
    showMsg.close();
  }


  // 昵称
  $("#nickname_kj").click(function(){
    $("#setTxt .header-address").text("修改昵称");
    var txt = $("#nickname_kj").text();
    txt = txt == '未填写' ? '' : txt;
    $("#settxt_tmp").val(txt);
    fixedWin.show('#setTxt', 'nickname');
  })
  // 毕业院校
  $("#school_select").click(function(){
    $("#setTxt .header-address").text("修改毕业院校");
    var txt = $("#school_select").text();
    txt = txt == '未填写' ? '' : txt;
    $("#settxt_tmp").val(txt);
    fixedWin.show('#setTxt', 'school');
  })

  // 年龄
  var mobileSelect_age = new MobileSelect({
    trigger: '#age_select',
    title: '年龄',
    connector: '-',
    sameOption: 'one', 
    name: '岁',
    wheels: [
        {data : returnAge([], 1)},
        {data : returnAge([], 1)},
    ],
    position: [config.dx.fromage, config.dx.toage],
    transitionEnd:function(indexArr, data, index){
        if(indexArr[0] >= indexArr[1]){
          this.locatePostion(1, indexArr[0]);
        }
    },
    callback:function(indexArr, data){
    }
  });

  // 身高
  var height_data1 = returnHeight([], 1, config.dx.dfheight, config.dx.dfheight);
  var height_data2 = returnHeight([], 1, config.dx.dfheight, config.dx.dtheight);
  var mobileSelect_height = new MobileSelect({
    trigger: '#height_select',
    title: '身高',
    connector: '-',
    name: '厘米',
    minTxt: '以下',
    maxTxt: '以上',
    wheels: [
        {data : height_data1.res},
        {data : height_data2.res},
    ],
    position: [height_data1.index, height_data2.index],
    transitionEnd:function(indexArr, data, index){
      if(index == 0){
        var minId = data[0].id;
        var maxId_ = data[1].id;

        var maxIdx_ = indexArr[1];

        var height_data_ = returnHeight([], 1, minId).res;
        var c = height_data_.length - height_data1.res.length;
        height_data1.res = height_data_;
        mobileSelect_height.updateWheel(1, returnHeight([], 1, minId).res);

        // 下限大于上限值
        if(minId > maxId_){
          this.locatePostion(1, 0);
        }else{
          this.locatePostion(1, maxIdx_ + c, 0);
        }
      }
    },
    callback:function(indexArr, data){
    }
  });

  // 学历
  var edu_data1 = returnEdu([], 0, config.dx.dfeducation);
  var edu_data2 = returnEdu([], config.dx.dfeducation, config.dx.dteducation);
  var mobileSelect_edu = new MobileSelect({
    trigger: '#edu_select',
    title: '学历',
    connector: '-',
    name: '',
    minTxt: '以下',
    maxTxt: '以上',
    wheels: [
        {data : edu_data1.res},
        {data : edu_data2.res},
    ],
    keyMap: {
      id: 'id',
      value: 'typename',
    },
    position: [edu_data1.index, edu_data2.index],
    transitionEnd:function(indexArr, data, index){
      if(index == 0){
        var minId = data[0].id;
        var maxId_ = data[1].id;

        var maxIdx_ = indexArr[1];
        var edu_data_ = returnEdu([], minId).res;
        var c = edu_data_.length - edu_data1.res.length;
        edu_data1.res = edu_data_;
        mobileSelect_edu.updateWheel(1, returnEdu([], minId).res);

        // 下限大于上限值
        if(minId > maxId_){
          this.locatePostion(1, 0);
        }else{
          this.locatePostion(1, maxIdx_ + c, 0);
        }
      }
    },
    callback:function(indexArr, data){
    }
  });

  // 收入
  var money_data1 = returnMoney([], 0, config.dx.dfincome);
  var money_data2 = returnMoney([], config.dx.dfincome, config.dx.dtincome);
  var mobileSelect_money = new MobileSelect({
    trigger: '#money_select',
    title: '收入',
    connector: '-',
    name: '',
    // skin: 'skin_fix_option',
    minTxt: '以下',
    maxTxt: '以上',
    wheels: [
        {data : money_data1.res},
        {data : money_data2.res},
    ],
    keyMap: {
      id: 'id',
      value: 'typename',
    },
    position: [money_data1.index, money_data2.index],
    transitionEnd:function(indexArr, data){
        
    },
    optionClick: function (theLi, index, sliderIndex) {

    },
    transitionEnd:function(indexArr, data, index){
        if(index == 0){
          var newd = returnMoney([], indexArr[0], data[1]);
          this.updateWheel(1, newd.res);
          this.locatePostion(1, newd.index, 0);
        }
    },
    callback:function(indexArr, data){

    }
  });


  // 修改昵称，毕业院校
  $('.settxt_save').click(function(){
    var t = $(this), by = t.closest('.fixedWin').attr('data-by');
    if(by == 'nickname'){
      var nickname = $.trim($('#settxt_tmp').val());
      if(nickname == ''){
        showMsg.alert('请填写昵称', 1000);
        return;
      }
      $("#nickname_kj").text(nickname);
      $("#nickname").val(nickname);
    }else if(by == 'school'){
      var school = $.trim($('#settxt_tmp').val());
      if(school == '') school = '<span class="null">未填写</span>';
      $("#school_select").html(school);
      $("#school").val(school);
    }
    fixedWin.close();
  })
  // 保存
  $('.save').click(function(){
    var t = $(this);
    if(t.hasClass('disabled')) return;

    var nickname = $.trim($('#nickname').val()),
        birthday = $('#birtyday').val(),
        height = $('#height').val();
    // 区域
    $('.gz-addr-seladdr').each(function(){
      var o = $(this), id = o.attr('data-id') || 0, id0 = o.attr('data-ids').split(' ')[0];
      o.find('input[type=hidden]').val(id);
      o.siblings('input[type=hidden]').val(id0);
    })

    // 择偶意向
    $('#box_intention .dom_kj').each(function(){
      var o = $(this), id = o.attr('data-id'), inp = o.parents('.ml4r').find('input');
      if(id != undefined){
        if(id.indexOf(',') > 0){
          var ids = id.split(',');
          var id0 = ids[0] ? ids[0] : 0;
          var id1 = ids[1] ? ids[1] : 0;
          inp.eq(0).val(id0);
          inp.eq(1).val(id1);
        }else{
          if(inp.length){
            inp.val(id);
          }
        }
      }
    })

    if(nickname == ''){
      showMsg.alert('请填写昵称', 1000);
      return;
    }
    if(birthday == ''){
      showMsg.alert('请填写生日', 1000);
      return;
    }
    if(height == ''){
      showMsg.alert('请填写身高', 1000);
      return;
    }
    var addrid = $('#addrid').val();
    if(addrid == '' || addrid == 0){
      showMsg.alert('请填写居住地', 1000);
      return;
    }

    showMsg.loading('正在提交，请稍后');
    // t.addClass('disabled');

    var data = $('#fabuForm').serialize();
    console.log(data);
    data += '&upType=1';
    operaJson(masterDomain + '/include/ajax.php?service=dating&action=updateProfile', data, function(data){
      showMsg.alert(data.info, 1000, function(){
        // window.history.go(-1);
      });
    }, true)
  })
  
})


// 返回年龄
function returnAge(arr, level, min, max){
  var min = min ? min : 18;
  var max = max ? max : 99;
  for(var i = min; i <= max; i++){
    var d = {
      id: i,
      value: i,
    }
    if(!level){
      d.childs = returnAge([], 1, i);
    }
    arr.push(d);
  }
  return arr;
}
// 返回身高
function returnHeight(arr, level, min, old){
  var index = 0, no = 1;
  var min = min ? min : 140;
  var max = 210;
  arr.push({
    id:0,
    value: '不限',
  });
  for(var i = min; i <= max; i++){
    var d = {
      id: i,
      value: i + '厘米',
    }
    if(!level){
      d.childs = returnHeight([], 1, i+1);
    }
    if(i == old){
      index = no;
    }
    no++;
    arr.push(d);
  }
  return {index:index,res:arr};
}
// 返回学历
function returnEdu(arr, min, old){
  var index = 0, no = 1;
  var min = min ? min : 0;
  arr.push({
    id:0,
    typename: '不限',
  });
  for(var i in edu_data){
    if(edu_data[i].id >= min){
      var d = {
        id: edu_data[i].id,
        typename: edu_data[i].typename,
      }
      arr.push(d);
      if(edu_data[i].id == old){
        index = no;
      }
      no++;
    }
  }
  return {index:index,res:arr};
}
// 返回收入
moneyLine_data.unshift({id:0, typename:'不限', });
function returnMoney(arr, min, old){
  var index = 0, no = 0;
  for(var i = 0; i < moneyLine_data.length; i++){
    if(i == 0 || i > min){
      if(moneyLine_data[i].id == old){
        index = no;
      }
      arr.push(moneyLine_data[i]);
      no ++;
    }
  }
  return {index:index,res:arr};
}



var fixedWin = {
  init: function(ids){
    var that = this;
    $(ids).click(function(){
      var id = $(this).attr('id');
      that.show("#"+id+'Win');
    })
  },
  show: function(id, from){
    var that = this;
    if($('.fixedWin-show.active').length){
      $('.fixedWin-show.active').addClass('active-last').removeClass('active');
    }
    var con = $(id);
    if(con.length){
      con.addClass("fixedWin-show active").attr("data-by", from ? from : '');
      con.find('.fixedWin-close').off().on("click", function(){
        that.close(true);
      })
    }
    $('html').addClass('md_fixed');
  },
  close: function(id){
    if(id){
      if(Boolean(id)){
        $(".fixedWin-show.active").removeClass("fixedWin-show active");
      }else{
        $(id).removeClass("fixedWin-show active");
      }
      if($('.fixedWin-show.active-last').length){
        setTimeout(function(){
          $('.fixedWin-show.active-last').addClass('active').removeClass('active-last');
        }, 250)
      }else{
        $('html').removeClass('md_fixed');
      }
    }else{
      $('.fixedWin').removeClass('fixedWin-show active active-last');
      $('html').removeClass('md_fixed');
    }
    
  }
}