/**
 * Created by xshaitt on 2016/7/12.
 */
number = 4;
total = 4;
score = 0;
//初始化老虎机方法
function init() {
    //初始化分数
    $('.score .number').html(fill(score));
    $('.total .number').html(fill(total));
    //初始化下注的分数
    for(var i=0;i<8;i++)
    {
        $('.betsBox:eq('+i+') .number').html(fill(0));
    }
}
//填充前导0，使数字框里的数字看上去像那么回事
function fill(num){
    num = String(num);
    while(num.length<number)
    {
        num = '0'+num;
    }
    return num;
}
