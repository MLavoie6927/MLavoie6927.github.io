const assert = require('node:assert/strict');
const { TCPModel } = require('./stack.js');

function connected() {
  const m = new TCPModel();
  assert.equal(m.connect(), true);
  m.run();
  assert.equal(m.client, 'ESTABLISHED');
  assert.equal(m.server, 'ESTABLISHED');
  assert.equal(m.sndUna, 1001);
  assert.equal(m.serverExpected, 1001);
  return m;
}

{
  const m = connected();
  assert.equal(m.enqueue('abcdefghijklmno'), true);
  assert.equal(m.unacked.length, 2);
  m.run();
  assert.equal(m.delivered, 'abcdefghijklmno');
  assert.equal(m.sndUna, m.sndNxt);
  assert.equal(m.unacked.length, 0);
}

{
  const m = connected();
  m.dropNext = 'DATA';
  m.enqueue('abcdefghijklmnop');
  m.run();
  assert.equal(m.delivered, 'abcdefghijklmnop');
  assert.ok(m.events.some(e => e.kind === 'DROP'));
  assert.ok(m.events.some(e => e.kind === 'RTO'));
  assert.ok(m.events.some(e => e.kind === 'BUFFER'));
  assert.equal(m.sndUna, m.sndNxt);
}

{
  const m = connected();
  m.dropNext = 'ACK';
  m.enqueue('abcdefgh');
  m.run();
  assert.equal(m.delivered, 'abcdefgh');
  assert.equal(m.sndUna, m.sndNxt);
  assert.ok(m.events.some(e => e.kind === 'DROP'));
  assert.equal(m.close(), true);
  m.run();
  assert.equal(m.client, 'TIME-WAIT');
  assert.equal(m.server, 'CLOSED');
  assert.equal(m.finishClose(), true);
  assert.equal(m.client, 'CLOSED');
}

console.log('PASS: handshake, ordered delivery, data/ACK loss recovery, and close');
