const defaultFont = '14px Microsoft YaHei -apple-system BlinkMacSystemFont Segoe UI';

interface GetTextWidth {
  canvas?: HTMLCanvasElement;
  (text: string, font?: string): number;
}

/**
 * 获取文本的宽度
 * @param text 文本
 * @param font 字体配置，参照defaultFont
 */
export const getTextWidth: GetTextWidth = (text: string, font = defaultFont) => {
  // 重用canvas对象以获得更好的性能
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d')!;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};
