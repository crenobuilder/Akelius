import { NextRequest } from "next/server";
import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { listingBySlug } from "@/data/listings";
import { formatPrice } from "@/lib/format";
import {
  LANGS,
  type Lang,
  listingDescription,
  listingTitle,
  roomsLabelLang,
} from "@/lib/compose";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------ libellés pdf */

const L: Record<Lang, Record<string, string>> = {
  fr: {
    sheet: "fiche du bien",
    rent: "loyer mensuel cc",
    base: "loyer hors charges",
    charges: "charges",
    deposit: "dépôt de garantie",
    facts: "caractéristiques",
    surface: "surface",
    rooms: "pièces",
    bedrooms: "chambres",
    floor: "étage",
    ground: "rez-de-chaussée",
    metro: "métro",
    built: "construction",
    dpe: "classe énergie",
    available: "disponible",
    now: "immédiatement",
    desc: "description",
    photos: "photos",
    official: "annonce officielle :",
    contact: "akelius france — 37-41 rue du rocher, 75008 paris — info@akelius.fr",
    disclaimer: "maquette de démonstration non officielle, non affiliée à akelius residential property ab",
    page: "page",
  },
  en: {
    sheet: "property sheet",
    rent: "monthly rent incl. charges",
    base: "base rent",
    charges: "charges",
    deposit: "deposit",
    facts: "key facts",
    surface: "size",
    rooms: "rooms",
    bedrooms: "bedrooms",
    floor: "floor",
    ground: "ground floor",
    metro: "metro",
    built: "built",
    dpe: "energy class",
    available: "available",
    now: "from now on",
    desc: "description",
    photos: "photos",
    official: "official listing:",
    contact: "akelius france — 37-41 rue du rocher, 75008 paris — info@akelius.fr",
    disclaimer: "unofficial demo mock-up, not affiliated with akelius residential property ab",
    page: "page",
  },
  es: {
    sheet: "ficha del piso",
    rent: "alquiler mensual c.i.",
    base: "alquiler base",
    charges: "gastos",
    deposit: "fianza",
    facts: "características",
    surface: "superficie",
    rooms: "habitaciones",
    bedrooms: "dormitorios",
    floor: "planta",
    ground: "planta baja",
    metro: "metro",
    built: "construcción",
    dpe: "clase energética",
    available: "disponible",
    now: "inmediatamente",
    desc: "descripción",
    photos: "fotos",
    official: "anuncio oficial:",
    contact: "akelius france — 37-41 rue du rocher, 75008 paris — info@akelius.fr",
    disclaimer: "maqueta de demostración no oficial, no afiliada a akelius residential property ab",
    page: "página",
  },
};

/* ------------------------------------------------------------ styles */

const NAVY = "#21365f";
const RED = "#ae1e2c";
const INK = "#171717";
const MUTED = "#716c66";
const LINE = "#e8e5e0";
const SAND = "#f7f6f3";

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: INK },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
    paddingBottom: 10,
  },
  wordmark: { fontSize: 22, fontFamily: "Helvetica-Bold", color: NAVY },
  sheetLabel: { fontSize: 9, color: MUTED, textTransform: "lowercase" },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", marginTop: 18 },
  address: { fontSize: 10, color: MUTED, marginTop: 4 },
  priceBox: {
    marginTop: 16,
    backgroundColor: SAND,
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceBig: { fontSize: 20, fontFamily: "Helvetica-Bold", color: NAVY },
  priceSub: { fontSize: 8.5, color: MUTED, marginTop: 2 },
  priceCol: { alignItems: "flex-end" },
  priceLine: { fontSize: 9, color: INK, marginTop: 2 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginTop: 20,
    marginBottom: 8,
    textTransform: "lowercase",
  },
  factsGrid: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderTopColor: LINE },
  factCell: {
    width: "25%",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingVertical: 7,
    paddingRight: 8,
  },
  factLabel: { fontSize: 7.5, color: MUTED, textTransform: "lowercase" },
  factValue: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 2 },
  desc: { fontSize: 10, lineHeight: 1.55, color: "#3f3d3a" },
  dpeBadge: {
    marginTop: 4,
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  photoRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  photo: { width: 247, height: 165, borderRadius: 8, objectFit: "cover" },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
  },
  footerText: { fontSize: 7.5, color: MUTED },
  official: { fontSize: 9, color: NAVY, marginTop: 14 },
});

const DPE_COLORS: Record<string, string> = {
  A: "#2e9b43", B: "#54b64b", C: "#a8ce38", D: "#f2e30e",
  E: "#f0b410", F: "#e2751b", G: "#d21e1e",
};

