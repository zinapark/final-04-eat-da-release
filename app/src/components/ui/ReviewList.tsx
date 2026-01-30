import ReviewItem from "@/app/src/components/ui/ReviewItem";

export interface Review {
  id?: string;
  _id?: number;
  userId?: number;
  userName?: string;
  profileImage?: string;
  rating?: number;
  createdAt?: string;
  productName?: string;
  content?: string;
  images?: string[];
  user?: {
    _id?: number;
    name?: string;
    image?: string;
  };
  product?: {
    name?: string;
    image?: {
      path?: string;
      name?: string;
    };
  };
  extra?: {
    images?: string[];
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const resolvedReviews = reviews.map((review, index) => {
    const resolvedId = review.id ?? String(review._id ?? index);
    const resolvedUserName = review.userName ?? review.user?.name ?? "익명";
    const resolvedProfileImage = review.profileImage ?? review.user?.image;
    const resolvedProductName = review.productName ?? review.product?.name ?? "";
    const resolvedImages =
      review.images ??
      review.extra?.images ??
      (review.product?.image?.path ? [review.product.image.path] : []);

    return {
      ...review,
      id: resolvedId,
      userName: resolvedUserName,
      profileImage: resolvedProfileImage,
      productName: resolvedProductName,
      images: resolvedImages,
    };
  });

  return (
    <section aria-labelledby="review-title" className="gap-0">
      <h3 id="review-title" className="mx-5 text-display-4 font-semibold">
        리뷰 ({resolvedReviews.length})
      </h3>

      <ul>
        {resolvedReviews.map((review, index) => {
          const isLast = index === resolvedReviews.length - 1;

          return (
            <li key={review.id ?? review._id ?? index}>
              <ReviewItem
                showDivider={!isLast}
                userName={review.userName}
                profileImage={review.profileImage}
                rating={review.rating}
                createdAt={review.createdAt}
                productName={review.productName}
                content={review.content}
                images={review.images}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
