import { Pool } from "pg";

const databases = JSON.parse(process.env.DATABASES!);
const connections: Record<string, Pool> = {};

for (const db of databases) {
    connections[db.name] = new Pool({ connectionString: db.url });
}

export function getShard(userId: string) {
    const shardCount = databases.length;
    const shardNumber = parseInt(userId.replace(/-/g, ""), 16) % shardCount;
    console.log(shardNumber,"shardNumbershardNumber", databases)
    return databases[shardNumber].name;
}

export function getDb(userId: string) {
    const shard = getShard(userId);
    console.log(userId,"userIduserId")
    return connections[shard];
}
