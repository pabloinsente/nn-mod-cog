# RNN notes

## Notes Goodfellow et all:
- for processsing sequential data
- sequences of variable lenght
- parameter sharing allows to apply the model to sequences of different lenght (form) and generalize
- we want to recognize information regardless of the position in the sequence
- mlp need fix-size inputs (problematic for language), and lear weights for each feature separately
- each member of the output depends on (is a function) the previous members of the output

## Notes Elman 1990:
- First proposed by Jordan (1986) 
- hidden unit patterns feedback to themselves
- internal representations reflect prior internal states
- context-dependent and generalization across classes of items
- language expresses as temporal sequences
- two approaches to represent time in neural nets: 
    - explicitly, as an additional dimension (a matrix instead of a vector)
    - implicitly, by the effect it has on processing (next outcome)
- Explicit approach: 
    - in a vector, the first temporal event is the x_1, the second x_2, and son on. A time-series. Hence space (i.e., position in a vector) is encoding time.
    - Problem 1: it needs to be represented for the networ all at once
    - Problem 2: input pattern has to be large enough to represent the longest sequence, and fix on that. Hence, all inputs has be of same lenght.
    - Problem 3: it's hard to distinguish relative temporal position from absolute temporal position. The same pattern, ocurring at slightly different times, would be processed as different in vetor space, when they are the same. 
- Implicit approach:
    - network requiers memory
    - Many ways to do it: Jordan 1986 introduced a good one. The recurrent connections allow the hiden units to see its previous output and use as an input for the current computation. In other words, memory.
    - Modification. (Temporal) Contex units: copy the state of the hidden units, and then serve as input to the hidden unit in the next time-step. It is like a short-term memory storage. They must learn representations that learn both classification and to encode temporal propierties of sequential input. 
- Temporal XOR:
    - feeding input one datapoint at a time. (x_1, x_2) -> (y_3), (x_1, x_2) -> (y_6), and so on. 
    - since prediction is just possible every 2 time steps, the error is going to follow a cyclic behavior. 
    - the network will try to use XOR att all time steps after training, although is going to work only every 2 time steps. 
- Structure in letter sequences:
    - architecture: there were 6 input units, 20 hidden units, 6 output units, and 20 context units
    - learns statistical regularities: the consonants were ordered randomly (high error), but the vowels were not (low error)
    - After each consonant can predict next vowel. At the end of the vowel sequence can't predict next consonant. 
    - Net learns which vowels follow which consinants
    - Net learns how many vowels follow each consonant
    - Net knows a consonant follows, but not which one
- Discovering the notion "word":
    - many linguist at the time assumed that basic language constructs must be innate, otherwise, their language theories do not work. Assumes clear-cut and uncontrovertial definitions of constructs like phoneme, morphene, word, etc. This is not true in practice, May counterexamples.
    - Fundamental concepts in lingistics are fliud. Learning is crucial.
    - Neural nets learn graded representations.
    - Can words emerge from learning the sequential structure of letter (or sound, gesture, etc)sequences?
    - Elman's model learns to parse words, but such criteria relative. This is similar to what happens in child languague acquisition, that sometime treat groups of words as single units. 
    - This is not a full-blown model of language acquisition. Intsead, it shows how a neural net can learn to parse words via extracting patterns from data.
- Discovering lexical classes from word oder:
    - Lexical classes (syntactic structure, etc) can be learned from data. Such classes are implicit in the data.
    - He was demonstrated that a network was able to learn the temporal structure of letter sequences
    - In simulation, input patterns do not contain any information about lexical classes, yet, the somehow learn such structure from the co-ocurrence statistics in the data. 
    - Evaluate similarity structure of learned representations with hierarchical clustering. 
    - The network learn representations that resemble the natural organization of classes, like nouns and verbs, or clusters of animals and objects. 
    - Network learns although it has less info than human in real world context. 
    - Replacing man with zog example 
- Remarks about distributed representations:
    - No limit to the number of concepts to be represented by a finite set of units



## LSTM Notes:

Problem:
- Backpropagation through time (BPTT) or real-time recurrent learning , tend to (1) blow up (very large derivatives) or (2) vanish (very small derivatives)
- temporal evolution of the backpropagated error exponentially depends on the size of the weights
- LSTM uses efficient, gradient-based algorithm for an architecture enforcing constant (thus, neither exploding nor vanishing) error flow through internal states of special units

## Vanishing gradient notes:



 
