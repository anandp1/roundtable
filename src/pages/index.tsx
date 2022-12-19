import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import Layout from "../components/shared/layout";
import { fetcher } from "../lib/fetcher";

import MovieRow from "../components/home/movie-row";
import { getAvailableUsers, MovieByUser, SafeUser } from "../modal/user.modal";

interface HomeProps {
  username: string;
  availableUsers: SafeUser[];
}

const Home: NextPage = ({ username, availableUsers }: HomeProps) => {
  const { data, error, mutate } = useSWR<MovieByUser>(
    "/api/user-movies",
    fetcher
  );

  const yourUsername = username;

  if (error) {
    return (
      <Layout
        username={username}
        mutateUserData={mutate}
        availableUsers={availableUsers}
      >
        <p className="text-white text-bold tracking-wider">Failed to load</p>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout
        username={username}
        mutateUserData={mutate}
        availableUsers={availableUsers}
      >
        <p className="text-white text-bold tracking-wider">Loading...</p>
      </Layout>
    );
  }

  const reorderedUserArray = [
    ...Object.keys(data.moviesByUser).filter(
      (username) => username === yourUsername
    ),
    ...Object.keys(data.moviesByUser).filter(
      (username) => username !== yourUsername
    ),
  ];

  return (
    <Layout
      username={username}
      mutateUserData={mutate}
      availableUsers={availableUsers}
    >
      <div className="flex flex-col">
        {reorderedUserArray.map((username: string, index: number) => {
          return (
            <MovieRow
              key={username}
              username={username}
              yourUsername={yourUsername}
              randomId={index}
              data={data}
              mutateUserData={mutate}
            />
          );
        })}
      </div>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const availableUsers = await getAvailableUsers();

  return {
    props: {
      username: session.user.email,
      availableUsers,
    },
  };
};

export { getServerSideProps };

export default Home;
