import Link from 'next/link';

type BottomFixedButtonProps =
  | {
      as: 'link';
      href: string;
      children: React.ReactNode;
    }
  | {
      as: 'button';
      type?: 'submit';
      formId: string;
      children: React.ReactNode;
    }
  | {
      as: 'button';
      type: 'button';
      onClick: () => void | Promise<void>;
      children: React.ReactNode;
      disabled?: boolean;
    };

export default function BottomFixedButton(props: BottomFixedButtonProps) {
  const wrapperClassName = 'fixed bottom-0 left-0 right-0 z-50';

  const baseClassName =
    'w-full max-w-[744px] mx-auto h-17 flex items-center justify-center pt-2 pb-2 text-white text-display-4 font-semibold bg-eatda-orange cursor-pointer';

  const disabledClassName =
    'w-full max-w-[744px] mx-auto h-17 flex items-center justify-center pt-2 pb-2 text-gray-500 text-display-4 font-semibold bg-gray-300 cursor-not-allowed';

  if (props.as === 'link') {
    return (
      <div className={wrapperClassName}>
        <Link href={props.href} className={baseClassName}>
          {props.children}
        </Link>
      </div>
    );
  }

  // 일반 클릭 버튼
  if (props.type === 'button') {
    const className = props.disabled ? disabledClassName : baseClassName;
    return (
      <div className={wrapperClassName}>
        <button
          type="button"
          onClick={props.disabled ? undefined : props.onClick}
          disabled={props.disabled}
          className={className}
        >
          {props.children}
        </button>
      </div>
    );
  }

  // 폼 제출 버튼
  return (
    <div className={wrapperClassName}>
      <button type="submit" form={props.formId} className={baseClassName}>
        {props.children}
      </button>
    </div>
  );
}
