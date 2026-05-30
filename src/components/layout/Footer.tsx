import Link from "next/link";
import { mockArticles, mockFooterData } from "@/lib/mock-data";

const featuredArticles = mockArticles.slice(0, 3);
const editorPickArticles = mockArticles.slice(3);

function formatDate(iso: string) {
  const d = new Date(iso);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return {
    month: months[d.getMonth()],
    day: d.getDate(),
    year: d.getFullYear(),
  };
}

function ArticleCard({ article }: { article: (typeof mockArticles)[number] }) {
  const date = formatDate(article.publishTime);
  return (
    <li>
      <div className="footer-post-thumb">
        <Link href={article.url}>
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              loading="lazy"
            />
          ) : (
            <span className="footer-thumb-placeholder" aria-label="暂无封面">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
              </svg>
            </span>
          )}
        </Link>
      </div>
      <Link href={article.url} className="footer-post-title">
        {article.title}
      </Link>
      <div className="footer-post-author">by {article.authorName}</div>
      <div className="footer-post-date">
        {date.month} <span>&nbsp;</span>{date.day}<span>, </span>{date.year}
      </div>
    </li>
  );
}

export default function Footer() {
  return (
    <footer id="colophon" className="site-footer">
      {/* Widgets */}
      <div id="footer">
        <div className="footer-container">
          <div className="footer-widgets">
            {/* Column 1: 精选文章 */}
            <div className="footer-column">
              <div className="footer-widget">
                <h4 className="footer-widget-title">精选文章</h4>
                <ul className="footer-posts-list">
                  {featuredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 2: 编辑推荐 */}
            <div className="footer-column">
              <div className="footer-widget">
                <h4 className="footer-widget-title">编辑推荐</h4>
                <ul className="footer-posts-list">
                  {editorPickArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: 其他 + 帮助 + 联系方式 */}
            <div className="footer-column">
              <div className="footer-widget">
                <div className="footer-columns">
                  <div className="footer-sub-column">
                    <h6 className="footer-sub-title">其他</h6>
                    <ul className="footer-links-list">
                      <li>
                        <Link href="/guestbook">留言板</Link>
                        <span className="footer-link-count">{mockFooterData.guestbookCount}</span>
                      </li>
                      <li>
                        <Link href="/friend-link">友链</Link>
                        <span className="footer-link-count">{mockFooterData.friendLinkCount}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-sub-column">
                    <h6 className="footer-sub-title">帮助</h6>
                    <ul className="footer-links-list">
                      <li>
                        <Link href="/about">关于</Link>
                      </li>
                      <li>
                        <Link href="/contact">联系</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="footer-widget">
                <div className="footer-contact-columns">
                  <div className="footer-contact-col">
                    <p>
                      <strong>邮箱:</strong>
                      <br />
                      <Link href={`mailto:${mockFooterData.email}`}>
                        {mockFooterData.email}
                      </Link>
                    </p>
                  </div>
                  <div className="footer-contact-col">
                    <p>
                      <strong>电话:</strong>
                      <br />
                      <Link href={`tel:${mockFooterData.phone}`}>
                        {mockFooterData.phone}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright-bar">
        <div className="footer-container">
          <div className="copyright-left">
            <span>Copyright 2025 &mdash; {mockFooterData.siteName}.</span>
          </div>
          <div className="copyright-right">
            <a href="http://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              {mockFooterData.icp}
            </a>
            {mockFooterData.icp && mockFooterData.police && (
              <>&nbsp;</>
            )}
            <a href="https://beian.mps.gov.cn/" target="_blank" rel="noopener noreferrer">
              {mockFooterData.police}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
