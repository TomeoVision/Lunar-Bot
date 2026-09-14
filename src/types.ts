export type ThemeId = "slate" | "sunset" | "forest" | "concrete" | "midnight";

export interface Theme {
  id: ThemeId;
  label: string;
  bg: string;
  surface: string;
  text: string;
  subtext: string;
  accent: string;
  accentText: string;
  heading: string;
  body: string;
}

export interface LineItem {
  id: string;
  label: string;
  detail: string;
  amount: number;
}

export interface MilestoneItem {
  id: string;
  label: string;
  window: string;
  detail: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
}

export type SurfaceType = "smooth" | "textured" | "brick" | "wood" | "concrete_block";

export interface EstimatorConfig {
  widthFt: number;
  heightFt: number;
  surfaceType: SurfaceType;
  ratePerSqFt: number;
  designFee: number;
  travelFee: number;
}

export type BlockType =
  | "cover"
  | "about"
  | "concept"
  | "scope"
  | "budget"
  | "materials"
  | "portfolio"
  | "terms"
  | "signature"
  | "custom";

interface BlockBase {
  id: string;
  type: BlockType;
  title: string;
  hidden?: boolean;
}

export interface CoverBlock extends BlockBase {
  type: "cover";
  projectTitle: string;
  clientName: string;
  location: string;
  date: string;
  preparedBy: string;
  heroImage: string;
  tagline: string;
}

export interface AboutBlock extends BlockBase {
  type: "about";
  heading: string;
  body: string;
  headshot: string;
  artistName: string;
}

export interface ConceptBlock extends BlockBase {
  type: "concept";
  heading: string;
  narrative: string;
  images: GalleryImage[];
}

export interface ScopeBlock extends BlockBase {
  type: "scope";
  heading: string;
  intro: string;
  milestones: MilestoneItem[];
}

export interface BudgetBlock extends BlockBase {
  type: "budget";
  heading: string;
  note: string;
  items: LineItem[];
  showTotal: boolean;
  estimator: EstimatorConfig;
}

export interface MaterialsBlock extends BlockBase {
  type: "materials";
  heading: string;
  body: string;
  bullets: string[];
}

export interface PortfolioBlock extends BlockBase {
  type: "portfolio";
  heading: string;
  intro: string;
  images: GalleryImage[];
}

export interface TermsBlock extends BlockBase {
  type: "terms";
  heading: string;
  body: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface SignatureBlock extends BlockBase {
  type: "signature";
  heading: string;
  agreementText: string;
}

export interface CustomBlock extends BlockBase {
  type: "custom";
  heading: string;
  body: string;
}

export type Block =
  | CoverBlock
  | AboutBlock
  | ConceptBlock
  | ScopeBlock
  | BudgetBlock
  | MaterialsBlock
  | PortfolioBlock
  | TermsBlock
  | SignatureBlock
  | CustomBlock;

export interface Approval {
  name: string;
  approvedAt: number;
}

export interface Proposal {
  id: string;
  title: string;
  themeId: ThemeId;
  blocks: Block[];
  approval?: Approval;
  createdAt: number;
  updatedAt: number;
}

export interface ProposalMeta {
  id: string;
  title: string;
  updatedAt: number;
}

export interface LibraryBio {
  id: string;
  label: string;
  artistName: string;
  headshot: string;
  body: string;
}

export interface LibraryImageItem {
  id: string;
  label: string;
  src: string;
  caption: string;
}

export interface LibrarySnippet {
  id: string;
  label: string;
  body: string;
}

export interface ContentLibraryData {
  bios: LibraryBio[];
  images: LibraryImageItem[];
  snippets: LibrarySnippet[];
}
