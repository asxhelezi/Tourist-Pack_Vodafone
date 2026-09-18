/**
 * Preset chatbot responses per language (spec 12.2).
 * Static imports keep the assistant fully offline; a translation API could be
 * placed behind this module later without changing the chat UI.
 */
import en from "@/data/chatbot/responses.en.json";
import sq from "@/data/chatbot/responses.sq.json";
import es from "@/data/chatbot/responses.es.json";
import fr from "@/data/chatbot/responses.fr.json";
import de from "@/data/chatbot/responses.de.json";
import ja from "@/data/chatbot/responses.ja.json";
import it from "@/data/chatbot/responses.it.json";
import cs from "@/data/chatbot/responses.cs.json";

type ResponseMap = Record<string, string>;

const RESPONSES: Record<string, ResponseMap> = {
  en: en as ResponseMap,
  sq: sq as ResponseMap,
  es: es as ResponseMap,
  fr: fr as ResponseMap,
  de: de as ResponseMap,
  ja: ja as ResponseMap,
  it: it as ResponseMap,
  cs: cs as ResponseMap,
};

export function getResponse(responseKey: string, locale: string): string {
  return RESPONSES[locale]?.[responseKey] ?? RESPONSES.en[responseKey] ?? "";
}
