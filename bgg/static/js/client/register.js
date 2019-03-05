$(function () {
    var shareid = getUrl('shareid')
    var sharetype = getUrl('sharetype')
    var phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
    var passwordReg = /^[a-zA-Z\d_]{6,}$/
    // 点击刷新图形验证码
    $('.img_code_show').on('click', function () {
        $(this).attr('src', ($(this).attr('src') + '?'))
    })
    // 发送验证码
    $('.right_input').on('tap', '.get_code_btn.active', function () {
        var $self = $(this)
        $(this).removeClass('active')
        var phone = $('#phone').val()
        var imgcode = $('#img_code').val()
        if(phone == ''){
            blackHiht('手机号不能为空')
            $(this).addClass('active')
        }else if(!phoneReg.test(phone)){
            blackHiht('手机号格式不正确')
            $(this).addClass('active')
        }else if(imgcode == ''){
            blackHiht('图形验证码不能为空')
            $(this).addClass('active')
        }else{
            $.ajax({
                url: _apiUrl + 'public/bgg/index/web/verifycode',
                data: {
                    mobile: phone,
                    verifycode: imgcode
                },
                dataType: 'JSON',
                type: 'POST',
                success: function (resstr) {
                    var res = null;
                    if (typeof resstr.result == "undefined") {
                        res = JSON.parse(resstr);
                    } else {
                        res = resstr;
                    }
                    if(res.code == 200){
                        var seconds = 60
                        var timer = setInterval(function () {
                            seconds--
                            $('.get_code_btn').text(seconds + '秒')
                            if(seconds <= 0){
                                clearInterval(timer)
                                timer = null
                                $('.get_code_btn').text('发送验证码')
                                $self.addClass('active')
                            }
                        }, 1000)
                    }else{
                        blackHiht(res.message)
                        $(this).attr('src', ($(this).attr('src') + '?'))
                        $self.addClass('active')
                    }
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }
    })

    // 注册
    $('.btn_box').on('tap', '.register.active', function () {
        var $self = $(this)
        $(this).removeClass('active')
        var phone = $('#phone').val()
        var imgcode = $('#img_code').val()
        var code = $('#code').val()
        var password = $('#password').val()
        var password2 = $('#password_again').val()
        if(phone == ''){
            blackHiht('手机号不能为空')
            $(this).addClass('active')
        }else if(!phoneReg.test(phone)){
            blackHiht('手机号格式不正确')
            $(this).addClass('active')
        }else if(code == ''){
            blackHiht('验证码不正确')
            $(this).addClass('active')
        }else if(password == ''){
            blackHiht('密码不能为空')
            $(this).addClass('active')
        }else if(!passwordReg.test(password)){
            blackHiht('密码格式不正确')
            $(this).addClass('active')
        }else if(password != password2){
            blackHiht('两次密码不一致')
            $(this).addClass('active')
        }else{
            $.ajax({
                url: _apiUrl + 'public/bgg/index/web/userregister?shareid=' + shareid + '&sharetype=' + sharetype,
                data: {
                    mobile: phone,
                    verifycode: code,
                    password: password
                },
                dataType: 'JSON',
                type: 'POST',
                success: function (resstr) {
                    var res = null;
                    if (typeof resstr.result == "undefined") {
                        res = JSON.parse(resstr);
                    } else {
                        res = resstr;
                    }
                    if(res.code == 200){
                        blackHiht('注册成功')
                    }else{
                        blackHiht(res.message)
                    }
                    $self.addClass('active')
                },
                error: function () {
                    blackHiht('网络错误')
                }
            })
        }
    })
})
