## Perceptron definiton

 # - What is a perceptron
 # - How is used
 # - Math:

## Decision or threshold function 
    # f(x) = 
        # 1 if w.T * x + b > 0
        # 0 otherwise

    ## where:
        # x is a vector of reald-valued features
        # w is a vector of real-valued weights
        # w.T * x is the inner product 
        # b is the bias term
    
## single-layer perceptron

# y = f(x) -> output from the perceptron for a vector x
# D = {(xj, yj),...,(xs, ys)} -> training set of s samples, where:
    # xj -> a n-dimensional input vector
    # yj -> desired output value
 
# y-hat = w0*x0 + w1*x1 + ... + wm*xm = Sum from j=0 to m xj, wj = w.T * x

# Decision boundary 
# make function equal to zero
# everything to the left will be 0
# everything to the right wil be 1

## Perceptron learning algorithm

# wj = wj + delta-wj

# delta-wj = n(yi - y-hati)xji

# where: 
    # n -> learning rate
    # yi -> true class label (or 'target')
    # y-hat-i -> predicted class label
    

## Implementation:
import numpy as np

# generate vector of random weights
def random_weights(X, random_state: int):
    '''create vector of random weights'''
    rand = np.random.RandomState(random_state)
    w = rand.normal(loc=0.0, scale=0.01, size=1 + X.shape[1])
    return w

# compute net values 
def net_input(X, w):
    '''Compute net input as dot product'''
    return np.dot(X, w[1:]) + w[0]

# prediction method
def predict(X, w):
    '''Return class label after unit step'''
    #w = random_weights(X, random_state=1)
    return np.where(net_input(X, w) >= 0.0, 1, -1)

#training loop
def fit(X, y, eta=0.01, n_iter=50):
    '''loop over exemplars and update weights'''
    errors = []
    w = random_weights(X, random_state=1)
    for exemplar in range(n_iter):
        error = 0
        for xi, target in zip(X, y):
            delta = eta * (target - predict(xi, w))
            w[1:] += delta * xi
            w[0] += delta
            error += int(delta != 0.0)
        errors.append(error)
    return w, errors

# create matrix of features
X = np.array([[11, 21, 33],
              [1, 2, 3],
              [12, 24, 37]])

# create targets
y = np.array([1, -1, 1])

# fit and predict values
w, errors = fit(X, y)
y_pred = predict(X, w)
print(w, errors, y_pred)

#TODO: compute score/accuracy
#TODO: implement perceptron with sklearn
#TODO: pass to jupyte notebook
#TODO: add theory/explanations