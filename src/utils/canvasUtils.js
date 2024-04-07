/**
 * 绘制带间距的文字
 * @param ctx
 * @param text
 * @param x
 * @param y
 * @param space
 */
export function fillTextWithSpacing(ctx, text, x, y, space = 0) {
    let canvas = ctx.canvas;

    if (!space && canvas) {
        space = parseFloat(window.getComputedStyle(canvas).letterSpacing);
    }
    if (!space) {
        return ctx.fillText(text, x, y);
    }

    let arrText = text.split('');
    let align = ctx.textAlign || 'left';

    // 这里仅考虑水平排列
    let originWidth = ctx.measureText(text).width;
    // 应用space占据宽度
    let actualWidth = originWidth + space * (arrText.length - 1);
    // 根据水平对齐方式确定第一个字符的坐标
    if (align == 'center') {
        x = x - actualWidth / 2;
    } else if (align == 'right') {
        x = x - actualWidth;
    }

    // 临时修改为文本左对齐
    ctx.textAlign = 'left';
    // 开始逐字绘制
    arrText.forEach(function (letter) {
        let letterWidth = ctx.measureText(letter).width;
        ctx.fillText(letter, x, y);
        // 确定下一个字符的横坐标
        x = x + letterWidth + space;
    });
    // 对齐方式还原
    ctx.textAlign = align;
}
