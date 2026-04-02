import * as FileSystem from "expo-file-system/legacy";

// URL de l'API en production
const NESTJS_URL = "https://hipster-api.fr/api/telegram";

export class TelegramService {
  async init() {
    // API is stateless and isolated on the backend. No initialization needed!
    console.log(
      "[TelegramService] Init: Le backend NestJS gère maintenant la connexion serveur !",
    );
  }

  async uploadFile(fileUri: string, fileName: string): Promise<number> {
    console.log(`[TelegramService] Upload de ${fileName} via NestJS API...`);

    try {
      // expo-file-system uploadAsync is very efficient for large PDFs
      const response = await FileSystem.uploadAsync(
        `${NESTJS_URL}/upload`,
        fileUri,
        {
          fieldName: "file",
          httpMethod: "POST",
          uploadType: 1 as any, // FileSystemUploadType.MULTIPART is 1
          parameters: {
            name: fileName,
          },
        },
      );

      let responseData;
      try {
        responseData = JSON.parse(response.body);
      } catch (e) {
        throw new Error(`Le serveur a renvoyé du texte au lieu de JSON (Status: ${response.status}):\n${response.body.substring(0, 300)}`);
      }

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(responseData?.message || "Erreur API serveur");
      }

      if (!responseData.success || !responseData.messageId) {
        throw new Error("Le serveur n'a pas renvoyé l'ID du message Telegram.");
      }

      console.log(
        `[TelegramService] Upload réussi! Message ID: ${responseData.messageId}`,
      );
      return responseData.messageId;
    } catch (err) {
      console.error("[TelegramService] Echec de l'upload via l'API: ", err);
      throw err;
    }
  }

  async downloadFile(messageId: number, outputPath: string): Promise<string> {
    console.log(
      `[TelegramService] Téléchargement du message ID ${messageId} depuis NestJS API...`,
    );

    try {
      const url = `${NESTJS_URL}/download/${messageId}`;
      const { uri } = await FileSystem.downloadAsync(url, outputPath);
      console.log(`[TelegramService] Document sauvegardé dans : ${uri}`);
      return uri;
    } catch (err) {
      console.error("[TelegramService] Echec du téléchargement: ", err);
      throw err;
    }
  }
}

export const telegramService = new TelegramService();
