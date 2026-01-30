import ReviewItem from "@/app/src/components/ui/ReviewItem";

interface Review {
  id: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <section aria-labelledby="review-title" className="gap-0">
      <h3 id="review-title" className="mx-5 text-display-4 font-semibold">
        리뷰 ({reviews.length})
      </h3>

      <ul>
        {reviews.map((review, index) => {
          const isLast = index === reviews.length - 1;

          return (
            <li key={review.id}>
              <ReviewItem showDivider={!isLast} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
