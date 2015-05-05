"use strict";

module.exports = process.env.GRUNTPROCESS_COV ? require('../../lib-cov') : require('../../lib');
