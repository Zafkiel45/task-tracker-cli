const { HandleCatchingTheUserInput } = require('./create-new-field.cjs');

async function HandleDeleteField(JSON_TASK, HandleWrite) {
    try {
        const currentTasks = await JSON_TASK();
        const userInput = await HandleCatchingTheUserInput();
        const keys = Object.keys(currentTasks[0]);
        const keyMatch = keys.find(item => item === userInput); 
    
        if(keyMatch && keys.length > 1) {
            delete currentTasks[0][userInput];
            await HandleWrite.call(currentTasks);
    
            console.log(`✅ Lista ${userInput} deletada com sucesso!`);
            process.exit(0);
        } else {
            console.log(`❗ Ops, parece que a lista não existe!`);
            console.log(`❗ Ou você está tentando deletar a última lista restante!`);
            
            throw new Error(`
                ❗ Por favor, verique se a lista existe ou se é a última lista 
                restante e tente novamente    
            `.trim());
        };
        
    } catch (err) {
        console.error(`Um erro ocorreu:`, err);
    }

}

module.exports = {
    HandleDeleteField
}