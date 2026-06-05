import SiteLayout from "@/components/layout/SiteLayout";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { Metadata } from "next";

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
                src="https://www.3forty.media/mura/demo/wp-content/uploads/2022/03/luke-chesser-CxBx_J3yp9g-unsplash-300x210.jpg"
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

          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
