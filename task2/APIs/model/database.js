import { createClient } from 'redis';

export const client = createClient({
    socket: {
        reconnectStrategy: retryNum => {
            if (retryNum == 0){
                startTime = Date.now();
            }
            
            if (Date.now() > startTime + 1000 * 5){
                if (!flag){
                    temp = retryNum;
                    flag = true;
                }

                if (retryNum - temp < 7) return 1000 * 2 ** (retryNum - temp);
                return 1000 * 60;
            }

            return 0;
        }
    }
});
client.on('error', err => {
    console.log(err);
});
await client.connect();