import type { User, Vote } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getVoteListings() {
  return await prisma.vote.findMany({
    select: {
      id: true,
      vote: true,
      game: true,
    },
  });
}

export async function createVote(
  userId: Vote["userId"],
  gameId: Vote["gameId"],
  vote: Vote["vote"]
) {
  return await prisma.vote.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      game: {
        connect: {
          id: gameId,
        },
      },
      vote,
    },
  });
}

export async function updateVote(id: Vote["id"], vote: Vote["vote"]) {
  console.log("updating vote: ", id, vote);
  return await prisma.vote.update({
    data: {
      vote,
    },
    where: {
      id,
    },
  });
}

export async function deleteVoteById(id: Vote["id"]) {
  return await prisma.vote.delete({
    where: {
      id: id,
    },
  });
}

export async function getVotesByUserId(id: User["id"]) {
  return await prisma.vote.findMany({
    select: {
      id: true,
      vote: true,
      game: true,
    },
    where: {
      userId: id,
    },
  });
}

export async function getVotes() {
  return await prisma.vote.findMany();
}
