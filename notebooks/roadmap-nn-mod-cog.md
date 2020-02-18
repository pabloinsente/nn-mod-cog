# A Roadmap to Neural Network Models of Cognition

In the introductory chapter, I briefly mentioned connectionist models as one of the main approaches in the computational cognitive modeling landscape. Since neural networks models of cognition is the topic that I'll cover in this e-book, I'll expand on the history of this perspective, and also layout a "roadmap" to what comes next in this series.  In particular, this roadmap will help you to understand why we selected these models, why are important to the field, and how they connect to each other from an historical and technical perspective.



There are multiple ways to characterize neural network models. We will cover all the major architectural design traits of each model, like the learning procedure, activation function, and domain application, but paying particular attention to what was novel or unique about them at the time they were introduced to the field. **Table 1** summarize the main characteristics that we will reference in this roadmap.



<center> Table 1 </center>

| Model                 | Number of neurons | Number of layers | Type of Inputs | Type of Outputs | Learning procedure | Differentiable | Activation function   | Domain                      |
| --------------------- | ----------------- | ---------------- | -------------- | --------------- | ------------------ | -------------- | --------------------- | :-------------------------- |
| McCulloch-Pitts       | Single neuron     | Single layer     | Binary         | Binary          | None               | No             | Step                  | Logic                       |
| Perceptron            | Multiple neurons  | Single layer     | Real value     | Binary?         | Delta rule?        | No             | Linear                | Perception                  |
| Adaline               | Multiple neurons  | Single layer     | Real value     | Real value      | Delta rule         | No             | Linear                | ?                           |
| Multilayer Perceptron | Multiple neurons  | Multiple layers  | Real value     | Real value      | Backpropagation    | Yes            | Linear and Non-linear | ?                           |
| Elman Network         | Multiple neurons  | Multiple layers  | Real value     | Real value      | Backpropagation    | Yes            | Linear and Non-linear | Language, time-dependencies |
| Convolutional Network | Multiple neurons  | Multiple layers  | Real value     | Real value      | Backpropagation    | Yes            | Linear and Non-linear | Vision                      |
| Rescorla-Wagner       | Agents            | Single agent     | Real value     | Real value      | Delta rule         | No             | ?                     | Reward-based learning       |



## The McCulloch-Pitts artificial neuron: single neurons and logic gates

...

## The Perceptron: multiple neurons and learning

...

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