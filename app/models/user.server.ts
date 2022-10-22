import type { User } from "@prisma/client";
import { stringify } from "querystring";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUsers() {
  return prisma.user.findMany({ select: { id: true, name: true } });
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    select: { name: true, id: true },
  });
}

export async function createUser(name: string) {
  return prisma.user.create({
    data: {
      name,
    },
  });
}
