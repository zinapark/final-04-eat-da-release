import Header from '@/app/src/components/common/Header';
import SignupForm from './SignupForm';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="회원가입" showBackButton />
      <div className="h-[60px]"></div>
      <div className="flex-1 px-5 py-8 overflow-y-auto pb-32 w-full max-w-[744px] min-w-[390px] mx-auto">
        <SignupForm />
      </div>
      <BottomFixedButton as="button" formId="signupForm">
        회원가입
      </BottomFixedButton>
    </div>
  );
}
