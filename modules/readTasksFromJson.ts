import fs from "node:fs/promises";

interface FileSignature {
  daily: any[],
  study: any[],
  entertainment: any[],
  revision: any[],
};

type FileData = [FileSignature, any[]]; 

const fileName = "tasks.json";

export async function readTasksFromJson():Promise<void | string> {
  try {
    return JSON.parse(await fs.readFile("tasks.json", "utf-8"));
  } catch (err: any) {
    if (err.code === "ENOENT") {
      createJsonFile();
    } else {
      console.error("❗ Erro ao ler o arquivo:", err);
      process.exit(1);
    };
  };
};

async function createJsonFile():Promise<never[] | FileData> {
  const fileStructure: FileData = [{
      daily: [],
      study: [],
      entertainment: [],
      revision: [],
  },[],]; // the additional empty array is necessary to add extra fields

  await fs.writeFile(fileName, JSON.stringify(fileStructure, null, 2));
  console.log("✅ Arquivo tasks.json criado com estrutura inicial.");
  return fileStructure;
};
