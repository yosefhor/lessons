const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const TARGET_BUCKET = "test1for";
const TARGET_FOLDER = "input_with_trigger/"; // סיום ב־/ כי זה תיקייה
const TEMP_FOLDER = "for_temp_files/"; // גם פה

exports.handler = async (event) => {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    // רק אם הקובץ נמצא בתיקייה המתאימה
    if (!key.startsWith(TARGET_FOLDER)) {
        console.log(`דילוג על קובץ מחוץ לתיקייה: ${key}`);
        return;
    }

    try {
        // 1. קריאת הקובץ
        const getResult = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        const content = getResult.Body.toString('utf-8');

        // 2. שינוי תוכן (כאן לדוגמה לאותיות גדולות)
        const modifiedContent = content.toUpperCase();

        // 3. יצירת מפתח זמני עם אותו שם קובץ בתיקיית טמפ
        const fileName = key.substring(TARGET_FOLDER.length); // קח רק את שם הקובץ בלי התיקייה
        const tempKey = TEMP_FOLDER + fileName;

        // 4. כתיבה לקובץ זמני (לא מפעיל את הטריגר מחדש)
        await s3.putObject({
            Bucket: TARGET_BUCKET,
            Key: tempKey,
            Body: modifiedContent,
        }).promise();

        // 5. העתקה חזרה למיקום המקורי
        await s3.copyObject({
            Bucket: TARGET_BUCKET,
            CopySource: `${TARGET_BUCKET}/${tempKey}`,
            Key: key,
        }).promise();

        // 6. מחיקת קובץ זמני
        await s3.deleteObject({
            Bucket: TARGET_BUCKET,
            Key: tempKey,
        }).promise();

        console.log(`הקובץ ${key} עודכן בהצלחה`);

    } catch (error) {
        console.error("שגיאה:", error);
        throw error;
    }
};
