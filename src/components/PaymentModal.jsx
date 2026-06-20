'use client';

import { useEffect, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '@/lib/axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm({ hiring, clientSecret, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!stripe || !elements) {
      setError('Payment form is still loading.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card input is not ready.');
      return;
    }

    setProcessing(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed. Please try again.');
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        await axiosInstance.post(`/api/hirings/${hiring._id}/confirm-payment`, {
          transactionId: result.paymentIntent.id,
        });
        onSuccess?.();
      } else {
        setError('Payment could not be completed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1f2937',
                '::placeholder': {
                  color: '#9ca3af',
                },
              },
              invalid: {
                color: '#dc2626',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 rounded-lg bg-[#1A3C5E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15304a] disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
        >
          {processing ? 'Processing...' : `Pay $${hiring.fee}`}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({ hiring, onClose, onSuccess }) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchClientSecret = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await axiosInstance.post(`/api/hirings/${hiring._id}/pay`);
        if (isMounted) setClientSecret(res.data.clientSecret);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to start payment. Please try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchClientSecret();

    return () => {
      isMounted = false;
    };
  }, [hiring._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-gray-900">Complete Payment</h2>
          <p className="mt-1 text-sm text-gray-500">
            Pay ${hiring.fee} for {hiring.lawyerName}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-[#1A3C5E]" />
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-[#1A3C5E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15304a] transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {!loading && !error && clientSecret && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              hiring={hiring}
              clientSecret={clientSecret}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
