"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { createClientSupabaseClient } from "@/libs";
import { useModal } from "@/shared";
import { useLogin } from "../hooks";

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useLogin();
	const { openModal } = useModal();

	// URL 쿼리 파라미터에서 에러 메시지 확인
	useEffect(() => {
		const error = searchParams.get("error");
		if (error) {
			let errorMessage = "알 수 없는 오류가 발생했습니다.";

			if (error === "unexpected_error") {
				errorMessage = "예상치 못한 오류가 발생했습니다. 다시 시도해주세요.";
			} else {
				errorMessage = decodeURIComponent(error);
			}

			openModal({
				type: "error",
				title: "인증 오류",
				message: errorMessage,
				confirmText: "확인",
			});

			// URL에서 에러 파라미터 제거
			router.replace("/login");
		}
	}, [searchParams, openModal, router]);

	const handleLogin = async () => {
		const { error } = await login(email, password);

		if (error) {
			// 이메일 확인이 필요한 경우 특별 처리
			if (error.message.includes("Email not confirmed")) {
				openModal({
					type: "warning",
					title: "이메일 확인 필요",
					message: "계정을 활성화하려면 이메일 확인이 필요합니다. 이메일을 확인해주세요.",
					confirmText: "확인",
					cancelText: "재전송",
					onCancel: async () => {
						// 확인 이메일 재전송 로직
						const { error } = await createClientSupabaseClient().auth.resend({
							type: "signup",
							email,
							options: {
								emailRedirectTo: `${window.location.origin}/auth/callback`,
							},
						});

						if (error) {
							openModal({
								type: "error",
								title: "이메일 재전송 실패",
								message: error.message,
								confirmText: "확인",
							});
						} else {
							openModal({
								type: "success",
								title: "이메일 재전송 성공",
								message: "확인 이메일이 재전송되었습니다. 이메일을 확인해주세요.",
								confirmText: "확인",
							});
						}
					},
				});
			} else {
				// 다른 오류 처리
				openModal({
					type: "error",
					title: "로그인 오류",
					message: error.message,
					confirmText: "확인",
				});
			}
		} else {
			// 로그인 성공 처리
			router.push("/");
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
				<h2 className="text-2xl font-semibold mb-6 text-center">로그인</h2>

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

					<button
						onClick={handleLogin}
						className="w-full rounded-md transition-colors flex items-center justify-center bg-[#1DB954] text-black gap-2 hover:bg-[#1ed760] font-medium text-base h-12 px-6 mt-6 cursor-pointer"
					>
						로그인
					</button>

					<div className="mt-4 text-center text-sm text-gray-400">
						<span>계정이 없으신가요? </span>
						<Link href="/signup" className="text-[#1DB954] hover:underline">
							회원가입
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

export default LoginForm;
