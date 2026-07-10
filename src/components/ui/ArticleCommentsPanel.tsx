"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getComments, getCommentReplies } from "@/lib/api/comment";
import { mockViewer, DEFAULT_AVATAR } from "@/lib/mock-data";
import type { CommentVO, ReplyVO } from "@/types/api";

const COMMENTS_PAGE_SIZE = 10;
const REPLIES_PAGE_SIZE = 100;

// mock 阶段固定为已登录访客，接后端时换成真实用户态
const VIEWER = {
  userId: mockViewer.userId,
  nickname: mockViewer.nickname,
  avatar: mockViewer.avatar,
  isAdmin: mockViewer.isAdmin,
};

interface ReplyItem {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string;
  replyToName: string;
  content: string;
  likeCount: number;
  liked: boolean;
  canDelete: boolean;
  createTime: string;
}

interface CommentItem {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  likeCount: number;
  liked: boolean;
  replyCount: number;
  canDelete: boolean;
  createTime: string;
  previewReply: { authorName: string; content: string; likeCount: number; createTime: string } | null;
}

interface ReplyTarget {
  commentId: number;
  replyId: number | null;
  targetUserId: number | null;
  targetName: string;
}

interface ArticleCommentsPanelProps {
  articleId: number;
  commentStatus?: number;
}

// 评论数据归一化（公开接口不带 liked/canDelete，默认 false）
function normalizeComment(item: CommentVO): CommentItem {
  return {
    id: item.id,
    userId: item.user_id,
    authorName: item.author_name || "游客",
    authorAvatar: item.author_avatar || DEFAULT_AVATAR,
    content: item.content,
    likeCount: item.like_count,
    liked: false,
    replyCount: item.reply_count,
    canDelete: false,
    createTime: item.created_at,
    previewReply: item.preview_reply_content
      ? {
          authorName: item.preview_reply_author_name || "游客",
          content: item.preview_reply_content,
          likeCount: 0,
          createTime: item.created_at,
        }
      : null,
  };
}

function normalizeReply(item: ReplyVO): ReplyItem {
  return {
    id: item.id,
    userId: item.user_id,
    authorName: item.author_name || "游客",
    authorAvatar: item.author_avatar || DEFAULT_AVATAR,
    replyToName: item.reply_to_name || "游客",
    content: item.content,
    likeCount: item.like_count,
    liked: false,
    canDelete: false,
    createTime: item.created_at,
  };
}

function getTimeValue(value: string): number {
  if (!value) return 0;
  // 兼容 "YYYY-MM-DD HH:mm:ss"（Safari 需要 / 分隔）
  const targetDate = new Date(String(value).replace(/-/g, "/"));
  return Number.isNaN(targetDate.getTime()) ? 0 : targetDate.getTime();
}

