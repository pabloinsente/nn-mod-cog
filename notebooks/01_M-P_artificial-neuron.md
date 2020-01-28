# The McCulloch-Pitts Artificial Neuron

Alan Turing's formalization of computation as Turing's Machines provided the theoretical and mathematical foundations for modern computer science.  In brief, Turing Machines "...are simple abstract computational devices intended to help investigate the extent and limitations of what can be computed." (https://plato.stanford.edu/entries/turing-machine/). Every modern computer device can be described as a Turing Machine, regardless of the details of its physical implementation (transistors, random access memory, etc.). This foundation provided the inspiration to [Warren McCulloch](https://en.wikipedia.org/wiki/Warren_McCulloch) and [Walter Pitts](https://en.wikipedia.org/wiki/Walter_Pitts), who in 1943, first proposed that neuronal activity in the brain can be represented as computational devices in resemblance to Turing's Machines  ("A Logical Calculus of the Ideas Immanent in Nervous Activity"). 

The crux of McCulloch and Pitts idea, is that given the *all-or-none* character of neural activity, the behavior of the nervous system can be described by means of **propositional logic**. Biological neurons are cells that can be described by three main elements: (1) the **cell body** containing the nucleus and metabolic machinery; (2) an **axon** that transmit information via its synaptic terminals; (3) and **dendrites** that receive inputs from other neurons via synapses. **Figure 2** shows an abstract scheme of the main components of two neurons and their synapses (REF).

<center> <b>Figure 1<b/><center/>

<img src="/home/pablo/Desktop/projects/comp_models_cog_beh/notebooks/images/neuron_synapse.svg" style="zoom:60%;" />



Neurons communicate with each other by passing **electro-chemical signals** from the axon terminals in the pre-synaptic neuron to the dendrites in the post-synaptic neuron. Usually, each neuron connects to hundreds or thousands of neurons. For a neuron to "*fire*", certain *threshold* of electrochemical excitation must be passed. The **combined excitatory and inhibitory input** received by the post-synaptic neuron from the pre-synaptic neurons, determines whether the neuron **passes such threshold and fires**. Is this *firing* or *spiking* behavior that McCulloch and Pitts modeled computationally. Furthermore, by carefully calibrating the magnitude of the inhibitory and excitatory signals passed to a neuron, McCulloch and Pitts where able to emulate the behavior of a few boolean functions or logical gates, like the AND, OR, and NOR.

At this point, you may be thinking "*Hold on, this is a model of function of a single neuron, not of a cognitive process*", and your would be correct. Nevertheless, there a few good reasons why we study the McCulloch and Pitts model as a seminal work in computational models of cognition. This model was the first steeping-stone in the development of many computational models of cognition, like the perceptron and multilayer-preceptrons. Additionally, as we mentioned before, McCulloch and Pitts also showed that such model could be used to represent some boolean functions. Boolean functions are about essentially about logic, and logical reasoning is one of the main topics of study in cognitive sciences. In a way, the McCulloch and Pitts artificial neuron provided one of the first clues about how to study logic and reasoning in humans from a computational perspective.

 

### Mathematical Definition

McCulloch and Pitts developed a mathematical formulation knows as **linear threshold gate**, which describes the activity of a single neuron with two states, firing or not-firing. In its simple form, the mathematical formulation is as follows:



$$
Sum = \sum_{i=1}^NI_iW_i
$$

$$
y(Sum)=
\begin{cases}
1, & \text{if } Sum \geq T \\
0, & \text{otherwise}
\end{cases}
$$



Where  $I_1, I_2,..., I_N$ are input values  $\in\{0,1\}$ ;  $W_1, W_2,..., W_N$ are weights associated with each input $\in\{-1,1\}$ ; $Sum$ is the weighted sum of inputs; and $T$ is a predefined threshold value for the neuron activation (i.e., *firing*).  An input is considered **excitatory** when its contribution to the weighted sum is positive, for instance $I_1*W_1 = 1 * 1 = 1$; whereas an input is considered **inhibitory** when its contribution to the weighted sum is negative, for instance $I_1*W_1 = 1 * -1 = -1$. If the value of $Sum$ is $\geq$ $T$, the neuron fires, otherwise, it does not.  **Figure 2** display a graphical representation of the function.



<center><b>Figure 2</b></center>


<img src="/home/pablo/Desktop/projects/comp_models_cog_beh/notebooks/images/linear_threshold_function_crop.svg" style="zoom:60%;" />



This is known as an *step-function*, where the $y$-axis encode the activation-state of the neuron, and the $Sum$-axis encodes the output of the weighted sum of inputs.



## Code implementation

Implementing the McCulloch-Pitts artificial neuron in code is very simple thanks to the features and libraries of high-level programming languages that we have available today. We can do this in four steps using `Python` and `Numpy`: 

**Step 1**: create a vector of inputs and a vector of weights

  ```Python
import numpy as np
np.random.seed(seed=0)
I = np.random.choice([0,1], 3)# generate random vector I, sampling from {0,1}
W = np.random.choice([-1,1], 3) # generate random vector W, sampling from {-1,1} 
print(f'Input vector:{I}, Weight vector:{W}')
# Input vector:[0 1 1], Weight vector:[-1  1  1]
  ```

**Step 2**: compute the dot product between the vector of inputs and weights

```Python
dot = I @ W
print(f'Dot product: {dot}')
# Dot product: 2
```

**Step 3**: define the threshold activation function...

```Python
def linear_threshold_gate(dot: int, T: float) -> int:
    '''Returns the binary threshold output'''
    if dot >= T:
        return 1
    else:
        return 0
```

**Step 4**: compute the output based on the threshold value

```python
T = 1
activation = linear_threshold_gate(dot, T)
print(f'Activation: {activation}')
# Activation: 1
```

In the previous example, the threshold was set to $T=1$. Since $Sum=2$, the neuron fires. If we increase the threshold for firing to  $T=3$, the neuron will not fire.

```python
T = 3
activation = linear_threshold_gate(dot, T)
print(f'Activation: {activation}')
# Activation: 0
```



## Boolean Algebra Using the McCulloch-Pitts Artificial Neuron

Logical thinking and reasoning are two of the most...



## Limitations of the McCulloch-Pitts Artificial Neuron