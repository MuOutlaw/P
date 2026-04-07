import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import ProfilePage from "./pages/profile/page.tsx";
import EditProfilePage from "./pages/profile/edit/page.tsx";
import PublicProfilePage from "./pages/profile/public.tsx";
import BoostPricingPage from "./pages/boost/page.tsx";
import MarketplacePage from "./pages/marketplace/page.tsx";
import ListingDetailPage from "./pages/listings/page.tsx";
import CreateListingPage from "./pages/create-listing/page.tsx";
import MyListingsPage from "./pages/my-listings/page.tsx";
import MessagesPage from "./pages/messages/page.tsx";
import ConversationPage from "./pages/messages/conversation.tsx";
import AnalyticsDashboardPage from "./pages/analytics/page.tsx";
import NotificationsPage from "./pages/notifications/page.tsx";
import SavedListingsPage from "./pages/saved/page.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useServiceWorker } from "@/hooks/use-service-worker.ts";
import PWAInstallBanner from "@/components/PWAInstallBanner.tsx";

export default function App() {
  useServiceWorker();

  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:id" element={<ConversationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/users/:id" element={<PublicProfilePage />} />
          <Route path="/boost" element={<BoostPricingPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/saved" element={<SavedListingsPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PWAInstallBanner />
      </BrowserRouter>
    </DefaultProviders>
  );
}
