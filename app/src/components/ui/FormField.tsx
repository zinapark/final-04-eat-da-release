import { useRef, useEffect } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: () => void;
  placeholder?: string;
  as?: "input" | "textarea";
  error?: string;
}

export default function FormField({
  label,
  required,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  as = "input",
  error,
}: FormFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 높이 자동 조절
  useEffect(() => {
    if (as === 'textarea' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [as, value]);

  const inputClassName =
    "w-full py-2 border-b-[0.5px] border-gray-400 text-display-2 text-gray-800 placeholder:text-gray-500 disabled:text-gray-500 focus:outline-none";

  return (
    <div>
      <label className="text-display-2 font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-eatda-orange">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          ref={textareaRef}
          rows={1}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${inputClassName} resize-none overflow-hidden`}
          required={required}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={inputClassName}
          required={required}
        />
      )}
      {error && (
        <p className="text-x-small text-eatda-orange mt-1">{error}</p>
      )}
    </div>
  );
}
