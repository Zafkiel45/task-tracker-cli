const { argv } = require('node:process');
const { HandleReadTaskFile } = require('../program.cjs');

async function HandleReadFile() {
    try {
        const isTaskField = argv[2] !== 'configuration-task-field';
        const isHelp = argv[2] !== 'help';
        const isBackup = argv[2] !== 'backup';
        const isNotification = argv[2] !== 'notification';

        if(isTaskField && isHelp && isBackup && isNotification) {
            const task = await HandleReadTaskFile();
            const key = Object.keys(task[0]);
    
            const commandExist = key.find((item) => {
                return item === argv[2];
            });
    
            if(!commandExist) {
                throw new Error(`
                    Você está tentando acessar uma lista que não existe! 
                    Por favor, crie a lista antes para poder acessa-la. 
                    Caso tenha alguma dúvida, digite o comando "help" no 
                    terminal.
                `.trim());
            };
        } 

    } catch (err) {
        console.error('O seguinte erro ocorreu:', err);
        process.exit(1);
    }
};

HandleReadFile();