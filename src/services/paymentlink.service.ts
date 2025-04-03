import Stripe from "stripe";

interface PaymentLink {
  amount: string;
  reference: string;
  idReference: string;
  iso: string;
}

export const createStripePaymentLink = async ({
  amount,
  reference,
  idReference,
}: PaymentLink) => {
  return new Promise(async (resolve, reject) => {
    try {
      const __stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
        typescript: true,
      });

      const price = await createPriceSimple({ amount, reference });

      const paymentLink = await __stripe.checkout.sessions.create({
        line_items: [
          {
            price: (price as Stripe.Price).id,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.BASE_URL}/webhook/stripe?reference=${idReference}&status=success`,
        cancel_url: `${process.env.BASE_URL}/webhook/stripe?reference=${idReference}&status=error`,
        locale: "es",
      });
    } catch (error) {}
  });
};

const createPriceSimple = ({
  amount,
  reference,
}: {
  amount: string;
  reference: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let __stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
        typescript: true,
      });
      const price = await __stripe.prices.create({
        unit_amount: parseInt((parseFloat(amount) * 100).toFixed(0), 10),
        currency: "mxn",
        product_data: {
          name: reference,
        },
      });
      return resolve(price);
    } catch (error) {
      return reject(error);
    }
  });
};
