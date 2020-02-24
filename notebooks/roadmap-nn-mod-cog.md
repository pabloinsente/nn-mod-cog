# A Roadmap to Neural Network Models of Cognition

In the introductory chapter, I briefly mentioned connectionist models as one of the main approaches in the computational cognitive modeling landscape. Since neural networks models of cognition is the topic that I'll cover in this e-book, I'll expand on the history of this perspective, and also layout a "roadmap" to what comes next in this series.  In particular, this roadmap will help you to understand why we selected these models, why are important to the field, and how they connect to each other from an historical and technical perspective.



There are multiple ways to characterize neural network models. We will cover all the major architectural design traits of each model, like the learning procedure, activation function, and domain application, but paying particular attention to what was novel or unique about them at the time they were introduced to the field. **Table 1** summarize the main characteristics that we will reference in this roadmap.



<center> Table 1 </center>
| Model                 | Number of neurons | Number of layers | Type of Inputs | Type of Outputs | Learning procedure | Differentiable | Activation function   | Domain                      |
| --------------------- | ----------------- | ---------------- | -------------- | --------------- | ------------------ | -------------- | --------------------- | :-------------------------- |
| McCulloch-Pitts       | Single neuron     | Single layer     | Binary         | Binary          | None               | No             | Step                  | Logic                       |
| Perceptron            | Multiple neurons  | Single layer     | Real value     | Binary?         | Delta rule?        | No             | Linear                | Perception?                 |
| Adaline               | Multiple neurons  | Single layer     | Real value     | Real value      | Delta rule         | No             | Linear                | ?                           |
| Multilayer Perceptron | Multiple neurons  | Multiple layers  | Real value     | Real value      | Backpropagation    | Yes            | Linear and Non-linear | ?                           |
| Elman Network         | Multiple neurons  | Multiple layers  | Real value     | Real value      | Backpropagation    | Yes            | Linear and Non-linear | Language, time-dependencies |
| Convolutional Network | Multiple neurons  | Multiple layers  | Real value     | Real value      | Backpropagation    | Yes            | Linear and Non-linear | Vision                      |
| Rescorla-Wagner       | Agents            | Single agent     | Real value     | Real value      | Delta rule         | No             | ?                     | Reward-based learning       |



## The McCulloch-Pitts artificial neuron: single neurons and logic gates

We begin the journey with the McCulloch-Pitts artificial neuron, with is probably the first published neuron-based model of cognition. This model was extremely simple in its architecture, which is perfect as building block for more complex models: a single neuron, with a single layer, where each input has a single link to the output. Only binary inputs and binary outputs are allowed. No learning algorithm was implemented, which means that the problem to be solved has to be figured out by the modeler. As binary systems, the application domain was essentially restricted to logic, although you can easily envision other applications. **Figure 1** displays a graphical representation of the model. 

<center> Figure 1: McCulloch-Pitts Artificial Neuron </center>

![](images/mp-neuron-concept.svg)

Why logic? This is a fair question, considering that nowadays most of the attention in the neural network community seems to be concentrated in problems pertaining language and perception. Back in the day, a common assumption among researchers was that sensorimotor processes like vision or locomotion must be easy to solve, whereas the ones related to reasoning and decision-making should be the really hard ones, the ones worthy of the efforts of the brightest minds. After all, seeing "feels" easy whereas solving logical puzzles "feels" hard (to most people, anyways). Therefore, if you were able to tackle something like logic or chess, you would had essentially solved the hardest thing that you could possibly imagine, so everything else should be easy to solve. If you knock down the first and heaviest domino, the rest should go down easily as a chain reaction. This assumption turned out to be a bad miscalculation. As researchers rapidly learn, vision and locomotion are bafflingly hard to solve, whereas logic and chess where relatively easy to do for artificial systems. This is sometimes refereed as ["Moravec's paradox"]([https://en.wikipedia.org/wiki/Moravec%27s_paradox](https://en.wikipedia.org/wiki/Moravec's_paradox)) (Moravec, 1998), in reference to the phenomena where "high-level" skills like reasoning are relatively easy to implement with computers, whereas "low-level" skills like vision and motor control are almost impossibly hard.



All thing considered, McCulloch and Pitts planted the seeds for the future development of the field.  



Moravec, H. (1998). When will computer hardware match the human brain? *Journal of Evolution and Technology*, *Vol 1*.

## The Perceptron: multiple neurons and learning

A single neuron, with a single layer, and no learning procedures definitively leaves a lot of space for improvement, considering that the human brain has  over 86 billion of neurons hierarchically organized into multiple layers of very complex connectivity patterns (Azevedo et al., 2009). 

Rosenblatt: 
"..the perceptron program is not primarily concerned with the invention of devices for "artificial intelligence", but rather with investigating the physical structures and neurodynamic principles which underlie "natural intelligence". A perceptron is first: and foremost a brain model, not an invention for pattern recognition." (p. vii-viii) / Neurodynamics book

that takes binary inputs, 

Neurons

Layers

Inputs

Outputs

Learning

Differentiable

Activation function

Application Domain



Azevedo, F. A., Carvalho, L. R., Grinberg, L. T., Farfel, J. M., Ferretti, R. E., Leite, R. E., Filho, W. J., Lent, R., & Herculano‐Houzel, S. (2009). Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled‐up primate brain. *Journal of Comparative Neurology*, *513*(5), 532–541.

## The Adaline: linear functions and delta-rule learning

...

## The Multilayer Perceptron: non-linear units and backpropagation

...

## The Elman Network: recurrent networks and time dependencies

...

## The Convolutional Network: convolutions, pooling, and images

...

## The Rescorla-Wagner Model: agents and reward-based learning 

...

## Conclusions

....

## References

...