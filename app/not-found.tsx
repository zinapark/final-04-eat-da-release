'use client';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF6155"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div>
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-display-2 font-semibold text-gray-700">
            페이지를 찾을 수 없습니다
          </h2>
        </div>

        <p className="text-paragraph text-gray-600 max-w-md">
          요청하신 페이지가 존재하지 않거나
          <br />
          삭제되었을 수 있습니다.
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <a
            href="/"
            className="px-6 py-3 bg-eatda-orange text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
          >
            홈으로 돌아가기
          </a>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
          >
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
