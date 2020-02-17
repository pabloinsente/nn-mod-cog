# Introduction to canonical neural network models of cognition

## About

The goal of this project is to introduce a selection of **canonical neural network models of cognition**. Each section covers the following contents: 

- Historical and theoretical background
- Mathematical definition
- Code implementation
- Example application
- Model limitations

Models are implemented in Python as Jupyter Notebooks tutorials. Although is recommended to follow the tutorials in a linear fashion, they can be used as stand-alone learning material. 


The tutorials are intended to be used by beginner to intermediate level students and/or researchers in cognitive science or related fields, for instance, advance undergraduates or early-stage graduate students. Knowledge of Python is not required, but it is advised to have previous exposure/experience working with some dynamically typed programming language like R, Julia, Scala, or Matlab. 

## Contents

1. Introduction to Neural Network Models of Cognition 
1. The McCulloch-Pitts Artificial Neuron  (McCulloch & Pitts, 1943)
2. The Perceptron (Rossenblat, 1958)
3. The Adaline (Widrow & Hoff, 1959)
4. The Multilayer Perceptron (Rummelhart, Hinton & Williams, 1986)
5. The Elman Network (Elman, 1990)
6. The Convolutional Neural Network (Lecun et all, 1989)
7. The Rescorla-Wagner Model (Rescorla & Wagner, 1972)



## Requirements

To set up your machine,  you first need this dependencies:

- python==3.7.x
- git= 2.17.1
- pip >= 20.0.2

## Usage

To run the notebooks in your machine, open the terminal and follow these steps:

```bash
# Step 0: check python 3.7.x
python --version
# if necessary, install the required python version
# consider using pyenv to manage and switch python versions safely

# Step 1: get the repository
git clone https://github.com/pabloinsente/nn-mod-cog

# Step 2: navigate into the directory
cd nn-mod-cog/

# Step 3: create virtual environment 
python3 -m venv venv

# Step 4: activate virtual environment 
source venv/bin/activate

# Step 5: check pip version >= 20.0.2
pip --version

# upgrade if necessary with
pip install --upgrade pip

# Step 6: install dependencies
pip install -r requirements.txt

# Step 7: Run Jupyter Lab
jupyter lab ./notebooks.
```
