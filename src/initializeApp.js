const { app } = require("electron");
const fs = require("fs").promises;
const path = require("node:path");

// FIX
const folderName = "work01test";

const initializeApp = async () => {
  try {
    const documentsPath = app.getPath("documents");
    const folderPath = path.join(documentsPath, folderName);
    const configPath = path.join(folderPath, "config.json");

    // IDEA: my app folder is absolutely essential
    await fs.mkdir(folderPath, { recursive: true });

    try {
      await fs.access(configPath);
    } catch (error) {
      // TODO: create config.json with default values
      await fs.writeFile(
        configPath,
        JSON.stringify({ theme: "dark", recentURL: "/settings" })
      );
    }

    // TODO: time to read the file and check if it has all the properties
    const configFile = await fs.readFile(configPath, "utf-8");
    const configData = JSON.parse(configFile);

    return configData;
  } catch (error) {
    // FIX
    console.log(error.message);

    return null;
  }
};

export default initializeApp;
