import { NEXT_API_URL } from "@/modules/common/constants";

export function toProductImageUrl(image: string) {
  if (image.startsWith("http")) return image;
  return `${NEXT_API_URL}/files/product/${image}`;
}
