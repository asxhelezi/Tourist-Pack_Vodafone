// One-time cleanup applied to every non-English locale file:
// 1. Removes the "Community" nav entry and translation section (feature deleted).
// 2. Moves the review-form copy that lived under community.* (rating labels,
//    validation messages) into reviews.*, since ReviewsTab now owns that form.
// 3. Rewords every string that referenced "demo"/"demonstration" to plain
//    product copy, mirroring the cleanup already done by hand in en.json.
// Run with: node scripts/i18n-cleanup.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = join(__dirname, "..", "messages");

const REWORDS = {
  cs: {
    "group.customGroup": "Individuální skupinové doporučení — pro skupiny této velikosti kontaktujte Vodafone",
    "fit.tooltip": "Toto skóre porovnává vaše volby s dostupnými balíčky.",
    "activation.demoNote": "Jedná se o ukázkový postup. Neprobíhá žádná skutečná platba ani aktivace SIM.",
    "activation.activateNow": "Aktivovat nyní",
    "activation.readyText": "Váš balíček je aktivní. Užijte si pobyt!",
    "offline.disclaimer": "Před spolehnutím se na tyto údaje ověřte nouzové kontakty a údaje o velvyslanectvích.",
    "map.coverageDemoNote": "Orientační data o pokrytí — nejedná se o oficiální měření.",
    "reviews.consent": "Souhlasím s uložením mé zpětné vazby v tomto prohlížeči.",
    "chatbot.demoNote": "Asistent s přednastavenými odpověďmi — nejedná se o živého operátora.",
    "currency.ratesFallback": "Náhradní kurzy — nejsou aktuální",
    "footer.demoProject": "Doprovodný projekt — nejedná se o oficiální web Vodafone.",
    "partners.offerCoffee": "10% sleva na kávu a dezerty",
    "partners.offerMuseum": "Vstupenka 2 za cenu 1",
    "partners.offerRestaurant": "Dezert k večeři zdarma",
    "partners.offerHotel": "Pozdní check-out do 14:00",
    "partners.offerBeach": "Lehátko zdarma ke dvěma nápojům",
    "partners.demoNote": "Ukázkoví partneři — žádné skutečné partnerství z toho nevyplývá.",
  },
  de: {
    "group.customGroup": "Individuelle Gruppenempfehlung — kontaktieren Sie Vodafone für Gruppen dieser Größe",
    "fit.tooltip": "Dieser Wert vergleicht Ihre Auswahl mit den verfügbaren Paketen.",
    "activation.demoNote": "Dies ist ein Vorschau-Ablauf. Es findet keine echte Zahlung oder SIM-Aktivierung statt.",
    "activation.activateNow": "Jetzt aktivieren",
    "activation.readyText": "Ihr Paket ist aktiv. Genießen Sie Ihren Aufenthalt!",
    "offline.disclaimer": "Überprüfen Sie Notfall- und Botschaftsangaben, bevor Sie sich darauf verlassen.",
    "map.coverageDemoNote": "Beispielhafte Abdeckungsdaten — keine offiziellen Messungen.",
    "reviews.consent": "Ich bin einverstanden, dass mein Feedback in diesem Browser gespeichert wird.",
    "chatbot.demoNote": "Assistent mit vorgefertigten Antworten — kein Live-Agent.",
    "currency.ratesFallback": "Ersatzkurse — nicht live",
    "footer.demoProject": "Begleitprojekt — keine offizielle Vodafone-Website.",
    "partners.offerCoffee": "10 % Rabatt auf Kaffee und Desserts",
    "partners.offerMuseum": "2-für-1-Eintrittskarte",
    "partners.offerRestaurant": "Gratis-Dessert zum Abendessen",
    "partners.offerHotel": "Später Check-out bis 14:00 Uhr",
    "partners.offerBeach": "Gratis-Liege bei zwei Getränken",
    "partners.demoNote": "Beispielpartner — es besteht keine echte Partnerschaft.",
  },
  es: {
   
    "group.customGroup": "Recomendación de grupo personalizada — contacta con Vodafone para grupos de este tamaño",
    "fit.tooltip": "Esta puntuación compara tus elecciones con los packs disponibles.",
    "activation.demoNote": "Este es un flujo de vista previa. No se realiza ningún pago real ni activación de SIM.",
    "activation.activateNow": "Activar ahora",
    "activation.readyText": "Tu pack está activo. ¡Disfruta tu estancia!",
    "offline.disclaimer": "Verifica los datos de emergencia y embajadas antes de confiar en ellos.",
    "map.coverageDemoNote": "Datos de cobertura ilustrativos — no son mediciones oficiales.",
    "reviews.consent": "Acepto que mi opinión se guarde en este navegador.",
    "chatbot.demoNote": "Asistente con respuestas predefinidas — no es un agente real.",
    "currency.ratesFallback": "Tipos de respaldo — no en vivo",
    "footer.demoProject": "Proyecto complementario — no es un sitio web oficial de Vodafone.",
    "partners.offerCoffee": "10% de descuento en café y postres",
    "partners.offerMuseum": "Entrada 2x1",
    "partners.offerRestaurant": "Postre gratis con la cena",
    "partners.offerHotel": "Salida tardía hasta las 14:00",
    "partners.offerBeach": "Tumbona gratis con dos bebidas",
    "partners.demoNote": "Socios de muestra: no se implica ninguna colaboración real.",
  },
  fr: {
  
    "group.customGroup": "Recommandation de groupe sur mesure — contactez Vodafone pour les groupes de cette taille",
    "fit.tooltip": "Ce score compare vos choix avec les packs disponibles.",
    "activation.demoNote": "Ceci est un parcours d'aperçu. Aucun paiement réel ni activation de SIM n'a lieu.",
    "activation.activateNow": "Activer maintenant",
    "activation.readyText": "Votre pack est actif. Bon séjour !",
    "offline.disclaimer": "Vérifiez les informations d'urgence et d'ambassade avant de vous y fier.",
    "map.coverageDemoNote": "Données de couverture indicatives — pas de mesures officielles.",
    "reviews.consent": "J'accepte que mon avis soit stocké dans ce navigateur.",
    "chatbot.demoNote": "Assistant avec des réponses prédéfinies — pas un agent en direct.",
    "currency.ratesFallback": "Taux de secours — pas en direct",
    "footer.demoProject": "Projet compagnon — pas un site officiel de Vodafone.",
    "partners.offerCoffee": "10 % de réduction sur les cafés et desserts",
    "partners.offerMuseum": "1 billet acheté = 1 billet offert",
    "partners.offerRestaurant": "Dessert offert avec le dîner",
    "partners.offerHotel": "Départ tardif jusqu'à 14 h",
    "partners.offerBeach": "Transat offert pour deux boissons achetées",
    "partners.demoNote": "Partenaires d'exemple — aucun partenariat réel n'est impliqué.",
  },
  it: {
    "group.customGroup": "Raccomandazione per gruppo personalizzato — contatta Vodafone per gruppi di queste dimensioni",
    "fit.tooltip": "Questo punteggio confronta le tue scelte con i pacchetti disponibili.",
    "activation.demoNote": "Questo è un flusso di anteprima. Non avviene alcun pagamento reale né attivazione della SIM.",
    "activation.activateNow": "Attiva ora",
    "activation.readyText": "Il tuo pacchetto è attivo. Buon soggiorno!",
    "offline.disclaimer": "Verifica i dati di emergenza e delle ambasciate prima di affidarti a essi.",
    "map.coverageDemoNote": "Dati di copertura illustrativi — non misurazioni ufficiali.",
    "reviews.consent": "Accetto che il mio feedback venga salvato in questo browser.",
    "chatbot.demoNote": "Assistente con risposte predefinite — non un operatore in tempo reale.",
    "currency.ratesFallback": "Tassi di riserva — non in tempo reale",
    "footer.demoProject": "Progetto complementare — non un sito ufficiale Vodafone.",
    "partners.offerCoffee": "10% di sconto su caffè e dolci",
    "partners.offerMuseum": "Biglietto d'ingresso 2x1",
    "partners.offerRestaurant": "Dolce in omaggio con la cena",
    "partners.offerHotel": "Check-out posticipato fino alle 14:00",
    "partners.offerBeach": "Lettino gratuito con due bevande",
    "partners.demoNote": "Partner di esempio: nessuna partnership reale è implicita.",
  },
  ja: {
    "group.customGroup": "カスタムグループのご提案 — この規模のグループはVodafoneまでお問い合わせください",
    "fit.tooltip": "このスコアは、あなたの選択と利用可能なパックを比較したものです。",
    "activation.demoNote": "これはプレビュー用のフローです。実際の支払いやSIMの有効化は行われません。",
    "activation.activateNow": "今すぐ有効化",
    "activation.readyText": "パックが有効になりました。素敵なご滞在を！",
    "offline.disclaimer": "緊急連絡先や大使館情報は、ご利用前に必ずご確認ください。",
    "map.coverageDemoNote": "参考用の通信エリアデータです — 公式の測定値ではありません。",
    "reviews.consent": "フィードバックがこのブラウザに保存されることに同意します。",
    "chatbot.demoNote": "定型回答によるアシスタントです — オペレーターではありません。",
    "currency.ratesFallback": "代替レートです — ライブではありません",
    "footer.demoProject": "案内用プロジェクトです — Vodafoneの公式サイトではありません。",
    "partners.offerCoffee": "コーヒーとデザートが10%オフ",
    "partners.offerMuseum": "入場チケット1枚で2名入場",
    "partners.offerRestaurant": "ディナーにデザート1品サービス",
    "partners.offerHotel": "14:00までのレイトチェックアウト",
    "partners.offerBeach": "ドリンク2杯注文でサンベッド無料",
    "partners.demoNote": "サンプルパートナーです。実際の提携関係はありません。",
  },
  sq: {
    "group.customGroup": "Rekomandim për grup të personalizuar — kontaktoni Vodafone për grupe të kësaj madhësie",
    "fit.tooltip": "Ky rezultat krahason zgjedhjet tuaja me paketat e disponueshme.",
    "activation.demoNote": "Ky është një proces paraprak. Nuk ndodh asnjë pagesë reale apo aktivizim SIM.",
    "activation.activateNow": "Aktivizo tani",
    "activation.readyText": "Paketa juaj është aktive. Kalofshi bukur!",
    "offline.disclaimer": "Verifikoni të dhënat e emergjencës dhe ambasadave përpara se të mbështeteni në to.",
    "map.coverageDemoNote": "Të dhëna ilustruese mbulimi — jo matje zyrtare.",
    "reviews.consent": "Pranoj që mendimi im të ruhet në këtë shfletues.",
    "chatbot.demoNote": "Asistent me përgjigje të paracaktuara — jo një agjent i vërtetë.",
    "currency.ratesFallback": "Kurse rezervë — jo live",
    "footer.demoProject": "Projekt shoqërues — jo një faqe zyrtare e Vodafone.",
    "partners.offerCoffee": "10% ulje për kafe dhe ëmbëlsira",
    "partners.offerMuseum": "Biletë hyrjeje 2 për 1",
    "partners.offerRestaurant": "Ëmbëlsirë falas me darkën",
    "partners.offerHotel": "Check-out i vonë deri në 14:00",
    "partners.offerBeach": "Shezlong falas me dy pije",
    "partners.demoNote": "Partnerë shembull — nuk nënkuptohet asnjë partneritet real.",
  },
};

