#!/usr/bin/env node
const {
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
} = require('kolorist')
const fse = require('fs-extra')
const argv = require('minimist')(process.argv.slice(2))
const prompts = require('prompts')
const execa = require('execa')
const figlet = require('figlet')

const questions = [
  {
    type: 'select',
    name: 'feature',
    message: 'Choose a feature',
    choices: [
      {
        title: 'git proxy',
        description: 'git config --global http.proxy http://127.0.0.1:${port}',
        value: 'git-proxy',
      },
      {
        title: 'git unset proxy',
        description: 'git config --global --unset http.proxy',
        value: 'git-unset-proxy',
      },
    ],
  },
  {
    type: (prev) => (prev == 'git-proxy' ? 'number' : false),
    name: 'port',
    message: 'Input proxy port',
  },
]

async function init() {
  const response = await prompts(questions)
  if (response.feature === 'git-proxy') {
    execa.command(
      `git config --global http.proxy http://127.0.0.1:${response.port}`
    )
    console.log(green('Proxy set successful.'))
  } else if (response.feature === 'git-unset-proxy') {
    execa.command(`git config --global --unset http.proxy`)
    console.log(green('Proxy unset successful.'))
  }
}

figlet('cbgcli', function (e, data) {
  if (e) {
    console.log(red('Something went wrong...'))
    console.dir(e)
    return
  }
  console.log(green(data))
  init().catch((e) => {
    console.error(e)
  })
})
