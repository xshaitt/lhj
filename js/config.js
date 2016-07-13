/**
 * Created by xshaitt on 2016/7/12.
 */
number = 4;
total = 400;
score = 0;
//必须有24个元素，可以为0
probability = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10000];
bets = [0,0,0,0,0,0,0,0]
//最后会走到的选项
result = 0;
start = 0;
lampTime = null;
runTime = null;
clearLampTime = null;
lamp = 5;
//下一个灯的位置
nowLamp = 0;
runLampMax = ran(48,55);
//元素映射倍率下注表
betsInPro = [[10,5],[10,7],[50,0],[100,0],[15,4],[5,4],[10,6],[20,1],[5,1],[0,0],[15,4],[3,5],[10,5],[10,7],[5,2],[20,2],[15,4],[3,6],[10,6],[20,3],[5,3],[0,0],[15,4],[3,7]];
/*
* 跑马灯大概有这几个属性
* 1.初始时定义N个，从上一次结束的地方，开始一个个的增加
* 2.进入加速状态
* 3.进入高速状态
* 4.进行减速状态
* 5.移到目标闪闪闪
* 但现在先不争着做变速的这样一个状态，先把匀速的跑马灯功能做成
* */
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
function probabilityMax()
{
    result = 0;
    for(var i in probability)
    {
        result += probability[i];
    }
    return result;
}
//范围取随机数
function ran(min,max)
{
    return Math.ceil(Math.random()*(max-min+1)+(min-1));
}
/*
* 结果是先随机出从0到24可能性的和之间的数，在通过这个数找到那个对应的选项返回
* 从0到23表示24个选项，而-1则表示没有反应的cha
* */
function target() {
    var tmp = 0;
    var num = ran(0,probabilityMax());
    if(probabilityMax() == 0)
    {
        return -1;
    }
    //根据随机出来的数，算出应该走到的选项
    for(var x in probability)
    {
        tmp += probability[x];
        if(num <= tmp)
        {
            return x;
        }
    }
}
//移动当前的跑马灯指定的格数
function stopLamp(startLamp,endLamp) {
    moveLampTime = setInterval(function () {
        if(startLamp != endLamp)
        {
            startLamp = startLamp+1==24?0:startLamp+1;
            var top = $('.smallBox').eq(startLamp).css('top')==''?'5px':$('.smallBox').eq(startLamp).css('top');
            var left = $('.smallBox').eq(startLamp).css('left')==''?'5px':$('.smallBox').eq(startLamp).css('left');
            $('.lamp').css('top',top);
            $('.lamp').css('left',left);
            if(startLamp == endLamp)
            {
                clearInterval(moveLampTime);
                moveLampTime = null;
                //触发结算方法
                balance();
            }
        }
    },50);
}
//判断是否下注
function isBest()
{
    for(var x in bets)
    {
        if(bets[x] != 0)
        {
            return true;
        }
    }
    return false;
}
//生成跑马灯
function generateLamp()
{
    lampTime = setInterval(function () {
        //获取到需要插入的位置，再插入
        var top = $('.smallBox')[start].style.top==''?'5px':$('.smallBox')[start].style.top;
        var left = $('.smallBox')[start].style.left==''?'5px':$('.smallBox')[start].style.left;
        $('.box').append('<div class="lamp" style="width:68px;height:68px;position: absolute;background-color:rgba(255,0,0,0.2);top:'+top+';left:'+left+';"></div>')
        start++;
        if(start>=lamp)
        {
            clearInterval(lampTime);
            lampTime = null;
            runLamp();
        }
    },1000);
}
//让灯走起来
function runLamp()
{
    /*
     * 1.直接删除第一个，再插入最后一个，但这样有一点需要保证，就是保证最后一个的位置要是新的位置
     * 2.本来准备想想是不是还有其它的方法的，但现在既然想到了一个有行且可用的方法，那么就先做喽
     * */
    //第一个灯要移动的位置，就是灯的数量
    nowLamp = lamp;
    runTime = setInterval(function () {
        var top = $('.smallBox')[nowLamp].style.top==''?'5px':$('.smallBox')[nowLamp].style.top;
        var left = $('.smallBox')[nowLamp].style.left==''?'5px':$('.smallBox')[nowLamp].style.left;
        $('.lamp:eq(0)').remove();
        $('.box').append('<div class="lamp" style="width:68px;height:68px;position: absolute;background-color:rgba(255,0,0,0.2);top:'+top+';left:'+left+';"></div>');
        nowLamp = nowLamp+1==24?0:nowLamp+1;
        runLampMax--;
        if(runLampMax<0)
        {
            clearInterval(runTime);
            runTime = null;
            clearLamp();
        }
    },50);
}
//只保留最后一个灯
function clearLamp()
{
    //只留下一个最后面的
    if($('.lamp').length >1)
    {
        clearLampTime = setInterval(function () {
            $('.lamp:eq(0)').remove();
            if($('.lamp').length <= 1)
            {
                clearInterval(clearLampTime);
                clearLampTime = null;
                stopLamp(nowLamp,result);
            }
        },200);
    }
}
//结算
function balance() {
    if(betsInPro[result][1] != 0)
    {
        score = betsInPro[result][0]*bets[betsInPro[result][1]];
        $('.score .number').html(fill(score));
    }
}