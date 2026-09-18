/**
 * Reviews provider adapter (spec 11.3).
 * Default source: local reviews.json (sample content, not verified).
 * To connect an approved App Store / Play Store feed later, implement
 * another ReviewsProvider (e.g. fetching a server route that talks to an
 * authorized API) and export it here instead. Never scrape store pages.
 */
import reviewsData from "@/data/reviews.json";

export interface Review {
  id: string;
  rating: number; // 1-5
  text: string;
  name: string;
  country: string;
  source: string; // "sample" | approved feed identifier
  verified: boolean;
}

export interface ReviewsProvider {
  list(): Promise<Review[]>;
}

export const localReviewsProvider: ReviewsProvider = {
  async list() {
    return reviewsData.reviews as Review[];
  },
};

export const reviewsProvider: ReviewsProvider = localReviewsProvider;
