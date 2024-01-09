import { client } from '../model/database.js'

export async function updateRequestCount(app_id){
    const cnt = await client.get(app_id);
    if (cnt == null){
        return {
            isError: true,
            message: "app id not present in database"
        }
    }

    await client.incr(app_id);
}