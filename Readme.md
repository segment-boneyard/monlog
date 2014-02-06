
# monlog

  MongoDB log server supporting [monquery](https://github.com/visionmedia/node-monquery)
  for human-friendly queries, and regular JSON queries. Built with [Koa](http://koajs.com) and requires node 0.11.x.

## Installation

```
$ npm install -g monlog
```

## Usage

```

  Usage: monlog [options]

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

  Search with [monquery](https://github.com/visionmedia/node-monquery) support,
  via the `?query` parameter:

```
GET /?query=level:error+AND+type:upload
```

  Limit responses with `?limit`:

```
GET /?limit=1 level:error
```

  Filter responses with `?filter`:

```
GET /?limit=1&fields=type,level,hostname level:error
```

## GET /stats

 Respond with log stats:

```
{
  "count": 2041999
}
```

## Capping the logs

 To turn your `monlog` "logs" collection into a capped collection
 run the following command in mongo's shell:

```js
db.runCommand({ convertToCapped: 'logs', size: 100000 });
```

# License

  MIT