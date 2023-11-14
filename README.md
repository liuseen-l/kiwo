<h1 align="center">:penguin: Pmm</h1>
<p align="center">A package.json module manager</p>

<pre align="center">npx <b>pmm</b></pre>

<p align="center">or recursively for <b>monorepos</b></p>

<pre align="center">npx pmm <b>-r</b></pre>

## Usage

By default, `npx pmm` or `npx pmm move` only scans the `package.json` of the current command execution path 
<br>
<p align='center'>
<img src='./screenshots/default.png' width='600'/>
</p>

The `-R` or `-r` option can scan packages in the current command execution path and in subdirectories
<br>
<p align='center'>
<img src='./screenshots/move-r.png' width='600'/>
</p>

Default move dependencies to devdependencies
<br>
<p align='center'>
<img src='./screenshots/move.png' width='600'/>
</p>

The `-D` or `-d` option can move devdependencies to dependencies 
<br>
<p align='center'>
<img src='./screenshots/move-d.png' width='600'/>
</p>

