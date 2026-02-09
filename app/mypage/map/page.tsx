import Header from '@/app/src/components/common/Header';
import MapClient from './MapClient';

export default function MapPage() {
  return (
    <>
      <Header title="공유주방 선택" showCloseButton />
      <MapClient />
    </>
  );
}
