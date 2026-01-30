import Badge from "./Badge";

interface IngredientListProps {
  ingredients: string[];
  className?: string;
}

export default function IngredientList({
  ingredients,
  className = "",
}: IngredientListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {ingredients.map((ingredient) => (
        <Badge key={ingredient}>{ingredient}</Badge>
      ))}
    </div>
  );
}
