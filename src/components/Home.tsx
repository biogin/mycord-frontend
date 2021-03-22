import React from 'react';
import Layout from "../ui/Layout";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client/core";
import { useHistory } from "react-router-dom";

const Home = () => {
  const [signout] = useMutation(gql`
        mutation Signout{
            signout{
                email
            }
        }
  `);

  const history = useHistory();

  return (
      <Layout>
        <h1>Main content</h1>
        <button className='p-5 border-2' onClick={async () => {
          try {
            try {
              await signout();
            } catch (e) {
              console.log(JSON.stringify(e, null, 2));
            }

            window.location.reload();
            history.push('/login');
          } catch (e) {
            console.error(JSON.stringify(e, null, 4));
          }
        }}>
          HEY
        </button>
      </Layout>
  );
};

export default Home;
