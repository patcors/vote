import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getUsers } from "~/models/user.server";

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

export const loader: LoaderFunction = async () => {
  const users = await getUsers();

  return json<LoaderData>({ users });
};

export default function UsersRoute() {
  const { users } = useLoaderData<LoaderData>();

  return (
    <main>
      <h1>Users</h1>
      {users.map(({ id, name }) => (
        <ol key={id}>
          <li>
            <Link
              to={`/users/${id}/votes`}
              className="text-x1 text-blue-600 underline"
            >
              {name}
            </Link>
          </li>
        </ol>
      ))}
    </main>
  );
}
