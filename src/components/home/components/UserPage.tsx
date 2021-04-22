import React, { useState, MouseEvent, useRef } from 'react';
import { useHistory, useLocation, useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Layout from "../../../ui/Layout";
import Button from "../../../ui/Button";
import Tabs from "../../../ui/tabs/Tabs";
import TabWrapper from "../../../ui/tabs/TabWrapper";

import Post from "./Post";
import { useLoggedIn } from "../../auth/AuthProvider";
import { IPost } from "../../../types/post";
import { useSendMessage } from "../../conversations/ConversationsProvider";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import { useForm } from "react-hook-form";

const USER_QUERY = gql`
    query User($username: String!){
        user(username: $username){
            user{
                id,
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
`;

const FOLLOW_MUTATION = gql`
    mutation Follow($username: String){
        follow(username: $username)
    }
`;

const UserPage = () => {
  const router = useHistory();
  const location = useLocation();

  const { sendMessage, error: sendMessageError } = useSendMessage();

  const { username } = useParams<{ username: string }>();

  const isLoggedIn = useLoggedIn();

  const { data, loading, error, refetch } = useQuery(USER_QUERY, { variables: { username } });

  const [follow, { error: mutationError }] = useMutation(FOLLOW_MUTATION);

  const inputFile = useRef<null | HTMLInputElement>(null);
  const sendMessageRef = useRef<null | HTMLDivElement>(null);

  const { register, watch } = useForm();

  const message = watch('message');

  const [showSendMessage, setShowSendMessage] = useState(false);

  useClickOutside(sendMessageRef, () => {
    setShowSendMessage(false);
  });

  const [showPhotoIcon, setShowPhotoIcon] = useState(false);

  const handleMouseEnter = (e: any) => {
    setShowPhotoIcon(true);
  };

  const handleMouseLeave = (e: any) => {
    setShowPhotoIcon(false);
  };

  const handlePhotoClick = (e: MouseEvent<HTMLImageElement>) => {
    inputFile.current!.click();
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];

    // TODO
    console.log(file);
  };

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
  const following = data?.user?.isFollowing;

  const canEditPhoto = isLoggedIn && me && !user?.profile?.imageUrl;

  return (
      <Layout>
        <input type='file' id='file' onChange={handleFileSelect} ref={inputFile} style={{ display: 'none' }}/>
        <div className='flex flex-col h-3/4'>
          <img
              src="https://www.solidbackgrounds.com/images/2880x1800/2880x1800-spanish-sky-blue-solid-color-background.jpg"
              className='max-w-full h-1/4'
              alt="Blue"/>
          <div>
            <div className='flex justify-between items-start p-4'>
              <div className='w-1/2'>
                {loading ?
                    <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                      <Skeleton className='transform -translate-y-20' height={170} width={170} circle={true}
                                count={1}/>
                    </SkeletonTheme>
                    : <div
                        className={`relative transform -translate-y-2/4 w-1/2 ${canEditPhoto && 'cursor-pointer'}`}
                        onClick={handlePhotoClick}
                        {...((canEditPhoto) && {
                          onMouseEnter: handleMouseEnter,
                          onMouseLeave: handleMouseLeave,
                        })
                        }
                    >
                      <img
                          className='w-full rounded-full border-4 border-white transition'
                          src={user?.profile?.imageUrl || '/profilePlaceholder.png'}
                          alt="User"
                          style={{ filter: showPhotoIcon ? 'blur(2px)' : 'none' }}
                      />
                      {showPhotoIcon &&
                      <img className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
                           src="/icons/photoIcon.svg" alt=""/>}
                    </div>
                }
              </div>
              {loading ?
                  <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                    <Skeleton className='transform -translate-y-11' height={45} width={130} count={1}/>
                  </SkeletonTheme>
                  :
                  <div className='flex relative'>
                    {isLoggedIn && me ?
                        <Button className='mt-4'
                                fluid={false}
                                click={() => router.push('/profile/edit', { background: location })}
                        >
                          Edit profile
                        </Button> :
                        <>
                        {sendMessageError && <p>Error sending message</p>}
                          <Button
                              className='mt-4'
                              fluid={false}
                              click={() => {
                                setShowSendMessage(true);
                              }}
                          >
                            Send message
                          </Button>
                          <div className={`absolute top-full flex ${showSendMessage ? 'flex' : 'hidden'}`}
                               ref={sendMessageRef}>
                            <textarea placeholder='Message'
                                      className='w-full p-4 placeholder-black-600 resize-none font-light h-full'
                                      {...register('message', { required: true })}
                            />
                            <img
                                src="/icons/planeIcon.svg"
                                alt="Send message"
                                onClick={async () => {
                                  if (!!message) {
                                    await sendMessage(user.id, message);

                                    router.push('/conversations');

                                    window.location.reload();
                                  }
                                }}
                                className='transform -rotate-90 -translate-y-1/2 absolute right-0 top-1/2 w-1/6 cursor-pointer'/>
                          </div>
                          <Button
                              className='mt-4 ml-4'
                              fluid={false}
                              click={async () => {
                                try {
                                  await follow({ variables: { username } });

                                  await refetch({ username });
                                } catch (e) {
                                  console.error('error', JSON.stringify(e, null, 4));
                                }
                              }}
                          >
                            {following ? 'Unfollow' : 'Follow'}
                          </Button>
                        </>
                    }
                  </div>
              }
            </div>

            {loading ?
                <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                  <Skeleton height={20} count={10}/>
                </SkeletonTheme>
                :
                <div className="flex flex-col -mt-16">
                  <div className="p-4 space-y-1">
                    <h1 className='font-medium text-2xl'>
                      {`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''} ${!user?.profile?.firstName && !user?.profile?.lastName && username}`}
                    </h1>
                    <p className='text-grey-400'>
                      @{username}
                    </p>
                    <div className='flex justify-start'>
                      {user?.profile?.location &&
                      <p>{user?.profile?.location}</p>
                      }
                      {user?.profile?.website &&
                      <p>{user?.profile?.website}</p>
                      }
                    </div>
                    <p className='whitespace-nowrap'>
                      {/*<span className='text-muted pl-2 font-light'>*/}
                      {/*  {user?.profile?.createdAt || new Date().toDateString()}*/}
                      {/*</span>*/}
                    </p>
                    <div className='flex'>
                      <div>
                        <span className='font-medium'>Followers</span> <Link to={'/followers'}
                                                                             className='text-muted pl-1 hover:underline'> {user?.followersCount || 0}</Link>
                      </div>
                      <div className='ml-2'>
                        <span className='font-medium'>Following</span> <Link to={'/following'}
                                                                             className='text-muted pl-1 hover:underline'> {user?.followingCount || 0}</Link>
                      </div>
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
                        {/*<TabWrapper label='Media'>*/}
                        {/*    fCoonten*/}
                        {/*</TabWrapper>*/}
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
