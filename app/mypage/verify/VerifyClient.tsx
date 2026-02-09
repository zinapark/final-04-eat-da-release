"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomFixedButton from "@/app/src/components/common/BottomFixedButton";
import ConfirmModal from "@/app/src/components/ui/ConfirmModal";
import useUserStore from "@/zustand/userStore";
import { getAxios } from "@/lib/axios";

export default function VerifyClient() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!password || !user?.email) return;
    setLoading(true);
    try {
      const axios = getAxios();
      const res = await axios.post("/users/login", {
        email: user.email,
        password,
      });
      if (res.data.ok) {
        setShowModal(true);
      } else {
        setIsError(true);
      }
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push("/account");
  };

  return (
    <>
      {/* 정보 확인 영역 */}
      <section className="px-5 mt-15 mb-24 flex flex-1 flex-col gap-5 min-h-[calc(100vh-10rem)]">
        <p className="text-gray-600 text-display-2">
          보안을 위해 비밀번호를 다시 입력해주세요.
        </p>
        <div className="flex flex-col">
          <h1 className="text-display-3 font-semibold">비밀번호</h1>
          <input
            type="password"
            placeholder="현재 비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheck();
            }}
            className="text-display-2 w-full border-b-[0.5px] border-gray-400 py-3 focus:outline-none"
          />

          {isError && (
            <p className="text-x-small text-eatda-orange mt-1">
              비밀번호가 일치하지 않습니다
            </p>
          )}
        </div>
      </section>

      {/* 하단 고정 버튼 */}
      <BottomFixedButton as="button" type="button" onClick={handleCheck}>
        {loading ? "확인 중..." : "확인"}
      </BottomFixedButton>

      <ConfirmModal
        isOpen={showModal}
        title="확인되었습니다"
        description="개인 정보 설정 페이지로 이동합니다."
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
