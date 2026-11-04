/** The public repository this site is published from. */
export const REPO_URL = "https://github.com/theuxkey-cpu/portfolio-in-code"

/** Link to a folder or file of the public repo, e.g. sourceUrl("src/prototypes/help-center"). */
export function sourceUrl(path: string): string {
  return `${REPO_URL}/tree/main/${path.replace(/^\/+/, "")}`
}
