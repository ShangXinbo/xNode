$(function(){

    //添加用户
    $('#add_customer').on('click', '.uk-button-primary',function(event){
        var Cont = $('#add_customer');
        var name = Cont.find('input[name="name"]').val(),
            tel = Cont.find('input[name="tel"]').val(),
            town = Cont.find('select[name="town"]').val(),
            marks = Cont.find('textarea[name="marks"]').val();

        if(!name){
            layer_alert(Cont,'姓名是需要填写的');
            Cont.find('input[name="name"]').addClass('uk-form-danger');
            return false;
        }else{
            Cont.find('input[name="name"]').removeClass('uk-form-danger');
        }
        if(!isRealPhone(tel)){
            layer_alert(Cont,'手机号码不合法');
            Cont.find('input[name="tel"]').addClass('uk-form-danger');
            return false;
        }else{
            Cont.find('input[name="tel"]').removeClass('uk-form-danger');
        }
        $.ajax({
            url: '/courier/user/add',
            type: 'GET',
            dataType: 'json',
            data: {
                name:name,
                tel:tel,
                town:town,
                marks:marks
            },
            success:function(data){
                if(data.status==0){
                    window.location.reload();
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }).on('click','[data-close]',function(){
        UIkit.modal("#add_customer").hide();
    });


    //添加订单
    $('#add_order').on('click', '.uk-button-primary',function(event){
        var Cont = $('#add_order');
        var id = $('.uk-article').data('id');
        var code = Cont.find('input[name="code"]').val(),
            company = Cont.find('select[name="company"]').val(),
            in_time = Cont.find('input[name="in_time"]').val();
        var codePattern = /^[0-9a-zA-Z]{10,}$/;
        if(!codePattern.test(code)){
            layer_alert(Cont,'快递号格式不正确');
            Cont.find('input[name="code"]').addClass('uk-form-danger');
            return false;
        }else{
            Cont.find('input[name="code"]').removeClass('uk-form-danger');
        }
        if(!in_time){
            layer_alert(Cont,'入库时间需要选择');
            Cont.find('input[name="in_time"]').addClass('uk-form-danger');
            return false;
        }else{
            Cont.find('input[name="in_time"]').removeClass('uk-form-danger');
        }
        $.ajax({
            url: '/courier/user/orderadd',
            type: 'GET',
            dataType: 'json',
            data: {
                id:id,
                code:code,
                company:company,
                in_time:in_time
            },
            success:function(data){
                if(data.status==0){
                    window.location.reload();
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }).on('click','[data-close]',function(){
        UIkit.modal("#add_order").hide();
    });


    //批量删除用户
    $('table').on('click','th input[type="checkbox"]',function(event){
        var checked = $(this)[0].checked;
        var tdcheck = $('table td input[type="checkbox"]');
        if(checked){
            for(var i=0;i<tdcheck.length;i++){
                tdcheck[i].checked = 'checked';
            }
        }else{
            for(var i=0;i<tdcheck.length;i++){
                tdcheck[i].checked = '';
            }
        }
    }).on('click','td input[type="checkbox"]',function(event){
        var checked = $(this)[0].checked;
        if(checked){
            $(this)[0].checked = 'checked';
        }else{
            $(this)[0].checked = '';
        }
    });

    $('#del_customer').on('click',function(event){
        UIkit.modal.confirm("您的操作不可返回，请确认是否删除选中数据", function(){
            var checked = $('table td input[type="checkbox"]');
            var arr = [];
            for(var i=0;i<checked.length;i++){
                if(checked[i].checked){
                    arr.push($(checked[i]).data('id'));
                }
            }
            if(arr.length>0){
                $.ajax({
                    url: '/courier/user/del',
                    type: 'GET',
                    dataType : 'json',
                    data:{
                        arr: arr
                    },
                    success:function(data){
                        if(data.status==0){
                            window.location.reload();
                        }else{
                            console.log(err);
                        }
                    },
                    error: function(err){
                        console.log(err);
                    }
                })
            }else{

            }

        });
    });

    $('#user_search').on('submit',function(event){
        var keyword = $(this).find('input').val();
        if(keyword){
            return true;
        }else{
            return false;
        }
    });

    $('#user_edit').on('click',function(event){
        var Cont = $('form');
        var id = $('input[name="id"]').val();
        var name = $('input[name="name"]').val(),
            tel = $('input[name="tel"]').val(),
            town = $('select[name="town"]').val(),
            marks = $('textarea[name="marks"]').val();

        if(!name){
            body_alert(Cont,'姓名是需要填写的');
            Cont.find('input[name="name"]').addClass('uk-form-danger');
            return false;
        }else{
            Cont.find('input[name="name"]').removeClass('uk-form-danger');
        }
        if(!isRealPhone(tel)){
            body_alert(Cont,'手机号码不合法');
            Cont.find('input[name="tel"]').addClass('uk-form-danger');
            return false;
        }else{
            Cont.find('input[name="tel"]').removeClass('uk-form-danger');
        }

        $.ajax({
            url: '/courier/user/edit',
            type: 'POST',
            dataType: 'json',
            data: {
                id:id,
                name:name,
                tel:tel,
                town:town,
                marks:marks
            },
            success:function(data){
                if(data.status==0){
                    window.location.href = '/courier/user';
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    });



});

function layer_alert(cont,msg){
    var dom = '<div class="uk-alert uk-alert-danger">'+ msg + '</div>';
    $(cont).find('.uk-modal-header').next('.uk-alert').remove();
    $(cont).find('.uk-modal-header').after(dom);
}
function body_alert(cont,msg){
    var dom = '<div class="uk-alert uk-alert-danger">'+ msg + '</div>';
    $('#user_edit').prev('.uk-alert').remove();
    $('#user_edit').before(dom);
}
function isRealPhone(num){
    var patten1 = /^1(3[456789]{1}|47|5[012789]{1}|78|8[23478]{1})\d{8}$/;   //移动
    var patten2 = /^1(3[012]{1}|45|5[56]{1}|76|8[56]{1})\d{8}$/;             //联通
    var patten3 = /^1(33|53|77|8[019]{1})\d{8}$/;                            //电信
    var patten4 = /^170\d{8}$/;                                              //虚拟运营商

    if (patten1.test(num)) {
        return 1;
    } else if (patten2.test(num)) {
        return 2;
    } else if (patten3.test(num)) {
        return 3;
    } else if (patten4.test(num)) {
        return 4;
    } else {
        return false;
    }
}