import { NextRequest, NextResponse } from "next/server";

/*
  Accès privé à la démo.
  Activé uniquement si la variable d'environnement DEMO_ACCESS_CODE est
  définie (sur vercel : Settings → Environment Variables). Sans elle,
  le site reste ouvert (développement, audit local).

  - lien magique : https://…/?acces=CODE → pose le cookie et ouvre le site
  - sinon : redirection vers /acces (saisie du code)
*/

const COOKIE = "ak_demo_access";

export function middleware(req: NextRequest) {
  const code = process.env.DEMO_ACCESS_CODE;
  if (!code) return NextResponse.next();

  const { pathname, searchParams } = req.nextUrl;

  // lien magique, valable sur n'importe quelle page
  const provided = searchParams.get("acces");
  if (provided !== null) {
    if (provided === code) {
      const url = req.nextUrl.clone();
      url.searchParams.delete("acces");
      const res = NextResponse.redirect(url);
      res.cookies.set(COOKIE, code, {
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        path: "/",
      });
      return res;
    }
    const url = req.nextUrl.clone();
    url.pathname = "/acces";
    url.search = "?err=1";
    return NextResponse.redirect(url);
  }

  // déjà autorisé
  if (req.cookies.get(COOKIE)?.value === code) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // page de saisie du code
  if (pathname === "/acces") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = "/acces";
  url.search = req.cookies.has(COOKIE) ? "?err=1" : "";
  return NextResponse.redirect(url);
}

export const config = {
  /* tout sauf les assets next et les fichiers statiques (logo, favicon…) */
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
