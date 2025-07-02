process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { client } from "./lib/dynamoClient.ts";
import { ScanCommand, PutCommand, QueryCommand, PutCommandInput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { CreateTableCommand, CreateTableCommandInput, waitUntilTableExists } from '@aws-sdk/client-dynamodb';

const TABLE_NAME = 'TestTable';
const GSI_NAME = 'CategoryIndex';

async function createTable() {
    console.log('Creating table...');

    const params: CreateTableCommandInput = {
        TableName: TABLE_NAME,
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'category', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST',
        GlobalSecondaryIndexes: [
            {
                IndexName: GSI_NAME,
                KeySchema: [
                    { AttributeName: 'category', KeyType: 'HASH' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                }
            }
        ]
    };

    try {
        await client.send(new CreateTableCommand(params));
        console.log('Table creation initiated...');

        // Wait for table to become active
        await waitUntilTableExists({ client, maxWaitTime: 300 }, { TableName: TABLE_NAME });
        console.log('Table created successfully!');
    } catch (error) {
        if (error.name === 'ResourceInUseException') {
            console.log('Table already exists');
        } else {
            throw error;
        }
    }
}

async function writeRecords(count = 1000) {
    console.log(`Writing ${count} records...`);
    const startTime = Date.now();

    const promises: Promise<any>[] = [];
    for (let i = 1; i <= count; i++) {
        const params: PutCommandInput = {
            TableName: TABLE_NAME,
            Item: {
                id: `item-${i}`,
                category: `category-${i % 10}`, // 10 different categories
                name: `Item ${i}`,
                price: Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
            }
        };
        promises.push(client.send(new PutCommand(params)));

        // Batch requests to avoid throttling
        if (promises.length === 25) {
            await Promise.all(promises);
            promises.length = 0;
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }

    const endTime = Date.now();
    console.log(`Write completed in ${endTime - startTime}ms`);
}

async function queryWithoutGSI() {
    console.log('Querying without GSI (scan operation)...');
    const startTime = Date.now();

    // This would require a scan operation to find items by category
    // Scan is inefficient and not recommended for production
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'category = :cat',
        ExpressionAttributeValues: {
            ':cat': 'category-5'
        }
    };

    // Note: Using scan here to simulate querying without GSI
    const result: any = await client.send(new ScanCommand(params));

    const endTime = Date.now();
    console.log(`Query without GSI completed in ${endTime - startTime}ms`);
    console.log(`Found ${result.Items.length} items`);
    return endTime - startTime;
}

async function queryWithGSI() {
    console.log('Querying with GSI...');
    const startTime = Date.now();

    const params = {
        TableName: TABLE_NAME,
        IndexName: GSI_NAME,
        KeyConditionExpression: 'category = :cat',
        ExpressionAttributeValues: {
            ':cat': 'category-5'
        }
    };

    const result: any = await client.send(new QueryCommand(params));

    const endTime = Date.now();
    console.log(`Query with GSI completed in ${endTime - startTime}ms`);
    console.log(`Found ${result.Items.length} items`);
    return endTime - startTime;
}

async function comparePerformance() {
    try {
        // Create table first
        await createTable();

        // Write 1000 records
        await writeRecords(1000);

        // Wait a moment for eventual consistency
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Query without GSI (using scan)
        const timeWithoutGSI = await queryWithoutGSI();

        // Query with GSI
        const timeWithGSI = await queryWithGSI();

        // Compare results
        console.log('\n=== PERFORMANCE COMPARISON ===');
        console.log(`Query without GSI (scan): ${timeWithoutGSI}ms`);
        console.log(`Query with GSI: ${timeWithGSI}ms`);
        console.log(`Performance improvement: ${(timeWithoutGSI / timeWithGSI).toFixed(2)}x faster with GSI`);

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the comparison
comparePerformance();