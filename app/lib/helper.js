const { Success } = require('../../core/httpException')

function success(msg, errerrorCode) {
    throw new Success(msg, errerrorCode)
}

module.exports = {
    success
}