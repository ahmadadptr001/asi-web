// src/pages/NotFound.jsx
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';

const Error404 = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 text-center">
			<img
				src="https://i.gifer.com/origin/78/787899e9d4e4491f797aba5c61294dfc_w200.webp"
				alt="404 Illustration"
				className="w-40 sm:w-60 mb-8"
			/>
			<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<p className="text-lg text-gray-600 mb-6">
				Oops! Halaman yang kamu cari tidak ditemukan.
			</p>
			<Link
				to="/"
				className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
			>
				Kembali ke Beranda
			</Link>

			<Divider />
			
			<p className="mt-2 sm:mt-6 text-[.8rem]">Made with ❤️ by Asi-Web developer </p>
		</div>
	);
};

export default Error404;
