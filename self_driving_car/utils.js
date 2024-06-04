function lerp(A, B, t) {
  //when t is 0 return A when t is 1 return B when t is 0.5 it moves half of A
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x); //intersection point of first line AB
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y); // intersection point of second line CD
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y); //denominator of both tops t and u

  if (bottom != 0) {
    // if bottom is 0 lines are parallel else they can intersection
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      //check if t lies on AB and u lies on CD
      return {
        //returns the x and y coordinates of the intersection and the offset of value t
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polysIntersect(poly1, poly2) {
  //iterate through all the points of poly1 and check if they intersect with any points from poly2
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      ); //modulo allows last point to connect to first point
      if (touch) {
        return true; //if an intersection return true
      }
    }
  }
  return false; //if no intersection
}

function getRGBA(value) {
  const alpha = Math.abs(value); //yellow = +, blue = -
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}
