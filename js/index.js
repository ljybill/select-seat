/**
 * Created by ljybill@aliyun.com  on 2018/3/15
 */
window.onload = function () {
    var row = 31
    var col = 30
    var viewBox = utils.getEleById('view-box');
    var viewBoxWrapper = utils.getEleById('view-box-wrapper');
    var eagleEyeWrapper = utils.getEleById('eagle-eye-wrapper');
    var eagleEye = undefined;
    var eagleView = undefined;
    var showEagleTimer = 0;
    var isShowEagle = false;
    var seatWrapper = undefined;
    var colIdxWrapper = undefined;
    var rowIdxWrapper = undefined;
    // 兼容处理
    var vendors = vendor();
    var startPoint = {};
    var endPoint = {};
    var offset = {x: 0, y: 0};
    var scale = 1;
    var eagleScale = 1;
    var distance = {};
    var origin = {};
    var isCanScale = false;

    function init () {
        // 生成项目结构
        var time = new Date().getTime()
        // 生成索引
        viewBoxWrapper.innerHTML = viewBoxWrapper.innerHTML + app.createIdxDom(row, col);
        viewBox = utils.getEleById('view-box');
        colIdxWrapper = utils.getEleById('col-idx-wrapper');
        rowIdxWrapper = utils.getEleById('row-idx-wrapper');
        // 生成座位dom
        viewBox.innerHTML = app.createSeatDom(row, col);
        seatWrapper = viewBox.firstChild;
        // 生成鹰眼图
        eagleEyeWrapper.innerHTML = app.createEagleEyeDom(row, col);
        eagleEye = eagleEyeWrapper.firstChild;
        eagleView = eagleEye.firstChild;
        drawEagleEye();
        // 渲染出来的最大的div宽度是375,不符合预期，用js手动处理下
        var colWidth = seatWrapper.children[0].children[0].offsetWidth
        seatWrapper.style.width = col * colWidth + 'px'
        console.log('花费时间:', new Date().getTime() - time);


        // dom 生成完毕后，将视口移到正中间
        moveCenter(viewBox);
        // 组织自带的滚动事件
        viewBox.addEventListener('touchmove', onViewTouchMove);
        // 手指划改变偏移事件
        viewBox.addEventListener('touchstart', onViewTouchStart);
        viewBox.addEventListener('touchend', onViewTOuchEnd);
        // 点击事件
        seatWrapper.addEventListener('click', onViewClick);
    }

    function vendor () {
        var TRANSITION = 'transition';
        var TRANSITION_END = 'transitionend';
        var TRANSFORM = 'transform';
        var TRANSFORM_PROPERTY = 'transform';
        var TRANSITION_PROPERTY = 'transition';

        if (typeof document.body.style.webkitTransform !== undefined) {
            TRANSFORM = 'webkitTransform';
            TRANSITION = 'webkitTransition';
            TRANSITION_END = 'webkitTransitionEnd';
            TRANSFORM_PROPERTY = '-webkit-transform';
            TRANSITION_PROPERTY = '-webkit-transition';
        }
        return {
            TRANSFORM: TRANSFORM,
            TRANSITION: TRANSITION,
            TRANSITION_END: TRANSITION_END,
            TRANSFORM_PROPERTY: TRANSFORM_PROPERTY,
            TRANSITION_PROPERTY: TRANSITION_PROPERTY
        };
    }

    function onViewTouchStart (event) {
        if (event.touches.length === 1) {
            // 一个手指的滑动效果
            startPoint.x = event.touches[0].screenX
            startPoint.y = event.touches[0].screenY
        } else if (event.touches.length === 2) {
            // 两个手指的缩放效果
            isCanScale = true;
            distance.start = getDistance({
                x: event.touches[0].screenX,
                y: event.touches[0].screenY
            }, {
                x: event.touches[1].screenX,
                y: event.touches[1].screenY
            });
        }
    }

    function onViewTouchMove (event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            // 一个手指的滑动效果
            endPoint.x = event.touches[0].screenX;
            endPoint.y = event.touches[0].screenY;

            offset.x += endPoint.x - startPoint.x;
            offset.y += endPoint.y - startPoint.y;

            startPoint.x = endPoint.x;
            startPoint.y = endPoint.y;

            isShowEagle = true;
            translate(viewBox.firstChild, offset.x, offset.y);
        } else if (event.touches.length === 2) {
            // 两个手指的缩放效果
            if (isCanScale) {
                origin = getOrigin({
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY
                }, {
                    x: event.touches[1].pageX,
                    y: event.touches[1].pageY
                });
                distance.stop = getDistance({
                    x: event.touches[0].screenX,
                    y: event.touches[0].screenY
                }, {
                    x: event.touches[1].screenX,
                    y: event.touches[1].screenY
                });
                if (distance.stop / distance.start < 1.5) {
                    scale = 1;
                } else {
                    scale = 2;
                }
                translate(viewBox.firstChild, offset.x, offset.y, true);
            }

        }
    }

    function onViewTOuchEnd (event) {
        if (scale < 1.5) {
            scale = 1;
        } else {
            scale = 2;
        }
        checkBack();
    }

    function onViewClick (event) {
        console.log(event)
        var target = event.target
        if (utils.hasClass(target, 'icon')) {
            // 确实点到座位上了
            if (utils.hasClass(target, 'icon-seat-no')) {
                // 座位不可选（有人了）
            } else {
                if (scale === 1) {
                    clickMove(event);
                }

                if (utils.hasClass(target, 'icon-seat-select')) {
                    // 已经选上了
                    utils.addClass(target, 'icon-seat')
                    utils.removeClass(target, 'icon-seat-select')
                } else {
                    // 空座位
                    utils.addClass(target, 'icon-seat-select')
                    utils.removeClass(target, 'icon-seat')
                }
            }
        }
    }

    function translate (el, x, y, animation) {
        var transition_animation = ''
        if (animation) {
            transition_animation = `${vendors.TRANSFORM_PROPERTY} .4s ease-out`;
        } else {
            transition_animation = 'none';
        }

        if (isShowEagle) {
            eagleEyeWrapper.style.opacity = 1;
            eagleEyeWrapper.style.zIndex = 10;
            if (showEagleTimer) {
                clearTimeout(showEagleTimer);
            }
            showEagleTimer = setTimeout(function () {
                eagleEyeWrapper.style.opacity = 0;
                eagleEyeWrapper.style.zIndex = -1;
            }, 1200);
        }

        el.style[vendors.TRANSITION] = transition_animation;
        colIdxWrapper.style[vendors.TRANSITION] = transition_animation;
        rowIdxWrapper.style[vendors.TRANSITION] = transition_animation;
        eagleView.style[vendors.TRANSITION] = transition_animation;
        eagleEye.style[vendors.TRANSITION] = transition_animation;

        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        eagleView.style.transform = `translate(${-x / scale}px, ${-y / scale}px) scale(${1 / scale})`;
        colIdxWrapper.style.transform = `translate(${x}px, 0px) scaleX(${scale})`;
        rowIdxWrapper.style.transform = `translate(0px, ${y}px) scaleY(${scale})`;
    }

    function moveCenter (el) {
        var width = el.clientWidth;
        var height = el.clientHeight;
        var firstChild = el.firstChild;
        var cWidth = firstChild.clientWidth;
        var cHeight = firstChild.clientHeight;
        offset.x = -cWidth / 2 + width / 2;
        offset.y = -cHeight / 2 + height / 2;
        isShowEagle = false;
        translate(firstChild, offset.x, offset.y);
    }

    function checkBack () {
        var locationCheck = false;
        var width = viewBox.clientWidth;
        var height = viewBox.clientHeight;
        var firstChild = viewBox.firstChild;
        var cWidth = firstChild.clientWidth * scale;
        var cHeight = firstChild.clientHeight * scale;

        if (offset.x > 0) {
            offset.x = 0;
            locationCheck = true;
        }
        if (offset.y > 0) {
            offset.y = 0;
            locationCheck = true;
        }
        if (offset.y < height - cHeight) {
            offset.y = height - cHeight;
            locationCheck = true;
        }
        if (offset.x < (width - cWidth)) {
            offset.x = (width - cWidth);
            locationCheck = true;
        }
        if (locationCheck) {
            isShowEagle = true;
            translate(viewBox.firstChild, offset.x, offset.y, true);
        }
    }

    function clickMove (event) {
        scale = 2;
        var width = viewBox.clientWidth;
        var height = viewBox.clientHeight;
        var cWidth = seatWrapper.clientWidth * scale;
        var cHeight = seatWrapper.clientHeight * scale;

        var movieSelect = utils.getEleById('movie-select');
        // 计算坐标系原点的实际x，y
        var diffHeight = movieSelect.offsetTop + viewBox.offsetTop;
        var diffWidth = movieSelect.offsetLeft + viewBox.offsetLeft;

        // 将点击点的实际xy换算成容器坐标系
        var x = (event.clientX - diffWidth) - offset.x;
        var y = (event.clientY - diffHeight) - offset.y;

        x = x * scale;
        y = y * scale;
        // 视口坐标系的宽和高
        var wrapHeight = movieSelect.offsetHeight - viewBox.offsetTop;
        var wrapWidth = movieSelect.offsetWidth - viewBox.offsetLeft;

        offset.x = -x + wrapWidth / 2;
        offset.y = -y + wrapHeight / 2;


        // 边缘校验
        if (offset.x > 0) {
            offset.x = 0;
        }
        if (offset.y > 0) {
            offset.y = 0;
        }
        if (offset.y < height - cHeight) {
            offset.y = height - cHeight;
        }
        if (offset.x < (width - cWidth - 20)) {
            offset.x = (width - cWidth - 20);
        }
        isShowEagle = true;
        translate(seatWrapper, offset.x, offset.y, true)
        // scaleView(seatWrapper, 1, event.clientX, event.clientY);
    }

    function drawEagleEye () {
        // 鹰眼的宽高
        var eagleWidth = 0;
        var eagleHeight = 0;
        // 画布的宽高
        var wrapperWidth = seatWrapper.children[0].children[0].offsetWidth * col;
        var wrapperHeight = seatWrapper.offsetHeight;
        // 视口的宽高
        var movieSelect = utils.getEleById('movie-select');
        var viewHeight = movieSelect.offsetHeight - viewBox.offsetTop;
        var viewWidth = movieSelect.offsetWidth - viewBox.offsetLeft;

        eagleScale = 200 / wrapperWidth;
        eagleWidth = wrapperWidth;
        eagleHeight = wrapperHeight;

        console.log(eagleScale)

        eagleEye.style.width = `${eagleWidth}px`;
        eagleEye.style.height = `${eagleHeight}px`;
        eagleEye.style.transform = `scale(${eagleScale})`;

        eagleView.style.width = `${viewWidth}px`;
        eagleView.style.height = `${viewHeight}px`;


    }

    function getDistance (start, stop) {
        return Math.sqrt(Math.pow((stop.x - start.x), 2) + Math.pow((stop.y - start.y), 2));
    }

    function getOrigin (first, second) {
        return {
            x: (first.x + second.x) / 2,
            y: (first.y + second.y) / 2
        };
    }

    init();
}