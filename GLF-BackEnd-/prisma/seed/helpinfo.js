const csv = require("csv-parser");
const fs = require("fs");
const path = "./prisma/seed/data/helpinfo.csv";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const readHelpInfo = async (file) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("Parsed help information successfully");
        resolve(results);
      })
      .on("error", (error) => {
        console.log("Error reading help information: ", error);
        reject(error);
      });
  });
};

const createHelpInfo = async (helpinfos) => {
  try {
    await Promise.all(
      helpinfos.map(async (info) => {
        await prisma.help.create({
          data: {
            title: info.h_title,
            subtitle: info.h_subtitle,
            description: info.h_description,
          },
        });
      })
    );
  } catch (error) {
    console.log("Error creating help informations: ", error);
  }
};

module.exports.seedHelpInformation = async () => {
  try {
    const helpinfos = await readHelpInfo(path);
    await createHelpInfo(helpinfos);
  } catch (error) {
    console.log("Error seeding help information: ", error);
  }
};
