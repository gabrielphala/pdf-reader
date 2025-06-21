import axios from "axios";

export const postWithAxios = async (url: string, body: any, options?: any) => {
  const res = await axios.post(url, body, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: options?.progress,
  });

  return res.data;
};