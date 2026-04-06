import * as bootstrap from 'bootstrap';
import CommentCard from './CommentCard';
import { useEffect, useState } from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { Share2, ChevronRight, MessageSquareText } from 'lucide-react';
import { api } from '../../app/features/auth/authAPI';

export default function News() {
  const { postId } = useParams();
  const location = useLocation();
  const { catagory } = location.state || {};

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 取得文章與留言
  useEffect(() => {
    if (!postId) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setPost(null); // 立即清空舊文章，避免閃爍舊內容
      setComments([]);
      setLoading(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 切換文章回到頂部

      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${postId}?_expand=user`, { signal: controller.signal }),
          api.get(`/comments?postId=${postId}&_expand=user`, { signal: controller.signal }),
        ]);
        setPost(postRes.data?.data ?? postRes.data ?? null);
        const rawComments = commentsRes.data?.data ?? commentsRes.data ?? [];
        setComments(Array.isArray(rawComments) ? rawComments : []);
      } catch (err) {
        if (err.code === 'ERR_CANCELED') return; // 切換文章或離開頁面時取消請求，忽略
        console.error('Failed to fetch news:', err);
        setError('載入文章失敗，請稍後再試。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 組件卸載或 postId 改變時，取消進行中的請求
    return () => controller.abort();
  }, [postId]);

  // 文章載入後初始化 Popover
  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(
      (el) => new bootstrap.Popover(el, { trigger: 'focus' })
    );
    return () => popoverList.forEach((p) => p.dispose());
  }, [post]);

  if (loading) {
    return (
      <div
        className="container mt-80 py-16 d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mt-80 py-16 text-center">
        <p className="text-danger">{error || '找不到此文章。'}</p>
        <NavLink to="/topics" className="btn btn-outline-primary mt-12">
          回到熱門話題
        </NavLink>
      </div>
    );
  }

  const displayCategory = catagory || post.category || '全部話題';
  const publishDate = post.createdAt
    ? new Date(post.createdAt).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  const paragraphs = post.content?.split('\n').filter(Boolean) ?? [];

  return (
    <>
      <div className="container mt-80 py-16 overflow-x-hidden">
        {/* 麵包屑 */}
        <nav className="font-zh-tw py-12 caption">
          <ul className="d-flex gap-8 align-items-center list-unstyled m-0">
            <li className="font-weight-light">
              <NavLink className="text-decoration-none text-gray-800" to="/">
                首頁
              </NavLink>
            </li>
            <li>
              <ChevronRight width={16} height={16} className="text-gray-800" />
            </li>
            <li>
              <NavLink className="text-decoration-none text-gray-800" to="/topics">
                熱門話題
              </NavLink>
            </li>
            <li>
              <ChevronRight width={16} height={16} className="text-gray-800" />
            </li>
            <li className="text-dark">{displayCategory}</li>
          </ul>
        </nav>

        {/* Hashtag 與分享 */}
        <div className="d-flex justify-content-between align-items-center my-16">
          <div className="d-flex flex-wrap gap-8">
            {post.hashtags?.map((tag) => (
              <span key={tag} className="caption text-primary round-96 border p-8">
                #{tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-link p-0 text-danger border-0"
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-placement="top"
            data-bs-content="分享文章連結"
          >
            <Share2 size={30} strokeWidth={2} />
          </button>
        </div>

        <h1 className="text-primary-200 fw-bold mb-20">{post.title}</h1>
        <h6 className="text-primary-500">{publishDate}</h6>

        {/* 封面圖 */}
        {post.imgUrl && (
          <div className="mt-20 card rounded-0 border-0 shadow-none">
            <img src={post.imgUrl} className="card-img-top rounded-0" alt={post.title} />
          </div>
        )}

        <hr
          className="border border-primary-200 opacity-75 my-48"
          style={{ borderTop: '3px solid' }}
        />

        {/* 內文（依換行符切段） */}
        {paragraphs.map((para, idx) => (
          <p key={idx} className="fw-light text-break">
            {para}
          </p>
        ))}

        {/* 原文連結 */}
        {post.url && (
          <p className="mt-16">
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-primary">
              閱讀原文 →
            </a>
          </p>
        )}

        <hr
          className="border border-primary-200 opacity-75 my-48"
          style={{ borderTop: '3px solid' }}
        />

        {/* 評論區 */}
        <h1 className="text-primary-200 fw-bold mb-20">看看其他人怎麼說...</h1>

        <div className="d-flex align-items-center justify-content-between py-8">
          <div className="d-flex align-items-center gap-12">
            <div className="d-flex align-items-center text-dark fw-bold">
              <MessageSquareText size={20} className="me-8" />
              <span>
                留言 <span className="fw-bold">({comments.length})</span>
              </span>
            </div>
          </div>
          <NavLink to="/login" className="text-primary fw-bold text-decoration-underline">
            登入留言
          </NavLink>
        </div>

        {/* 留言列表 */}
        <div className="d-flex flex-column gap-12 mt-16">
          {comments.length === 0 ? (
            <p className="text-muted">目前尚無留言，成為第一個留言的人吧！</p>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} userData={comment.user} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
