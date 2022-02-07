const Conf = require('conf')

const conf = new Conf({
  defaults: {
    proxies: {
      ClashX: '127.0.0.1:7890'
    },
    users: {
      ryanmoyo: 'iherewithmyheart@gmail.com'
    }
  }
})

module.exports = conf
