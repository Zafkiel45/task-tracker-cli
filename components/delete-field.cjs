const { HandleCatchingTheUserInput } = require('./create-new-field.cjs');

async function HandleDeleteField(JSON_TASK, HandleWrite) {

    const currentTasks = await JSON_TASK();
    const userInput = await HandleCatchingTheUserInput();
    const keys = Object.keys(currentTasks[0]);
    const keyMatch = keys.find(item => item === userInput); 

    if(keyMatch && keys.length > 1) {
        delete currentTasks[0][userInput];
        await HandleWrite.call(currentTasks);

        console.log(`field ${userInput} delete successfully`);
        process.exit(0);
    } else {
        console.error(`ops... seems that the field don't exist`);
        console.error(`or this is the last list! Please, don't try delete the last list`);
    };
}

module.exports = {
    HandleDeleteField
}