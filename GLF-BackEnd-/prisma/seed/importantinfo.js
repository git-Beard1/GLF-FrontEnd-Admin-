const csv = require("csv-parser");
const fs = require("fs");
const path = "./prisma/seed/data/importantinfo.csv";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const readImportantInfo = async (file) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("Parsed important information successfully");
        resolve(results);
      })
      .on("error", (error) => {
        console.log("Error reading important information: ", error);
        reject(error);
      });
  });
};

const createImportantInfo = async (importantInfos) => {
  try {
    await Promise.all(
      importantInfos.map(async (info) => {
        await prisma.importantinfo.create({
          data: {
            title: info.i_title,
            subtitle: info.i_subtitle,
            description: info.i_description,
          },
        });
      })
    );
  } catch (error) {
    console.log("Error creating important information: ", error);
  }
};

module.exports.seedImportantInfo = async () => {
  try {
    const importantInfos = await readImportantInfo(path);
    await createImportantInfo(importantInfos);
  } catch (error) {
    console.log("Error seeding important information: ", error);
  }
};
