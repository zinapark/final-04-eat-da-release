import Header from '@/app/src/components/common/Header';
import LoginForm from './LoginForm';
import BottomFixedButton from '@/app/src/components/common/BottomFixedButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="로그인" showBackButton />
      <div className="h-[60px]"></div>
      <div className="flex-1 px-5 py-8 overflow-y-auto pb-32">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
      <BottomFixedButton as="button" formId="loginForm">
        로그인
      </BottomFixedButton>
    </div>
  );
}
