const csv = require("csv-parser");
const fs = require("fs");
const path = "./prisma/seed/data/users.csv";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const readUser = async (file) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("Parsed user successfully");
        resolve(results);
      })
      .on("error", (error) => {
        console.log("Error reading user: ", error);
        reject(error);
      });
  });
};

const createUser = async (users) => {
  try {
    await Promise.all(
      users.map(async (info) => {
        await prisma.users.create({
          data: {
            first_name: info.first_name,
            last_name: info.last_name,
            company: info.company,
            type: info.u_type,
            uid: info.uid,
          },
        });
      })
    );
  } catch (error) {
    console.log("Error creating users: ", error);
  }
};

module.exports.seedUser = async () => {
  try {
    const users = await readUser(path);
    await createUser(users);
  } catch (error) {
    console.log("Error seeding users: ", error);
  }
};
