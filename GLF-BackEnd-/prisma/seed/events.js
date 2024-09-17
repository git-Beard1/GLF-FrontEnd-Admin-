const csv = require("csv-parser");
const fs = require("fs");
const path = "./prisma/seed/data/events.csv";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const readEvent = async (file) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("Parsed events successfully");
        resolve(results);
      })
      .on("error", (error) => {
        console.log("Error reading events: ", error);
        reject(error);
      });
  });
};

const createEvent = async (events) => {
  try {
    await Promise.all(
      events.map(async (info) => {
        await prisma.events.create({
          data: {
            title: info.e_title,
            image_banner: info.image_banner,
            time_start: info.time_start,
            time_end: info.time_end,
            location: info.location,
            keynote_speaker: info.keynote_speaker,
            description: info.e_description,
            survey_link: info.survey_link,
          },
        });
      })
    );
  } catch (error) {
    console.log("Error creating events: ", error);
  }
};

module.exports.seedEvent = async () => {
  try {
    const events = await readEvent(path);
    await createEvent(events);
  } catch (error) {
    console.log("Error seeding events: ", error);
  }
};
