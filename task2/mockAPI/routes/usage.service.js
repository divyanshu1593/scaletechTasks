import { client } from '../model/database.js'

export async function updateUsageObj(usageObj){
    const cnt = await client.get(usageObj.data.app_id);
    if (cnt == null){
        return {
            isError: true,
            message: "app id not in database"
        }
    }

    usageObj.data.usage.requests = cnt;
    usageObj.data.usage.requests_remaining = usageObj.data.usage.requests_quota - cnt;
}