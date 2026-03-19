import React from 'react';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

export default function CommentCard({ comment, userData }) {
  // 處理日期格式
  const publishDate = comment?.createdAt
    ? new Date(comment.createdAt).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })
    : '未知時間';

  // 對應用戶資料
  const userName = userData?.name || `用戶 ${comment?.userId || '未知'}`;
  const userAvatar =
    userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment?.userId}`;

  return (
    <div className="card border-0 border-bottom rounded-0 py-4 mb-2" style={{ maxWidth: '800px' }}>
      <div className="card-body p-0">
        <div className="d-flex">
          <div className="flex-shrink-0">
            <div
              className="rounded-circle border overflow-hidden"
              style={{ width: '128px', height: '128px' }}
            >
              <img
                src={userAvatar}
                className="img-fluid"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt="avatar"
              />
            </div>
          </div>
          <div className="flex-grow-1 ms-4">
            <div className="mb-2">
              <h5 className="mb-0 fw-bold">{userName}</h5>
              <small className="text-muted">{publishDate} 發布</small>
            </div>
            <p className="mb-3 text-dark fs-5" style={{ lineHeight: '1.6' }}>
              {comment?.content}
            </p>
            <div className="d-flex gap-4">
              <button className="btn btn-link p-0 text-dark text-decoration-none d-flex align-items-center">
                <ThumbsUp size={20} className="me-2" /> {comment?.reactions?.like || 0}
              </button>
              <button className="btn btn-link p-0 text-dark text-decoration-none">
                <MessageCircle size={20} />
              </button>
              <button className="btn btn-link p-0 text-dark text-decoration-none">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
