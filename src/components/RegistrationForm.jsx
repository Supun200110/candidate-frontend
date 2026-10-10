import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const RegistrationForm = () => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      fullName: '',
      address: '',
      occupation: '',
      dateOfBirth: '',
      isSriLankanCitizen: true,
      isDualCitizen: false,
      candidacyType: 'Party',
      partyAffiliation: { partyName: '', secretarySignatureUrl: '' },
      legislativeHistory: { isExMP: false, certificateUrl: '' },
      supportData: {
        proposer: { name: '', voterRegistrationNumber: '' },
        seconder: { name: '', voterRegistrationNumber: '' }
      },
      securityDeposit: { amount: '', receiptNumber: '', paymentDate: '' },
      declarations: {
        hasBeenElectedTwice: false,
        isOfSoundMind: true,
        hasCriminalConviction: false,
        hasSignedConsent: false
      },
      ballotDetails: { ballotName: '', symbolName: '', symbolImageUrl: '' }
    }
  });

  const candidacyType = watch("candidacyType");

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token"); 
      
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/candidate", 
        data, 
        {
          headers: {
            "Authorization": `Bearer ${token}` 
          },
        }
      );

     if (response.status === 201) {
  toast.success(`සාර්ථකයි! අපේක්ෂක අංකය: ${response.data.id}`);
  reset();
}
    } catch (error) {
  const errorMsg = error.response?.data?.message || "දත්ත ඇතුළත් කිරීමේ දෝෂයක්!";
  toast.error(errorMsg);
}
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 mt-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#592c68]">Presidential Candidate Registration</h2>
            <p className="text-sm text-gray-500">Official Admin Entry Portal</p>
          </div>
          <Link
            to="/admin/verification"
            className="bg-[#592c68] text-white px-4 py-2 rounded font-semibold text-sm text-center hover:bg-[#462153]"
          >
            Election Officer Verification
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          
          {/* 1. Personal Identity */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">1. Personal Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Full Legal Name *</label>
                <input {...register("fullName", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Occupation *</label>
                <input {...register("occupation", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium">Permanent Address *</label>
                <textarea {...register("address", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Date of Birth *</label>
                <input type="date" {...register("dateOfBirth", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="flex items-center space-x-6 pt-6">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register("isSriLankanCitizen")} className="w-4 h-4" />
                  <span className="text-sm">Sri Lankan Citizen</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register("isDualCitizen")} className="w-4 h-4" />
                  <span className="text-sm">Dual Citizen</span>
                </label>
              </div>
            </div>
          </section>

          {/* 2. Candidacy Details */}
          <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">2. Candidacy Details</h3>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center space-x-2">
                <input type="radio" value="Party" {...register("candidacyType")} />
                <span>Recognized Political Party</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" value="Independent" {...register("candidacyType")} />
                <span>Independent</span>
              </label>
            </div>

            {candidacyType === 'Party' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Party Name" {...register("partyAffiliation.partyName")} className="p-2 border rounded" />
                <input placeholder="Secretary Signature URL" {...register("partyAffiliation.secretarySignatureUrl")} className="p-2 border rounded" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register("legislativeHistory.isExMP")} />
                  <span className="text-sm">Is Ex-Member of Parliament?</span>
                </label>
                <input placeholder="Certificate URL" {...register("legislativeHistory.certificateUrl")} className="p-2 border rounded" />
              </div>
            )}
          </section>

          {/* 3. Ballot Details */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">3. Ballot Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input placeholder="Name on Ballot Paper" {...register("ballotDetails.ballotName", { required: true })} className="p-2 border rounded" />
              <input placeholder="Symbol Name" {...register("ballotDetails.symbolName", { required: true })} className="p-2 border rounded" />
              <input placeholder="Symbol Image URL" {...register("ballotDetails.symbolImageUrl")} className="p-2 border rounded" />
            </div>
          </section>

          {/* 4. Support Data (Proposer & Seconder) */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">4. Support Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-3 border rounded bg-blue-50/30">
                <p className="text-xs font-bold mb-2">PROPOSER</p>
                <input placeholder="Full Name" {...register("supportData.proposer.name")} className="w-full p-2 border rounded mb-2" />
                <input placeholder="Voter Reg No" {...register("supportData.proposer.voterRegistrationNumber")} className="w-full p-2 border rounded" />
              </div>
              <div className="p-3 border rounded bg-blue-50/30">
                <p className="text-xs font-bold mb-2">SECONDER</p>
                <input placeholder="Full Name" {...register("supportData.seconder.name")} className="w-full p-2 border rounded mb-2" />
                <input placeholder="Voter Reg No" {...register("supportData.seconder.voterRegistrationNumber")} className="w-full p-2 border rounded" />
              </div>
            </div>
          </section>

          {/* 5. Security Deposit */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">5. Security Deposit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="number" placeholder="Amount (LKR)" {...register("securityDeposit.amount")} className="p-2 border rounded" />
              <input placeholder="Receipt Number" {...register("securityDeposit.receiptNumber")} className="p-2 border rounded" />
              <input type="date" {...register("securityDeposit.paymentDate")} className="p-2 border rounded" />
            </div>
          </section>

          {/* 6. Legal Declarations */}
          <section className="space-y-4 bg-purple-50/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">6. Declarations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("declarations.hasBeenElectedTwice")} />
                <span className="text-sm">Has been elected twice as President</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("declarations.isOfSoundMind")} />
                <span className="text-sm">Is of sound mind</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("declarations.hasCriminalConviction")} />
                <span className="text-sm">Has any criminal convictions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register("declarations.hasSignedConsent")} />
                <span className="text-sm">Has signed the official consent form</span>
              </label>
            </div>
          </section>

          <div className="flex justify-end pt-6 border-t">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#592c68] text-white px-12 py-3 rounded font-bold hover:bg-[#462153] transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? "Processing..." : "REGISTER CANDIDATE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};