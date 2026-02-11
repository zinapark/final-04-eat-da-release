import { Metadata } from 'next';
import { getAxios } from '@/lib/axios';
import ProductDetailClient from '@/app/products/[productId]/ProductDetailCilent';

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { productId } = await params;
    const axios = getAxios();
    const response = await axios.get(`/products/${productId}/`);
    const product = response.data.item;

    return {
      title: `${product.name} - 잇다`,
      openGraph: {
        title: product.name,
        description:
          product.content?.replace(/<[^>]*>/g, '') || '상품 상세 페이지',
        url: `/products/${productId}`,
        images: product.mainImages?.[0]?.path
          ? [{ url: product.mainImages[0].path }]
          : [],
      },
    };
  } catch (error) {
    // console.error('메타데이터 생성 실패:', error);
    return {
      title: '상품 상세 - 잇다',
      openGraph: {
        title: '상품 상세',
        description: '상품 상세 페이지',
        url: '/products',
      },
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  return <ProductDetailClient params={params} />;
}
