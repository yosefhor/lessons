const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucket = 'test2for';
const prefix = 'input_with_activity_log_trigger/';
const activityFileKey = 'activity.log'

exports.handler = async (event) => {
    try {
        const records = event.Records;

        const validRecords = records.filter(record => {
            try {
                return record.s3.bucket.name === bucket && decodeURIComponent(record.s3.object.key.replace(/\+/g, " ")).startsWith(prefix)
            } catch (error) {
                return false
            }
        })
        if (validRecords.length === 0) throw new Error('no valid record!');

        let currentLog = '';
        try {
            const getResponse = await S3.getObject({ Bucket: bucket, Key: activityFileKey }).promise();
            currentLog = getResponse.Body.toString('utf-8').trim();
        } catch (error) {
            if (error.code !== 'NoSuchKey') throw error
        }

        const newRecords = validRecords?.map(record => (JSON.stringify({
            bucket: record.s3.bucket.name,
            fileName: decodeURIComponent(record.s3.object.key.replace(/\+/g, " ")).split('/').pop(),
            size: record.s3.object.size,
            uploadTimeStamp: record.eventTime,
        }))).join('\n');

        const fullLog = currentLog ? currentLog + '\n' + newRecords : newRecords;

        await S3.putObject({ Bucket: bucket, Key: activityFileKey, Body: fullLog }).promise()

        console.log('activity updated successfully');

    } catch (error) {
        console.error(`Error: ${error}`);
    }
}