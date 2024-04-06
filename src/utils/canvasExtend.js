CanvasRenderingContext2D.prototype.letterSpacingText = function (text, x, y, letterSpacing) {
    let context = this;
    let canvas = context.canvas;

    if (!letterSpacing && canvas) {
        letterSpacing = parseFloat(window.getComputedStyle(canvas).letterSpacing);
    }
    if (!letterSpacing) {
        return this.fillText(text, x, y);
    }

    let arrText = text.split('');
    let align = context.textAlign || 'left';

    // 这里仅考虑水平排列
    let originWidth = context.measureText(text).width;
    // 应用letterSpacing占据宽度
    let actualWidth = originWidth + letterSpacing * (arrText.length - 1);
    // 根据水平对齐方式确定第一个字符的坐标
    if (align == 'center') {
        x = x - actualWidth / 2;
    } else if (align == 'right') {
        x = x - actualWidth;
    }

    // 临时修改为文本左对齐
    context.textAlign = 'left';
    // 开始逐字绘制
    arrText.forEach(function (letter) {
        let letterWidth = context.measureText(letter).width;
        context.fillText(letter, x, y);
        // 确定下一个字符的横坐标
        x = x + letterWidth + letterSpacing;
    });
    // 对齐方式还原
    context.textAlign = align;
};

/**
 * 绘制带间距的文字
 * @param text 要绘制的文字
 * @param x 绘制的位置 x
 * @param y 绘制的位置 y
 * @param spacing 文字间距
 */
CanvasRenderingContext2D.prototype.fillTextWithSpacing =
    function (text, x, y, spacing = 0) {
        // 如果间距为0，则不用对每个字符单独渲染以节省性能
        if (spacing === 0) {
            this.fillText(text, x, y);
            return;
        }

        let totalWidth = 0; // 已渲染字符所占用的宽度
        // 对每个字符单独渲染
        for (let i = 0; i < text.length; i++) {
            this.fillText(text[i], totalWidth, y);
            //累计已占用宽度
            totalWidth += ctx.measureText(text[i]).width + spacing;
        }
    }