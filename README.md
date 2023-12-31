<h1 align="center">⛄ Kiwo</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/kiwo" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/v/kiwo" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/kiwo" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/dt/kiwo" alt="NPM Downloads" /></a>
  <a href="https://www.npmjs.com/package/kiwo" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/node/v/kiwo" alt="Node Compatibility" /></a>
</p>
<p align="center">A package.json module manager</p>

<pre align="center">npx <b>kiwo</b></pre>

<p align="center">or recursively for <b>monorepos</b></p>

<pre align="center">npx kiwo <b>-r</b></pre>


## 📦 Installation

```

# kiwo 

pnpm install kiwo -D

```

## 🦄 Usage

By default, `npx kiwo` or `npx kiwo move` only scans the `package.json` of the current command execution path 
<br>
<p align='center'>
<img src='./screenshots/default.png' width='600'/>
</p>

The `-R` or `-r` option can scan packages in the current command execution path and in subdirectories
<br>
<p align='center'>
<img src='./screenshots/move-r.png' width='600'/>
</p>

Once we have selected the package we want to work on, we can choose how to move the dependencies, which by default is to move the dependencies 
to the devdependencies
<br>
<p align='center'>
<img src='./screenshots/move.png' width='400'/>
</p>

The `-D` or `-d` option can choose move devdependencies to dependencies 
<br>
<p align='center'>
<img src='./screenshots/move-d.png' width='400'/>
</p>

