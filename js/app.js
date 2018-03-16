/**
 * Created by ljybill@aliyun.com  on 2018/3/15
 */
var app = (function (window) {
    /**
     * x: row number
     * y: col number
     */
    function createSeatDom (x, y) {
        function createBaseColHtml (idx) {
            return `
<li class="seat-col" data-col="${idx}">
    <i class="icon icon-seat"></i>
</li>
`.trim();
        }

        function createBaseRowHtml (idx, colHtml) {
            return `<ul class="seat-row" data-row="${idx}">
${colHtml}
</ul>`.trim();
        }


        var colHtml = ''
        for (var j = 0; j < y; j++) {
            colHtml += createBaseColHtml(j)
        }

        var rowHtml = ''
        for (var i = 0; i < x; i++) {
            rowHtml += createBaseRowHtml(i, colHtml)
        }


        return `<div class="seat-wrapper">
${rowHtml}
</div>`.trim();
    }

    /**
     * x: row number
     * y: col number
     */
    function createIdxDom (x, y) {
        function createBaseColIdxHtml (idx) {
            return `<li class="col-idx-item">${idx + 1}</li>`
        }

        function createBaseRowIdxHtml (idx) {
            return `<li class="row-idx-item">${idx + 1}</li>`
        }

        var colIdxHtml = ''
        for (var i = 0; i < y; i++) {
            colIdxHtml += createBaseColIdxHtml(i);
        }
        colIdxHtml = `<ul class="col-idx-list"><div id="col-idx-wrapper">${colIdxHtml}</div></ul>`.trim();

        var rowIdxHtml = ''
        for (var j = 0; j < x; j++) {
            rowIdxHtml += createBaseRowIdxHtml(j);
        }
        rowIdxHtml = `<ul class="row-idx-list"><div id="row-idx-wrapper">${rowIdxHtml}</div></ul>`.trim();


        return colIdxHtml + rowIdxHtml;
    }

    /**
     * x: row number
     * y: col number
     */
    function createEagleEyeDom (row, col) {
        // function createBaseEagleCol (idx) {
        //     return `<li data-idx="${idx + 1}" class="eagle-col-item"></li>`
        // }
        //
        // function createBaseEagleRow (idx, baseColHtml) {
        //     return `<ul data-idx="${idx + 1}" class="eagle-row-item">${baseColHtml}</ul>`
        // }
        //
        // var baseColHtml = ''
        // for (var i = 0; i < col; i++) {
        //     baseColHtml += createBaseEagleCol(i);
        // }
        //
        // var baseRowHtml = ''
        // for (var j = 0; j < row; j++) {
        //     baseRowHtml += createBaseEagleRow(j, baseColHtml);
        // }

        return `<div class="eagle-eye"><div class="eagle-view"></div></div>`.trim();
    }

    return {
        createSeatDom: createSeatDom,
        createIdxDom: createIdxDom,
        createEagleEyeDom: createEagleEyeDom
    }
})(window)