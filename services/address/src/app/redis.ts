import { createClient } from 'redis';


export const connectRedis = async () => {
    const client = createClient({
        username: 'default',
        password: '',
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: 6379,
        }
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect()
    client.set('result', 'connected');
    const res = await client.get('result');
    console.log('Redis Client: ', res);
    return client;
}