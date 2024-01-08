import React, { useState, useEffect } from "react";
import { Input, Button, message, Rate } from "antd";
import { commentApis } from "../../apis/commentAPI";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import { setAverageRating } from "../../redux/features/product/productSlice";

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.userInfo);
  const [rating, setRating] = useState(0);
  const [editingRating, setEditingRating] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    // Update average rating whenever comments change
    if (comments.length > 0) {
      const totalRating = comments.reduce(
        (acc, comment) => acc + comment.rating,
        0
      );
      const newAverageRating = (totalRating / comments.length).toFixed(1);
      dispatch(
        setAverageRating({ productId, averageRating: newAverageRating })
      );
    } else {
      dispatch(setAverageRating({ productId, averageRating: "0" }));
    }
  }, [comments, productId, dispatch]);

  useEffect(() => {
    // Fetch comments based on product ID
    commentApis
      .getAllComments({ productId })
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => console.error(error));
  }, [productId]);

  const updateAverageRating = (updatedComments) => {
    const totalRating = updatedComments.reduce(
      (acc, comment) => acc + comment.rating,
      0
    );
    const newAverageRating =
      updatedComments.length > 0
        ? (totalRating / updatedComments.length).toFixed(1)
        : "0";
    dispatch(setAverageRating({ productId, averageRating: newAverageRating }));
  };

  const handleAddComment = () => {
    if (!isLoggedIn) {
      message.warning("Bạn cần đăng nhập để thực hiện bình luận!");
      setNewComment("");
      return;
    }

    const userId = currentUser?.id;

    const commentToAdd = {
      productId,
      userId, // Sử dụng userId từ currentUser
      text: newComment,
      userFullName: currentUser?.fullName,
      rating,
    };

    commentApis
      .addComment(commentToAdd)
      .then((response) => {
        setComments([...comments, response]); // Cập nhật comments
        setNewComment(""); // Đặt lại nội dung bình luận
        message.success("Bình luận đã được thêm!"); // Hiển thị thông báo thành công

        const updatedComments = [
          ...comments,
          {
            // Thông tin về bình luận mới bao gồm cả rating
          },
        ];
        updateAverageRating(updatedComments); // Gọi updateAverageRating sau khi cập nhật danh sách comments
      })
      .catch((error) => {
        console.error(error);
        message.error("Có lỗi xảy ra khi thêm bình luận."); // Hiển thị thông báo lỗi
      });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApis.deleteCommentById(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));

      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      updateAverageRating(updatedComments); // Gọi updateAverageRating sau khi xóa bình luận
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEditComment = async (commentId, updatedText) => {
    if (!commentId) {
      console.error("Comment ID is undefined!");
      return;
    }

    const commentToUpdate = {
      text: updatedText,
      rating: editingRating,
    };

    try {
      await commentApis.editCommentById(commentId, commentToUpdate);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, ...commentToUpdate }
            : comment
        )
      );
      setEditingCommentId(null); // Reset trạng thái chỉnh sửa

      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, text: updatedText, rating: editingRating }
          : comment
      );
      updateAverageRating(updatedComments); // Gọi updateAverageRating sau khi chỉnh sửa bình luận
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleRatingChange = (newRating) => {
    // Cập nhật giá trị đánh giá
    setRating(newRating);
  };

  return (
    <div className="comment-section">
      <h2 className="comments-title">Bình Luận Sản Phẩm</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          {editingCommentId === comment.id ? (
            // Khi đang chỉnh sửa bình luận
            <div>
              <div className="user-avatar">
                {comment.userFullName ? comment.userFullName.charAt(0) : "?"}{" "}
                {/* Avatar với ký tự đầu tiên */}
              </div>
              <strong>{comment.userFullName || "Anonymous"}</strong>

              <div className="user-rating">
                <span>Đánh giá:</span>
                <Rate
                  allowHalf
                  value={editingRating} // Sử dụng state riêng cho việc chỉnh sửa
                  onChange={(newRating) => setEditingRating(newRating)}
                />

                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <Button
                  onClick={() => handleEditComment(comment.id, editingText)}
                >
                  Lưu đánh giá
                </Button>
              </div>
            </div>
          ) : (
            // Khi hiển thị bình luận
            <div className="comment-content">
              <div className="comment-user">
                <div className="user-avatar">
                  {comment.userFullName ? comment.userFullName.charAt(0) : "?"}{" "}
                  {/* Avatar với ký tự đầu tiên */}
                </div>
                <strong>{comment.userFullName || "Anonymous"}</strong>
                <div className="user-rating">
                  <span>Đánh giá:</span>
                  <Rate allowHalf value={comment.rating} disabled />

                  <span>{comment.rating} sao</span>
                </div>
              </div>
              <div className="comment-text">{comment.text}</div>
              <div className="comment-actions">
                <Button
                  onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditingText(comment.text);
                    setEditingRating(comment.rating);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button onClick={() => handleDeleteComment(comment.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Phần thêm bình luận mới */}
      <div className="add-comment">
        <div className="rating-section">
          <span>Đánh giá của bạn:</span>
          <Rate allowHalf value={rating} onChange={handleRatingChange} />

          <span>{rating} sao</span>
        </div>
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button onClick={handleAddComment}>Lưu đánh giá</Button>
      </div>
    </div>
  );
};

export default CommentSection;
