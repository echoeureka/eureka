const conf = require('./conf')

/** @type {import('prompts').PromptObject[]} */
module.exports = [
  {
    type: 'select',
    name: 'feature',
    message: 'feature',
    choices: [
      { title: 'proxy', value: 'proxy' },
      { title: 'user', value: 'user' }
    ]
  },
  {
    type: (_, value) => (value.feature === 'proxy' ? 'select' : false),
    name: 'action',
    message: 'action',
    choices: [
      { title: 'add', value: 'add' },
      { title: 'delete', value: 'delete' },
      { title: 'config', value: 'config' },
      { title: 'unset', value: 'unset' }
    ]
  },
  {
    type: (_, values) => (values.feature === 'proxy' && values.action !== 'add' ? 'select' : false),
    name: 'choice',
    message: 'choice',
    choices: Object.keys(conf.get('proxies')).map(k => ({
      title: k,
      description: conf.get('proxies')[k],
      value: k
    }))
  },
  {
    type: (_, values) => (values.feature === 'proxy' && values.action === 'add' ? 'text' : false),
    name: 'alias',
    message: 'alias'
  },
  {
    type: (_, values) => (values.feature === 'proxy' && values.action === 'add' ? 'text' : false),
    name: 'proxy',
    message: 'proxy'
  },
  // user
  {
    type: (_, values) => (values.feature === 'user' ? 'select' : false),
    name: 'action',
    message: 'action',
    choices: [
      { title: 'add', value: 'add' },
      { title: 'delete', value: 'delete' },
      { title: 'config', value: 'config' }
    ]
  },
  {
    type: (_, values) => (values.feature === 'user' && values.action !== 'add' ? 'select' : false),
    name: 'choice',
    message: 'choice',
    choices: Object.keys(conf.get('users')).map(k => ({
      title: k,
      description: conf.get('users')[k],
      value: k
    }))
  },
  {
    type: (_, values) => (values.feature === 'user' && values.action === 'add' ? 'text' : false),
    name: 'name',
    message: 'name'
  },
  {
    type: (_, values) => (values.feature === 'user' && values.action === 'add' ? 'text' : false),
    name: 'email',
    message: 'email'
  }
]
