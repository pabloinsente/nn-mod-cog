## Rumelhart notes

Rumelhart read about perceptrons in grad school, in 1963. He was doind  mathematical psychology. Perceptrons were not part of it.
1969, Rumelhart thinks that math psych is too narrow, only close form solutions to problems. He start to think on computer simulations 
1970, Rumelhart chose "Perceptrons" as a book for a course
1981, the PDP group is formed as a Rumelhart's and McClelland's idea to tackle the issue of neural nets in psychology
	a ton of people jumped in, included Hinton. 
	McClelland and Rumelhart first tried to train a multilayer net with sigmoid units, so they pretended they were linear,
	as in Widrow and Hoff model. THIS is the actual origin of the backpropagation idea.
	The riddle: they wanted the non-linearities of the perceptron, but with the training algorithm of the ADALINE. The problem, is the
	non-linear units technically can't be trained with gradient descent, and they know how to put together many ADALINES, but given
	that the output of that is still a linear function, you may as well have a single layer.

	- They knew  how to train systems with many layers, like the ADALINE
	- But, that only worked with linear units
	- If the problem can be solved with linear units, you may as well not have more layers

Rumelhart about backpropagation: backprop was discovered multiple times. Their contribution was to actually build something with it.


## Hinton notes
1982, Hinton learned about Rumelhart's backprop idea. He thought it was a bad idea, it won't work. Problem of weight symmetry and local min
Hinton continue to work with Boltzmann machines. It get frustrated (net goes sour, local min, etc). Decides to implement Rumelhart's backprop idea. 
Neural nets trained with backprop turned out to work way better that Boltzmann machines.
When Hinton was working on neural nets at CMU, Peter Brown, a Hinton's grad student,told him about hidden Markov models. 
He seemed to like the idea of "hidden", so he decided to name the "intermediate" layers as "hidden layers".
 Yes sir, hidden layers in neural inherited its name from hidden Markov models.  
