class NeuralNetwork {
  constructor(neuronCounts) {
    //neuronCounts is the number of neurons in each layer
    this.levels = [];
    //for each level specify the input and output neuroncounts
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }
  static feedForward(givenInputs, network) {
    //get the ouputs from given inputs and network first level
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    //iterate through remaining levels
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  //mutate network
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    //level has a layer of input and outputs
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount); //each output variable has a bias

    //for each input node we will have an outputCount number of connections
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }
    Level.#randomize(this); //random brain to begin with
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; //value between -1 and 1
        //ex. negative weights on the right side that are negative = turn left
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]; //set all the level inputs to the given inputs
    }
    for (let i = 0; i < level.outputs.length; i++) {
      //calculate sum between the product of the jth input and the weight between the jth input and the ith output
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      //check if sum is greater than bias of this output neuron
      if (sum > level.biases[i]) {
        level.outputs[i] = 1; //turn on output neuron
      } else {
        level.outputs[i] = 0; //turn off output neuron
      }
    }
    return level.outputs;
  }
}
