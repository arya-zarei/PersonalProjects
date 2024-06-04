# Self-Driving Car Project

This project showcases a self-driving car simulation using vanilla JavaScript, machine learning, and neural networks. The car navigates through traffic, optimizing its path through continuous learning. 
The best car path is stored in local storage, and users can choose to save or discard this path. Additionally, the number of cars used for training can be adjusted to enhance the learning process.

## Features

- **Self-Driving Car Simulation**: A car navigating three lanes with generated traffic.
- **Neural Networks**: Four neural links for directions (left, right, forward, reverse).
- **Machine Learning**: Stores the best car path in local storage with an option to increase or decrease the number of AI cars per simulation to better train AI car.
- **User Interaction**: Options to save or discard the car path from local memory to enhance car learning based on previous results.
- **Adjustable Parameters**: Modify the number of cars used for better machine learning optimization.

## Project Structure

- **index.html**: The main HTML file.
- **styles.css**: The CSS file for styling the project.
- **car.png**: The png image of the car.
- **main.js**: The main JavaScript file containing the organization of the logic for the self-driving car and machine learning.
- **car.js**: The JavaScript file containing the main "AI" car and the traffic "DUMMY" cars and their sensors.
- **controls.js**: The JavaScript file containing the key controls for the car "KEYS" used primarily for testing (left, right, forward, reverse).
- **road.js**: The JavaScript file containing the road structure, borders and display for the cars.
- **sensor.js**: The JavaScript file containing the sensors of the car, its drawing and management.
- **network.js**: The JavaScript file containing the neural network levels and feedForward functionality as well as its display.
- **utils.js**: The JavaScript file containing the mathematical logic for the sensors and the reading of intersections and their distance.
- **visualizer.js**: The JavaScript file containing the visualization for the neural network inputs, outputs, weights and biases.

## Screenshots

![Screenshot 2024-06-04 144258](https://github.com/arya-zarei/PersonalProjects/assets/132939550/6730bf84-23ea-403b-b53e-ef32e848ea2a)
![Screenshot 2024-06-04 144313](https://github.com/arya-zarei/PersonalProjects/assets/132939550/af309f16-47e3-4002-9c39-20e0264533d5)
![Screenshot 2024-06-04 144344](https://github.com/arya-zarei/PersonalProjects/assets/132939550/b6ec7fa6-65eb-48ef-8f3f-05af0737ce84)
![Screenshot 2024-06-04 144407](https://github.com/arya-zarei/PersonalProjects/assets/132939550/402a6e9d-948a-439d-bd49-0ed4ebe9ea56)
