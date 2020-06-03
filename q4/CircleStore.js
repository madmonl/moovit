
const { v4: uuidv4 } = require('uuid');

/*
  Explanation:
  In order to reduce the amount of isOverlapping calls -
  The idea is to perform binary search & binary insertion,.
  The order of insertion and searching will take advantage of
  the fact that for each circle there is a bounding square.
  If a square's right edge's x value is smaller than another box's
  right edge's x value and vice versa we can safely assume that their
  corresponding bounded circles are not overlapping, hence we reduced
  the runtime to average of O(logn) and worse case O(n).
  The uid is for being able to avoid duplications more easily.
*/

class CircleStore {
  constructor() {
    this.sortedByLeftEdge = [];
    this.sortedByRightEdge = [];
  }


  chooseCirclesByType(type) {
    return (type === 'right') ? this.sortedByRightEdge : this.sortedByLeftEdge;
  }
  
  calcLeftOrRightEdge(type, a, b) {
    return (type === 'left') ? a - b : a + b;
  }
  
  calcPositionByEdge(circle, type) {
    const circles = this.chooseCirclesByType(type);
    if (!circles.length) {
      return 0;
    }

    const xEdge = this.calcLeftOrRightEdge(type, circle.x, circle.r);
    let left = 0;
    let right = circles.length - 1;
    while (left < right) {
      const pos = Math.floor((left + right) / 2);
      const xCurrEdge = this.calcLeftOrRightEdge(type, circles[pos][0].x, circles[pos][0].r)
      if (xEdge <= xCurrEdge) {
        right = pos;
      } else {
        left = pos + 1;
      }
    }

    const xCurr = this.calcLeftOrRightEdge(type, circles[left][0].x, circles[left][0].r) 
    return (xEdge <= xCurr) ? left : left + 1;
  }
  
  addCircle(circle) {
    const rightPosition = this.calcPositionByEdge(circle, 'right');
    this.sortedByRightEdge.splice(rightPosition, 0, [circle, uuidv4()]);
    const leftPosition = this.calcPositionByEdge(circle, 'left');
    this.sortedByLeftEdge.splice(leftPosition, 0, [circle, uuidv4()]);
  }
  
  iterateOverlapping(overlapping, circle, position, type) {
    const circles = this.chooseCirclesByType(type);
    while (position < circles.length) {
      const xCurr = this.calcLeftOrRightEdge(type, circles[position].x - circles[position].r);
      const oppositeEdgeType = (type === 'left') ? 'right' : 'left';
      const xOppositeEdge = this.calcLeftOrRightEdge(oppositeEdgeType, circle.x, circle.r);
      if (xCurr > xOppositeEdge) {
        return;
      } else {
        const candidateCircle = circles[position][0];
        if (circle.isOverlapping(candidateCircle)) {
          const id = circles[position][1];
          overlapping[id] = circles[position][0];
        }
          
        position++;
      }
    }
  }

  getOverlappingCircles(circle) {
    const overlapping = {};    
    const rightEdgeCircle = new Circle(circle.x + 2*circle.r, undefined, circle.r);
    const leftEdgeCircle = new Circle(circle.x - 2*circle.r, undefined, circle.r);
    let leftPosition = this.calcPositionByEdge(rightEdgeCircle, 'left');
    let rightPosition = this.calcPositionByEdge(leftEdgeCircle, 'right');
    this.iterateOverlapping(overlapping, circle, rightPosition, 'left');
    this.iterateOverlapping(overlapping, circle, leftPosition, 'right');    

    return Object.values(overlapping);
  }
}
