import { Prisma, PrismaClient, Vote } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.vote.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.game.deleteMany({});

  const users = [{ name: "pat" }, { name: "sam" }, { name: "jake" }];
  const games = [
    { name: "Twighlight Imperium" },
    { name: "Root" },
    { name: "Fish" },
  ];
  const createdGames = [];
  const createdUsers = [];
  for (const game of games) {
    createdGames.push(
      await prisma.game.create({
        data: {
          ...game,
        },
      })
    );
  }

  for (const user of users) {
    createdUsers.push(
      await prisma.user.create({
        data: {
          ...user,
        },
      })
    );
  }

  for (const game of createdGames) {
    for (const user of createdUsers) {
      await prisma.vote.create({
        data: {
          vote: Math.floor(Math.random() * 10),
          user: {
            connect: {
              id: user.id,
            },
          },
          game: {
            connect: {
              id: game.id,
            },
          },
        },
      });
    }
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
