exports.handler = (event) => {
    try {
        const records = event.Records;
        records?.forEach(record => {
            const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
            const keySize = record.s3.object.size;
            const eventType = record.eventName;
            console.log(`Event details: Bucket: ${bucket}, File path: ${key}, File size: ${keySize}, Event type: ${eventType}`);
        });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}