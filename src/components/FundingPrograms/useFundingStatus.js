import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { describeStatus } from "@site/src/data/funding";

// "Today" is the build date so server and client agree; dates are formatted
// for the current locale.
export default function useFundingStatus(program) {
  const { siteConfig, i18n } = useDocusaurusContext();
  const today = siteConfig.customFields.BUILD_DATE || new Date().toISOString().slice(0, 10);
  const locale = i18n.currentLocale || "en";
  const formatDate = (iso) =>
    new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
  return describeStatus(program, today, formatDate);
}
