/**
 * Created by ljybill@aliyun.com  on 2018/3/15
 */
// 计算rem函数，在mainjs里面引用
(function init () {
    // 跟字体是10px
    const baseFontSize = 10
    const docEle = document.documentElement;
    const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    const fontSize = function () {
        const clientWidth = docEle.clientWidth;
        if (!clientWidth) return;
        docEle.style.fontSize = baseFontSize * (clientWidth / 375) + 'px';
    }
    fontSize();
    window.addEventListener(resizeEvt, fontSize, false);
})();
