async function HandleCatchingTheUserInput() {
    console.warn(`💡 Digite "exit" para encerrar encerrar o processo`);
    console.log(`🔷 Para criar listas apenas digite um nome de alguma lista que ainda não existe sem espaço entre as palavras.`.trim());
    console.log(`🔷 para deletar listas, basta digitar o nome de alguma lista existente e apertar "Enter".`.trim());

    return new Promise((resolve, rejects) => {
        process.stdin.on('data', (input) => {
    
            const formattedInput = String(input).trim();

            if(/\s/.test(formattedInput)) {
                console.log('O nome do campo não pode ter espaços!');
                console.log('Por favor, use o formato CamelCase');

                rejects('[TIPO DE ERRO]: Sintax');
                process.exit(1);

            } else if(formattedInput === 'exit') {
                console.log('exiting...');

                rejects('🔷 Processo encerrado com sucesso!');
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
        console.log(`A lista ${userInput} foi criada com sucesso!`);
        process.exit(0);
    } else {
        console.error('Este campo já existe! Encerrando o processo.');
        process.exit(1);
    };
};

module.exports = {
    HandleCreateNewFieldToTasks,
    HandleCatchingTheUserInput,
}
