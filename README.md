# OneWay Inc.
A PDF Reader

This project is built with Next.js + Express.js + Tailwind CSSP

## Good to know

Please run the vscode or command line with admin rights to prevent folder access errors, this is addressed later on in this document

## Installation

Clone from git and navigate to root `pdf-reader` and run the following command `npm i` like so

```bash
git clone https://github.com/gabrielphala/pdf-reader.git
```

Navigate to the pdf-reader root like so

```bash
gabri@gabrielphala MINGW64 ~/Desktop/node/pdf-reader (main)
$ npm i
```

Output should be like so

```bash
up to date, audited 196 packages in 3s

27 packages are looking for funding
  run 'npm fund' for details

found 0 vulnerabilities
```

Express 15 has issues with wildcard routes so downgrade to 14 if necessary like so `npm i express@4.21.2`

```bash
gabri@gabrielphala MINGW64 ~/Desktop/node/pdf-reader (main)
$ npm i express@4.21.2
```

Output should be like below

```bash
up to date, audited 196 packages in 3s

27 packages are looking for funding
  run `npm fund' for details

found 0 vulnerabilities
```

Now that the dependencies are downloaded let's run the project like so

```bash
gabri@gabrielphala MINGW64 ~/Desktop/node/pdf-reader (main)
$ npm run dev
```

The output should be like this

```bash
> pdf-reader@0.1.0 dev
> ts-node --project tsconfig.server.json ./src/api/index.ts

> Ready on http://localhost:3000
```

If for some unknown reason you get an output like this

```bash
[Error: EPERM: operation not permitted, open 'C:\Users\gabri\Desktop\node\pdf-reader\.next\trace'] {
  errno: -4048,
  code: 'EPERM',
  syscall: 'open',
  path: 'C:\\Users\\gabri\\Desktop\\node\\pdf-reader\\.next\\trace'
}

```

Please close the programm you are running this on and re-run it as admin or delete the `.next` folder or the `trace` folder inside the `.next` folder

Otherwise the output should be like so

`Ready on http://localhost:3000`

You can then open the programm on here 

`http://localhost:3000/`