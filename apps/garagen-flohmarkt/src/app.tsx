import type { CreateListingInput } from "@openzirndorf/garagen-flohmarkt-api";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  SiteFooter,
  SiteHeader,
  Textarea,
} from "@openzirndorf/ui";
import { CalendarDays, LoaderCircle, MapPin, Store } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { useCreateListingMutation } from "./hooks/use-create-listing-mutation";
import { useListingsQuery } from "./hooks/use-listings-query";

const initialFormState: CreateListingInput = {
  title: "",
  description: "",
  neighborhood: "",
  saleDate: "",
};

export function App() {
  const [formValues, setFormValues] =
    useState<CreateListingInput>(initialFormState);
  const listingsQuery = useListingsQuery();
  const createListingMutation = useCreateListingMutation({
    onSuccess() {
      setFormValues(initialFormState);
    },
  });

  const entries = listingsQuery.data ?? [];
  const statusText = listingsQuery.isPending
    ? "Lade Einträge über TanStack Query …"
    : listingsQuery.isError
      ? "Worker aktuell nicht erreichbar"
      : `Synchronisiert, ${entries.length} Einträge im Cache`;

  const errorMessage = listingsQuery.error
    ? listingsQuery.error instanceof Error
      ? listingsQuery.error.message
      : "Die Liste konnte nicht geladen werden."
    : createListingMutation.error
      ? createListingMutation.error instanceof Error
        ? createListingMutation.error.message
        : "Der Eintrag konnte nicht gespeichert werden."
      : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createListingMutation.mutateAsync(formValues);
  }

  return (
    <div className="gf-shell">
      <SiteHeader
        homeHref="#top"
        items={[
          { label: "Überblick", href: "#ueberblick" },
          { label: "Stand eintragen", href: "#eintragen" },
          { label: "Liste", href: "#liste" },
        ]}
        cta={{ label: "Stand eintragen", href: "#eintragen" }}
        mobileCtaLabel="Eintragen"
      />

      <main id="top" className="gf-main">
        <section id="ueberblick" className="gf-section gf-hero">
          <Card className="gf-hero-card">
            <CardHeader>
              <Badge className="w-fit">Garagen-Flohmarkt</Badge>
              <CardTitle className="max-w-3xl text-4xl leading-tight sm:text-5xl">
                Nachbarschaftsstände sichtbar machen und direkt aus dem UI in
                die Liste schreiben.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Diese erste Version nutzt einen Cloudflare Worker mit tRPC. Das
                Frontend lädt die Liste mit TanStack Query und legt neue
                Einträge über eine Mutation direkt an.
              </CardDescription>
            </CardHeader>
            <CardContent className="gf-hero-grid">
              <div className="gf-stat-grid">
                <div className="gf-stat">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Status
                  </div>
                  <div className="mt-2 text-lg font-bold">{statusText}</div>
                </div>
                <div className="gf-stat">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Einträge
                  </div>
                  <div className="mt-2 text-lg font-bold">{entries.length}</div>
                </div>
                <div className="gf-stat">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Transport
                  </div>
                  <div className="mt-2 text-lg font-bold">
                    tRPC + TanStack Query
                  </div>
                </div>
              </div>
              <Card className="border-brand-green/15 bg-white/80">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Was hier schon funktioniert
                  </CardTitle>
                  <CardDescription>
                    Die Liste wird gecacht, neue Stände aktualisieren den
                    Query-Cache direkt und das Formular bleibt vom Transportcode
                    getrennt.
                  </CardDescription>
                </CardHeader>
              </Card>
            </CardContent>
          </Card>
        </section>

        <section className="gf-section gf-grid">
          <Card id="eintragen">
            <CardHeader>
              <CardTitle>Neuen Stand eintragen</CardTitle>
              <CardDescription>
                Das Formular ruft eine TanStack-Query-Mutation auf. Bei Erfolg
                wird der Listings-Cache sofort ergänzt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="gf-form-grid" onSubmit={handleSubmit}>
                <div className="gf-field">
                  <label htmlFor="title">Titel</label>
                  <Input
                    id="title"
                    placeholder="Zum Beispiel: Hofeinfahrt voller Kinderkleidung"
                    value={formValues.title}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="gf-field">
                  <label htmlFor="neighborhood">Stadtteil</label>
                  <Input
                    id="neighborhood"
                    placeholder="Zirndorf Nord"
                    value={formValues.neighborhood}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        neighborhood: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="gf-field">
                  <label htmlFor="saleDate">Datum</label>
                  <Input
                    id="saleDate"
                    type="date"
                    value={formValues.saleDate}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        saleDate: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="gf-field">
                  <label htmlFor="description">Beschreibung</label>
                  <Textarea
                    id="description"
                    placeholder="Was finden Besucherinnen und Besucher an deinem Stand?"
                    value={formValues.description}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </div>

                {errorMessage ? (
                  <div className="gf-error">{errorMessage}</div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={createListingMutation.isPending}
                >
                  {createListingMutation.isPending ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      Wird gespeichert …
                    </>
                  ) : (
                    <>
                      <Store />
                      Stand speichern
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card id="liste">
            <CardHeader>
              <CardTitle>Aktuelle Liste</CardTitle>
              <CardDescription>
                Die Einträge kommen über `listings.list` zurück und werden von
                TanStack Query im Frontend verwaltet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listingsQuery.isPending ? (
                <div className="gf-empty">Liste wird geladen …</div>
              ) : entries.length === 0 ? (
                <div className="gf-empty">Noch keine Einträge vorhanden.</div>
              ) : (
                <div className="gf-list-grid">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="gf-listing-card gap-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xl font-bold leading-tight">
                            {entry.title}
                          </div>
                          <div className="gf-listing-meta">
                            <span>
                              <MapPin className="mr-1 inline size-4" />
                              {entry.neighborhood}
                            </span>
                            <span>
                              <CalendarDays className="mr-1 inline size-4" />
                              {entry.saleDate}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">offen</Badge>
                      </div>
                      <p className="m-0 text-sm leading-6 text-muted-foreground">
                        {entry.description}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <SiteFooter
        description="Erste Arbeitsversion für den Garagen-Flohmarkt. Frontend auf Vite und React, API auf Cloudflare Workers mit tRPC und gemeinsamen Zod-Schemas."
        columns={[
          {
            title: "App",
            links: [
              { label: "Überblick", href: "#ueberblick" },
              { label: "Stand eintragen", href: "#eintragen" },
              { label: "Liste", href: "#liste" },
            ],
          },
          {
            title: "Technik",
            links: [
              { label: "Cloudflare Worker", href: "#top" },
              { label: "tRPC Call", href: "#liste" },
              { label: "Shared Schemas", href: "#eintragen" },
            ],
          },
        ]}
        copyright="OpenZirndorf · Garagen-Flohmarkt"
      />
    </div>
  );
}
