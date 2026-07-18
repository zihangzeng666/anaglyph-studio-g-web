import { site } from "../../content/site";
import { sectionComponents } from "@/components/sections";

/**
 * Long-page home: maps content/site.ts sections registry → components only.
 * Parallel section PRs replace modules under components/sections without
 * reordering sibling JSX by hand.
 */
export default function HomePage() {
  return (
    <main id="main">
      {site.sections.map((slot) => {
        const Component = sectionComponents[slot.id];
        return <Component key={slot.id} />;
      })}
    </main>
  );
}
