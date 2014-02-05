
# monlog

  MongoDB log server supporting [monquery](https://github.com/visionmedia/node-monquery)
  for human-friendly queries, and regular JSON queries. Built with [Koa](http://koajs.com) and requires node 0.11.x.

## Installation

```
$ npm install -g monlog
```

## Usage

```

  Usage: _monlog [options]

  Options:

    -h, --help      output usage information
    -V, --version   output the version number
    -p, --port <n>  port number [3000]

```

## API

### POST /

  Create a log entry, expects:

  - `timestamp`
  - `hostname`
  - `message`
  - `level`
  - `type`

### GET /

  Search with a JSON or form-data body:

```
$ GET / -d 'level=error&type=upload'
```

### GET /search

  Search with [monquery](https://github.com/visionmedia/node-monquery) support:

```
$ GET /search -d 'level:error AND type:upload'
```

### Limiting responses

  Both search routes support `?limit=N` to limit the number of responses.

### Filtering responses

  Both search routes support `?fields=hostname,type` to limit the response fields.

## Capping the logs

 To turn your `monlog` "logs" collection into a capped collection
 run the following command in mongo's shell:

```js
db.runCommand({ convertToCapped: 'logs', size: 100000 });
```

# License

  MIT