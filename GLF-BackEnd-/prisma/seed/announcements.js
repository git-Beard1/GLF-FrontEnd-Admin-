const csv = require("csv-parser");
const fs = require("fs");
const path = "./prisma/seed/data/announcements.csv";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const readAnnouncement = async (file) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("Parsed announcement successfully");
        resolve(results);
      })
      .on("error", (error) => {
        console.log("Error reading announcement: ", error);
        reject(error);
      });
  });
};

const createAnnouncement = async (announcements) => {
  try {
    await Promise.all(
      announcements.map(async (info) => {
        await prisma.announcements.create({
          data: {
            eventid: parseInt(info.a_eventid),
            title: info.a_title,
            description: info.a_description,
            image: info.image,
          },
        });
      })
    );
  } catch (error) {
    console.log("Error creating announcements: ", error);
  }
};

module.exports.seedAnnouncement = async () => {
  try {
    const announcements = await readAnnouncement(path);
    await createAnnouncement(announcements);
  } catch (error) {
    console.log("Error seeding announcements: ", error);
  }
};
