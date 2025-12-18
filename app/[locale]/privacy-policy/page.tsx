import { useTranslations } from "next-intl";
import { Navigation } from "@/components/navigation"

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacyPolicy");

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
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("informationWeCollect.title")}</h2>
                  <p>
                    {t("informationWeCollect.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("howWeUseYourInformation.title")}</h2>
                  <p>
                    {t("howWeUseYourInformation.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("informationSharing.title")}</h2>
                  <p>
                    {t("informationSharing.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("dataSecurity.title")}</h2>
                  <p>
                    {t("dataSecurity.description")}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t("contactUs.title")}</h2>
                  <p>{t("contactUs.description")}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
