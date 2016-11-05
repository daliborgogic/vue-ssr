'use strict'
const fs = require('fs')
const path = require('path')
const layout = fs.readFileSync('./index.html', 'utf8')
const renderer = require('vue-server-renderer').createRenderer()
const express = require('express')
const server = express()

global.Vue = require('vue')

server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

const layoutSections = layout.split('<div id="app"></div>')
const preAppHTML = layoutSections[0]
const postAppHTML = layoutSections[1]

server.get('*', (req, res) => {
  const stream = renderer.renderToStream(require('./assets/app')())

  res.write(preAppHTML)

  stream.on('data', (chunk) => {
    res.write(chunk)
  })

  stream.on('end', () => {
    res.end(postAppHTML)
  })

  stream.on('error', (error) => {
    console.error(error)
    return res
      .status(500)
      .send('Server Error')
  })
})

server.listen(3000, function (error) {
  if (error) throw error
  console.log('Server is running at localhost:3000')
})