const KEYS_TO_DELETE = [
  "common.demo",
  "common.demoNote",
  "embassy.demoDetails",
  "safety.demoAlert",
  "map.demoPartner",
  "map.ratingDemo",
  "events.demoEvents",
  "events.liveEvents",
  "reviews.demoReviews",
  "nav.community",
];

const REVIEW_KEYS_FROM_COMMUNITY = [
  "rating",
  "ratingRequired",
  "textTooShort",
  "textTooLong",
  "moderationBlocked",
  "pendingModeration",
];

function deletePath(obj, path) {
  const [section, key] = path.split(".");
  if (obj[section]) delete obj[section][key];
}

for (const locale of Object.keys(REWORDS)) {
  const file = join(MESSAGES_DIR, `${locale}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));

  // Move the review-form copy that used to live under community.* into reviews.*
  const community = data.community ?? {};
  for (const key of REVIEW_KEYS_FROM_COMMUNITY) {
    if (community[key] !== undefined) data.reviews[key] = community[key];
  }

  delete data.community;
  for (const path of KEYS_TO_DELETE) deletePath(data, path);

  for (const [path, value] of Object.entries(REWORDS[locale])) {
    const [section, key] = path.split(".");
    if (data[section]) data[section][key] = value;
  }

  writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`Cleaned ${locale}.json`);
}
