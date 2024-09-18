const { seedUser } = require("./users");
const { seedEvent } = require("./events");
const { seedAnnouncement } = require("./announcements");
const { seedMarker } = require("./marker");
const { seedImportantInfo } = require("./importantinfo");
const { seedHelpInformation } = require("./helpinfo");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    await seedUser();
    await seedEvent();
    await seedAnnouncement();
    await seedMarker();
    await seedImportantInfo();
    await seedHelpInformation();
  } catch (error) {
    console.log("Error seeding: ", error);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    console.log("Seeding completed successfully");
    await prisma.$disconnect();
  }
})();
