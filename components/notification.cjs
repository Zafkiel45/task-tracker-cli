async function HandleSearchNotifications(JSON,HandleWrite, HandleGetDate) {
    try {
        const currentTasks = await JSON();
        const currentDate  = HandleGetDate();
        const currentKeys  = Object.keys(currentTasks[0]);
        const lengthOfKeys = currentKeys.length - 1;

        currentTasks[1] = []; 

        function HandleSearchTasks(arr = [], idx = 0) {

            if(idx > lengthOfKeys) {
                return arr;
            };

            const taskGroup = currentTasks[0][currentKeys[idx]];

            if (Array.isArray(taskGroup) && taskGroup.length > 0) {
                const todayTasks = taskGroup.filter((item) => {
                    return item.finishAt && String(item.finishAt) === String(currentDate);
                });

                arr = [...arr, ...todayTasks];
            };

            return HandleSearchTasks(arr, idx + 1);
        };

        currentTasks[1] = HandleSearchTasks();

        await HandleWrite.call(currentTasks);
        HandleAlertNotification(currentTasks[1].length, currentTasks[1]);

    } catch (err) {
        console.error('❗ Um erro ocorreu:', err);
        process.exit(1);
    }
};

async function HandleAlertNotification(lengthNotifications, tasksToday) {
    try {
        console.log(`⌛ você tem ${lengthNotifications} tarefa(s) pendente(s)`);
        console.log(`--------------------------------------------`);
        
        tasksToday.forEach((item) => {
            console.log(`🔶 ${item.name}`);
        });

    } catch (err) {
        console.error(`❗ Ops...parece que ocorreu um erro ao buscar notificações`, err);
        process.exit(1);
    }
};

module.exports = {
    HandleSearchNotifications
};