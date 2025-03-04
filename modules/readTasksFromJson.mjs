import fs from "node:fs/promises";

const fileName = "tasks.json";

export async function readTasksFromJson() {
  try {
      return JSON.parse(await fs.readFile("tasks.json", "utf-8"));
    
  } catch (err) {
    if (err.code === "ENOENT") {
      createJsonFile();
    } else {
      console.error("❗ Erro ao ler o arquivo:", err);
      process.exit(1);
    }
  }
}

async function createJsonFile() {
  const fileStructure = [
    {
      daily: [],
      study: [],
      entertainment: [],
      revision: [],
    },
    [],
  ]; // the additional empty array is necessary to add extra fields

  await fs.writeFile(fileName, JSON.stringify(fileStructure, null, 2));
  console.log("✅ Arquivo tasks.json criado com estrutura inicial.");
  return fileStructure;
}
