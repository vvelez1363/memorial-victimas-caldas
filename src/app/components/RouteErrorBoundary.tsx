import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "./ui/button";

export function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Ocurrió un error inesperado";
  let message = "No pudimos cargar esta vista. Intenta nuevamente.";

  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`;
    message =
      typeof error.data === "string" ? error.data : error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f2] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-xl border border-[#B2916F]/25 bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl text-[#2E4739]">{title}</h1>
        <p className="mt-3 text-[#4b5563]">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => window.location.reload()}>Recargar</Button>
          <Button asChild variant="outline">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
