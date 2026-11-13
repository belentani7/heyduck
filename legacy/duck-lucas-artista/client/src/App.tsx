/*
 * App shell: identidade pessoal de Lucas/Duck e duas experiências complementares.
 * A home apresenta o artista; Singles é o arquivo visual de créditos; Studio é o
 * playground local de áudio e inspiração. O tema escuro é permanente.
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Singles from "./pages/Singles";
import Studio from "./pages/Studio";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/singles" component={Singles} />
      <Route path="/studio" component={Studio} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
