import Link from "next/link";
import { articleHref } from "@/lib/utils";
import { ArchiveDateLinks } from "@/components/ui/ArchiveDateLinks";
import type { Article } from "@/types/ui";

function FooterArticleCard({ article }: { article: Article }) {
  return (
    <li>
      <div className="footer-post-thumb">
        <Link href={articleHref(article)}>
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              width={120}
              height={90}
              loading="lazy"
              decoding="async"
              className="footer-thumb-img"
            />
          ) : (
            <span className="footer-thumb-placeholder cover-placeholder" aria-label="暂无封面">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
              </svg>
            </span>
          )}
        </Link>
      </div>
      <div className="footer-post-content">
        <Link href={articleHref(article)} className="footer-post-title">
          {article.title}
        </Link>
        <div className="footer-post-author">by {article.authorName}</div>
        <div className="footer-post-date">
          <ArchiveDateLinks year={article.year} month={article.month} day={article.day} />
        </div>
      </div>
    </li>
  );
}

interface FooterProps {
  featuredArticles: Article[];
  editorPickArticles: Article[];
  siteName: string;
  email: string;
  phone: string;
  icp: string;
  police: string;
  guestbookCount: number;
  friendLinkCount: number;
}

export default function Footer({
  featuredArticles,
  editorPickArticles,
  siteName,
  email,
  phone,
  icp,
  police,
  guestbookCount,
  friendLinkCount,
}: FooterProps) {
  return (
    <footer id="colophon" className="site-footer">
      <div id="footer">
        <div className="footer-container">
          <div className="footer-widgets">
            {featuredArticles.length > 0 && (
              <div className="footer-column">
                <div className="footer-widget">
                  <h4 className="footer-widget-title">精选文章</h4>
                  <ul className="footer-posts-list">
                    {featuredArticles.map((article) => (
                      <FooterArticleCard key={article.id} article={article} />
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {editorPickArticles.length > 0 && (
              <div className="footer-column">
                <div className="footer-widget">
                  <h4 className="footer-widget-title">编辑推荐</h4>
                  <ul className="footer-posts-list">
                    {editorPickArticles.map((article) => (
                      <FooterArticleCard key={article.id} article={article} />
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="footer-column">
              <div className="footer-widget">
                <div className="footer-columns">
                  <div className="footer-sub-column">
                    <h6 className="footer-sub-title">其他</h6>
                    <ul className="footer-links-list">
                      <li>
                        <Link href="/guestbook">留言板</Link>
                        <span className="footer-link-count">{guestbookCount}</span>
                      </li>
                      <li>
                        <Link href="/friendlink">友链</Link>
                        <span className="footer-link-count">{friendLinkCount}</span>
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
                      <Link href={`mailto:${email}`}>
                        {email}
                      </Link>
                    </p>
                  </div>
                  <div className="footer-contact-col">
                    <p>
                      <strong>电话:</strong>
                      <br />
                      <Link href={`tel:${phone}`}>
                        {phone}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright-bar">
        <div className="footer-container">
          <div className="copyright-left">
            <span>Copyright {new Date().getFullYear()} &mdash; <Link href="/">{siteName}</Link>.</span>
          </div>
          <div className="copyright-right">
            <a href="http://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              {icp}
            </a>
            {icp && police && (
              <>&nbsp;</>
            )}
            <a href="https://beian.mps.gov.cn/" target="_blank" rel="noopener noreferrer">
              {police}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
