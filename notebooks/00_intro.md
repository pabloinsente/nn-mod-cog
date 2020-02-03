# Introduction to Computational Models of Cognition 

Understanding human cognition has been one of the main driving forces behind over a century of research in psychology. Mathematical approaches in the study of cognition date from as early as the 19th century, when researchers like [Ernst Heinrich Weber](https://www.britannica.com/biography/Ernst-Heinrich-Weber) developed mathematical models describing the so-called "just-noticeable difference" effect, the process by which humans can perceive differences between objects (Raymond & Rutherford, 2012). However, it was not until the advent of theoretical computer science and digital computers in the 20th century that *computational psychology* rose as a field. Amid the creation of the digital computer, cognitive psychologist developed mathematical formalisms and computational models describing cognition as an information processing phenomena, in close resemblance to how digital computers work. Researchers like [George Miller](https://www.britannica.com/biography/George-A-Miller), [Allen Newell](https://www.britannica.com/biography/Allen-Newell), [Herbert Simon](https://www.britannica.com/biography/Herbert-A-Simon), and [Frank Rosenblatt](https://www.britannica.com/biography/Frank-Rosenblatt), applied computational methods to the study of perception, language, and problem-solving, effectively establishing the field with their collective efforts (Boden, 2008a). The rise of computational psychology offered an alternative approach to the study of the mind, one based on algorithms and computer simulations, rather than on correlations and laboratory-based experimentation, the dominant paradigms according to the, at the time, president of the American Psychological Association [Lee Cronbach](https://www.britannica.com/biography/Lee-Cronbach) (Cronbach, 1957).



Nowadays, in the first quarter of the 21st century, the field enjoys a fast-paced growth in a world where nations and tech-giants race to discover the keys to human and artificial intelligence. In this introduction, I offer a brief overview of the history of computational approaches in cognitive science, along with a few thoughts about its importance and unique perspective in the study of human thinking and behavior. I take a historical perspective, focusing on articulating a high-level narrative of the evolution of the field, rather than in the many individual examples of computational models. For a more exhaustive review, refer to the excellent work of Boden (2008a, 2008b).

## The rise, fall, and resurgence of computational cognitive science 

Alas, computational cognitive science took a long time to establish itself among the main paradigms in the study of the mind and behavior. During the first half of the 20th century, the study of the mind was considered problematic by many, given our incapacity of directly accessing its contents (Skinner, 196; Watson, 1913). Constructs like "consciousness" or "memory", are things that researchers can *indirectly* measure by observing people's behavior, but there is no way to "touch" and "see" a piece of memory in someone else's mind. Those are private events, subjective experiences, inaccessible entities of ethereal constitution. True, at the time, we were able to observe and measure patterns of electrical activity in the brain (Haas, 2003), but finding a direct correspondence between such patterns and a particular chunk of memory was ambiguous at best. This is one of the main reasons why the invention of the digital computer was so impactful for cognitive psychologists. It provided a physical exemplar of something that could do many of the things that the human mind does: arithmetic, logic, storage information, and more. After all, you can *build*, *touch*, and *see* a digital computer. You know exactly where a piece of information is processed and saved in memory. It is hard witnessing a digital computer in action and ignore the resemblance to the inner workings of the human mind. 



There isn't an exact date, event, or piece of research signaling the foundation of computational cognitive science as a field. Yet, there are a few works that had a lasting influence on the development of the field worth mentioning. In 1956, Allen Newell and Herbert Simon introduced a computer program that they called "*The Logic Theorist*" (Newell & Simon, 1956). This program had the remarkable capacity of discovering proofs for theorems in propositional logic, employing *heuristics* considered to be similar to those observed in human problem-solving. Three years later, in 1959, Newell, Shaw, and Simon introduced a new program called GPS-I for "*General Problem Solving I*" (Newell et al., 1959). This time, the authors were more explicit about the resemblance to human cognition, as the GPS-I had the explicit intention of helping to "...understand the information processes that underlie human intellectual, adaptive, and creative abilities" (p. 0). These early works are exemplars of the [*symbolic approach*](#) to artificial intelligence and cognitive science, approach based on the idea that intelligence is essentially the result of *symbol manipulation*, as in the Logic Theorist and GPS-I. 



Newell, Shaw, and Simon's work made remarkably progress on emulating human problem-solving skills, by working under the assumption that the human mind operates by manipulating symbols as in logic and mathematics. We can think of this approach as a *top-down approach* in cognitive science. Form this perspective, the existence of symbolic representations in the mind is taken for granted as a starting point, aiming to explain how such entities operate to generate human thinking and behavior. Contrasting with this line of work, other researchers adopted a perspective that we can qualify as *bottom-up*. This approach drew inspiration from how the nervous system works: via the collective interplay of complex ensembles of neurons. In 1943, [Warren McCulloch](https://www.britannica.com/biography/Warren-S-McCulloch) and [Walter Pitts](https://www.britannica.com/biography/Walter-Pitts) published "*A logical calculus of the ideas immanent in nervous activity*" (McCulloch & Pitts, 1943), introducing what is considered the first computational model of an artificial neuron. Although the McCulloch and Pitts approach were significantly different from the one taken by Newell, Shaw, and Simon, their artificial neuron was able to perform some remarkable feats as well, like emulating the behavior of boolean functions like the AND, OR, and NOR [logic gates](https://en.wikipedia.org/wiki/Logic_gate). 



It is important to highlight the McCulloch and Pitts architecture was modeling a *single neuron*, with multiple binary input values (zeros or ones), and a single binary outcome (zero or one). One of the first and best well-known models utilizing *multiple* neurons to produce an output is the "*Perceptron*", introduced by Frank Rosenblatt in 1958 (Rosenblatt, 1958). One of the main differences between the McCulloch-Pitts' and Rosenblatt's architectures, aside from the number of neurons, was that Rosenblatt's model incorporated a *learning algorithm*, that allowed the network to adjust its parameters to make better predictions over time. The learning part was of crucial importance for later developments in the field because it enabled the possibility of creating artificial systems able to "discover" solutions instead of forcing humans to figure out the solution beforehand, and then building the solution *into* the system. This became part of a larger corpus of thinking in cognitive science known as [*connectionism*](#), which in a nutshell, postulates that human intelligence emerges from the coordinated action of billions of neurons in the brain. This may not sound like a particularly bold statement today, but proposing that complex intelligent behavior can emerge *entirely* from the interplay of *non-intelligent* processing units wasn't entirely obvious at the time.



The works of Newell, Shaw, Simon, McCulloch, Pitts, Rosenblatt, and many others, sparked a great amount of interest in cognitive science and artificial intelligence. Unfortunately, the expectations surrounding the field were too high to be fulfilled. Researchers' claims did not help to temper expectations either. In 1965, Herbert Simon famously predicted that machines would be able to do what humans can do in 10 years, which as we know today, it never happened. The many limitations of the early symbolic and connectionist approaches to the study of the mind became clear, as researchers unsuccessfully attempted to applied such ideas to problems that were trivially easy to solve for humans, like image recognition or language understanding. In 1969, [Marvin Minsky](#) and [Seymour Papert](#) famously demonstrated that Rosenblatt's perceptron wasn't able to learn simple patterns like the [exclusive-or (XOR)](#) rule, which had a devastating effect on the interest on artificial neural networks. The symbolic approach would later receive its fair share of criticism as well. [Douglas Hofstadter](#) (1979) would criticize symbolism by its reliance on a "rigid" notion of concepts and categories inherited from mathematical logic, which he argued could not capture the "fluid" nature of how humans use concepts and categories. Researchers in the connectionist tradition (McClelland et al., 1986) would repeatedly point out to the disconnection between symbolic-cognition and how the brain works (parallelism, noisiness, graceful degradation, etc.). The failure of ["expert-systems"](#) to deliver technological solutions in the industrial sector would damage the symbolic approach reputation as well. In the artificial intelligence community, these failures and unfulfilled promises would cause a series of "winters", for both connectionist and symbolic approaches, where research funds and interest in the field faded away. In the great scheme of things, the cognitive psychology community continued to be dominated by the more traditional correlational and lab-based experimentation approaches, relegating the role of computational modeling to the background. 



In the aftermath of Minsky and Papert's critique, the enthusiasm surrounding connectionist models of cognition almost completely disappeared. Nonetheless, the lack of enthusiasm did not deter all researchers from pursuing the "connectionist way" of thinking. In particular, a group of researchers led by [David Rumelhart](#), [James McClelland](#), and [Geoffrey Hinton](#), the so-called "*Parallel Distributed Processing Research Group*" (PDP research group), would work together exploring the implications of neural network models for the understanding of human intelligence (McClelland et al., 1986). Their work would be crystallized in a two volumes book titled "*Parallel Distributed Processing: Explorations in the Microstructure of Cognition*". The PDP research group work would help to revitalize the interest in neural network models of cognition in the 80s. In particular, the introduction of today's well-known "*backpropagation* *algorithm*" by Rumelhart, Hinton, and Williams, would be the key to overcome Minsky and Papert's criticism. In the book, the trio would tackle Minsky and Papert's challenges one by one, showing how to solve problems like learning the exclusive-or (XOR) rule by combining multiple layers of non-linear processing units, trained with the backpropagation algorithm. 



By the late 80s, the future seemed bright for connectionist models. Nonetheless, they would rapidly collide with the limitations of data availability and computational power. It turned out that training large neural networks to learn anything resembling human-level intelligence, required large amounts of data and computation, that were scarce and expensive at the time. Interest in artificial neural networks would diminish again, yet, a few things were different this time: many of the early limitations were overcome; several models tackling language, memory, and perception were introduced as "proof of concepts"; a method to efficiently train large neural networks had been established; and a new generation of researchers had been trained in this line of thought, researchers who would carry on with the connectionist agenda in the following decades. 



At this point, it may be useful to pause and ponder the relationship between symbolic and connectionist approaches. In the early 50, the fierce competition and mutual criticism weren't nearly as heated as it later became. They also were researchers attempting to combine both approaches. For instance, [Donald Norman](https://en.wikipedia.org/wiki/Donald_Norman) and [Tim Shallice](https://en.wikipedia.org/wiki/Tim_Shallice) (1981) introduced models of attentional control of executive functioning combining symbolic-like planning and connectionist-like pattern recognition. This line of thought has extended until today, whit many researchers attempting to take advantage of the strengths of both approaches (Sun & Alexandre, 2013, Moreno et al., 2019). At present, it is hard to evaluate the role and the future of hybrid approaches, but it is clear that still is an active area of research with many proponents. 



As in most things in society, computational cognitive science also has its own "third way", challenging the dominance of the symbolic and connectionist duality in the field. [*Probabilistic models of cognition*](#) describe a formal framework of human reasoning under uncertainty, grounded on probability theory (Chater et al., 2006, Griffiths et al., 2008). Even though Bernoulli and Bayes did theorize about human reasoning, their reflections were largely ignored by the computational cognitive science community until the late 80s and early 90s. The works of [Roger Shepard](https://en.wikipedia.org/wiki/Roger_Shepard) on generalization theory (1987), [Judea Pearl](#) on belief networks and causality (1988), and [Ulf Grenander](#) on pattern theory (1993), were foundational for the probabilistic perspective. Why probabilistic models took so long to break into the field it is unclear. According to Chater, Tenenbaum, and Yuille (Chater et al., 2006), there are at least three major reasons: the historical focus on architectures over content within those architectures; formal approaches to reason under uncertainty has been historically studied using non-probabilistic approaches, grounded in logic or heuristics; and finally, probabilistic methods have been perceived as too restricted in scope compared to linguistic description, logical representations, and neural network architectures. Although not mentioned by Chater and colleagues, probabilistic modeling entails a fair amount of mathematical formalism and computational resources to be implemented, things that most cognitive scientists did not have access to, either by lack of training or resources. Regardless of the reason for the late arrival, the fact is that the probabilistic perspective was established during the early 90s, grew in popularity over the next few decades, and today has become one the major focus of attention in computational cognitive science. 



In the early 21st century, the availability of computational resources and data has exploded. Researchers in cognitive science and artificial intelligence have greatly benefited from this explosion. One of the best well-known examples of the impact of data and computational availability in the field is "*The ImageNet Large Scale Visual Recognition Challenge*" (ILSVRC; Deng et al., 2009). Since 2010, the ImageNet project runs a large scale competition on object recognition and image classification, where researchers from all over the world compete to produce models as accurate as possible. By 2011, solutions based on models fed with carefully crafted image features were achieving top-5 error rates (i.e., classifications where the correct label was among the 5 most likely answers produced by the model) of ~25%. The surprise came in 2012, when [Alex Krizhevsky](#), [Ilya Sutskever](#), and Geoffrey Hinton (2012), introduced a convolutional neural network model with a top-5 error rate of ~17%. An 8% reduction in the error rate may not sound very impressive, but keep in mind that the field had struggled during decades to reduce the error rate, often with little success. The impact Krizhevsky, Sutskever, and Hinton's were enormous, effectively reviving the interest in artificial neural networks, in both the artificial intelligence and cognitive science communities. 



How does the computational cognitive science field look today? The truth is that the correlational and lab-based experimental approaches still dominate cognitive psychology as a whole, at least by the numbers. However, it is fair to say that in the last couple of years psychology has witnessed an increasing presence interest in computational models. More articles are published every year at major journals and conferences, and more students are being trained in computational methods than ever before. Cognitive scientists still debate about the merits of connectionist and symbolic approaches, but the landscape seems to be more open, with probabilistic and hybrid approaches joining the conversation. It is also fair to say that the prominence of deep learning in artificial intelligence, has greatly contributed to the cause of connectionism, placing this approach as the center of attention, and making it the one producing the highest volume of research. Yet, as history demonstrates, scientists have been remarkably bad at predicting the future of the field, repeatedly overlooking its limitations and miscalculating its potential.

## Why computational ?



According to McClelland (REF): "Models are not intended to capture fully the processes they attempt to elucidate. Rather, they are explorations of ideas about the nature of cognitive processes." (p. 11)

## References



Boden, M. A. (2008a). *Mind as Machine: A History of Cognitive Science*. Clarendon Press.

Boden, M. A. (2008b). An Evaluation of Computational Modeling in Cognitive Science. In *The Cambridge Handbook of Computational Psychology* (pp. 667–683). Cambridge University Press.

Chater, N., Tenenbaum, J. B., & Yuille, A. (2006). Probabilistic models of cognition: Conceptual foundations. *Trends in Cognitive Sciences*, *10*(7), 287–291. https://doi.org/10.1016/j.tics.2006.05.007

Cronbach, L. J. (1957). The two disciplines of scientific psychology. *American Psychologist*, *12*(11), 671.

Deng, J., Dong, W., Socher, R., Li, L.-J., Li, K., & Fei-Fei, L. (2009). *Imagenet: A large-scale hierarchical image database*. 248–255.

Grenander, U. (1993). *General pattern theory: A mathematical study of regular structures Oxford mathematical monographs*. Oxford University Press: Clarendon.

Griffiths, T., Kemp, C., & B Tenenbaum, J. (2008). *Bayesian models of cognition*.

Haas, L. F. (2003). Hans berger (1873–1941), Richard Caton (1842–1926), and electroencephalography. *Journal of Neurology, Neurosurgery & Psychiatry*, *74*(1), 9–9.

Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). *Imagenet classification with deep convolutional neural networks*. 1097–1105.

McCulloch, W. S., & Pitts, W. (1943). A logical calculus of the ideas immanent in nervous activity. *The Bulletin of Mathematical Biophysics*, *5*(4), 115–133.

McClelland, J. L., Rumelhart, D. E., & PDP Research Group. (1986). Parallel distributed processing. *Explorations in the Microstructure of Cognition*, *2*, 216–271.

Moreno, M., Civitarese, D., Brandao, R., & Cerqueira, R. (2019). Effective Integration of Symbolic and Connectionist Approaches through a Hybrid Representation. *ArXiv Preprint ArXiv:1912.08740*.

Newell, A., & Simon, H. (1956). The logic theory machine—A complex information processing system. *IRE Transactions on Information Theory*, *2*(3), 61–79.

Newell, A., Shaw, J. C., & Simon, H. A. (1959). *Report on a general problem solving program*. *256*, 64.

Lansman, M., & Hunt, E. (1981). *Proceedings of the Lake Wilderness Attention Conference. Interim Technical Report, August 1, 1980 through September 30, 1980.*

Pearl, J. (1988). *Probabilistic reasoning in intelligent systems: Networks of plausible inference*. Morgan-Kaufman.

Raymond, F., & Rutherford, A. (2012). The Sensing and Perceiving Mind. In *Pioneers of Psychology: A History* (Fourth ed). Norton.

Rosenblatt, F. (1958). The perceptron: A probabilistic model for information storage and organization in the brain. *Psychological Review*, *65*(6), 386–408. https://doi.org/10.1037/h0042519

Shepard, R. N. (1987). Toward a universal law of generalization for psychological science. *Science*, *237*(4820), 1317–1323.

Skinner, B. F. (1965). *Science and human behavior*. Simon and Schuster.

Sun, R., & Alexandre, F. (2013). *Connectionist-symbolic integration: From unified to hybrid approaches*. Psychology Press.

Watson, J. B. (1913). Psychology as the behaviorist views it. *Psychological Review*, *20*(2), 158.


