(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TCPStackLab = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class TCPModel {
    constructor() { this.reset(); }

    reset() {
      this.client = 'CLOSED';
      this.server = 'LISTEN';
      this.clientISN = 1000;
      this.serverISN = 5000;
      this.sndUna = this.clientISN;
      this.sndNxt = this.clientISN;
      this.rcvNxt = this.clientISN + 1;
      this.serverNext = this.serverISN;
      this.serverExpected = this.clientISN + 1;
      this.serverWindow = 24;
      this.mss = 8;
      this.rto = 3;
      this.clock = 0;
      this.queue = [];
      this.unacked = [];
      this.pending = [];
      this.outOfOrder = new Map();
      this.delivered = '';
      this.dropNext = '';
      this.events = [];
      this.packetId = 0;
      this.log('READY', 'Server is listening. Client has no connection.');
    }

    log(kind, detail, packet) {
      this.events.push({ time: this.clock, kind, detail, packet: packet || null });
      if (this.events.length > 160) this.events.shift();
    }

    packet(from, flags, seq, ack, data = '') {
      return { id: ++this.packetId, from, to: from === 'Client' ? 'Server' : 'Client', flags, seq, ack, data, length: data.length + (flags.includes('SYN') ? 1 : 0) + (flags.includes('FIN') ? 1 : 0) };
    }

    send(packet) {
      this.log('SEND', `${packet.from} → ${packet.to}: ${packet.flags || 'DATA'} seq=${packet.seq} ack=${packet.ack}${packet.data ? ` len=${packet.data.length}` : ''}`, packet);
      const drop = packet.flags === 'DATA' ? 'DATA' : packet.flags === 'ACK' ? 'ACK' : '';
      if (drop && this.dropNext === drop) {
        this.dropNext = '';
        this.log('DROP', `Injected loss: ${packet.flags} #${packet.id} never reached ${packet.to}.`, packet);
      } else {
        this.queue.push(packet);
      }
    }

    connect() {
      if (this.client !== 'CLOSED') return false;
      this.client = 'SYN-SENT';
      this.sndNxt++;
      this.send(this.packet('Client', 'SYN', this.clientISN, 0));
      return true;
    }

    enqueue(text) {
      if (this.client !== 'ESTABLISHED' || this.server !== 'ESTABLISHED') return false;
      const bytes = Array.from(new TextEncoder().encode(String(text)));
      if (!bytes.length || bytes.length > 256) return false;
      for (let i = 0; i < bytes.length; i += this.mss) {
        const chunk = bytes.slice(i, i + this.mss);
        this.pending.push(chunk);
      }
      this.log('APP', `Application queued ${bytes.length} UTF-8 bytes in ${this.pending.length} pending segment(s).`);
      this.fillWindow();
      return true;
    }

    fillWindow() {
      while (this.pending.length && this.sndNxt - this.sndUna + this.pending[0].length <= this.serverWindow) {
        const bytes = this.pending.shift();
        const data = String.fromCharCode(...bytes);
        const packet = this.packet('Client', 'DATA', this.sndNxt, this.serverNext, data);
        this.sndNxt += bytes.length;
        this.unacked.push({ packet, sentAt: this.clock, retries: 0 });
        this.send(packet);
      }
      if (this.pending.length) this.log('WINDOW', `Flow control holds ${this.pending.length} segment(s); advertised receive window is ${this.serverWindow} bytes.`);
    }

    step() {
      this.clock++;
      if (this.queue.length) {
        const packet = this.queue.shift();
        this.log('DELIVER', `Packet #${packet.id} arrived at ${packet.to}.`, packet);
        packet.to === 'Server' ? this.receiveServer(packet) : this.receiveClient(packet);
      } else {
        this.log('IDLE', 'No packet in transit. Timers continue.');
      }
      const oldest = this.unacked[0];
      if (oldest && this.clock - oldest.sentAt >= this.rto) {
        oldest.sentAt = this.clock;
        oldest.retries++;
        this.log('RTO', `Oldest unacknowledged byte ${oldest.packet.seq} timed out; retransmitting.`, oldest.packet);
        this.send(this.packet('Client', 'DATA', oldest.packet.seq, this.serverNext, oldest.packet.data));
      }
      return this.snapshot();
    }

    receiveServer(p) {
      if (p.flags === 'SYN' && this.server === 'LISTEN') {
        this.server = 'SYN-RECEIVED';
        this.serverExpected = p.seq + 1;
        this.serverNext++;
        this.send(this.packet('Server', 'SYN ACK', this.serverISN, this.serverExpected));
      } else if (p.flags === 'ACK' && this.server === 'SYN-RECEIVED' && p.ack === this.serverNext) {
        this.server = 'ESTABLISHED';
        this.log('STATE', 'Server entered ESTABLISHED. Three-way handshake complete.');
      } else if (p.flags === 'DATA' && this.server === 'ESTABLISHED') {
        if (p.seq === this.serverExpected) {
          this.accept(p.data);
          while (this.outOfOrder.has(this.serverExpected)) {
            const next = this.outOfOrder.get(this.serverExpected);
            this.outOfOrder.delete(this.serverExpected);
            this.accept(next);
          }
        } else if (p.seq > this.serverExpected && p.seq + p.data.length <= this.serverExpected + this.serverWindow) {
          this.outOfOrder.set(p.seq, p.data);
          this.log('BUFFER', `Out-of-order bytes at ${p.seq}; cumulative ACK remains ${this.serverExpected}.`);
        } else {
          this.log('IGNORE', `Duplicate or outside-window data at ${p.seq}; next expected byte is ${this.serverExpected}.`);
        }
        this.send(this.packet('Server', 'ACK', this.serverNext, this.serverExpected));
      } else if (p.flags === 'FIN ACK' && this.server === 'ESTABLISHED') {
        this.serverExpected = p.seq + 1;
        this.server = 'CLOSE-WAIT';
        this.send(this.packet('Server', 'ACK', this.serverNext, this.serverExpected));
        this.server = 'LAST-ACK';
        this.send(this.packet('Server', 'FIN ACK', this.serverNext, this.serverExpected));
        this.serverNext++;
      } else if (p.flags === 'ACK' && this.server === 'LAST-ACK' && p.ack === this.serverNext) {
        this.server = 'CLOSED';
        this.log('STATE', 'Server entered CLOSED.');
      }
    }

    accept(data) {
      this.delivered += data;
      this.serverExpected += data.length;
      this.log('APP', `Server delivered ${data.length} contiguous byte(s); next expected=${this.serverExpected}.`);
    }

    receiveClient(p) {
      if (p.flags === 'SYN ACK' && this.client === 'SYN-SENT' && p.ack === this.sndNxt) {
        this.client = 'ESTABLISHED';
        this.sndUna = p.ack;
        this.serverNext = p.seq + 1;
        this.send(this.packet('Client', 'ACK', this.sndNxt, this.serverNext));
        this.log('STATE', 'Client entered ESTABLISHED.');
      } else if (p.flags === 'ACK' && (this.client === 'ESTABLISHED' || this.client === 'FIN-WAIT-1')) {
        if (p.ack > this.sndUna && p.ack <= this.sndNxt) {
          this.sndUna = p.ack;
          this.unacked = this.unacked.filter(item => item.packet.seq + item.packet.length > p.ack);
          this.log('ACK', `Cumulative ACK ${p.ack}; ${this.unacked.length} data segment(s) still outstanding.`);
          this.fillWindow();
        } else if (p.ack === this.sndUna) {
          this.log('DUP ACK', `ACK ${p.ack} repeats; a gap may remain.`);
        }
        if (this.client === 'FIN-WAIT-1' && p.ack === this.sndNxt) this.client = 'FIN-WAIT-2';
      } else if (p.flags === 'FIN ACK' && (this.client === 'FIN-WAIT-1' || this.client === 'FIN-WAIT-2')) {
        this.client = 'TIME-WAIT';
        this.serverNext = p.seq + 1;
        this.send(this.packet('Client', 'ACK', this.sndNxt, this.serverNext));
        this.log('STATE', 'Client entered TIME-WAIT. Use Finish close to expire the teaching timer.');
      }
    }

    close() {
      if (this.client !== 'ESTABLISHED' || this.pending.length || this.unacked.length || this.queue.some(p => p.flags === 'DATA')) return false;
      this.client = 'FIN-WAIT-1';
      this.send(this.packet('Client', 'FIN ACK', this.sndNxt, this.serverNext));
      this.sndNxt++;
      return true;
    }

    finishClose() {
      if (this.client !== 'TIME-WAIT' || this.server !== 'CLOSED') return false;
      this.client = 'CLOSED';
      this.log('STATE', 'Teaching TIME-WAIT expired; connection closed.');
      return true;
    }

    run(max = 80) {
      let n = 0;
      while (n < max && (this.queue.length || this.unacked.length || (this.client === 'SYN-SENT' || this.server === 'SYN-RECEIVED'))) {
        this.step(); n++;
      }
      return n;
    }

    snapshot() {
      return { client: this.client, server: this.server, sndUna: this.sndUna, sndNxt: this.sndNxt, rcvNxt: this.serverExpected, serverNext: this.serverNext, clock: this.clock, queue: this.queue.slice(), unacked: this.unacked.slice(), pending: this.pending.length, delivered: this.delivered, events: this.events.slice() };
    }
  }

  function mount() {
    const app = document.querySelector('[data-tcp-lab]');
    if (!app) return;
    const model = new TCPModel();
    const $ = selector => app.querySelector(selector);
    const controls = { connect: $('[data-action="connect"]'), send: $('[data-action="send"]'), step: $('[data-action="step"]'), run: $('[data-action="run"]'), close: $('[data-action="close"]'), finish: $('[data-action="finish"]'), reset: $('[data-action="reset"]') };
    const message = $('[data-message]');
    const notice = $('[data-notice]');
    function render() {
      const s = model.snapshot();
      $('[data-client-state]').textContent = s.client;
      $('[data-server-state]').textContent = s.server;
      $('[data-snd-una]').textContent = s.sndUna;
      $('[data-snd-nxt]').textContent = s.sndNxt;
      $('[data-rcv-nxt]').textContent = s.rcvNxt;
      $('[data-inflight]').textContent = s.unacked.length;
      $('[data-clock]').textContent = s.clock;
      $('[data-queue]').textContent = s.queue.length;
      $('[data-delivered]').textContent = new TextDecoder().decode(Uint8Array.from(s.delivered, c => c.charCodeAt(0))) || 'No application bytes delivered yet.';
      const feed = $('[data-events]');
      feed.replaceChildren(...s.events.slice(-22).reverse().map(e => {
        const row = document.createElement('li');
        row.className = `event event-${e.kind.toLowerCase().replace(/[^a-z]+/g, '-')}`;
        const time = document.createElement('span'); time.textContent = `T+${e.time}`;
        const kind = document.createElement('strong'); kind.textContent = e.kind;
        const detail = document.createElement('span'); detail.textContent = e.detail;
        row.append(time, kind, detail);
        return row;
      }));
      controls.connect.disabled = s.client !== 'CLOSED';
      controls.send.disabled = s.client !== 'ESTABLISHED' || s.server !== 'ESTABLISHED';
      controls.close.disabled = s.client !== 'ESTABLISHED' || s.pending > 0 || s.unacked.length > 0 || s.queue.some(p => p.flags === 'DATA');
      controls.finish.disabled = s.client !== 'TIME-WAIT' || s.server !== 'CLOSED';
      controls.step.disabled = !s.queue.length && !s.unacked.length && s.client !== 'SYN-SENT';
    }
    app.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      let ok = true;
      switch (button.dataset.action) {
        case 'connect': ok = model.connect(); break;
        case 'send': ok = model.enqueue(message.value); break;
        case 'step': model.step(); break;
        case 'run': model.run(); break;
        case 'close': ok = model.close(); break;
        case 'finish': ok = model.finishClose(); break;
        case 'reset': model.reset(); break;
        case 'drop-data': model.dropNext = 'DATA'; break;
        case 'drop-ack': model.dropNext = 'ACK'; break;
      }
      notice.textContent = !ok ? 'This action is not valid in the current state.' : model.dropNext ? `Next ${model.dropNext} packet will be dropped.` : `Last action: ${button.textContent.trim()}.`;
      render();
    });
    render();
  }

  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', mount);
  return { TCPModel };
});
