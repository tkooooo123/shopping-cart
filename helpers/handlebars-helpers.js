const dayjs = require('dayjs') 
module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  currentYear: () => dayjs().year()
}
