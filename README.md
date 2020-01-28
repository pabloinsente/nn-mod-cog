# Computational models of cognition and behavior

## About

The goal of this project is to implement a selection of **canonical models in cognitive science**. Theoretical and historical remarks are added along with the mathematical formulation and code implementation. The algorithms follow a step-by-step code implementation with the aim of maximize conceptual clarity. Models are implemented as Jupyter Notebooks tutorials.

## Contents

**Implemented models**:

* The Perceptron (Rossenblat, 1958) ​
* The Adaline - Adaptive Linear Neuron (Widrow and Hoff, 1959)
* Multilayer Perceptron Trained with Backpropagation (Rummelhart, Hinton and Williams, 1986)
*  

**To do**:

* Elman Network - Recurrent Neural Network (Jeffrey Elman, 1990)
* Convolutional Neural Network - Lecun et all (1989)



## Requirements

- Python, version 3.7.6
- Git,  version 2.17.1
- pipenv, version 2018.11.26

You can find instructions to install `Git` [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), and to install `pipenv` [here](https://pipenv.kennethreitz.org/en/latest/install/#installing-pipenv)

## Usage

To run the Notebooks in your machine, open the terminal and follow these steps

```bash
# Step 1: Get the repository
git clone https://github.com/pabloinsente/comp_models_cog_beh
# Step 2: Navigate into the directory
cd comp_models_cog_beh/
# Step 3: Create virtual environment and install dependencies
pipenv install # it may take a few minutes to build and lock the dependencies
# Step 4: Activate virtual environment 
pipenv shell
# Step 5: Run Jupyter Lab
jupyter lab ./notebooks.
```

