/**
 * Basic Albanian phrases (spec 9.3 C).
 * Translations of the phrase meaning come from messages/*.json via labelKey.
 */
export interface Phrase {
  id: string;
  labelKey: string;
  albanian: string;
  pronunciation: string;
}

export const ALBANIAN_PHRASES: Phrase[] = [
  { id: "hello", labelKey: "phrases.hello", albanian: "Përshëndetje / Mirupafshim", pronunciation: "per-shen-DET-yeh / mee-roo-PAF-sheem" },
  { id: "thankyou", labelKey: "phrases.thankYou", albanian: "Faleminderit", pronunciation: "fah-leh-meen-DEH-reet" },
  { id: "please", labelKey: "phrases.please", albanian: "Ju lutem", pronunciation: "yoo LOO-tem" },
  { id: "help", labelKey: "phrases.help", albanian: "Ndihmë!", pronunciation: "n-DEEH-muh" },
  { id: "whereis", labelKey: "phrases.whereIs", albanian: "Ku është…?", pronunciation: "koo USHT-uh" },
  { id: "lost", labelKey: "phrases.iAmLost", albanian: "Kam humbur rrugën", pronunciation: "kahm HOOM-boor RROO-gun" },
  { id: "doctor", labelKey: "phrases.needDoctor", albanian: "Kam nevojë për mjek", pronunciation: "kahm neh-VOY-uh pur myek" },
  { id: "police", labelKey: "phrases.callPolice", albanian: "Telefononi policinë", pronunciation: "teh-leh-fo-NO-nee po-lee-TSEE-nuh" },
  { id: "cost", labelKey: "phrases.howMuch", albanian: "Sa kushton?", pronunciation: "sah koosh-TON" },
  { id: "english", labelKey: "phrases.speakEnglish", albanian: "A flisni anglisht?", pronunciation: "ah FLEES-nee ahn-GLEESHT" },
];
