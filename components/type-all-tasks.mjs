import { argv } from "node:process";

export async function HandleSetTypeAllTasks(LIST, HandleWrite) {
  try {
    const listofTask = await LIST();

    for (element of listofTask[0][argv[2]]) {
      element.type = argv[4];
    }

    await HandleWrite.call(listofTask);
  } catch (err) {
    console.error(`❗ O seguinte erro ocorreu:`, err);
    process.exit(1);
  }
}
