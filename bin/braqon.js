#!/usr/bin/env node
// `npx braqon`: BRAQON's business card for the terminal.
// Zero dependencies, no network, no telemetry. It only prints.
'use strict';

const VERSION = require('../package.json').version;
const args = process.argv.slice(2);

if (args.includes('-v') || args.includes('--version')) {
  console.log(VERSION);
  process.exit(0);
}
if (args.includes('-h') || args.includes('--help')) {
  console.log('Usage: npx braqon [--no-color] [--version]');
  process.exit(0);
}

const out = process.stdout;
const color =
  out.isTTY && !('NO_COLOR' in process.env) && !args.includes('--no-color') && process.env.TERM !== 'dumb';
const truecolor = /truecolor|24bit/i.test(process.env.COLORTERM || '');
const cols = out.columns || 80;

// Brand palette: soft cyan -> accent -> deep blue
const STOPS = [[0x90, 0xe0, 0xef], [0x00, 0xb4, 0xd8], [0x00, 0x77, 0xb6]];
const XTERM = [117, 81, 45, 39, 38, 32, 31, 25]; // 256-color fallback for Terminal.app

const esc = (code) => (s) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = esc('1');
const dim = esc('2');
const accent = esc(truecolor ? '38;2;0;180;216' : '38;5;38');

function gradientAt(t) {
  if (!truecolor) return `38;5;${XTERM[Math.min(XTERM.length - 1, Math.floor(t * XTERM.length))]}`;
  const seg = t < 0.5 ? 0 : 1;
  const k = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const [a, b] = [STOPS[seg], STOPS[seg + 1]];
  const rgb = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `38;2;${rgb.join(';')}`;
}

function paint(line, width) {
  if (!color) return line;
  return [...line].map((ch, i) => (ch === ' ' ? ch : `\x1b[${gradientAt(i / width)}m${ch}`)).join('') + '\x1b[0m';
}

// "ANSI Shadow" letters, assembled per glyph so the columns always line up
const GLYPHS = {
  B: ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔══██╗', '██████╔╝', '╚═════╝ '],
  R: ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔══██╗', '██║  ██║', '╚═╝  ╚═╝'],
  A: [' █████╗ ', '██╔══██╗', '███████║', '██╔══██║', '██║  ██║', '╚═╝  ╚═╝'],
  Q: [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║▄▄ ██║', '╚██████╔╝', ' ╚══▀▀═╝ '],
  O: [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  N: ['███╗   ██╗', '████╗  ██║', '██╔██╗ ██║', '██║╚██╗██║', '██║ ╚████║', '╚═╝  ╚═══╝'],
};
const logo = GLYPHS.B.map((_, row) => [...'BRAQON'].map((l) => GLYPHS[l][row]).join(''));
const logoWidth = [...logo[0]].length;

const LINKS = [
  ['web', 'https://braqon.dev'],
  ['github', 'https://github.com/braqon'],
  ['org', 'https://github.com/braqon-dev'],
  ['npm', 'https://www.npmjs.com/org/braqon'],
  ['x', 'https://x.com/braqondev'],
  ['linkedin', 'https://linkedin.com/in/braian-quintian'],
  ['youtube', 'https://youtube.com/@braqon'],
  ['email', 'hola@braqon.dev'],
];

const body = [
  '',
  `${bold('Braian Quintian')}  ${dim('·')}  ${accent('@braqon')}`,
  `Founder @ ${bold('BRAQON')} ${dim('·')} CTO @ 88Pay`,
  dim('open-source POS & developer tools from LATAM'),
  '',
  ...LINKS.map(([k, v]) => `${dim(k.padEnd(9))} ${v}`),
  '',
  `${accent('$')} npm i express-version-api   ${dim('# versioned Express APIs')}`,
  '',
  dim('BRAQON™ · hecho en Colombia'),
  '',
];

const visible = (s) => [...s.replace(/\x1b\[[0-9;]*m/g, '')].length;
const inner = Math.max(...body.map(visible)) + 4;
const box = [
  dim(`╭${'─'.repeat(inner)}╮`),
  ...body.map((l) => `${dim('│')}  ${l}${' '.repeat(inner - 2 - visible(l))}${dim('│')}`),
  dim(`╰${'─'.repeat(inner)}╯`),
];

const lines = [''];
if (cols >= logoWidth + 4) lines.push(...logo.map((l) => '  ' + paint(l, logoWidth)), '');
else lines.push('  ' + bold(accent('BRAQON')), '');
if (cols >= inner + 4) lines.push(...box.map((l) => '  ' + l));
else lines.push(...body.map((l) => '  ' + l));
lines.push('');
out.write(lines.join('\n') + '\n');
