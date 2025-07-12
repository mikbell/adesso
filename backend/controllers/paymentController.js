import PaymentRequest from "../models/paymentRequestModel.js";
import { responseReturn } from "../utils/response.js";

export const getPaymentRequests = async (req, res) => {
	try {
		const requests = await PaymentRequest.find({}).sort({ createdAt: -1 });
		responseReturn(res, 200, { paymentRequests: requests });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero delle richieste" });
	}
};

export const confirmPaymentRequest = async (req, res) => {
	const { paymentId } = req.params;
	try {
		await PaymentRequest.findByIdAndUpdate(paymentId, { status: "confirmed" });
		responseReturn(res, 200, { message: "Richiesta confermata con successo" });
	} catch (error) {
		responseReturn(res, 500, {
			error: "Errore durante la conferma della richiesta",
		});
	}
};
