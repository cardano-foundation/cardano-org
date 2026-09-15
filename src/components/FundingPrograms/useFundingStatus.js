import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { describeStatus } from "@site/src/data/funding";

// The only place that reads the build date and the locale. The build date
// keeps server and client in agreement on "today"; the locale formats dates
// in the page language. Everything else is describeStatus in the data file.
export default function useFundingStatus(venue) {
  const { siteConfig, i18n } = useDocusaurusContext();
  const today = siteConfig.customFields.BUILD_DATE || new Date().toISOString().slice(0, 10);
  const locale = i18n.currentLocale || "en";
  const formatDate = (iso) =>
    new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
  return describeStatus(venue, today, formatDate);
}
