import type { ComponentType } from "react";
import type { SectionId } from "../../../content/types";
import { Cameras } from "./Cameras";
import { Cta } from "./Cta";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Hold } from "./Hold";
import { Paths } from "./Paths";
import { Pipeline } from "./Pipeline";
import { Printables } from "./Printables";
import { Problem } from "./Problem";
import { Specs } from "./Specs";

/**
 * id → component map for content/site.ts sections registry.
 * page.tsx only maps; parallel PRs replace section modules in place.
 */
export const sectionComponents: Record<SectionId, ComponentType> = {
  hero: Hero,
  problem: Problem,
  pipeline: Pipeline,
  paths: Paths,
  hold: Hold,
  specs: Specs,
  printables: Printables,
  cameras: Cameras,
  cta: Cta,
  footer: Footer,
};

export {
  Cameras,
  Cta,
  Footer,
  Hero,
  Hold,
  Paths,
  Pipeline,
  Printables,
  Problem,
  Specs,
};
