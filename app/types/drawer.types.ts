export interface DrawerSettings {
  _id?: string;
  shop: string;
  isEnabled: boolean;
  position: "left" | "right";
  width: number;
  backgroundColor: string;
  textColor: string;
  closeButtonColor: string;
  showTriggerButton: boolean;
  openOnCartClick: boolean;
  componentOrder: string[]; // Array of component IDs in display order
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  _id?: string;
  shop: string;
  isEnabled: boolean;
  title: string;
  message: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: string;
  link?: string;
  linkText?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressBar {
  _id?: string;
  shop: string;
  isEnabled: boolean;
  title: string;
  goalAmount: number;
  goalText: string;
  backgroundColor: string;
  progressColor: string;
  textColor: string;
  showPercentage: boolean;
  showAmount: boolean;
  height: number;
  borderRadius: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecommendationSettings {
  _id?: string;
  shop: string;
  isEnabled: boolean;
  title: string;
  numberOfProducts: number;
  layout: "grid" | "list";
  showPrice: boolean;
  showAddToCart: boolean;
  cardBackgroundColor: string;
  cardBorderRadius: number;
  titleColor: string;
  titleFontSize: number;
  priceColor: string;
  priceFontSize: number;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  buttonFontSize: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
