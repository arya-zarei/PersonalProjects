class Car {
  //properties of the car
  constructor(x, y, width, height, controlType, maxSpeed = 3, color = "blue") {
    //car location
    this.x = x;
    this.y = y;
    //car dimensions
    this.width = width;
    this.height = height;

    //movement speed of car
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;

    //angle for turns
    this.angle = 0;

    //all cars are not damaged to begin with
    this.damaged = false;

    //if control type is AI use the car brain
    this.useBrain = controlType == "AI";

    //if car not dummy equipe with sensor
    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }

    //pretend controls
    this.controls = new Controls(controlType);

    //car image
    this.img = new Image();
    this.img.src = "car.png";
    this.mask = document.createElement("canvas");
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext("2d");
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();
      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };
  }

  //update the movement of the car
  update(roadBorders, traffic) {
    //if car is damaged car is useless
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic); //add traffic to assessed damage
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic); //only update roadBoarders if sensor exist (not dummy car)
      const offsets = this.sensor.readings.map(
        (s) => (s == null ? 0 : 1 - s.offset) //larger number = closer reading, low value if object is far away
      );
      //to see wha neural network is outputting
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      //if a car point has intersected with a border then car is damaged
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      //check is car has intersected with traffic dummy car
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = []; //1 point per corner of car
    const rad = Math.hypot(this.width, this.height) / 2; //hypothenius of ray
    const alpha = Math.atan2(this.width, this.height); //angle of radius
    //top right point
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    //top left points
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    //bottom right
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    //bottom left
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  //move car according to controls
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration; //movement of car
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration; //decrease vertical location
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed; //set speed cap to maxSpeed
    }

    //negative sign indicates car is going backwards
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction; //lose friction to move car
    }

    if (this.speed < 0) {
      this.speed += this.friction; //apply friciton to stop car
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0; //make sure car comes to full stop
    }

    //make car turn correctly backwards
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip; //update car angle for turns
      }

      if (this.controls.right) {
        this.angle -= 0.03 * flip; //update car angle for turns
      }
    }

    this.x -= Math.sin(this.angle) * this.speed; //update x value from movement
    this.y -= Math.cos(this.angle) * this.speed; //update y value from movement
  }
  //draw car recieves car context
  draw(ctx, drawSenor = false) {
    if (this.sensor && drawSenor) {
      this.sensor.draw(ctx); //draw sensor for car
    }
    //draw car.png
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    if (!this.damaged) {
      ctx.drawImage(
        this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = "multiply";
    }

    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
