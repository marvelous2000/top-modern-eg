import { Navigation } from "@/components/navigation"

import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="min-h-screen bg-background py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <h1 className="font-serif text-4xl font-bold text-foreground mb-8">{t("title")}</h1>

              <div className="space-y-6 text-muted-foreground">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("acceptanceOfTerms.title")}</h2>
                  <p>
                    {t("acceptanceOfTerms.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("services.title")}</h2>
                  <p>
                    {t("services.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("userResponsibilities.title")}</h2>
                  <p>
                    {t("userResponsibilities.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("limitationOfLiability.title")}</h2>
                  <p>
                    {t("limitationOfLiability.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("contactInformation.title")}</h2>
                  <p>{t("contactInformation.description")}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
