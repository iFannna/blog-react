export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-muted">
      {/* Widgets — 3 column flex row with gutter 2.4rem */}
      <div className="mx-auto max-w-[1420px] px-[5rem] py-[5rem]">
        <div className="flex flex-wrap gap-[2.4rem]">
          {/* Column 1 */}
          <div className="flex-1 min-w-[240px]">
            <h4 className="widget-title mb-[2rem] text-[1.4rem] font-bold text-text">
              精选文章
            </h4>
            <ul className="space-y-[1.5rem]">
              <li className="text-[1.4rem] text-text-muted">
                暂无文章。
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex-1 min-w-[240px]">
            <h4 className="widget-title mb-[2rem] text-[1.4rem] font-bold text-text">
              编辑推荐
            </h4>
            <ul className="space-y-[1.5rem]">
              <li className="text-[1.4rem] text-text-muted">
                暂无文章。
              </li>
            </ul>
          </div>

          {/* Column 3 — Links & Contact */}
          <div className="flex-1 min-w-[240px]">
            <h4 className="widget-title mb-[2rem] text-[1.4rem] font-bold text-text">
              其他
            </h4>
            <ul className="space-y-[0.8rem]">
              <li>
                <a href="/guestbook" className="text-[1.4rem] text-text-muted transition-[var(--transition-primary)] hover:text-primary">
                  留言板
                </a>
              </li>
              <li>
                <a href="/friend-link" className="text-[1.4rem] text-text-muted transition-[var(--transition-primary)] hover:text-primary">
                  友情链接
                </a>
              </li>
              <li>
                <a href="/about" className="text-[1.4rem] text-text-muted transition-[var(--transition-primary)] hover:text-primary">
                  关于
                </a>
              </li>
              <li>
                <a href="/contact" className="text-[1.4rem] text-text-muted transition-[var(--transition-primary)] hover:text-primary">
                  联系
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border-faint">
        <div className="mx-auto flex max-w-[1420px] flex-col items-center justify-between gap-[0.8rem] px-[5rem] py-[1.6rem] text-[1.2rem] text-text-light sm:flex-row">
          <span>© {new Date().getFullYear()} Blog. All rights reserved.</span>
          <span />
        </div>
      </div>
    </footer>
  );
}
