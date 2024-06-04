class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5; //cast rays in different directions
    this.rayLength = 150; //range length of ray
    this.raySpread = Math.PI / 2; //angle spread of ray

    this.rays = []; //keeps each individual ray in an array
    this.readings = []; //readings for if there is a border near and how far it is
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    //iterate through reading array and add readings
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  //get distance from boarder intersection for sensor rays
  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    //add traffic dummy cars to sensor ray readings
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      //gets offset for each element in the array
      const offsets = touches.map((e) => e.offset);
      //gets the minimum offset
      const minOffset = Math.min(...offsets);
      //return the min offset (closest boundary)
      return touches.find((e) => e.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];

    //input into empty rays array
    for (let i = 0; i < this.rayCount; i++) {
      //angle of rays
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      //array start point(the car)
      const start = { x: this.car.x, y: this.car.y };
      //array end point (angle of ray multiplied by length)
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]); //push these to array to form a segment
    }
  }
  //draw sensor
  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2; //sensor line width
      ctx.strokeStyle = "yellow"; //sensor colour
      //sensor dimension and coordinate
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);

      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2; //sensor line width
      ctx.strokeStyle = "black"; //sensor touching colour
      //sensor dimension and coordinate
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);

      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