function formatCommentTime(value: string): string {
  const targetTime = getTimeValue(value);
  if (!targetTime) return "";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - targetTime) / 1000));

  if (diffSeconds < 60) return "刚刚";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} 分钟前`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} 小时前`;
  if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)} 天前`;

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(targetTime));
}

// 生成新评论/回复的临时 id
let mockIdSeed = 10000;
function nextMockId() {
  mockIdSeed += 1;
  return mockIdSeed;
}

// 评论本地排序：hot 按点赞（同点赞按时间倒序），time 按时间倒序
function sortComments(list: CommentItem[], mode: "hot" | "time") {
  return [...list].sort((a, b) => {
    if (mode === "hot" && b.likeCount !== a.likeCount) {
      return b.likeCount - a.likeCount;
    }
    return getTimeValue(b.createTime) - getTimeValue(a.createTime);
  });
}

export default function ArticleCommentsPanel({ articleId, commentStatus }: ArticleCommentsPanelProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [sortMode, setSortMode] = useState<"hot" | "time">("hot");
  const [totalComments, setTotalComments] = useState(0);
  const [nextCommentPage, setNextCommentPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState("");
  const [expandedCommentIds, setExpandedCommentIds] = useState<number[]>([]);
  const [loadedRepliesMap, setLoadedRepliesMap] = useState<Record<number, ReplyItem[]>>({});
  const [activeReplyTarget, setActiveReplyTarget] = useState<ReplyTarget | null>(null);
  const [replyDraftMap, setReplyDraftMap] = useState<Record<number, string>>({});
  const [draftComment, setDraftComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replySubmittingMap, setReplySubmittingMap] = useState<Record<number, boolean>>({});

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // comment_status: 0 表示关闭（接后端时若语义相反再调整）
  const isCommentClosed = commentStatus === 0;
  const hasMoreComments = comments.length < totalComments;

  // 加载评论（真实接口，结果按 sortMode 本地排序）
  const loadComments = useCallback(
    async (reset: boolean) => {
      if (!articleId) return;
      // 仅"加载更多"防重入；切换文章(reset)必须放行，否则上一页 loading 时新文章评论不会加载
      if (!reset && commentsLoading) return;
      const page = reset ? 1 : nextCommentPage;
      setCommentsLoading(true);
      try {
        const data = await getComments({ articleId, page, size: COMMENTS_PAGE_SIZE });
        const rows = data.list.map(normalizeComment);
        setTotalComments(data.total);
        setNextCommentPage(page + 1);
        setComments((prev) => {
          const base = reset ? [] : prev;
          const merged = reset
            ? rows
            : [...base, ...rows.filter((r) => !base.some((c) => c.id === r.id))];
          return sortComments(merged, sortMode);
        });
        if (reset) {
          setActiveMenuKey("");
          setExpandedCommentIds([]);
          setLoadedRepliesMap({});
          setActiveReplyTarget(null);
          setReplyDraftMap({});
        }
      } catch (error) {
        console.error("加载评论失败:", error);
        if (reset) {
          setComments([]);
          setTotalComments(0);
        }
      } finally {
        setCommentsLoading(false);
      }
    },
    [articleId, commentsLoading, nextCommentPage, sortMode],
  );

  // 文章切换时重新加载评论
  useEffect(() => {
    loadComments(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  // 点击空白处关闭更多菜单
  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest(".comment-more")) return;
      setActiveMenuKey("");
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  // 滚动到底部加载更多（mock 数据不足一页时不会触发，逻辑保留给接后端）
  const loadMoreComments = useCallback(() => {
    if (!hasMoreComments) return;
    loadComments(false);
  }, [hasMoreComments, loadComments]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMoreComments) {
      observerRef.current?.disconnect();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMoreComments();
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(node);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [hasMoreComments, comments.length, loadMoreComments]);

  function getMenuKey(type: string, commentId: number, replyId: number | null = null) {
    return [type, commentId, replyId].filter(Boolean).join("-");
  }

  function toggleMenu(type: string, commentId: number, replyId: number | null = null) {
    const nextKey = getMenuKey(type, commentId, replyId);
    setActiveMenuKey((prev) => (prev === nextKey ? "" : nextKey));
  }

  function isExpanded(commentId: number) {
    return expandedCommentIds.includes(commentId);
  }

  function hasLoadedReplies(commentId: number) {
    return Object.prototype.hasOwnProperty.call(loadedRepliesMap, commentId);
  }

  // 加载回复（真实接口）
  async function loadReplies(comment: CommentItem) {
    if (hasLoadedReplies(comment.id)) return;
    try {
      const data = await getCommentReplies(comment.id, 1, REPLIES_PAGE_SIZE);
      const replies = data.list.map(normalizeReply);
      setLoadedRepliesMap((prev) => ({ ...prev, [comment.id]: replies }));
    } catch (error) {
      console.error("加载回复失败:", error);
    }
  }

  async function ensureRepliesVisible(comment: CommentItem) {
    await loadReplies(comment);
    if (!isExpanded(comment.id)) {
      setExpandedCommentIds((prev) => [...prev, comment.id]);
    }
  }

  function toggleReplies(comment: CommentItem) {
    if (isExpanded(comment.id)) {
      setExpandedCommentIds((prev) => prev.filter((id) => id !== comment.id));
      return;
    }
    ensureRepliesVisible(comment);
  }

  // 切换排序：本地重排已加载评论（后端不支持 sort）
  function selectSortMode(mode: "hot" | "time") {
    if (sortMode === mode) return;
    setSortMode(mode);
    setComments((prev) => sortComments(prev, mode));
  }

  function getExpandedReplies(comment: CommentItem): ReplyItem[] {
    const replies = loadedRepliesMap[comment.id] || [];
    return [...replies].sort((a, b) => getTimeValue(a.createTime) - getTimeValue(b.createTime));
  }

  function getReplyPreview(comment: CommentItem) {
    const loaded = loadedRepliesMap[comment.id];
    if (loaded && loaded.length) {
      return [...loaded].sort((a, b) => {
        if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount;
        return getTimeValue(b.createTime) - getTimeValue(a.createTime);
      })[0];
    }
    return comment.previewReply;
  }

  function isReplyEditorVisible(commentId: number) {
    return activeReplyTarget?.commentId === commentId;
  }

  function getReplyDraft(commentId: number) {
    return replyDraftMap[commentId] || "";
  }

  function updateReplyDraft(commentId: number, value: string) {
    setReplyDraftMap((prev) => ({ ...prev, [commentId]: value }));
  }

  async function openReplyEditor(comment: CommentItem, reply: ReplyItem | null = null) {
    if (isCommentClosed) return;
    const nextTarget: ReplyTarget = {
      commentId: comment.id,
      replyId: reply?.id ?? null,
      targetUserId: reply?.userId ?? comment.userId,
      targetName: reply?.authorName ?? comment.authorName,
    };
    if (
      activeReplyTarget?.commentId === nextTarget.commentId &&
      activeReplyTarget?.replyId === nextTarget.replyId
    ) {
      setActiveReplyTarget(null);
      return;
    }
    if (comment.replyCount) await ensureRepliesVisible(comment);
    setActiveReplyTarget(nextTarget);
  }

  function publishMockComment() {
    if (isCommentClosed) return;
    const content = draftComment.trim();
    if (!content) return;

    setSubmittingComment(true);
    // mock：构造一条新评论插入列表头部
    const newComment: CommentItem = {
      id: nextMockId(),
      userId: VIEWER.userId,
      authorName: VIEWER.nickname,
      authorAvatar: VIEWER.avatar,
      content,
      likeCount: 0,
      liked: false,
      replyCount: 0,
      canDelete: true,
      createTime: new Date().toISOString().replace("T", " ").substring(0, 19),
      previewReply: null,
    };
    setComments((prev) => [newComment, ...prev]);
    setTotalComments((prev) => prev + 1);
    setDraftComment("");
    selectSortMode("time");
    setSubmittingComment(false);
  }

  function publishMockReply(comment: CommentItem) {
    if (isCommentClosed) return;
    const content = (replyDraftMap[comment.id] || "").trim();
    if (!content || !activeReplyTarget || activeReplyTarget.commentId !== comment.id) return;

    setReplySubmittingMap((prev) => ({ ...prev, [comment.id]: true }));
    const newReply: ReplyItem = {
      id: nextMockId(),
      userId: VIEWER.userId,
      authorName: VIEWER.nickname,
      authorAvatar: VIEWER.avatar,
      replyToName: activeReplyTarget.targetName,
      content,
      likeCount: 0,
      liked: false,
      canDelete: true,
      createTime: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    setLoadedRepliesMap((prev) => ({
      ...prev,
      [comment.id]: [...(prev[comment.id] || []), newReply],
    }));
    setComments((prev) =>
      prev.map((item) =>
        item.id === comment.id ? { ...item, replyCount: item.replyCount + 1 } : item,
      ),
    );
    if (!isExpanded(comment.id)) setExpandedCommentIds((prev) => [...prev, comment.id]);
    setReplyDraftMap((prev) => ({ ...prev, [comment.id]: "" }));
    setActiveReplyTarget(null);
    setReplySubmittingMap((prev) => ({ ...prev, [comment.id]: false }));
  }

  function likeComment(comment: CommentItem) {
    setComments((prev) =>
      prev.map((item) => {
        if (item.id !== comment.id) return item;
        const liked = !item.liked;
        return { ...item, liked, likeCount: item.likeCount + (liked ? 1 : -1) };
      }),
    );
  }

  function likeReply(commentId: number, reply: ReplyItem) {
    if (!hasLoadedReplies(commentId)) return;
    setLoadedRepliesMap((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || []).map((item) => {
        if (item.id !== reply.id) return item;
        const liked = !item.liked;
        return { ...item, liked, likeCount: item.likeCount + (liked ? 1 : -1) };
      }),
    }));
  }

  function reportItem(itemType: "comment" | "reply") {
    setActiveMenuKey("");
    // mock：仅提示，接后端时调用举报接口
    console.log(`[mock] 举报${itemType === "reply" ? "回复" : "评论"}`);
  }

  function deleteComment(commentId: number) {
    setComments((prev) => prev.filter((item) => item.id !== commentId));
    setTotalComments((prev) => Math.max(0, prev - 1));
    setExpandedCommentIds((prev) => prev.filter((id) => id !== commentId));
    setLoadedRepliesMap((prev) => {
      if (!hasLoadedReplies(commentId)) return prev;
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
    setReplyDraftMap((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, commentId)) return prev;
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
    if (activeReplyTarget?.commentId === commentId) setActiveReplyTarget(null);
    setActiveMenuKey("");
  }

  function deleteReply(commentId: number, replyId: number) {
    if (hasLoadedReplies(commentId)) {
      setLoadedRepliesMap((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || []).filter((item) => item.id !== replyId),
      }));
    }
    setComments((prev) =>
      prev.map((item) =>
        item.id === commentId ? { ...item, replyCount: Math.max(0, item.replyCount - 1) } : item,
      ),
    );
    if (activeReplyTarget?.replyId === replyId) {
      const target = comments.find((item) => item.id === commentId);
      setActiveReplyTarget({
        commentId,
        replyId: null,
        targetUserId: target?.userId ?? null,
        targetName: target?.authorName ?? "游客",
      });
    }
    setActiveMenuKey("");
  }

  function canDelete(item: { canDelete: boolean; userId: number }) {
    if (typeof item.canDelete === "boolean") return item.canDelete;
    return Boolean(VIEWER.userId && (VIEWER.isAdmin || VIEWER.userId === item.userId));
  }

  return (
    <section className="article-comments">
      <header className="article-comments__header">
        <div className="article-comments__heading">
          <h3 className="article-comments__title">评论</h3>
          <p className="article-comments__subtitle">{totalComments} 条讨论</p>
        </div>

        <div className="article-comments__sort">
          <button
            type="button"
            className={`article-comments__sort-button${sortMode === "hot" ? " active" : ""}`}
            onClick={() => selectSortMode("hot")}
          >
            最热
          </button>
          <button
            type="button"
            className={`article-comments__sort-button${sortMode === "time" ? " active" : ""}`}
            onClick={() => selectSortMode("time")}
          >
            最新
          </button>
        </div>
      </header>

      <section className="comment-editor">
        <div className="comment-editor__panel">
          <div className="comment-editor__head">
            <div className="comment-editor__avatar">
              <img src={VIEWER.avatar} alt={VIEWER.nickname} />
            </div>
            <div className="comment-editor__meta">
              <strong>{VIEWER.nickname}</strong>
              <span>留言</span>
            </div>
          </div>

          <textarea
            className="comment-editor__input"
            rows={4}
            aria-label="留言"
            placeholder={isCommentClosed ? "评论已关闭" : "写下你的评论..."}
            value={draftComment}
            disabled={isCommentClosed}
            onChange={(e) => setDraftComment(e.target.value)}
          />

          <div className="comment-editor__actions">
            <button
              type="button"
              className="comment-editor__submit"
              disabled={submittingComment || isCommentClosed}
              onClick={publishMockComment}
            >
              发表评论
            </button>
          </div>
        </div>
      </section>

      {comments.length > 0 ? (
        <div className="comment-list">
          {comments.map((comment) => {
            const replyPreview = getReplyPreview(comment);
            return (
              <article key={comment.id} className="comment-card">
                <div className="comment-card__body">
                  <div className="comment-card__top">
                    <div className="comment-card__meta">
                      <div className="comment-card__avatar">
                        <img src={comment.authorAvatar} alt={comment.authorName} />
                      </div>
                      <div className="comment-card__author">
                        <strong>{comment.authorName}</strong>
                        <span>{formatCommentTime(comment.createTime)}</span>
                      </div>
                    </div>

                    <div className="comment-more" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="comment-more__button"
                        aria-label="更多操作"
                        onClick={() => toggleMenu("comment", comment.id)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="5" cy="12" r="1.8" fill="currentColor" />
                          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                          <circle cx="19" cy="12" r="1.8" fill="currentColor" />
                        </svg>
                      </button>
                      {activeMenuKey === getMenuKey("comment", comment.id) && (
                        <div className="comment-more__menu">
                          <button type="button" onClick={() => reportItem("comment")}>
                            举报
                          </button>
                          {canDelete(comment) && (
                            <button type="button" onClick={() => deleteComment(comment.id)}>
                              删除
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="comment-card__content">{comment.content}</p>

                  <div className="comment-card__footer">
                    <button
                      type="button"
                      className={`comment-card__action${comment.liked ? " is-liked" : ""}`}
                      onClick={() => likeComment(comment)}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.04 9.11l3.297-7.419a1 1 0 01.914-.594 3.67 3.67 0 013.67 3.671V7.33h4.028a2.78 2.78 0 012.78 3.2l-1.228 8.01a2.778 2.778 0 01-2.769 2.363H5.019a2.78 2.78 0 01-2.78-2.78V11.89a2.78 2.78 0 012.78-2.78H7.04zm-2.02 2a.78.78 0 00-.781.78v6.232c0 .431.35.78.78.78H6.69V11.11H5.02zm12.723 7.793a.781.781 0 00.781-.666l1.228-8.01a.78.78 0 00-.791-.898h-5.04a1 1 0 01-1-1V4.77c0-.712-.444-1.32-1.07-1.56L8.69 10.322v8.58h9.053z"
                        />
                      </svg>
                      <span>{comment.likeCount}</span>
                    </button>
                    {comment.replyCount > 0 && (
                      <button
                        type="button"
                        className="comment-card__action comment-card__toggle"
                        onClick={() => toggleReplies(comment)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.997 21.5a9.5 9.5 0 01-8.49-5.251A9.38 9.38 0 012.5 11.997V11.5c.267-4.88 4.12-8.733 8.945-8.999L12 2.5a9.378 9.378 0 014.25 1.007A9.498 9.498 0 0121.5 12a9.378 9.378 0 01-.856 3.937l.838 4.376a1 1 0 01-1.17 1.17l-4.376-.838a9.381 9.381 0 01-3.939.856zm3.99-2.882l3.254.623-.623-3.253a1 1 0 01.09-.64 7.381 7.381 0 00.792-3.346 7.5 7.5 0 00-4.147-6.708 7.385 7.385 0 00-3.35-.794H11.5c-3.752.208-6.792 3.248-7.002 7.055L4.5 12a7.387 7.387 0 00.794 3.353A7.5 7.5 0 0012 19.5a7.384 7.384 0 003.349-.793 1 1 0 01.639-.09z"
                          />
                        </svg>
                        {isExpanded(comment.id)
                          ? "收起回复"
                          : `展开 ${comment.replyCount} 条回复`}
                      </button>
                    )}
                    <button
                      type="button"
                      className="comment-card__action"
                      onClick={() => openReplyEditor(comment)}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.83 2.106c.628-.634 1.71-.189 1.71.704v2.065c4.821.94 6.97 4.547 7.73 8.085l-.651.14.652-.134c.157.757-.83 1.192-1.284.565l-.007-.009c-1.528-2.055-3.576-3.332-6.44-3.502v2.352c0 .893-1.082 1.338-1.71.704L1.091 8.295a1 1 0 010-1.408l4.737-4.78zm7.303 8.617C12.08 8.495 10.204 6.68 7.046 6.14c-.47-.08-.84-.486-.84-.99V3.62L2.271 7.591l3.934 3.971V9.667a.993.993 0 011.018-.995c2.397.065 4.339.803 5.909 2.051z"
                        />
                      </svg>
                      <span>回复</span>
                    </button>
                  </div>

                  {(comment.replyCount > 0 || isReplyEditorVisible(comment.id)) && (
                    <div className="comment-replies">
                      {isExpanded(comment.id)
                        ? getExpandedReplies(comment).map((reply) => (
                            <article key={reply.id} className="comment-reply">
                              <div className="comment-reply__top">
                                <div className="comment-reply__meta">
                                  <div className="comment-reply__avatar">
                                    <img src={reply.authorAvatar} alt={reply.authorName} />
                                  </div>
                                  <div className="comment-reply__author">
                                    <strong>{reply.authorName}</strong>
                                    <span>{formatCommentTime(reply.createTime)}</span>
                                  </div>
                                </div>

                                <div className="comment-more" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="comment-more__button"
                                    aria-label="更多操作"
                                    onClick={() => toggleMenu("reply", comment.id, reply.id)}
                                  >
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <circle cx="5" cy="12" r="1.8" fill="currentColor" />
                                      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                                      <circle cx="19" cy="12" r="1.8" fill="currentColor" />
                                    </svg>
                                  </button>
                                  {activeMenuKey === getMenuKey("reply", comment.id, reply.id) && (
                                    <div className="comment-more__menu">
                                      <button type="button" onClick={() => reportItem("reply")}>
                                        举报
                                      </button>
                                      {canDelete(reply) && (
                                        <button
                                          type="button"
                                          onClick={() => deleteReply(comment.id, reply.id)}
                                        >
                                          删除
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="comment-reply__body">
                                <p className="comment-reply__content">
                                  <span className="comment-reply__target">@{reply.replyToName}</span>
                                  {reply.content}
                                </p>

                                <div className="comment-reply__footer">
                                  <button
                                    type="button"
                                    className={`comment-card__action${reply.liked ? " is-liked" : ""}`}
                                    onClick={() => likeReply(comment.id, reply)}
                                  >
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M7.04 9.11l3.297-7.419a1 1 0 01.914-.594 3.67 3.67 0 013.67 3.671V7.33h4.028a2.78 2.78 0 012.78 3.2l-1.228 8.01a2.778 2.778 0 01-2.769 2.363H5.019a2.78 2.78 0 01-2.78-2.78V11.89a2.78 2.78 0 012.78-2.78H7.04zm-2.02 2a.78.78 0 00-.781.78v6.232c0 .431.35.78.78.78H6.69V11.11H5.02zm12.723 7.793a.781.781 0 00.781-.666l1.228-8.01a.78.78 0 00-.791-.898h-5.04a1 1 0 01-1-1V4.77c0-.712-.444-1.32-1.07-1.56L8.69 10.322v8.58h9.053z"
                                      />
                                    </svg>
                                    <span>{reply.likeCount}</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="comment-card__action"
                                    onClick={() => openReplyEditor(comment, reply)}
                                  >
                                    <svg viewBox="0 0 16 16" aria-hidden="true">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.83 2.106c.628-.634 1.71-.189 1.71.704v2.065c4.821.94 6.97 4.547 7.73 8.085l-.651.14.652-.134c.157.757-.83 1.192-1.284.565l-.007-.009c-1.528-2.055-3.576-3.332-6.44-3.502v2.352c0 .893-1.082 1.338-1.71.704L1.091 8.295a1 1 0 010-1.408l4.737-4.78zm7.303 8.617C12.08 8.495 10.204 6.68 7.046 6.14c-.47-.08-.84-.486-.84-.99V3.62L2.271 7.591l3.934 3.971V9.667a.993.993 0 011.018-.995c2.397.065 4.339.803 5.909 2.051z"
                                      />
                                    </svg>
                                    <span>回复</span>
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))
                        : replyPreview && (
                            <article className="comment-reply comment-reply--preview">
                              <p className="comment-reply__preview-content">
                                <span className="comment-reply__preview-name">
                                  {replyPreview.authorName}：
                                </span>
                                {replyPreview.content}
                              </p>
                            </article>
                          )}

                      {isReplyEditorVisible(comment.id) && activeReplyTarget && (
                        <div className="comment-inline-editor">
                          <div className="comment-inline-editor__row">
                            <div className="comment-inline-editor__avatar">
                              <img src={VIEWER.avatar} alt={VIEWER.nickname} />
                            </div>
                            <div className="comment-inline-editor__input-shell">
                              <span className="comment-inline-editor__prefix">
                                回复 {activeReplyTarget.targetName}：
                              </span>
                              <input
                                type="text"
                                className="comment-inline-editor__input"
                                aria-label={`回复 ${activeReplyTarget.targetName}`}
                                value={getReplyDraft(comment.id)}
                                onChange={(e) => updateReplyDraft(comment.id, e.target.value)}
                              />
                            </div>
                            <button
                              type="button"
                              className="comment-inline-editor__submit"
                              disabled={replySubmittingMap[comment.id]}
                              onClick={() => publishMockReply(comment)}
                            >
                              回复
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="article-comments__empty">还没有评论，来说两句吧</div>
      )}

      {comments.length > 0 && hasMoreComments && (
        <div ref={loadMoreRef} className="article-comments__load-sentinel" />
      )}
    </section>
  );
}
