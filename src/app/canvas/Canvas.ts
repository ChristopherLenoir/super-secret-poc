// TO DO : Request animation frame everywhere drawing

export function waitForNextFrame(): Promise<void> {
  return new Promise(resolve => {
    // requestAnimationFrame(time => {
    //   console.log('requestAnimationFrame : time : ', time);
    //   resolve();
    // });
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

export function dummyPromise(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000 / 10);
  });
}

export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  fillColor: string = '#777777';
  strokeColor: string = '#000000';

  constructor(canvasRef) {
    this.canvas = canvasRef;
    this.ctx = canvasRef.getContext('2d');
  }

  set setFillColor(color: string) {
    this.fillColor = color;
  }

  set setStrokeColor(color: string) {
    this.strokeColor = color;
  }

  resize(width: number, height: number = width): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  invert() {
    this.ctx.scale(-1, 1);
  }

  drawVideo(video: HTMLVideoElement): void {
    // this.ctx.save();
    // this.ctx.scale(-1, 1);
    // this.ctx.translate(-video.clientWidth, 0);
    this.ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
    // this.drawVideo(video);
  }

  drawLine(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    color: string = this.strokeColor,
    strokeWeight: number = 1
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(ax, ay);
    this.ctx.lineTo(bx, by);
    this.ctx.lineWidth = strokeWeight;
    this.ctx.stroke();
  }

  drawCircle(
    x: number,
    y: number,
    radius: number,
    fillColor: string = this.fillColor,
    strokeColor: string = this.strokeColor
  ): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius ? radius : 3, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.stroke();
  }

  drawRectangle(x: number, y: number, width: number, height: number, color: string = this.strokeColor): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  background(color: string = this.fillColor): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.fillRect(this.canvas.width, this.canvas.height, 0, 0);
  }

  // TO DO : Save state and draw saved state functions
}
