import React from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { IPost } from "../../types/post";

import Layout from "../../ui/Layout";
import { useUserProfileImage } from "../auth/AuthProvider";
import Post from "./components/Post";
import Recorder from "../Recorder";
import { useForm } from "react-hook-form";

import { sendPost as sendPostToApi } from './sendPost';

const CREATE_POST_MUTATION = gql`
    mutation createPost($title: String!, $audioUrl: String!){
        createPost(title: $title, audioUrl: $audioUrl){
            title,
            audioUrl
        }
    }
`;

const POSTS_QUERY = gql`
    query Posts{
        recentPosts{
            title,
            #            createdAt,
            audioUrl,
            profile{
                imageUrl
            }
        }
    }
`;

const Home = () => {
  const { register, watch } = useForm();

  const profileImage = useUserProfileImage();

  const message = watch('message', '');

  const [createPost, { error: createdPostError, data: createdPostData }] = useMutation(CREATE_POST_MUTATION, {
    update(cache, { data: { createPost } }) {
      const { recentPosts: existingPosts }: any = cache.readQuery({ query: POSTS_QUERY });

      cache.writeQuery({
        query: POSTS_QUERY,
        data: {
          recentPosts: [createPost, ...existingPosts]
        }
      });
    }
  });

  console.log(JSON.stringify(createdPostError, null, 4));

  const sendPost = async ({ chunks }: { chunks: Array<BlobPart> }) => {
    if (!message) {
      return
    }

    // temp
    const audioUrl = 'https://freesound.org/data/previews/201/201982_3146655-lq.mp3';

    await createPost(
        {
          variables: {
            title: message,
            audioUrl,
          },
          optimisticResponse: {
            createPost: {
              __typename: 'Post',
              title: message,
              audioUrl,
              profile: {
                imageUrl: profileImage,
                __typename: "Profile"
              }
            }
          }
        }
    );

    // await sendPostToApi({ audioChunks: chunks, message });
  }

    const [signout] = useMutation(gql`
        mutation Signout{
            signout{
                email
            }
        }
    `);

  const { data, loading, error } = useQuery(POSTS_QUERY);

  console.log(data);

  return (
      <Layout>
        <div className="flex flex-col bg-grey-100">
          <div
              className="flex flex-col shadow-lg lg:flex-row justify-between items-center p-6 my-5 mx-8 rounded-xl bg-white">
            <div className='flex items-center'>
              <img className='self-start rounded-full w-1/6 m-auto md:w-14 md:ml-0' src={profileImage} alt="Profile"/>
              <textarea
                  {...register('message')}
                  placeholder={`Title`}
                  maxLength={20}
                  className='border-none placeholder-black-600 font-bold resize-none ml-4'>
                </textarea>
            </div>
            <Recorder onAudioSend={sendPost}/>
          </div>
          <div className='h-full mt-4'>
            {error && <p className='text-red-100'>An error occurred while fetching posts</p>}
            {loading ?
                <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                  <Skeleton count={10}/>
                </SkeletonTheme> :
                data?.recentPosts?.length ? data.recentPosts?.map(({
                                                                     audioUrl,
                                                                     title,
                                                                     createdAt,
                                                                     profile: { imageUrl }
                                                                   }: IPost, i: number) => (
                    <Post
                        audioUrl={audioUrl}
                        title={title}
                        profileImageUrl={imageUrl}
                        createdAt={createdAt || new Date()}
                        key={i}
                    />)
                ) : <Link to={'/discover'} className={'text-secondary font-medium text-center w-1/6 mx-auto flex'}>
                </Link>
            }
          </div>
        </div>
      </Layout>
  );
};

export default Home;
