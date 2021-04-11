import React from 'react';
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Layout from "../ui/Layout";
import Button from "../ui/Button";
import Tabs from "../ui/tabs/Tabs";
import TabWrapper from "../ui/tabs/TabWrapper";

import Post from "./Home/Post";
import { useLoggedIn } from "./auth/AuthProvider";
import { IPost } from "../types/post";

const FOLLOW_MUTATION = gql`
    mutation Follow($username: String){
        follow(username: $username)
    }
`;

const UserPage = () => {
  const router = useHistory();
  const location = useLocation();

  const { username } = useParams<{ username: string }>();

  const isLoggedIn = useLoggedIn();

    const { data, loading, error } = useQuery(gql`
        query User($username: String!){
            user(username: $username){
                user{
                    profile{
                        username,
                        imageUrl
                    },
                    posts{
                        title,
                        description,
                        audioUrl,
                        createdAt
                    }
                },
                me,
                isFollowing
            }
        }
    `, { variables: { username } });

  const [follow, { error: mutationError }] = useMutation(FOLLOW_MUTATION);

  if (error) {
    switch (error.message) {
      case 'USER_NOT_FOUND':
      default:
        console.error(error);
        // router.push('/not-found');

        break;

    }
  }

  const user = data?.user?.user;
  const me = data?.user?.me;
  const following = data?.user?.following;

  return (
      <Layout>
        <div className='flex flex-col h-3/4'>
          <img
              src="https://www.solidbackgrounds.com/images/2880x1800/2880x1800-spanish-sky-blue-solid-color-background.jpg"
              className='max-w-full h-1/4'
              alt="Blue"/>
          <div>
            <div className='flex justify-between items-center p-4'>
              <div className='w-1/2'>
                {loading ?
                    <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                      <Skeleton className='transform -translate-y-20' height={170} width={170} circle={true}
                                count={1}/>
                    </SkeletonTheme>
                    : <img
                        className='transform -translate-y-2/4 w-1/2 rounded-full border-4 border-white'
                        src={isLoggedIn ? user?.profile?.imageUrl : '/profilePlaceholder.png'}
                        alt="User"/>
                }
              </div>
              {loading ?
                  <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                    <Skeleton className='transform -translate-y-11' height={45} width={130} count={1}/>
                  </SkeletonTheme>
                  :
                  <>
                    {isLoggedIn && me ?
                        <Button className='rounded-full self-start mt-4'
                                fluid={false}
                                click={() => router.push('/profile/edit', { background: location })}
                        >
                          Edit profile
                        </Button> :
                        <Button
                            className='rounded-full self-start mt-4'
                            fluid={false}
                            click={async () => {
                              try {
                                await follow({ variables: { username } });
                              } catch (e) {
                                console.error('error', JSON.stringify(e, null, 4));
                              }
                            }}
                        >
                          {following ? 'Unfollow' : 'Follow'}
                        </Button>
                    }
                  </>
              }
            </div>

            {loading ?
                <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                  <Skeleton height={20} count={10}/>
                </SkeletonTheme>
                :
                <div className="flex flex-col -mt-16">
                  <div className="p-4">
                    <h1 className='font-medium text-2xl'>
                      {user?.profile?.username}
                    </h1>
                    <p className='text-grey-400'>
                      @{username}
                    </p>
                    <div className='flex justify-start items-center'>
                      <p>Location</p>
                      <p>www.youtube.com</p>
                      <p>Location</p>
                    </div>
                    <p>Joined 23.40.2523</p>
                    <div className='flex'>
                      <span className='font-bold'></span> <p className='text-muted'>
                      Following
                    </p>
                    </div>
                  </div>
                  {user &&
                  <div className='pt-7'>
                      <Tabs>
                          <TabWrapper label='Audios'>
                            {loading && <h1>loading ...</h1>}
                            {!loading &&
                            user?.posts?.map(({ audioUrl, description, title, createdAt }: IPost, key: number) => (
                                <Post
                                    key={key}
                                    audioUrl={audioUrl}
                                    description={description}
                                    createdAt={createdAt}
                                    profileImageUrl={user?.profile?.imageUrl}
                                    title={title}
                                />
                            ))
                            }
                          </TabWrapper>
                          <TabWrapper label='Audios & Replies'>
                              fCoonten
                          </TabWrapper>
                          <TabWrapper label='Media'>
                              fCoonten
                          </TabWrapper>
                          <TabWrapper label='Likes'>
                              fCoonten
                          </TabWrapper>
                      </Tabs>
                  </div>
                  }
                </div>
            }            </div>
        </div>
      </Layout>
  );
};

export default UserPage;
