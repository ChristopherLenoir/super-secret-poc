export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  fillColor: string = '#777777';
  strokeColor: string = '#000000';

  constructor(canvasRef) {
    this.canvas = canvasRef;
    this.ctx = canvasRef.getContext('2d', { willReadFrequently: true });
  }

  set setFillColor(color: string) {
    this.fillColor = color;
  }

  set setStrokeColor(color: string) {
    this.strokeColor = color;
  }

  resize(width: number, height: number = width): void {
    console.log('resize : ', width, height);
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
    this.ctx.beginPath();
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

  drawText(text: string, x: number, y: number, color: string = this.fillColor, size: number = 12) {
    this.ctx.font = `${size}px serif`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  background(color: string = this.fillColor, alpha: number = 1): void {
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    // this.ctx.fillRect(this.canvas.width, this.canvas.height, 0, 0);
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // TO DO : Save state and draw saved state functions
}
