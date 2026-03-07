import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Home } from "@/pages/Home";
import { VictimGallery } from "@/pages/VictimGallery";
import { VictimProfile } from "@/pages/VictimProfile";
import { MemoryMap } from "@/pages/MemoryMap";
import { Timeline } from "@/pages/Timeline";
import { Testimonies } from "@/pages/Testimonies";
import { DigitalSanctuary } from "@/pages/DigitalSanctuary";
import { Events } from "@/pages/Events";
import { ReportCase } from "@/pages/ReportCase";
import { TrackReport } from "@/pages/TrackReport";
import { AdminLogin } from "@/pages/AdminLogin";
import { Dashboard } from "@/pages/admin/Dashboard";
import { VictimsManagement } from "@/pages/admin/VictimsManagement";
import { TestimoniesManagement } from "@/pages/admin/TestimoniesManagement";
import { MapManagement } from "@/pages/admin/MapManagement";
import { TimelineManagement } from "@/pages/admin/TimelineManagement";
import { ReportsManagement } from "@/pages/admin/ReportsManagement";
import { EventsManagement } from "@/pages/admin/EventsManagement";
import { UsersManagement } from "@/pages/admin/UsersManagement";
import { SettingsManagement } from "@/pages/admin/SettingsManagement";
import { RouteErrorBoundary } from "@/components/feedback/RouteErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: Home },
      { path: "victimas", Component: VictimGallery },
      { path: "victimas/:id", Component: VictimProfile },
      { path: "mapa", Component: MemoryMap },
      { path: "linea-tiempo", Component: Timeline },
      { path: "testimonios", Component: Testimonies },
      { path: "santuario", Component: DigitalSanctuary },
      { path: "eventos", Component: Events },
      { path: "reportar", Component: ReportCase },
      { path: "seguimiento", Component: TrackReport },
    ],
  },
  {
    path: "/login",
    Component: AdminLogin,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "dashboard", Component: Dashboard },
      { path: "victims", Component: VictimsManagement },
      { path: "testimonies", Component: TestimoniesManagement },
      { path: "map", Component: MapManagement },
      { path: "timeline", Component: TimelineManagement },
      { path: "reports", Component: ReportsManagement },
      { path: "events", Component: EventsManagement },
      { path: "users", Component: UsersManagement },
      { path: "settings", Component: SettingsManagement },
    ],
  },
]);
