import path from 'node:path';
import fs from 'node:fs/promises';

const originalFilePath = path.join(import.meta.dirname, "tasks.json");
const backupFolderPath = path.join(import.meta.dirname, "backup");
const backupFilePath = path.join(backupFolderPath, "backup.json");

const MAX_RETRIES = 5;
const TIME_TO_RETRIES = 2000;

async function ensureBackupDirectoryExists() {
  try {
    await fs.access(backupFolderPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(backupFolderPath);
      console.log(`✅ Diretório de backup criado com sucesso!`);
    } else console.error(`❌ Um erro inesperado correu: ${err}`);
  }
}

async function attemptCopyFile(src, dist, retries = 0) {
  try {
    await fs.copyFile(src, dist);
    console.log(`✅ Backup atualizado com sucesso!`);
  } catch (err) {
    if (err.code === "EBUSY" && retries < MAX_RETRIES) {

      console.warn(
        `❌ Ocorreu um erro, tentando realizar o backup novamente em ${TIME_TO_RETRIES}`
      );

      await new Promise((resolve) => setTimeout(resolve, TIME_TO_RETRIES));
      return attemptCopyFile(src, dist, retries + 1);
    } else {
      console.error(`❌ Não foi possível realizar o backup`, err);
    }
  }
}

export async function performBackup() {
  try {
    await ensureBackupDirectoryExists();
    await attemptCopyFile(originalFilePath, backupFilePath);
  } catch (err) {
    console.error(err.message.trim());
  }
}
