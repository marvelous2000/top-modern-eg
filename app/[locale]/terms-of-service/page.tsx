import { useTranslations } from "next-intl";
import { Navigation } from "@/components/navigation"

export default function TermsOfServicePage() {
  const t = useTranslations("terms");

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="min-h-screen bg-background py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
              <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>

              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("acceptanceOfTerms.title")}</h2>
                  <p>{t("acceptanceOfTerms.description")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("services.title")}</h2>
                  <p>{t("services.description")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("userResponsibilities.title")}</h2>
                  <p className="mb-4">{t("userResponsibilities.description")}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {t.raw("userResponsibilities.list").map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("pricingAndPayment.title")}</h2>
                  <p>{t("pricingAndPayment.description")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("warranties.title")}</h2>
                  <p>{t("warranties.description")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("limitationOfLiability.title")}</h2>
                  <p>{t("limitationOfLiability.description")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("governingLaw.title")}</h2>
                  <p>{t("governingLaw.description")}</p>
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