function Wordmark() {
  return (
    <Text style={s.wordmark}>
      Ak<Text style={{ color: RED }}>e</Text>lius
    </Text>
  );
}

function Footer({ t }: { t: Record<string, string> }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{t.contact}</Text>
      <Text style={[s.footerText, { marginTop: 2 }]}>{t.disclaimer}</Text>
    </View>
  );
}

function SheetDocument({
  listing,
  lang,
  images,
}: {
  listing: Listing;
  lang: Lang;
  images: Buffer[];
}) {
  const t = L[lang];
  const facts: [string, string][] = [
    [t.surface, `${Math.round(listing.surface)} m²`],
    [t.rooms, roomsLabelLang(listing.rooms, lang)],
    [t.bedrooms, String(listing.bedrooms)],
  ];
  if (listing.floor !== null && listing.floor !== undefined)
    facts.push([t.floor, listing.floor === 0 ? t.ground : String(listing.floor)]);
  if (listing.station) facts.push([t.metro, listing.station]);
  if (listing.constructionYear) facts.push([t.built, String(listing.constructionYear)]);
  if (listing.dpe) facts.push([t.dpe, listing.dpe]);
  facts.push([t.available, t.now]);

  return (
    <Document
      title={`Akelius — ${listingTitle(listing, lang)}`}
      author="Akelius (maquette démo)"
    >
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Wordmark />
          <Text style={s.sheetLabel}>{t.sheet}</Text>
        </View>

        <Text style={s.title}>{listingTitle(listing, lang)}</Text>
        <Text style={s.address}>
          {listing.district} — {listing.address}
        </Text>

        <View style={s.priceBox}>
          <View>
            <Text style={s.priceBig}>{formatPrice(listing.price, listing.currency)}</Text>
            <Text style={s.priceSub}>{t.rent}</Text>
          </View>
          <View style={s.priceCol}>
            {listing.baseRent ? (
              <Text style={s.priceLine}>
                {t.base} : {formatPrice(listing.baseRent, listing.currency)}
              </Text>
            ) : null}
            {listing.charges ? (
              <Text style={s.priceLine}>
                {t.charges} : {formatPrice(listing.charges, listing.currency)}
              </Text>
            ) : null}
            {listing.deposit ? (
              <Text style={s.priceLine}>
                {t.deposit} : {formatPrice(listing.deposit, listing.currency)}
              </Text>
            ) : null}
          </View>
        </View>

        <Text style={s.sectionTitle}>{t.facts}</Text>
        <View style={s.factsGrid}>
          {facts.map(([k, v]) => (
            <View key={k} style={s.factCell}>
              <Text style={s.factLabel}>{k}</Text>
              <Text style={s.factValue}>{v}</Text>
            </View>
          ))}
        </View>

        {listing.dpe ? (
          <View
            style={[s.dpeBadge, { backgroundColor: DPE_COLORS[listing.dpe] ?? MUTED }]}
          >
            <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: "#fff" }}>
              {listing.dpe}
            </Text>
          </View>
        ) : null}

        <Text style={s.sectionTitle}>{t.desc}</Text>
        <Text style={s.desc}>{listingDescription(listing, lang)}</Text>

        {listing.officialUrl ? (
          <Text style={s.official}>
            {t.official}{" "}
            <Link src={listing.officialUrl} style={{ color: NAVY }}>
              {listing.officialUrl}
            </Link>
          </Text>
        ) : null}

        <Footer t={t} />
      </Page>

      {images.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.headerRow}>
            <Wordmark />
            <Text style={s.sheetLabel}>{t.photos}</Text>
          </View>
          <View style={s.photoRow}>
            {images.map((buf, i) => (
              <Image key={i} src={{ data: buf, format: "jpg" }} style={s.photo} />
            ))}
          </View>
          <Footer t={t} />
        </Page>
      )}
    </Document>
  );
}

/* ------------------------------------------------------------ handler */

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = listingBySlug(id);
  if (!listing) {
    return new Response("listing not found", { status: 404 });
  }

  const langParam = req.nextUrl.searchParams.get("lang") as Lang | null;
  const lang: Lang = langParam && LANGS.includes(langParam) ? langParam : "fr";

  // photos du cdn officiel — les échecs sont ignorés (fiche sans photos)
  const images = (
    await Promise.all(listing.photos.slice(0, 6).map(fetchImage))
  ).filter((b): b is Buffer => b !== null);

  const buffer = await renderToBuffer(
    <SheetDocument listing={listing} lang={lang} images={images} />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="akelius-${listing.slug}-${lang}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
