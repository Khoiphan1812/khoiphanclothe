import axios from "axios";

export const commentApis = {
  getAllComments: async (params) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BE_URL}comments`,
      {
        params: {
          ...params,
          _sort: "creatAtComment",
          _order: "desc",
        },
      }
    );
    return response;
  },

  addComment: async (comment) => {
    const response = await axios.post(
      `${process.env.REACT_APP_BE_URL}comments`,
      comment
    );
    return response.data;
  },

  getCommentById: async (id) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BE_URL}comments/${id}`
    );
    return response;
  },

  deleteCommentById: async (id) => {
    return await axios.delete(`${process.env.REACT_APP_BE_URL}comments/${id}`);
  },

  editCommentById: async (id, commentUpdate) => {
    const data = await axios.patch(
      `${process.env.REACT_APP_BE_URL}comments/${id}`,
      commentUpdate
    );
    return data;
  },
};
