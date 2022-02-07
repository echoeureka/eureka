#! /usr/bin/env node

// @ts-check
const prompts = require('prompts')
const execa = require('execa')
const { lightGreen } = require('kolorist')
const questions = require('./utils/questions')
const conf = require('./utils/conf')

async function init() {
  const response = await prompts(questions)
  if (response.feature === 'proxy') {
    if (response.action === 'add') conf.set(`proxies.${response.alias}`, response.proxy)
    else if (response.action === 'delete') conf.delete(`proxies.${response.choice}`)
    else if (response.action === 'config')
      execa.commandSync(`git config --global http.proxy http://${conf.get(`proxies.${response.choice}`)}`)
    else if (response.action === 'unset') execa.commandSync(`git config --global --unset http.proxy`)
  } else {
    if (response.action === 'add') conf.set(`users.${response.name}`, response.email)
    else if (response.action === 'delete') conf.delete(`users.${response.choice}`)
    else if (response.action === 'config') {
      execa.commandSync(`git config --global user.name ${response.choice}`)
      execa.commandSync(`git config --global user.email ${conf.get(`users.${response.choice}`)}`)
    }
  }
}

init()
  .catch(e => {
    console.error(e)
  })
  .then(() => console.log(lightGreen('  Success')))
