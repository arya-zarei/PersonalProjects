const carCanvas = document.getElementById("carCanvas"); //get reference to car canvas
carCanvas.width = 200; //set car width to 200px
const networkCanvas = document.getElementById("networkCanvas"); //get reference to network canvas
networkCanvas.width = 300; //set network width to 300px

const carCtx = carCanvas.getContext("2d"); //to draw on canvas get 2d context
const networkCtx = networkCanvas.getContext("2d"); //to draw on canvas get 2d context
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100; //100 cars in parallel (more cars better ML)
const cars = generateCars(N);
//global var bestCar
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

//traffic that can be manipulated based on user preference
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -1400, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 2, getRandomColor()),
]; //array of cars

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

//add more traffic that move independantly
function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

//animate the car movement
function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []); //add empty array traffic so dummy cars dont worry about eachother
  }

  //update cars
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  //find car that goes the farthest
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight; //set canvas height to full inner window
  networkCanvas.height = window.innerHeight;
  carCtx.save();
  //give space infront of car to see further up road
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx); //draw road before the car

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx); //draw traffic
  }

  //draw cars
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx); //draw car
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();
  //calls animate method repeatedly giving us the illusion of movement

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
