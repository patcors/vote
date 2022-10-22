import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getUserById } from "~/models/user.server";
import {
  createVote,
  deleteVoteById,
  getVotesByUserId,
  updateVote,
} from "~/models/vote.server";

type LoaderData = {
  votes: Awaited<ReturnType<typeof getVotesByUserId>>;
  user: Awaited<ReturnType<typeof getUserById>>;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  const { id, vote, userId, gameId } = values;
  console.log("update value:", values);
  console.log("update value:", vote);
  console.log("update value:", Number(vote));

  if (_action === "create") {
    return await createVote(
      Number(userId),
      Number(gameId),
      new Decimal(Number(vote))
    );
  }

  if (_action === "update") {
    console.log("update :", id, vote);
    return await updateVote(Number(id), new Prisma.Decimal(Number(vote)));
  }

  if (_action === "delete") {
    return await deleteVoteById(Number(id));
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  const { userId } = params;
  invariant(userId, "userId is required");
  invariant(!Number.isNaN(Number(userId)), "userId must be a number");
  const votes = await getVotesByUserId(Number(userId));
  const user = await getUserById(Number(userId));

  return json<LoaderData>({ votes, user });
};

export default function UserVotesRoute() {
  const { votes, user } = useLoaderData<LoaderData>();
  invariant(user, "User cannot be null");
  invariant(votes, "vote cannot be null");
  return (
    <main>
      <h1>{user?.name}</h1>
      <ol>
        {votes.map(({ id, vote, game }) => (
          <li key={id}>
            <Form method="post">
              Game: {game.name} <input type="hidden" name="id" value={id} />
              <input type="text" name="vote" defaultValue={vote} /> / 10{" "}
              <button
                type="submit"
                aria-label="update"
                name="_action"
                value="update"
              >
                ☝️
              </button>
            </Form>{" "}
            <Form style={{ display: "inline" }} method="post">
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                aria-label="delete"
                name="_action"
                value="delete"
              >
                ❌
              </button>
            </Form>
          </li>
        ))}
      </ol>
    </main>
  );
}
