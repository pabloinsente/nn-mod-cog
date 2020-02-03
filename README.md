# Introduction to computational models of cognition

## About

The goal of this project is to introduce a selection of **canonical models in cognitive science**. Each section covers the following contents: 

- Historical context
- Theoretical background
- Mathematical definition
- Code implementation
- Example application
- Model limitations

Models are implemented in Python as Jupyter Notebooks tutorials. Although is recommended to follow the tutorials in a linear fashion, these can be used as stand-alone learning material, which comes at the cost of moderate redundancy in both contents and code. 



In the first stage of this project, I focus solely on connectionist models of cognition. In future stages, symbolic and probabilistic models may be added to create a more complete introduction to the subject. 



The tutorials are intended to be used by novices to intermediate level students and/or researchers in cognitive science or related fields. Knowledge of Python is not required, but it is advised to have previous exposure/experience working with some dynamic programming language like R, Julia, Scala, or Matlab. 

## Contents

0. Introduction to Computational Models of Cognition 
1. McCulloch-Pitts Artificial Neuron  (McCulloch & Pitts, 1943)
2. The Perceptron (Rossenblat, 1958) ​
3. The Adaline - Adaptive Linear Neuron (Widrow & Hoff, 1959)
4. Multilayer Perceptron Trained with Backpropagation (Rummelhart, Hinton & Williams, 1986)

**To do**:

5. Elman Network - Recurrent Neural Network (Elman, 1990)
6. Convolutional Neural Network (Lecun et all, 1989)



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
git clone https://github.com/pabloinsente/comp_models_cog_beh

# Step 2: navigate into the directory
cd comp_models_cog_beh/

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
