#!/usr/bin/env node

function stepRead(callback) {
  const input = process.stdin;
  const output = process.stdout;
  let line = ''

  function onkeypress(s) {
    output.write(s)
    line += s
    switch(s) {
      case '\r':
        input.pause()
        callback(line)
        break
    }
  }

  emitKeypressEvents(input)
  input.on('keypress', onkeypress)

  input.setRawMode(true)
  input.resume()
}



function emitKeypressEvents(stream) {
  function onData(chunk) {
    g.next(chunk.toString())
  }

  const g = emitKeys(stream)
  g.next()

  stream.on('data', onData)
}

function* emitKeys(stream) {
  while(true) {
    let ch = yield;
    stream.emit('keypress', ch)
  }
}

stepRead((s) => {
  console.log('answer:' + s)
})