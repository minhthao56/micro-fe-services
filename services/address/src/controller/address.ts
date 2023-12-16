import { Request, Response } from "express";
import type { PoolClient } from 'pg';
import type { RedisClientType } from 'redis';
import { geocodingService } from '../app/goong';
import {ServiceAddress, DBAddress, CachedAddress, ProxyAddress } from "./proxy";

export async function getAddress(req: Request, res: Response) {
    const db = req.app.get("db") as PoolClient
    const redis = req.app.get("redis") as RedisClientType
    // latlng: '21.0137443130001,105.798346108'
    const {lat, long} = req.query

    try {
        const serviceAddress = new ServiceAddress(geocodingService);
        const dbAddress = new DBAddress(db);
        const cachedAddress = new CachedAddress(redis);
        const proxyAddress = new ProxyAddress(dbAddress, cachedAddress, serviceAddress);
        const result = await proxyAddress.get(`${lat},${long}`);
        res.status(200).json(result);
        
    } catch (error) {
        console.log("Error in getAddress", error);
        res.status(500).json({
            "status": "error",
            "message": JSON.stringify(error)
        });
        
    }

    
}