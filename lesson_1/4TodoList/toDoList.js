import fs from 'fs';

const jsonFile = 'todoList.json'

async function checkFileExist () {
    return fs.existsSync('todoList.json');
}

async function add(task) {
    const fileExist = checkFileExist();
    if (!fileExist) await fs.promises.writeFile(jsonFile, {}, 'utf8')
    await fs.promises.appendFile(jsonFile, task)
}

function remove(task) {

}

async function list() {
    const response = await fs.promises.readFile(jsonFile, 'utf8');
    const parsed = await JSON.parse(response)
    return parsed
}

const handleError = (errMessage) => {
    console.log(`Error: ${errMessage}`);
}
export{add, remove, list}