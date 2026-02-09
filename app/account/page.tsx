import Header from '@/app/src/components/common/Header';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';
import AccountClient from './AccountClient';

export const metadata = {
  title: '개인 정보 설정',
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="개인 정보 설정" showBackButton />
      <div className="h-[60px]"></div>
      <div className="flex-1 px-5 py-8 overflow-y-auto pb-32 w-full max-w-[744px] min-w-[390px] mx-auto">
        <AccountClient />
      </div>
      <BottomFixedButton as="button" formId="account-form">
        변경 완료
      </BottomFixedButton>
    </div>
  );
}
