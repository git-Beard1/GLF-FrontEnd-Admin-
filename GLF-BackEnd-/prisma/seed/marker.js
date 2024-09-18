const csv = require("csv-parser");
const fs = require("fs");
const path = "./prisma/seed/data/marker.csv";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const readMarker = async (file) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("Parsed marker successfully");
        resolve(results);
      })
      .on("error", (error) => {
        console.log("Error reading marker: ", error);
        reject(error);
      });
  });
};

const createMarker = async (markers) => {
  try {
    await Promise.all(
      markers.map(async (info) => {
        await prisma.marker.create({
          data: {
            location_name: info.location,
            category: info.category,
            description: info.m_description,
            coordinates: info.coordinates,
          },
        });
      })
    );
  } catch (error) {
    console.log("Error creating markers: ", error);
  }
};

module.exports.seedMarker = async () => {
  try {
    const markers = await readMarker(path);
    await createMarker(markers);
  } catch (error) {
    console.log("Error seeding markers: ", error);
  }
};
