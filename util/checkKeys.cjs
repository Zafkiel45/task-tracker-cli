const { argv } = require('node:process');
const { HandleReadTaskFile } = require('../program.cjs');

async function HandleReadFile() {
    try {
        const task = await HandleReadTaskFile();
        const key = Object.keys(task[0]);

        const commandExist = key.find((item) => {
            return item === argv[2];
        });

        if(!commandExist) {
            throw new Error(`the first "list command" doesn't exist`);
        };

    } catch (err) {
        console.error('occurrs a error:', err);
        process.exit(1);
    }
};

HandleReadFile();