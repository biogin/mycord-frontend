interface Args {
  file: File;
}

export async function uploadFile({ file }: Args) {
  const formData = new FormData();

  formData.append('file', file);

  return fetch('http://localhost:1337/api/file/upload', {
    method: 'POST',
    body: formData
  })
      .then(res => {
        if (!res.ok) {
          // todo
        }

        return res.json();
      })
      .then(data => {
        if (!data.ok) {
        }

        return data.imageUrl;
      })
      .catch(err => {
        console.error(err);
      });
}
