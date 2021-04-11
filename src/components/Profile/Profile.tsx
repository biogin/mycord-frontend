import React from 'react';
import Layout from "../../ui/Layout";
import Tabs from "../../ui/tabs/Tabs";
import TabWrapper from "../../ui/tabs/TabWrapper";

const Profile = () => {

  return (
      <Layout>
        <Tabs>
          <TabWrapper label={'Followers'}>

          </TabWrapper>
          <TabWrapper label={'Following'}>

          </TabWrapper>
        </Tabs>
      </Layout>
  );
};

export default Profile;
