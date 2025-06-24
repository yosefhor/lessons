export const handler = async (event) => {
    // TODO implement
    const userId = event.pathParameters?.userid;
if (!userId || !/^\d{6}$/.test(userId)) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"message": "error occoured"}),
        };
    } else {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"message": "Success"}),
        };
    }
};
