import { site } from "../config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>{site.tagline} ♡</p>
      <p>
        <a href={site.domain}>{site.host}</a>
      </p>
    </footer>
  );
}
