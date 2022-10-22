import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getVoteListings } from "~/models/vote.server";

type LoaderData = {
  votes: Awaited<ReturnType<typeof getVoteListings>>;
};

export const loader: LoaderFunction = async () => {
  const votes = await getVoteListings();

  return json<LoaderData>({ votes });
};

export default function VotesRoute() {
  const { votes } = useLoaderData<LoaderData>();

  return (
    <main>
      <h1>votes</h1>
      {votes.map(({ id, vote }) => (
        <ol key={id}>
          <h3>{vote}/10</h3>
        </ol>
      ))}
    </main>
  );
}
