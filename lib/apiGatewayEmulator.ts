import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import * as path from 'path';

let slsOfflineProcess: ChildProcessWithoutNullStreams;

const finishLoading = () =>
  new Promise<void>((resolve, reject) => {
    slsOfflineProcess.stdout.on('data', (data: any) => {
      const dataString = data.toString();

      if (dataString.includes('Error:')) {
        reject(dataString.trim());
      }

      // if (data.includes('server ready')) {
      //   console.log(data.toString().trim());
      //   console.log(`Serverless: Offline started with PID : ${slsOfflineProcess.pid}`);
      //   resolve('ok');
      // }

      // if (data.includes('Address already in use')) {
      //   reject(data.toString().trim());
      // }
    });

    slsOfflineProcess.stderr.on('data', (data: any) => {
      const dataString = data.toString();
      if (dataString.includes('listening on http://localhost:3002')) {
        // console.log(`Serverless Offline started with PID : ${slsOfflineProcess.pid}`);
        resolve();
      }
    });
  });

export function startAPIGatewayEmulator() {
  const cmdArr = 'offline --stage test'.split(' ');
  slsOfflineProcess = spawn('sls', cmdArr, { shell: true, cwd: path.resolve(__dirname, '../') });

  // Pipe stdout of spawned process to stdout of this process
  // slsOfflineProcess.stdout.pipe(process.stdout);
  // Pipe stderr of spawned process to stderr of this process
  // slsOfflineProcess.stderr.pipe(process.stderr);

  return finishLoading();
}

export function stopAPIGatewayEmulator() {
  slsOfflineProcess.stdin.write('q\n');
  // slsOfflineProcess.stdin.pause();
  slsOfflineProcess.kill();

  // console.log('Serverless Offline stopped');
}
