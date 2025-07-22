/**
 * Questo file è il punto di ingresso per la libreria di componenti UI condivisi.
 * Esporta tutti i componenti riutilizzabili per renderli disponibili
 * alle applicazioni nel monorepo (es. dashboard, shop).
 */

// --- Componenti Shared (Primitivi e Generici) ---
export { default as ActionsMenu } from "./components/shared/ActionsMenu";
export { default as AuthForm } from "./components/shared/AuthForm";
export { default as CustomButton } from "./components/shared/CustomButton";
export { default as CustomCheckbox } from "./components/shared/CustomCheckbox";
export { default as CustomInput } from "./components/shared/CustomInput";
export { default as CustomListbox } from "./components/shared/CustomListbox";
export { default as DashboardCard } from "./components/shared/DashboardCard";
export { default as ErrorBoundary } from "./components/shared/ErrorBoundary";
export { default as LoadingPage } from "./components/shared/LoadingPage";
export { default as Message } from "./components/shared/Message";
export { default as Pagination } from "./components/shared/Pagination";
export { default as StatusBadge } from "./components/shared/StatusBadge";
export { default as ToggleSwitch } from "./components/shared/ToggleSwitch";

// --- Componenti per Tabelle ---
export { default as TableHeader } from "./components/tables/TableHeader";
export { default as TablePagination } from "./components/tables/TablePagination";
export { default as OrdersTable } from "./components/tables/OrdersTable";
export { default as StandardTable } from "./components/tables/StandardTable";

// --- Componenti Specifici per Prodotti (utili anche per lo shop) ---
export { default as ProductCard } from "./components/products/ProductCard";
export { default as ProductImageGallery } from "./components/products/ProductImageGallery";
export { default as QuantitySelector } from "./components/products/QuantitySelector";
export { default as SmartPrice } from "./components/products/SmartPrice";
export { default as Rating } from "./components/products/Rating";
export { default as FeaturedProducts } from "../../frontend/src/features/products/FeaturedProducts";

// --- Componenti Specifici per Ordini ---
export { default as InfoCard } from "./components/orders/InfoCard";
export { default as OrderTimeline } from "./components/orders/OrderTimeline";
export { default as ProductsTable } from "./components/orders/ProductsTable";

// --- Componenti per la Chat ---
export { default as ChatHeader } from "./components/chat/ChatHeader";
export { default as ChatSkeleton } from "./components/chat/ChatSkeleton";
export { default as ChatWindow } from "./components/chat/ChatWindow";
export { default as CustomerListItem } from "./components/chat/CustomerListItem";
export { default as EmptyState } from "./components/chat/EmptyState";
export { default as MessageBubble } from "./components/chat/MessageBubble";
export { default as MessageInput } from "./components/chat/MessageInput";
export { default as SellerList } from "./components/chat/SellerList";
export { default as SellerListItem } from "./components/chat/SellerListItem";
export { default as BannerCarousel } from "./components/carousels/BannerCarousel";
export { default as CategoryCarousel } from "./components/carousels/CategoryCarousel";
export { default as ProductGrid } from "./components/products/ProductGrid";
export { default as ProductCarousel } from "./components/carousels/ProductCarousel";
export { default as PriceRangeSlider } from "./components/shared/PriceRangeSlider";
export { default as CustomerList } from "./components/chat/CustomerList";

export { default as GeneralSettings } from "./components/settings/GeneralSettings";
export { default as SecuritySettings } from "./components/settings/SecuritySettings";
export { default as NotificationSettings } from "./components/settings/NotificationSettings";
export { default as Breadcrumbs } from "./components/products/Breadcrumbs";
export { default as ScrollToTop } from "./components/shared/ScrollToTop";
