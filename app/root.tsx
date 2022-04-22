import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import { ToneContext } from "./tone-context";
export const links: LinksFunction = () => {
  // return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
  return [];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Metronome",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ToneContext>
          <Outlet />
        </ToneContext>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
