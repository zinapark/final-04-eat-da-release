"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "확인",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-lg w-[90vw] max-w-150 px-6 pb-4 pt-8 flex flex-col gap-4">
        <div className="text-gray-800 text-center flex flex-col gap-1">
          <p className="text-display-4 font-semibold">{title}</p>
          {description && <p className="text-display-2">{description}</p>}
        </div>

        {onCancel ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded bg-gray-200 text-gray-800 text-display-2 font-semibold hover:opacity-80"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-3 rounded bg-eatda-orange text-white text-display-2 font-semibold hover:opacity-80"
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 rounded bg-eatda-orange text-white text-display-2 font-semibold hover:opacity-80"
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  );
}
