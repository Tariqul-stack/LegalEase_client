'use client';

import { useEffect, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FaCcMastercard, FaCcVisa, FaLock } from 'react-icons/fa';
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
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Card details
        </label>
        <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3 pr-20 shadow-sm transition-colors focus-within:border-[#1A3C5E] focus-within:ring-2 focus-within:ring-[#1A3C5E]/15">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1A3C5E',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#dc2626',
                },
              },
            }}
          />
          <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray-400">
            <FaCcVisa size={24} />
            <FaCcMastercard size={24} />
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500">
          <FaLock size={12} />
          Your payment is secured by Stripe
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A3C5E] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15304a] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {processing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Processing...
            </>
          ) : (
            <>
              <FaLock size={13} />
              Pay ${hiring.fee}
            </>
          )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1A3C5E]/10 text-[#1A3C5E]">
            <FaLock size={18} />
          </div>
          <div>
            <h2 id="payment-modal-title" className="text-xl font-extrabold text-gray-900">
              Complete Payment
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review your secure payment details
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Lawyer
              </p>
              <p className="mt-1 text-base font-bold text-[#1A3C5E]">
                {hiring.lawyerName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Amount
              </p>
              <p className="mt-1 text-xl font-extrabold text-[#1A3C5E]">
                ${hiring.fee}
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-[#1A3C5E]" />
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-[#1A3C5E] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15304a]"
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
