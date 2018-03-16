/**
 * Created by ljybill@aliyun.com  on 2018/3/15
 */
var utils = (function (window) {
    function getEleById (id) {
        return window.document.getElementById(id)
    }

    function hasClass (el, className) {
        var reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
        return reg.test(el.className)
    }

    function addClass (el, className) {
        if (hasClass(el, className)) {
            return
        }

        let newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
    }

    function removeClass (el, className) {
        if (!hasClass(el, className)) {
            return
        }

        let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
        el.className = el.className.replace(reg, ' ')
    }

    function getData (el, name, val) {
        let prefix = 'data-'
        if (val) {
            return el.setAttribute(prefix + name, val)
        }
        return el.getAttribute(prefix + name)
    }

    return {
        getEleById: getEleById,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getData: getData
    }
})(window)