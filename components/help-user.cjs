const commands = {
    "add": "Adiciona tarefas",
    "update": "Atualiza o nome das tarefas",
    "delete-task": "Apagar uma tarefa individual",
    "type": "define o tipo da tarefa",
    "list": "lista todas as tarefas",
    "mark-todo":"Marca uma tarefa como 'todo'",
    "mark-done": "Marca uma tarefa como 'done'",
    "mark-in-progress": "Marca uma tarefa como 'in-progress'",
    "delete-all": "deleta todas as tarefas de uma lista",
    "mark-all-done": "marca todas as tarefas como 'done'",
    "mark-all-todo": "marca todas as tarefas como 'todo'",
    "mark-all-in-progress": "marca todas as tarefas como 'in-progress'",
    "date-conclusion": "Define a data de conclusão para uma tarefa",
    "date-conclusion-all": "Define uma data de conclusão para todas as tarefas da lista",
    "add-field": "Usado para adicionar um novo campo",
    "delete-field": "Usado para remover um campo",
    "type-all": "Usado para definir um tipo para todas as tarefas da lista",
    "configuration-task-field": "Usado para alterar a estrutura geral da aplicação, adicionando ou apagando listas",
};

function HandleHelp() {
    console.log('---------------------------')
    console.log(`⚠️ Para informalções detalhadas sobre cada comando, visite:"`);
    console.log(`https://github.com/Zafkiel45/task-tracker-cli`);
    console.log('---------------------------')

    console.log(`=========== Todos os Comandos =======`);

    for(element in commands) {
        console.log('\x1b[32m%s\x1b[0m %s',`comando: 🟦 ${element}:`, `${commands[element]}`);
    };
};

module.exports = {
    HandleHelp,
}


