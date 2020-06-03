class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  isOverlapping(circle) {
    const distance = Math.sqrt((this.x - circle.x)**2 + (this.y - circle.y)**2);
    return ((distance - this.r - circle.r) < 0);
  }
}
