import type { PoolClient } from 'pg';
import type { RedisClientType } from 'redis';
import type { GeocodeGoongResponse } from "schema/booking/GeocodeGoongResponse"
import type { ProxyAddressType } from "schema/address/addess"

export interface AddressLib {
    get(key: string,): Promise<ProxyAddressType>;
}


export class ServiceAddress implements AddressLib {
    private service: any;
    
    constructor(service: any) {
        this.service = service;
    }

    async get(key: string){
        const res =  await this.service.reverseGeocode({latlng: key}).send();
        const body = JSON.parse(res.rawBody) as GeocodeGoongResponse;
        const address = body?.results?.[0];
        const formatted_address = address?.formatted_address || "";
        const display_name = address?.name || "";
        return {formatted_address, display_name};
    }
}


export class DBAddress implements AddressLib {
    private db: PoolClient;
    constructor(db: PoolClient) {
        this.db = db;
    }
    async get(key: string) {
        const latLog = key.split(",");
        const lat = latLog[0];
        const long = latLog[1];
        const result = await this.db.query<ProxyAddressType>(`SELECT formatted_address, display_name FROM addresses WHERE lat = $1 AND long = $2`, [lat, long]);
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return { formatted_address: "", display_name: "" };
    }
}


export class CachedAddress implements AddressLib {
    private redis: RedisClientType;
    constructor(redis: RedisClientType,) {
        this.redis = redis;
    }
    async get(key: string) {
        const res = await this.redis.get(key);
        if (res) {
            return JSON.parse(res) as ProxyAddressType;
        }
        return { formatted_address: "", display_name: "" };
    }
    async set(key: string, value: ProxyAddressType) {
        await this.redis.set(key, JSON.stringify(value));
    }
}

export class ProxyAddress implements AddressLib {
    private db: AddressLib;
    private redis: CachedAddress;
    private service: AddressLib;
    constructor(db: AddressLib, redis: CachedAddress, service: AddressLib) {
        this.db = db;
        this.redis = redis;
        this.service = service;
    }
    async get(key: string) {
        const cached = await this.redis.get(key);
        if (cached.display_name !== "" || cached.formatted_address !== "") {
            return cached;
        }
        const db = await this.db.get(key);
        if (db.display_name !== "" || db.formatted_address !== "") {
            await this.redis.set(key, db);
            return db;
        }
        const service = await this.service.get(key);
        if (service.display_name !== "" || service.formatted_address !== "") {
            await this.redis.set(key, service);
            return service;
        }
        return { formatted_address: "", display_name: "" };
    }
}