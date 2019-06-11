import net from 'net';
import chalk from 'chalk';

const initSocketPromise = (serverID, host, port, socketErrorCallback) => {
  const client = new net.Socket();

  client.on('data', data => {
    console.error(chalk`{cyan 📡 ${serverID} received} ${data.toString('hex')}`);
    client.destroy(); // kill client after server's response
  });

  client.on('close', hadError => {
    console.error(
      chalk`{cyan 📡 ${serverID} closed, hadError: }{white ${JSON.stringify(hadError)}}`
    );
  });

  return new Promise((resolve, reject) => {
    client.on('error', err => {
      console.error(
        chalk`{cyan 📡 ${serverID} error} connecting to {white ${host}} on port {white ${port}} : {white ${err}}`
      );
      socketErrorCallback(serverID, err);
      reject(err);
    });

    client.connect(port, host, () => {
      console.log(chalk`{cyan 📡${serverID} connected} to {white ${host}} on port {white ${port}}`);
      resolve(client);
    });
  });
};

export const initiateConnection = (serverConfigs, socketErrorCallback) => {
  return Promise.all(
    Object.entries(serverConfigs).map(async ([serverID, { host, opcPort }]) =>
      Object.assign(serverConfigs[serverID], {
        client: await initSocketPromise(serverID, host, opcPort, socketErrorCallback)
      })
    )
  ).catch(err => err);
};
