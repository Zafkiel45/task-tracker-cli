const { argv } = require('node:process');
const { HandleReadTaskFile } = require('../program.cjs');

async function HandleReadFile() {
    try {
        if(argv[2] !== 'configuration-task-field' && argv[2] !== 'help') {
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
                `);
            };
        } 

    } catch (err) {
        console.error('O seguinte erro ocorreu:', err);
        process.exit(1);
    }
};

HandleReadFile();