
module.exports = {
  servers: {
    one: {
      host: '13.233.93.182',
      username: 'ubuntu',
      pem:'~/wm.pem'
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },
meteor: {
    name: 'writersmelon',
    path: '../../writersmelon',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://13.233.93.182',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    dockerImage: 'abernix/meteord:node-8.4.0-base',
    deployCheckWaitTime: 60,
     enableUploadProgressBar: true,
  },
mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};