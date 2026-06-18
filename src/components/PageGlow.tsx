// Decorative indigo→violet aurora behind a page. Fixed to the viewport and
// scroll-reactive (see .page-glow in index.css). Render as a sibling BEFORE the
// animated page root so its `position: fixed` isn't captured by the page's
// transform during the enter animation.
export default function PageGlow() {
  return <div className="page-glow" aria-hidden="true" />
}
