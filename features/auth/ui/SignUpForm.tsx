"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useModal } from "@/shared";
import { useSignUp } from "../model";

function SignUpForm() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [nickname, setNickname] = useState("");
	const { signUp } = useSignUp();
	const { openModal } = useModal();

	const handleSignUp = async () => {
		if (password !== confirmPassword) {
			openModal({
				type: "error",
				title: "비밀번호 불일치",
				message: "비밀번호가 일치하지 않습니다.",
				confirmText: "확인",
			});
			return;
		}

		const result = await signUp(email, password, nickname);

		if (result.error) {
			openModal({
				type: "error",
				title: "회원가입 오류",
				message: result.error.message,
				confirmText: "확인",
			});
		} else if (result.emailConfirmationRequired) {
			// 이메일 인증이 필요한 경우
			openModal({
				type: "success",
				title: "회원가입 성공",
				message:
					"회원가입이 완료되었습니다. 이메일로 전송된 확인 링크를 클릭하여 계정을 활성화해주세요.",
				confirmText: "확인",
			});
		} else {
			// 이메일 인증이 필요 없는 경우
			openModal({
				type: "success",
				title: "회원가입 성공",
				message: "회원가입이 완료되었습니다.",
				confirmText: "로그인 페이지로 이동",
				onConfirm: () => {
					router.push("/login");
				},
			});
		}
	};

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<div className="flex items-center gap-3 mb-2">
				<div className="bg-[#1DB954] w-10 h-10 rounded-full flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-black"
					>
						<path d="M9 18V5l12-2v13"></path>
						<circle cx="6" cy="18" r="3"></circle>
						<circle cx="18" cy="16" r="3"></circle>
					</svg>
				</div>
				<h1 className="text-3xl sm:text-4xl font-bold">NoteVault</h1>
			</div>

			<div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md">
				<h2 className="text-2xl font-semibold mb-6 text-center">회원가입</h2>

				<div className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="email" className="block text-sm font-medium text-gray-300">
							이메일
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="이메일을 입력하세요"
							className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent text-white"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="nickname" className="block text-sm font-medium text-gray-300">
							닉네임
						</label>
						<input
							id="nickname"
							type="text"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							placeholder="닉네임을 입력하세요"
							className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent text-white"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="block text-sm font-medium text-gray-300">
							비밀번호
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="비밀번호를 입력하세요"
							className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent text-white"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
							비밀번호 확인
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="비밀번호를 다시 입력하세요"
							className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent text-white"
						/>
					</div>

					<button
						onClick={handleSignUp}
						className="w-full rounded-md transition-colors flex items-center justify-center bg-[#1DB954] text-black gap-2 hover:bg-[#1ed760] font-medium text-base h-12 px-6 mt-6"
					>
						회원가입
					</button>

					<div className="mt-4 text-center text-sm text-gray-400">
						<span>이미 계정이 있으신가요? </span>
						<Link href="/login" className="text-[#1DB954] hover:underline">
							로그인
						</Link>
					</div>
				</div>
			</div>

			<div className="text-zinc-500 text-sm text-center mt-6">
				<p>© 2025 NoteVault. 모든 권리 보유.</p>
			</div>
		</div>
	);
}

export default SignUpForm;
