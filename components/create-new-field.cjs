async function HandleCatchingTheUserInput() {
    console.log('type "exit" in the terminal to finish this event');

    return new Promise((resolve, rejects) => {
        process.stdin.on('data', (input) => {
    
            const formattedInput = String(input).trim();

            if(/\s/.test(formattedInput)) {
                console.log('the word typed has whitespace!');
                console.log('Please, it use CamelCase');

                rejects('a error occurred with the format of input');
                process.exit(1);

            } else if(formattedInput === 'exit') {
                console.log('exiting...');

                rejects('Exited successufully!');
                process.exit(0);
    
            } else {
                resolve(String(formattedInput));
            };
        }); 
    })
};

async function HandleCreateNewFieldToTasks(JSON_TASK, HandleWriteFile) {
    const taskObject = await JSON_TASK();
    const userInput = await HandleCatchingTheUserInput();

    const keysOfObject = Object.keys(taskObject[0]);
    const checkIfKeyExist = keysOfObject.find(item => item === userInput);

    if(!checkIfKeyExist) {

        taskObject[0][userInput] = [];
        await HandleWriteFile.call(taskObject);

        process.exit(0);
    } else {
        console.error('this field alright exist!');
        process.exit(1);
    };
};

module.exports = {
    HandleCreateNewFieldToTasks,
    HandleCatchingTheUserInput,
}
