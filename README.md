## SKM
SKM is a simple and powerful SSH Keys Manager. It helps you to manage your multiple SSH keys easily!
(powered by https://github.com/TimothyYe/skm)

## Installation
```bash
npm install node-skm -g
```
## Usage
### init
```bash
skm init // init a file
```
### ls
```bash
skm ls  // List all ssh keys
```
### create
```bash
skm create [name] -C "xxxx@gmail.com"  // create  a ssh key
```
### use
```bash
skm use [name]  // use  a ssh key
```
### delete
```bash
skm delete [name]  // delete a ssh key
```

### rename
```bash
skm rename [oldName] [newName] // rename a ssh key
```

### registry
```bash
skm registry [path]  // move ssh key File
```
