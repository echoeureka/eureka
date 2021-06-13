#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

// @ts-check
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

const cwd = process.cwd()

const renameFiles = {
  _gitignore: '.gitignore',
  _npmrc: '.npmrc',
}

const gitUser = {
  name: 'cabbage9',
  email: 'iherewithmyheart@gmail.com',
}

/** @type {import('prompts').PromptObject[]} */
const questions = [
  {
    type: 'select',
    name: 'feature',
    message: 'Choose a feature',
    choices: [
      {
        title: green('git proxy'),
        description: green(
          'git config --global http.proxy http://127.0.0.1:${port}'
        ),
        value: 'gitProxy',
      },
      {
        title: blue('git unset proxy'),
        description: blue('git config --global --unset http.proxy'),
        value: 'gitUnsetProxy',
      },
      {
        title: magenta('git config user'),
        description: magenta('git config user.name & user.email'),
        value: 'gitConfigUser',
      },
      {
        title: cyan('create template'),
        description: cyan('Some templates'),
        value: 'createTemplate',
      },
    ],
  },
  {
    type: (prev) => (prev == 'gitProxy' ? 'number' : false),
    name: 'port',
    message: 'Input proxy port',
  },
  {
    type: (prev) => (prev == 'createTemplate' ? 'select' : false),
    name: 'template',
    message: 'Choose a template',
    choices: [
      {
        title: cyan('VitePress'),
        description: cyan('Vitepress template.'),
        value: 'template-vitepress',
      },
    ],
  },
  {
    type: (prev, value, prompt) =>
      value.feature === 'createTemplate' ? 'text' : false,
    name: 'dirname',
    message: 'Please input dir name',
  },
]

async function init() {
  const response = await prompts(questions)
  if (response.feature === 'gitProxy') {
    execa.commandSync(
      `git config --global http.proxy http://127.0.0.1:${response.port}`
    )
    console.log(green('Proxy set successful.'))
  } else if (response.feature === 'gitUnsetProxy') {
    execa.commandSync(`git config --global --unset http.proxy`)
    console.log(green('Proxy unset successful.'))
  } else if (response.feature === 'gitConfigUser') {
    execa.commandSync(`git config user.name ${gitUser.name}`)
    execa.commandSync(`git config user.email ${gitUser.email}`)
    console.log(green('Git config user.name & user.email successful.'))
  } else if (response.feature === 'createTemplate' && response.dirname) {
    fse.copySync(
      `${__dirname}/templates/${response.template}`,
      `${cwd}/${response.dirname}`
    )
    const pkg = require(`${cwd}/${response.dirname}/package.json`)
    pkg.name = response.dirname
    fse.writeFileSync(
      `${cwd}/${response.dirname}/package.json`,
      JSON.stringify(pkg, null, 2)
    )
    console.log(`\nScaffolding project in ${cwd}/${response.dirname}...\n`)
    console.log('Done. Now run:\n')
    console.log(` cd ${response.dirname}`)
    console.log(' yarn')
    console.log(' yarn docs:dev')
  } else console.log(red('There must be something wrong happened!'))
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
