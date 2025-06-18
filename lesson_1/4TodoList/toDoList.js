import fs from 'fs';

const jsonFile = 'todoList.json';
const fn = process.argv[2];
const task = process.argv.slice(3).join(' ');

function checkFileExist() {
    return fs.existsSync('todoList.json');
}

async function add(task) {
    const fileExist = checkFileExist();
    if (!fileExist) {
        await fs.promises.writeFile(jsonFile, JSON.stringify([task]), 'utf8')
    } else {
        const tasks = await list()
        tasks.push(task)
        await fs.promises.writeFile(jsonFile, JSON.stringify(tasks), 'utf8')
    }
}

async function remove(task) {
    const prevTasks = await list()
    const updatedTasks = prevTasks.filter(t => t !== task)
    await fs.promises.writeFile(jsonFile, JSON.stringify(updatedTasks), 'utf8')
}

async function list() {
    const response = await fs.promises.readFile(jsonFile, 'utf8');
    const parsed = JSON.parse(response)
    console.log(parsed);
}

// const handleError = (errMessage) => {
//     console.log(`Error: ${errMessage}`);
// }
fn === 'add' ? add(task) : fn === 'remove' ? remove(task) : list()