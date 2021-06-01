export interface PostInput {
  audioChunks: Array<BlobPart>;
  message: string;
}

export const sendPost = async (post: PostInput) => {
  const blob = new Blob(post.audioChunks, { type: 'audio/ogg; codecs=opus' })

  const file = new File([blob], 'audiofile');

  const formData = new FormData();

  formData.append('file', file);

  // fetch('http://localhost:1337/api/file/upload', {
  //   method: 'POST',
  //   body: formData
  // })
  //     .then(res => res.json())
  //     .then(d => {
  //       console.log(d)
  //     })
  //     .catch(err => console.error(err));

    const postData = {
      message: post.message
    };
}
