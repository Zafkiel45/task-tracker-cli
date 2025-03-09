interface FileSignature {
  daily: any[],
  study: any[],
  entertainment: any[],
  revision: any[],
};

type FileData = [FileSignature, any[]] | never[]; 

const fileName = "tasks.json";

export async function readTasksFromJson():Promise<void | string | FileData> {
  try {
    const file = Bun.file("./database/tasks.json", {type: "application/json"});

    if(!(await file.exists())) {
      return await createJsonFile();
    };

    return JSON.parse(await file.text());
  } catch (err: any) {
    if (err.code === "ENOENT") {

    } else {
      console.error("❗ Erro ao ler o arquivo:", err);
      process.exit(1);
    };
  };
};

async function createJsonFile():Promise<FileData> {
  const fileStructure: FileData = [{
      daily: [],
      study: [],
      entertainment: [],
      revision: [],
  },[],]; // the additional empty array is necessary to add extra fields
  await Bun.write(`./database/${fileName}`, JSON.stringify(fileStructure, null, 2));
  console.log("✅ Arquivo tasks.json criado com estrutura inicial.");
  return fileStructure;
};