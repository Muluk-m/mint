interface OptionsType {
  fontSize: number | string;
  font: number | string;
}

/**
 * 通过cavans计算字体宽度
 */
class CalculateCanvas {
  canvas: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  options: {
    fontSize: number | string;
    font: number | string;
  };

  string: string;

  constructor(string: string, options: OptionsType) {
    const { fontSize = '', font = '' } = options;

    this.options = options;
    this.string = string;
    this.canvas = document.createElement('canvas');

    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.font = `${fontSize} ${font}`;
  }

  getFontWidth() {
    return this.ctx.measureText(this.string).width;
  }
}

export default CalculateCanvas;
