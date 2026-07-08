import SiteLayout from "@/components/layout/SiteLayout";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "排版",
  description: "Markdown 渲染样式展示",
};

export default function TypographyPage() {
  return (
    <SiteLayout
      breadcrumbs={
        <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Typography", path: "/typography" },
        ]} />
      }
    >
      <div id="primary" className="content-area">
        <article className="page-entry">
          <div className="entry-content page-entry-content">

            {/* ── 开篇段落 ── */}
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected. Together{" "}
              <strong>happy feelings</strong>{" "}
              continue juvenile had off one. Unknown may service subject her letters one bed.
            </p>

            <p>
              Oh acceptance apartments up{" "}
              <em>sympathize astonished</em>{" "}
              delightful. Waiting him new lasting towards. Continuing melancholy especially so to. Me{" "}
              <a href="#"><strong>unpleasing impossible</strong></a>{" "}
              in attachment announcing so astonished.
            </p>

            <div className="typo-spacer" />

            {/* ── H1 ── */}
            <h1 className="typo-heading-1">H1 – Continuing melancholy especially so to subject</h1>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <div className="typo-spacer" />

            {/* ── H2 ── */}
            <h2 className="typo-heading-2">H2 – Continuing melancholy especially so to subject her behaviour</h2>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <div className="typo-spacer" />

            {/* ── H3 ── */}
            <h3 className="typo-heading-3">H3 – Continuing melancholy especially so to subject her behaviour</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <div className="typo-spacer" />

            {/* ── H4 ── */}
            <h4 className="typo-heading-4">H4 – Continuing melancholy especially so to subject her behaviour</h4>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <div className="typo-spacer" />

            {/* ── H5 ── */}
            <h5 className="typo-heading-5">H5 – Continuing melancholy especially so to subject her behaviour</h5>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <div className="typo-spacer" />

            {/* ── H6 ── */}
            <h6 className="typo-heading-6">H6 – Continuing melancholy especially so to subject her behaviour</h6>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Dropcaps ── */}
            <h3 className="typo-heading-3">Dropcaps</h3>
            <p>
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
            </p>
            <p>
              Down has rose feel find man. Learning day desirous informed expenses material returned six the.
              She enabled invited exposed him another. Reasonably conviction solicitude me mr at discretion
              reasonable. Age out full gate bed day lose.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Columns ── */}
            <h3 className="typo-heading-3">Columns</h3>
            <div className="page-columns">
              <div className="page-column">
                <p>
                  Down has rose feel find man. Learning day desirous informed expenses material returned six
                  the. She enabled invited exposed him another. Reasonably conviction solicitude me mr at
                  discretion reasonable. Age out full gate bed day lose.
                </p>
              </div>
              <div className="page-column">
                <p>
                  Down has rose feel find man. Learning day desirous informed expenses material returned six
                  the. She enabled invited exposed him another. Reasonably conviction solicitude me mr at
                  discretion reasonable. Age out full gate bed day lose.
                </p>
              </div>
            </div>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Paragraphs ── */}
            <h3 className="typo-heading-3">Paragraphs</h3>
            <p>
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
              Pasture imagine my garrets an he.
            </p>
            <p>
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
              Pasture imagine my garrets an he.
            </p>

            <div className="typo-spacer" />

            {/* ── Small font ── */}
            <h4 className="typo-heading-4">Small font</h4>
            <p className="typo-font-small">
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
              Pasture imagine my garrets an he.
            </p>

            <div className="typo-spacer" />

            {/* ── Medium Font ── */}
            <h4 className="typo-heading-4">Medium Font</h4>
            <p className="typo-font-medium">
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
              Pasture imagine my garrets an he.
            </p>

            <div className="typo-spacer" />

            {/* ── Large Font ── */}
            <h4 className="typo-heading-4">Large Font</h4>
            <p className="typo-font-large">
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
              Pasture imagine my garrets an he.
            </p>

            <div className="typo-spacer" />

            {/* ── X-Large Font ── */}
            <h4 className="typo-heading-4">X-Large Font</h4>
            <p className="typo-font-xlarge">
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
              Pasture imagine my garrets an he.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Blockquote & Pullquote ── */}
            <h3 className="typo-heading-3">Blockquote &amp; Pullquote</h3>

            <blockquote className="typo-quote">
              <p>
                Twenty years from now you will be more disappointed by the{" "}
                <strong>things that you didn't do</strong>{" "}
                than by the ones you did do — Mark Twain
              </p>
            </blockquote>

            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <blockquote className="typo-quote">
              <p>
                Twenty years from now you will be more disappointed by the{" "}
                <strong>things that you didn't do</strong>{" "}
                than by the ones you did do — Mark Twain
              </p>
            </blockquote>

            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <blockquote className="typo-quote">
              <p>
                Twenty years from now you will be more disappointed by the{" "}
                <strong>things that you didn't do</strong>{" "}
                than by the ones you did do — Mark Twain
              </p>
            </blockquote>

            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <blockquote className="typo-quote">
              <p>
                Twenty years from now you will be more disappointed by the{" "}
                <strong>things that you didn't do</strong>{" "}
                than by the ones you did do — MARK TWAIN
              </p>
            </blockquote>

            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <p>
              At ourselves direction believing do he departure. Celebrated her had sentiments understood are
              projection set. Possession ye no mr unaffected remarkably at. Wrote house in never fruit up.
              Pasture imagine my garrets an he. Its sometimes her behaviour are contented. Do listening am
              eagerness oh objection collected. Together happy feelings continue juvenile had off one.
            </p>

            <blockquote className="typo-quote">
              <p>
                Twenty years from now you will be more disappointed by the{" "}
                <strong>things that you didn't do</strong>{" "}
                than by the ones you did do — MARK TWAIN
              </p>
            </blockquote>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Lists ── */}
            <h3 className="typo-heading-3">Lists</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <ul className="typo-list">
              <li>Pasture imagine in my garrets</li>
              <li>Together happy feelings are</li>
              <li>Do listening sometimes then</li>
            </ul>

            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <ol className="typo-list">
              <li>Pasture imagine in my garrets</li>
              <li>Together happy feelings are</li>
              <li>Do listening sometimes then</li>
            </ol>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Image alignment ── */}
            <h3 className="typo-heading-3">Image alignment</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>
            <p>
              Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards.
              Continuing melancholy especially so to. Me{" "}
              <a href="#"><strong>unpleasing impossible</strong></a>{" "}
              in attachment announcing so astonished.
            </p>

            <figure className="typo-image-left">
              <img
                decoding="async"
                src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg"
                alt=""
                style={{ width: 300, height: 200 }}
              />
              <figcaption>Left aligned image</figcaption>
            </figure>

            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one. Unknown may service subject her letters one bed.
            </p>
            <p>
              Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards.
              Continuing melancholy especially so to. Me{" "}
              <a href="#"><strong>unpleasing impossible</strong></a>{" "}
              in attachment announcing so astonished.
            </p>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one. Unknown may service subject her letters one bed.
            </p>

            <figure className="typo-image-right">
              <img
                decoding="async"
                src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg"
                alt=""
              />
            </figure>

            <p>
              Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards.
              Continuing melancholy especially so to. Me{" "}
              <a href="#"><strong>unpleasing impossible</strong></a>{" "}
              in attachment announcing so astonished.
            </p>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one. Unknown may service subject her letters one bed.
            </p>
            <p>
              Oh acceptance apartments up sympathize astonished delightful. Waiting him new lasting towards.
              Continuing melancholy especially so to. Me{" "}
              <a href="#"><strong>unpleasing impossible</strong></a>{" "}
              in attachment announcing so astonished.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Code ── */}
            <h3 className="typo-heading-3">Code</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <pre className="typo-code-block">
              <code>{`<?php

function theme_setup() {

  add_theme_support( 'html5', array(
    'comment-form',
    'comment-list',
    'gallery',
    'caption',
    'search',
  ) );

}

add_action( 'after_setup_theme', 'theme_setup' );

?>`}</code>
            </pre>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── Buttons ── */}
            <h3 className="typo-heading-3">Buttons</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
              Together happy feelings continue juvenile had off one.
            </p>

            <div className="page-columns typo-buttons-row">
              <div className="page-column">
                <div className="typo-buttons-group">
                  <a className="typo-btn" style={{ borderRadius: 0 }}>
                    Button
                  </a>
                </div>
              </div>
              <div className="page-column">
                <div className="typo-buttons-group">
                  <a className="typo-btn typo-btn--outline" style={{ borderRadius: 0 }}>
                    Outline Button
                  </a>
                </div>
              </div>
              <div className="page-column">
                <div className="typo-buttons-group">
                  <a className="typo-btn typo-btn--rounded">
                    Rounded Button
                  </a>
                </div>
              </div>
            </div>

            <hr className="typo-separator" />

            <p>
              Down has rose feel find man. Learning day desirous informed expenses material returned six the.
              She enabled invited exposed him another. Reasonably conviction solicitude me mr at discretion
              reasonable. Age out full gate bed day lose.
            </p>

            <div className="typo-spacer" />

            {/* ── 1. 行内代码 ── */}
            <h3 className="typo-heading-3">Inline Code</h3>
            <p>
              You can install the package by running{" "}
              <code className="typo-inline-code">npm install blog-theme</code>{" "}
              in your terminal. The entry point is{" "}
              <code className="typo-inline-code">src/index.ts</code>{" "}
              and the default port is{" "}
              <code className="typo-inline-code">3000</code>.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 2. 表格 ── */}
            <h3 className="typo-heading-3">Table</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
            </p>

            <table className="typo-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jane Cooper</td>
                  <td>Developer</td>
                  <td>jane@example.com</td>
                  <td><span className="typo-badge typo-badge--green">Active</span></td>
                </tr>
                <tr>
                  <td>Floyd Miles</td>
                  <td>Designer</td>
                  <td>floyd@example.com</td>
                  <td><span className="typo-badge typo-badge--gray">Inactive</span></td>
                </tr>
                <tr>
                  <td>Ronald Richards</td>
                  <td>Manager</td>
                  <td>ronald@example.com</td>
                  <td><span className="typo-badge typo-badge--green">Active</span></td>
                </tr>
                <tr>
                  <td>Marvin McKinney</td>
                  <td>Writer</td>
                  <td>marvin@example.com</td>
                  <td><span className="typo-badge typo-badge--yellow">Pending</span></td>
                </tr>
                <tr>
                  <td>Jenny Wilson</td>
                  <td>Editor</td>
                  <td>jenny@example.com</td>
                  <td><span className="typo-badge typo-badge--green">Active</span></td>
                </tr>
              </tbody>
            </table>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 3. 任务列表 ── */}
            <h3 className="typo-heading-3">Task List</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
            </p>

            <ul className="typo-task-list">
              <li>
                <span className="typo-checkbox typo-checkbox--checked">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Create a new project</span>
              </li>
              <li>
                <span className="typo-checkbox typo-checkbox--checked">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Configure the development environment</span>
              </li>
              <li>
                <span className="typo-checkbox" />
                <span>Write documentation</span>
              </li>
              <li>
                <span className="typo-checkbox" />
                <span>Deploy to production</span>
              </li>
            </ul>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 4. 嵌套列表 ── */}
            <h3 className="typo-heading-3">Nested List</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
            </p>

            <ul className="typo-list">
              <li>Frontend
                <ul className="typo-list">
                  <li>React</li>
                  <li>Vue</li>
                  <li>Angular</li>
                </ul>
              </li>
              <li>Backend
                <ul className="typo-list">
                  <li>Node.js</li>
                  <li>Python</li>
                  <li>Go</li>
                </ul>
              </li>
              <li>DevOps
                <ul className="typo-list">
                  <li>Docker</li>
                  <li>Kubernetes</li>
                </ul>
              </li>
            </ul>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 5. 删除线 ── */}
            <h3 className="typo-heading-3">Strikethrough</h3>
            <p>
              The old price was{" "}
              <del>$99.99</del>{" "}
              and the new price is <strong>$49.99</strong>. This feature has been{" "}
              <del>deprecated</del>{" "}
              replaced with a better alternative.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 6. 上标 / 下标 ── */}
            <h3 className="typo-heading-3">Superscript &amp; Subscript</h3>
            <p>
              Einstein's famous equation is E = mc<sup>2</sup>. Water is composed
              of H<sub>2</sub>O. The chemical formula for sulfuric acid is
              H<sub>2</sub>SO<sub>4</sub>.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 7. 高亮 ── */}
            <h3 className="typo-heading-3">Highlight</h3>
            <p>
              The most important thing to remember is{" "}
              <mark className="typo-highlight">consistency is key</mark>{" "}
              when building a design system. You should always{" "}
              <mark className="typo-highlight">test your changes</mark>{" "}
              before deploying to production.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 8. 嵌套引用 ── */}
            <h3 className="typo-heading-3">Nested Blockquote</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
            </p>

            <blockquote className="typo-quote">
              <p>
                Twenty years from now you will be more disappointed by the{" "}
                <strong>things that you didn't do</strong>{" "}
                than by the ones you did do.
              </p>
              <blockquote className="typo-quote">
                <p>
                  The secret of getting ahead is getting started. — Mark Twain
                </p>
              </blockquote>
            </blockquote>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 9. 带语言标识的代码块 ── */}
            <h3 className="typo-heading-3">Code with Language Label</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
            </p>

            <div className="typo-code-wrapper">
              <span className="typo-code-lang">JavaScript</span>
              <pre className="typo-code-block">
                <code>{`function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

greet('World');`}</code>
              </pre>
            </div>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 10. 居中图片 & 全宽图片 ── */}
            <h3 className="typo-heading-3">Image Centered &amp; Full Width</h3>

            <figure className="typo-image-center">
              <img
                src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg"
                alt=""
              />
              <figcaption>Centered image with caption</figcaption>
            </figure>

            <div className="typo-spacer" />

            <figure className="typo-image-fullwidth">
              <img
                src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/media/image/2026/04/b482211c-135f-426a-b36d-ec519374b6a6.jpg"
                alt=""
              />
              <figcaption>Full width image</figcaption>
            </figure>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 11. 带 cite 的引用 ── */}
            <h3 className="typo-heading-3">Blockquote with Citation</h3>
            <p>
              Its sometimes her behaviour are contented. Do listening am eagerness oh objection collected.
            </p>

            <blockquote className="typo-quote">
              <p>
                The only way to do great work is to love what you do. If you haven't
                found it yet, keep looking. Don't settle.
              </p>
              <footer className="typo-quote-footer">
                — <cite>Steve Jobs</cite>, Stanford Commencement Address, 2005
              </footer>
            </blockquote>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 14. 缩写 ── */}
            <h3 className="typo-heading-3">Abbreviation</h3>
            <p>
              We use <abbr title="HyperText Markup Language" className="typo-abbr">HTML</abbr>{" "}
              to structure the page,{" "}
              <abbr title="Cascading Style Sheets" className="typo-abbr">CSS</abbr>{" "}
              to style it, and{" "}
              <abbr title="JavaScript" className="typo-abbr">JS</abbr>{" "}
              to add interactivity. The{" "}
              <abbr title="Application Programming Interface" className="typo-abbr">API</abbr>{" "}
              handles data exchange between client and server.
            </p>

            <hr className="typo-separator" />
            <div className="typo-spacer" />

            {/* ── 15. 键盘快捷键 ── */}
            <h3 className="typo-heading-3">Keyboard Shortcuts</h3>
            <p>
              To copy text, press{" "}
              <kbd className="typo-kbd">Ctrl</kbd> + <kbd className="typo-kbd">C</kbd>.
              To paste, press{" "}
              <kbd className="typo-kbd">Ctrl</kbd> + <kbd className="typo-kbd">V</kbd>.
              To save, press{" "}
              <kbd className="typo-kbd">Ctrl</kbd> + <kbd className="typo-kbd">S</kbd>.
              To undo, press{" "}
              <kbd className="typo-kbd">Ctrl</kbd> + <kbd className="typo-kbd">Z</kbd>.
            </p>
            <p>
              On macOS, use <kbd className="typo-kbd">⌘ Cmd</kbd> instead of{" "}
              <kbd className="typo-kbd">Ctrl</kbd>. Switch tabs with{" "}
              <kbd className="typo-kbd">Ctrl</kbd> + <kbd className="typo-kbd">Tab</kbd>.
            </p>

          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
