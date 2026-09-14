import { v4 as uuid } from "uuid";
import type {
  Block,
  BlockType,
  CoverBlock,
  AboutBlock,
  ConceptBlock,
  ScopeBlock,
  BudgetBlock,
  MaterialsBlock,
  PortfolioBlock,
  TermsBlock,
  CustomBlock,
} from "../types";

export const BLOCK_LABELS: Record<BlockType, string> = {
  cover: "Cover Page",
  about: "About the Artist",
  concept: "Concept & Vision",
  scope: "Scope & Timeline",
  budget: "Budget",
  materials: "Materials & Process",
  portfolio: "Past Work",
  terms: "Terms & Contact",
  custom: "Custom Section",
};

function createCover(): CoverBlock {
  return {
    id: uuid(),
    type: "cover",
    title: BLOCK_LABELS.cover,
    projectTitle: "Untitled Mural Project",
    clientName: "Client / Organization Name",
    location: "City, State",
    date: new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    preparedBy: "Your Name / Studio",
    heroImage: "",
    tagline: "A proposal for a site-specific mural",
  };
}

function createAbout(): AboutBlock {
  return {
    id: uuid(),
    type: "about",
    title: BLOCK_LABELS.about,
    heading: "About the Artist",
    artistName: "Your Name",
    headshot: "",
    body: "Write a short bio: your background, style, and why you're the right fit for this project.",
  };
}

function createConcept(): ConceptBlock {
  return {
    id: uuid(),
    type: "concept",
    title: BLOCK_LABELS.concept,
    heading: "Concept & Vision",
    narrative:
      "Describe the concept for this specific wall/space: the story, imagery, color palette, and how it responds to the site and community.",
    images: [],
  };
}

function createScope(): ScopeBlock {
  return {
    id: uuid(),
    type: "scope",
    title: BLOCK_LABELS.scope,
    heading: "Scope & Timeline",
    intro: "An outline of the phases from approval to completion.",
    milestones: [
      { id: uuid(), label: "Design & Approval", window: "Week 1-2", detail: "Finalize concept sketch and color mockup with client sign-off." },
      { id: uuid(), label: "Surface Prep", window: "Week 3", detail: "Pressure wash, prime, and prep the wall surface." },
      { id: uuid(), label: "Painting", window: "Week 3-5", detail: "On-site painting, weather permitting." },
      { id: uuid(), label: "Sealing & Walkthrough", window: "Week 6", detail: "Apply protective anti-graffiti coating and final client walkthrough." },
    ],
  };
}

function createBudget(): BudgetBlock {
  return {
    id: uuid(),
    type: "budget",
    title: BLOCK_LABELS.budget,
    heading: "Budget",
    note: "Pricing includes design, labor, materials, and equipment unless noted otherwise.",
    items: [
      { id: uuid(), label: "Design & Concept Development", detail: "Sketches, color studies, revisions", amount: 500 },
      { id: uuid(), label: "Materials", detail: "Paint, primer, sealant, supplies", amount: 800 },
      { id: uuid(), label: "Labor & Installation", detail: "On-site painting days", amount: 3200 },
      { id: uuid(), label: "Equipment", detail: "Lift/scaffold rental if needed", amount: 400 },
    ],
    showTotal: true,
  };
}

function createMaterials(): MaterialsBlock {
  return {
    id: uuid(),
    type: "materials",
    title: BLOCK_LABELS.materials,
    heading: "Materials & Process",
    body: "Notes on paint type, longevity, and maintenance.",
    bullets: [
      "Exterior-grade acrylic mural paint rated for UV and weather exposure",
      "Anti-graffiti clear coat sealant for protection and easy cleaning",
      "Expected lifespan of 8-10+ years with minimal maintenance",
    ],
  };
}

function createPortfolio(): PortfolioBlock {
  return {
    id: uuid(),
    type: "portfolio",
    title: BLOCK_LABELS.portfolio,
    heading: "Past Work",
    intro: "A selection of relevant past projects.",
    images: [],
  };
}

function createTerms(): TermsBlock {
  return {
    id: uuid(),
    type: "terms",
    title: BLOCK_LABELS.terms,
    heading: "Terms & Next Steps",
    body: "A 50% deposit secures your project date, with the remaining balance due upon completion. Proposal valid for 30 days.",
    contactName: "Your Name",
    contactEmail: "you@example.com",
    contactPhone: "(555) 555-5555",
  };
}

function createCustom(): CustomBlock {
  return {
    id: uuid(),
    type: "custom",
    title: BLOCK_LABELS.custom,
    heading: "Custom Section",
    body: "Add anything unique to this project: permits, community involvement, press, sponsors, etc.",
  };
}

export function createBlock(type: BlockType): Block {
  switch (type) {
    case "cover":
      return createCover();
    case "about":
      return createAbout();
    case "concept":
      return createConcept();
    case "scope":
      return createScope();
    case "budget":
      return createBudget();
    case "materials":
      return createMaterials();
    case "portfolio":
      return createPortfolio();
    case "terms":
      return createTerms();
    case "custom":
      return createCustom();
  }
}

export function createStarterProposal() {
  return {
    id: uuid(),
    title: "Untitled Proposal",
    themeId: "slate" as const,
    blocks: [
      createCover(),
      createAbout(),
      createConcept(),
      createScope(),
      createBudget(),
      createMaterials(),
      createPortfolio(),
      createTerms(),
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
