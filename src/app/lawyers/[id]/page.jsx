"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "@/lib/axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function LawyerSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col sm:flex-row gap-8 mb-8">
        <div className="w-36 h-36 rounded-full bg-gray-200 flex-shrink-0 mx-auto sm:mx-0" />
        <div className="flex-1 space-y-3 py-2">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-16 bg-gray-200 rounded w-full mt-4" />
        </div>
      </div>
    </div>
  );
}

// ─── Hire Modal ───────────────────────────────────────────────────────────────

function HireModal({ lawyer, user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/hirings",
        {
          lawyerId: lawyer._id,
          clientName: user.name,
          clientEmail: user.email,
          lawyerName: lawyer.name,
          specialization: lawyer.specialization,
          fee: lawyer.consultationFee,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Hiring request sent successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send hiring request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full md:min-w-[500px] md:max-w-xl overflow-hidden">
        <div className="bg-[#1A3C5E] px-10 py-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Confirm Hiring</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-10 py-8">
          {
            <>
              <div className="bg-gray-50 rounded-xl p-5 mb-7 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lawyer</span>
                  <span className="font-semibold text-gray-800">
                    {lawyer.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Specialization</span>
                  <span className="font-semibold text-gray-800">
                    {lawyer.specialization || "General Practice"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-semibold text-green-700">
                    ${lawyer.consultationFee ?? "N/A"}/hr
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Your Name</span>
                  <span className="font-semibold text-gray-800">
                    {user.name}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#1A3C5E] text-white font-medium hover:bg-[#15304a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    "Confirm Hire"
                  )}
                </button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Comments Section ─────────────────────────────────────────────────────────

function CommentsSection({ lawyerId, user }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/api/comments/${lawyerId}`);
      setComments(res.data);
    } catch {
      // silently fail — comments are optional
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lawyerId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    setCommentError("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:8000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lawyerId,
          clientName: user.name,
          clientPhoto: user.photo || "",
          comment: commentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes("hiring") || data.message?.includes("hired")) {
          setCommentError("You can only review a lawyer after hiring them");
        } else {
          setCommentError("Failed to post review. Please try again");
        }
        return;
      }

      setCommentText("");
      fetchComments();
      toast.success("Review posted successfully!");
    } catch {
      setCommentError("Failed to post review. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Client Reviews</h2>

      {/* Comment Form */}
      {user?.role === "user" ? (
        <form
          onSubmit={handleCommentSubmit}
          className="bg-white rounded-xl shadow p-5 mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave a Review
          </label>
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              if (commentError) setCommentError("");
              if (commentSuccess) setCommentSuccess("");
            }}
            placeholder="Share your experience with this lawyer…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E] resize-none"
          />
          {commentError && (
            <p className="mt-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-md p-2">
              {commentError}
            </p>
          )}
          {commentSuccess && (
            <p className="mt-2 text-green-600 text-sm bg-green-50 border border-green-100 rounded-md p-2">
              {commentSuccess}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="mt-3 px-5 py-2 bg-[#1A3C5E] text-white text-sm font-medium rounded-lg hover:bg-[#15304a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Posting…" : "Post Review"}
          </button>
        </form>
      ) : !user ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-700">
          <Link href="/login" className="font-semibold underline">
            Log in
          </Link>{" "}
          to leave a review.
        </div>
      ) : null}

      {/* Comments List */}
      {loadingComments ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 animate-pulse flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow">
          <span className="text-4xl">💬</span>
          <p className="mt-3 text-gray-500">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const avatar =
              c.clientPhoto ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(c.clientName || "User")}&background=1A3C5E&color=fff&size=64`;
            return (
              <div
                key={c._id}
                className="bg-white rounded-xl shadow p-5 flex gap-4"
              >
                <img
                  src={avatar}
                  alt={c.clientName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-800 text-sm">
                      {c.clientName || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {c.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LawyerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isHired, setIsHired] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchLawyer = async () => {
      try {
        const res = await axiosInstance.get(`/api/lawyers/${id}`);
        setLawyer(res.data);
      } catch {
        setError("Lawyer not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchLawyer();
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== "user" || !lawyer?._id) return;

    const checkHiringStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/hirings/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const alreadyHired = res.data.some(
          (hiring) =>
            String(hiring.lawyerId?._id || hiring.lawyerId) ===
            String(lawyer._id),
        );
        setIsHired(alreadyHired);
      } catch {
        setIsHired(false);
      }
    };

    checkHiringStatus();
  }, [user, lawyer]);

  const avatarSrc = lawyer?.photo
    ? lawyer.photo
    : lawyer
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=1A3C5E&color=fff&size=256`
      : "";

  const isAvailable = lawyer?.status !== "busy";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {showModal && lawyer && user && (
        <HireModal
          lawyer={lawyer}
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={() => setIsHired(true)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A3C5E] mb-6 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Loading */}
        {loading && <LawyerSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <span className="text-5xl">⚠️</span>
            <p className="mt-4 text-lg font-semibold text-gray-700">{error}</p>
            <Link
              href="/browse"
              className="mt-5 inline-block px-6 py-2.5 bg-[#1A3C5E] text-white rounded-lg text-sm font-medium hover:bg-[#15304a] transition-colors"
            >
              Back to Browse
            </Link>
          </div>
        )}

        {/* Lawyer Profile */}
        {!loading && lawyer && (
          <>
            <div className="bg-white rounded-2xl shadow p-8 mb-6">
              <div className="flex flex-col sm:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center sm:items-start flex-shrink-0">
                  <img
                    src={avatarSrc}
                    alt={lawyer.name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-[#1A3C5E]/20 shadow"
                  />
                  <span
                    className={`mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                      isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isAvailable ? "● Available" : "● Busy"}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                    {lawyer.name}
                  </h1>
                  <p className="text-blue-600 font-semibold text-base mb-3">
                    {lawyer.specialization || "General Practice"}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <strong>${lawyer.consultationFee ?? "N/A"}/hr</strong>{" "}
                      consultation fee
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Joined {formatDate(lawyer.createdAt)}
                    </span>
                  </div>

                  {lawyer.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {lawyer.bio}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div>
                    {user?.role === "user" && isHired ? (
                      <span className="inline-block px-8 py-3 bg-green-100 text-green-700 font-semibold rounded-lg">
                        ✓ Already Hired
                      </span>
                    ) : user?.role === "user" ? (
                      <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-3 bg-[#1A3C5E] text-white font-semibold rounded-lg hover:bg-[#15304a] transition-colors shadow"
                      >
                        Hire Now
                      </button>
                    ) : !user ? (
                      <Link
                        href="/login"
                        className="inline-block px-8 py-3 bg-[#1A3C5E] text-white font-semibold rounded-lg hover:bg-[#15304a] transition-colors shadow"
                      >
                        Login to Hire
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <CommentsSection lawyerId={id} user={user} />
          </>
        )}
      </div>
    </div>
  );
}
