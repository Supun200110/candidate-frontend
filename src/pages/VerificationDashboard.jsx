import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiUser, FiImage } from "react-icons/fi";

const API = import.meta.env.VITE_BACKEND_URL;

const emptyChecks = {
  eligibilityVerified: false,
  identityVerified: false,
  nominationVerified: false,
  supportDataVerified: false,
  depositVerified: false,
  declarationsVerified: false
};

const checkLabels = {
  eligibilityVerified: "Eligibility requirements verified",
  identityVerified: "Identity / personal information verified",
  nominationVerified: "Nomination details verified",
  supportDataVerified: "Proposer and seconder verified",
  depositVerified: "Security deposit and receipt verified",
  declarationsVerified: "Declarations and consent verified"
};

export default function VerificationDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checks, setChecks] = useState(emptyChecks);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("Pending");

  const token = localStorage.getItem("token");

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/candidate`, config);
      setCandidates(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const openCandidate = (candidate) => {
    setSelected(candidate);
    setChecks({
      ...emptyChecks,
      ...(candidate.verification?.checks || {})
    });
    setNotes(candidate.verification?.notes || "");
  };

  const updateCheck = (name) => {
    setChecks((previous) => ({
      ...previous,
      [name]: !previous[name]
    }));
  };

  const verify = async (status) => {
    if (!selected) return;

    if (status === "Accepted" && !Object.values(checks).every(Boolean)) {
      toast.error("Complete all verification checks before accepting.");
      return;
    }

    if (status === "Rejected" && !notes.trim()) {
      toast.error("Enter a reason before rejecting the application.");
      return;
    }

    try {
      setSaving(true);

      await axios.patch(
        `${API}/api/candidate/${selected.candidateId}/verify`,
        { status, checks, notes },
        config
      );

      toast.success(`Candidate ${status.toLowerCase()} successfully.`);
      setSelected(null);
      await loadCandidates();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    } finally {
      setSaving(false);
    }
  };

  const filteredCandidates = candidates.filter((candidate) =>
    filter === "All" ? true : candidate.status === filter
  );

  const statusClass = {
    Pending: "bg-yellow-100 text-yellow-800",
    "Under Verification": "bg-blue-100 text-blue-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800"
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-[#592c68] text-white px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Election Officer Verification</h1>
            <p className="text-purple-200 text-sm mt-1">
              Review candidate applications, verify credentials & symbols, and record decisions.
            </p>
          </div>

          <Link
            to="/admin"
            className="bg-white text-[#592c68] px-4 py-2 rounded-lg font-semibold text-sm text-center hover:bg-purple-50 transition-colors"
          >
            + Register New Candidate
          </Link>
        </div>

        <div className="p-5 border-b bg-gray-50 flex flex-wrap gap-2">
          {["Pending", "Under Verification", "Accepted", "Rejected", "All"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                filter === item
                  ? "bg-[#592c68] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-[#592c68] border-t-transparent rounded-full animate-spin"></div>
            <p>Loading candidate applications...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            No {filter.toLowerCase()} candidate applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b">
                <tr>
                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Candidate ID</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Candidate</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Party / Type</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Ballot Symbol</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Submitted</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Status</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.candidateId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-[#592c68] font-mono">{candidate.candidateId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {candidate.candidateImageUrl ? (
                          <img
                            src={candidate.candidateImageUrl}
                            alt={candidate.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-purple-200 shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-[#592c68] flex items-center justify-center font-bold text-sm">
                            {candidate.fullName?.charAt(0) || "C"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-800">{candidate.fullName}</div>
                          <div className="text-xs text-gray-500">{candidate.occupation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <span className="font-medium text-gray-700">
                        {candidate.candidacyType === 'Party' ? (candidate.partyAffiliation?.partyName || 'Party') : 'Independent'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {candidate.ballotDetails?.symbolImageUrl ? (
                          <img
                            src={candidate.ballotDetails.symbolImageUrl}
                            alt={candidate.ballotDetails?.symbolName || "Symbol"}
                            className="w-8 h-8 rounded border border-gray-200 object-contain bg-white p-0.5"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <FiImage className="w-4 h-4" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-gray-600">
                          {candidate.ballotDetails?.symbolName || "None"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass[candidate.status] || "bg-gray-100 text-gray-700"}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openCandidate(candidate)}
                        className="bg-[#592c68] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#462153] transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Verification Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs p-4 overflow-y-auto flex items-center justify-center">
          <div className="max-w-4xl w-full my-8 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-[#592c68] text-white p-6 flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-purple-200 font-semibold">Official Application</p>
                <h2 className="text-2xl font-bold mt-0.5">{selected.candidateId} — {selected.fullName}</h2>
              </div>
              <button 
                onClick={() => setSelected(null)} 
                className="text-white hover:text-purple-200 text-2xl font-bold leading-none cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Image Assets Section */}
              <div className="bg-purple-50/40 rounded-xl p-4 border border-purple-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Candidate Photo */}
                <div className="flex items-center gap-4 bg-white p-3.5 rounded-lg border border-purple-200/60 shadow-xs">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {selected.candidateImageUrl ? (
                      <img
                        src={selected.candidateImageUrl}
                        alt={selected.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <FiUser className="w-8 h-8" />
                        <span className="text-[10px] mt-1">No Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Candidate Photo</span>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{selected.fullName}</p>
                    {selected.candidateImageUrl ? (
                      <a 
                        href={selected.candidateImageUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-[#592c68] font-medium hover:underline inline-block mt-1"
                      >
                        View Full Image ↗
                      </a>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium mt-1 inline-block">Not provided</span>
                    )}
                  </div>
                </div>

                {/* Ballot Symbol */}
                <div className="flex items-center gap-4 bg-white p-3.5 rounded-lg border border-purple-200/60 shadow-xs">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 p-1">
                    {selected.ballotDetails?.symbolImageUrl ? (
                      <img
                        src={selected.ballotDetails.symbolImageUrl}
                        alt={selected.ballotDetails?.symbolName || "Party Symbol"}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <FiImage className="w-8 h-8" />
                        <span className="text-[10px] mt-1">No Symbol</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ballot Symbol</span>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {selected.ballotDetails?.symbolName || "N/A"}
                    </p>
                    {selected.ballotDetails?.symbolImageUrl ? (
                      <a 
                        href={selected.ballotDetails.symbolImageUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-[#592c68] font-medium hover:underline inline-block mt-1"
                      >
                        View Full Symbol ↗
                      </a>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium mt-1 inline-block">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Candidate Details */}
              <section>
                <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">Candidate Details</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <p><strong>Full Name:</strong> {selected.fullName}</p>
                  <p><strong>Occupation:</strong> {selected.occupation}</p>
                  <p><strong>Date of Birth:</strong> {new Date(selected.dateOfBirth).toLocaleDateString()}</p>
                  <p><strong>Citizenship:</strong> {selected.isSriLankanCitizen ? "Sri Lankan" : "Not confirmed"}</p>
                  <p><strong>Address:</strong> {selected.address}</p>
                  <p><strong>Candidacy:</strong> {selected.candidacyType}</p>
                  <p><strong>Party:</strong> {selected.partyAffiliation?.partyName || "N/A"}</p>
                  <p><strong>Ballot Name:</strong> {selected.ballotDetails?.ballotName}</p>
                  <p><strong>Symbol Name:</strong> {selected.ballotDetails?.symbolName}</p>
                  <p><strong>Deposit:</strong> LKR {Number(selected.securityDeposit?.amount || 0).toLocaleString()}</p>
                  <p><strong>Receipt:</strong> {selected.securityDeposit?.receiptNumber}</p>
                  <p><strong>Consent:</strong> {selected.declarations?.hasSignedConsent ? "Signed" : "Not confirmed"}</p>
                </div>
              </section>

              {/* Verification Checklist */}
              <section>
                <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">
                  Verification Checklist
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(checkLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        checks[key] ? "bg-green-50 border-green-300 text-green-950 font-medium" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checks[key]}
                        onChange={() => updateCheck(key)}
                        className="w-5 h-5 accent-[#592c68] rounded"
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Notes */}
              <section>
                <label className="block font-bold text-gray-800 mb-2">
                  Officer Notes / Decision Reason
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Enter verification notes. A reason is required when rejecting."
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-200 border-gray-300"
                />
              </section>

              {selected.verification?.officerEmail && (
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border">
                  Last reviewed by <strong>{selected.verification.officerEmail}</strong>
                  {selected.verification.verifiedAt &&
                    ` on ${new Date(selected.verification.verifiedAt).toLocaleString()}`}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-5">
                <button
                  onClick={() => verify("Under Verification")}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Save as Under Verification
                </button>
                <button
                  onClick={() => verify("Rejected")}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Reject
                </button>
                <button
                  onClick={() => verify("Accepted")}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Accept Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
