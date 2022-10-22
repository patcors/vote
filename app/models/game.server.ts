import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Game } from "@prisma/client";

export async function getGames() {
  return prisma.game.findMany();
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(name: string) {
  return prisma.user.create({
    data: {
      name,
    },
  });
}

