'use client';

import generatePayload from 'promptpay-qr';
import QRCode from 'qrcode';
import { QrCode, Wallet } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';

function PromptPayGenerator() {
	const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
	const [type, setType] = useState<string>('01');
	const [mobileNo, setMobileNo] = useState<string>('');
	const [promptPayId, setPromptPayId] = useState<string>('');
	const [amount, setAmount] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const generatePromptPay = async () => {
		try {
			setLoading(true);
			setError('');

			const identifier = type === '01' ? mobileNo : promptPayId;

			const payload = generatePayload(identifier, { amount });
			const qrCodeDataUrl = await QRCode.toDataURL(payload);

			setQrCodeUrl(qrCodeDataUrl);
		} catch (err) {
			setError('ไม่สามารถสร้าง QR Code ได้');
			console.error('QR Code generation error:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setType(value);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'amount') {
			const newAmount = Number(value);
			setAmount(newAmount);
		} else if (name === 'mobileNo') {
			setMobileNo(value);
		} else {
			setPromptPayId(value);
		}
	};

	useEffect(() => {
		const idCard = process.env.NEXT_PUBLIC_ID_CARD ?? '';
		const phone = process.env.NEXT_PUBLIC_MOBILE ?? '';
		setPromptPayId(idCard);
		setMobileNo(phone);
	}, []);

	if (loading) {
		return <div className={`text-center`}>กำลังสร้าง QR Code...</div>;
	}

	if (error) {
		return <div className={`text-red-500 text-center`}>{error}</div>;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
						<QrCode className="text-blue-600" size={40} />
						PromptPay QR Generator by promptpay-qr
					</h1>
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					<div className="bg-white rounded-2xl shadow-xl p-6">
						<div className="space-y-4">
							<div>
								<label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
									Amount (฿)
								</label>
								<input
									type="number"
									name="amount"
									value={amount}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									min="0"
									step="0.01"
								/>
							</div>
							<div>
								<label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
									Amount (฿)
								</label>
								<select name="type" value={type} onChange={handleTypeChange}>
									<option value="01">Mobile</option>
									<option value="02">ID Card</option>
								</select>
							</div>
							{type === '01' ? (
								<div>
									<label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number
									</label>
									<input
										type="text"
										name="mobileNo"
										value={mobileNo}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
								</div>
							) : (
								<div>
									<label htmlFor="promptPayId" className="block text-sm font-medium text-gray-700 mb-2">
										ID Card / Promppay ID
									</label>
									<input
										type="text"
										name="promptPayId"
										value={promptPayId}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
								</div>
							)}
							<button
                onClick={generatePromptPay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95"
              >
                Generate PromptPay QR
              </button>
						</div>
					</div>

					<div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
						<h1 className="text-xl font-bold mb-2 text-center">สแกน QR Code เพื่อชำระเงิน</h1>
						<div className="flex flex-col items-center justify-center gap-4">
							<div className="flex items-center gap-2">
								<Wallet className="w-5 h-5 text-gray-600" />
								<span className="font-medium text-gray-600">จำนวน</span>
								<div className="text-2xl font-bold text-blue-800">
									{amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
								</div>
								<span className="font-medium text-gray-600">บาท</span>
							</div>
							<div className="rounded-lg overflow-hidden shadow-lg">
								<div className={`text-center`}>
									{qrCodeUrl && (
										<div>
											<img
												src={qrCodeUrl}
												width={200}
												height={200}
												alt="PromptPay QR Code"
												className="mx-auto border border-gray-300 rounded-lg"
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PromptPayGenerator;
