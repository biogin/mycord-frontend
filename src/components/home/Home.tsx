import React from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { useHistory, Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { IPost } from "../../types/post";

import Layout from "../../ui/Layout";
import Button from "../../ui/Button";
import { useUserProfileImage } from "../auth/AuthProvider";
import Post from "./components/Post";
import Recorder from "../Recorder";

const Home = () => {
    const [signout] = useMutation(gql`
        mutation Signout{
            signout{
                email
            }
        }
    `);

    const { data, loading, error } = useQuery(gql`
        query Posts{
            recentPosts{
                title,
                description,
                createdAt,
                audioUrl,
                profileImageUrl
            }
        }
    `);

  const image = useUserProfileImage();

  return (
      <Layout>
        <div className="flex flex-col bg-white h-full">
          {/*<h1 className='font-bold text-2xl p-4'>*/}
          {/*  Home*/}
          {/*</h1>*/}
          <div className='flex flex-row items-center p-8 border-t-2 border-b-2 border-grey-200'>
            <img className='self-start rounded-full w-1/12' src={image} alt="Profile"/>
            <div className="flex flex-col lg:flex-row justify-between w-full">
              <div className='flex flex-col self-center mx-4 w-full'>
                <textarea
                    placeholder={`Title`}
                    maxLength={20}
                    className='border-none placeholder-black-600 font-bold resize-none'>
                </textarea>
                <Recorder />
              </div>
              <div className='self-start w-full mt-4 lg:self-end lg:mt-0 lg:w-auto'>
                <Button>
                  Send
                </Button>
              </div>
            </div>
          </div>
          <div className='bg-grey-100 h-4'>
          </div>
          <div className='h-full mt-4'>
            {error && <p className='text-red-100'>An error occurred while fetching posts</p>}
            {loading ?
                <SkeletonTheme color="#f3f3f3" highlightColor="lightgrey">
                  <Skeleton count={10}/>
                </SkeletonTheme> :
                data.recentPosts?.length ? data.recentPosts?.map(({
                                                                    audioUrl,
                                                                    description,
                                                                    title,
                                                                    profileImageUrl,
                                                                    createdAt
                                                                  }: IPost & { profileImageUrl: string }) => (
                    <Post
                        audioUrl={audioUrl}
                        description={description}
                        title={title}
                        profileImageUrl={profileImageUrl}
                        createdAt={createdAt}
                    />)
                ) : <Link to={'/discover'} className={'text-secondary font-medium text-center w-1/6 mx-auto flex'}>
                  <Button>
                    Discover
                  </Button>
                </Link>
            }
          </div>
        </div>
      </Layout>
  );
};

export default Home;
