import SiteLayout from "@/components/blog/layout/SiteLayout";
import Breadcrumbs from "@/components/blog/common/Breadcrumbs";
import { getSiteSetting } from "@/services/site";
import { DOC_LOCALES } from "@/lib/docs/types";
import { localePath } from "@/lib/locale";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateStaticParams() {
  return DOC_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const setting = await getSiteSetting().catch(() => null);
  const email = setting?.developer_email?.trim() || "";
  const phone = setting?.developer_phone?.trim() || "";
  return (
    <SiteLayout
      locale={locale}
      breadcrumbs={
        <Breadcrumbs items={[
          { name: "Home", path: localePath(locale, "/") },
          { name: "Contact", path: localePath(locale, "/contact") },
        ]} />
      }
    >
      <div id="primary" className="content-area">
        <article className="page-entry">
          <div className="entry-content page-entry-content">
            <div className="page-columns items-top flex-layout">
              {/* ── Left: Contact info ── */}
              <div className="page-column items-top page-column-wide">
                <h6 className="page-heading page-heading-6 text-accent-pink">
                  期待你的来信
                </h6>
                <h2 className="page-heading page-heading-2">
                  你好<br />
                  欢迎给我<em>留言</em>
                </h2>
                <p>
                  很高兴与你在此相遇。无论是想法上的交流、项目上的合作，还是关于本站的
                  <a href="#"><strong>一点建议</strong></a>，我都乐于倾听。
                </p>
                <p>
                  我会认真阅读每一条消息，并尽快回复。你也可以直接来信，邮箱始终敞开。
                </p>
                <div className="page-spacer spacer-md" />
                <div className="contact-info-line">
                  <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M26.693 3.41H5.339c-2.269 0-4.004 1.735-4.004 4.004V23.43c0 2.269 1.735 4.004 4.004 4.004h21.354c2.269 0 4.004-1.735 4.004-4.004V7.414c0-2.269-1.735-4.004-4.004-4.004zM5.339 6.079h21.354c.534 0 .934.267 1.201.801l-11.878 8.275L4.138 6.88c.267-.534.667-.801 1.201-.801zm21.354 18.685H5.339c-.801 0-1.335-.534-1.335-1.335V9.949l11.211 7.874c.267.133.534.267.801.267s.534-.133.801-.267l11.211-7.874v13.48c0 .801-.534 1.335-1.335 1.335z" />
                  </svg>
                  <span>{email}</span>
                </div>
                <div className="page-spacer spacer-xs" />
                <div className="contact-info-line">
                  <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M27.227 17.957c-1.201-.133-2.402-.4-3.47-.801-1.468-.534-3.07-.133-4.271.934l-.934.934c-2.402-1.602-4.538-3.604-6.139-6.139l.934-.934c1.068-1.068 1.468-2.803.934-4.271-.4-1.068-.667-2.269-.801-3.47C13.213 2.208 11.478.74 9.476.74H5.072c-1.068.133-2.002.667-2.669 1.468s-.934 1.868-.934 2.936c.4 4.271 2.002 8.542 4.271 12.145a28.055 28.055 0 008.408 8.408c3.604 2.402 7.874 3.87 12.145 4.271h.4c1.068 0 2.135-.4 2.803-1.201s1.201-1.735 1.201-2.803V21.96c0-2.002-1.468-3.737-3.47-4.004zm.8 4.004v4.004c0 .4-.133.667-.4.934s-.534.4-1.068.4c-3.87-.4-7.607-1.735-10.944-3.87-3.07-1.868-5.605-4.538-7.607-7.607-2.135-3.337-3.47-7.074-3.87-10.944 0-.4.133-.667.267-.934.267-.267.667-.534 1.068-.534h4.004c.667 0 1.201.534 1.335 1.201a13.644 13.644 0 001.068 4.004c.133.534 0 1.068-.267 1.468l-1.735 1.602c-.4.4-.534 1.068-.267 1.602a21.896 21.896 0 008.542 8.542c.534.267 1.201.267 1.602-.267l1.735-1.735c.4-.4.934-.534 1.468-.267 1.335.534 2.669.801 4.004 1.068.534.133 1.068.667 1.068 1.335zM20.286-.594c-.667-.133-1.335.4-1.468 1.201-.133.667.4 1.335 1.201 1.468 4.938.534 8.809 4.404 9.476 9.476.133.667.667 1.201 1.335 1.201h.133c.667-.133 1.201-.801 1.201-1.468C31.363 5.011 26.425.073 20.286-.594zm3.737 12.145c.133.667.667 1.068 1.335 1.068h.267a1.385 1.385 0 001.068-1.602c-.667-3.203-3.07-5.739-6.273-6.273-.667-.133-1.468.267-1.602 1.068s.267 1.468 1.068 1.602c2.135.4 3.737 2.002 4.137 4.137z" />
                  </svg>
                  <span>{phone}</span>
                </div>
                <div className="page-spacer spacer-xs" />
              </div>

              {/* ── Right: Contact form ── */}
              <div className="page-column items-top page-column-narrow">
                <p>
                  欢迎<strong>给我留言</strong>，填写下方表单即可，我会<strong>尽快回复你</strong>！
                </p>
                <form className="contact-form" noValidate>
                  <div className="form-field">
                    <fieldset>
                      <legend className="form-field-label">
                        姓名 <span className="form-required" aria-hidden="true">*</span>
                      </legend>
                      <div className="form-name-row">
                        <div className="form-name-block">
                          <input type="text" className="form-field-input" name="first" required />
                          <label className="form-field-sublabel">名</label>
                        </div>
                        <div className="form-name-block">
                          <input type="text" className="form-field-input" name="last" required />
                          <label className="form-field-sublabel">姓</label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="form-field">
                    <label className="form-field-label" htmlFor="contact-email">
                      邮箱 <span className="form-required" aria-hidden="true">*</span>
                    </label>
                    <input id="contact-email" type="email" className="form-field-input" name="email" required />
                  </div>
                  <div className="form-field">
                    <label className="form-field-label" htmlFor="contact-message">
                      评论或留言
                    </label>
                    <textarea id="contact-message" className="form-field-textarea" name="message" />
                  </div>
                  <div className="form-submit-wrapper">
                    <button type="submit" className="form-submit-btn">提交</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
