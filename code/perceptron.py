## Perceptron ##

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
              [12, 24, 37],
              [1, 2, 3]])

# create targets
y = np.array([1, -1, 1, -1])

# fit and predict values
w, errors = fit(X, y)
y_pred = predict(X, w)
print(w, errors, y_pred)

# plot error curve 
import matplotlib.pyplot as plt 

def plot_errors(errors):
    step = np.arange(0, len(errors))
    fig = plt.figure()
    ax = plt.axes()
    ax.plot(step, errors)
    plt.show()

plot_errors(errors)

# try perceptron with a sklearn dataset
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()

# fit and predict values
w, errors = fit(data.data, data.target, n_iter=1000)
y_pred = predict(data.data, w)

print(plot_errors(errors))

