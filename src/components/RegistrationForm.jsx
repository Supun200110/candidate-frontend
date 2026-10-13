import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ImageUploader from './ImageUploader';

export const RegistrationForm = () => {
  const [candidateImageFile, setCandidateImageFile] = useState(null);
  const [candidateImagePreview, setCandidateImagePreview] = useState(null);

  const [partySymbolFile, setPartySymbolFile] = useState(null);
  const [partySymbolPreview, setPartySymbolPreview] = useState(null);

  const [uploadProgressText, setUploadProgressText] = useState("");

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
      partyAffiliation: {
    partyName: '',
    partyColor: '#666666',
    secretarySignatureUrl: ''
},
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

      let candidateImageUrl = data.candidateImageUrl || "";
      let symbolImageUrl = data.ballotDetails?.symbolImageUrl || "";

      // 1. If images are selected, upload them to Supabase via backend endpoint
      if (candidateImageFile || partySymbolFile) {
        setUploadProgressText("Uploading images to Supabase Storage...");
        const formData = new FormData();

        if (candidateImageFile) {
          formData.append("candidateImage", candidateImageFile);
        }
        if (partySymbolFile) {
          formData.append("partySymbol", partySymbolFile);
        }

        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/candidate/upload`,
          formData,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        const uploaded = uploadResponse.data?.data || {};
        if (uploaded.candidateImageUrl) {
          candidateImageUrl = uploaded.candidateImageUrl;
        }
        if (uploaded.partySymbolUrl || uploaded.symbolImageUrl) {
          symbolImageUrl = uploaded.partySymbolUrl || uploaded.symbolImageUrl;
        }
      }

      setUploadProgressText("Registering candidate in database...");

      // 2. Prepare payload with uploaded image URLs
      const payload = {
        ...data,
        candidateImageUrl,
        ballotDetails: {
          ...data.ballotDetails,
          symbolImageUrl
        },
        partyAffiliation: {
          ...data.partyAffiliation,
          partySymbolUrl: symbolImageUrl
        }
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/candidate`, 
        payload, 
        {
          headers: {
            "Authorization": `Bearer ${token}` 
          },
        }
      );

      if (response.status === 201) {
        toast.success(`Candidate registered successfully! Candidate ID: ${response.data.id}`);
        reset();
        setCandidateImageFile(null);
        setCandidateImagePreview(null);
        setPartySymbolFile(null);
        setPartySymbolPreview(null);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to register candidate. Please try again.";
      toast.error(errorMsg);
    } finally {
      setUploadProgressText("");
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
          
          {/* 1. Personal Identity & Photo */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 flex items-center justify-between">
              <span>1. Personal Identity & Qualifications</span>
              <span className="text-xs font-normal text-gray-400">Section A</span>
            </h3>

            {/* Candidate Photo Uploader */}
            <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 mb-4">
              <ImageUploader
                label="Candidate Official Photograph"
                sublabel="Portrait photo (PNG, JPG, WEBP - Max 5MB). Will be stored in Supabase."
                iconType="user"
                file={candidateImageFile}
                previewUrl={candidateImagePreview}
                onFileSelect={(file, preview) => {
                  setCandidateImageFile(file);
                  setCandidateImagePreview(preview);
                }}
                onRemove={() => {
                  setCandidateImageFile(null);
                  setCandidateImagePreview(null);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Full Legal Name *</label>
                <input {...register("fullName", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" placeholder="e.g. John Doe" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Occupation *</label>
                <input {...register("occupation", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" placeholder="e.g. Attorney-at-Law" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium">Permanent Address *</label>
                <textarea {...register("address", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" placeholder="Permanent residential address" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Date of Birth *</label>
                <input type="date" {...register("dateOfBirth", { required: true })} className="p-2 border rounded mt-1 outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="flex items-center space-x-6 pt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" {...register("isSriLankanCitizen")} className="w-4 h-4 text-[#592c68] rounded" />
                  <span className="text-sm">Sri Lankan Citizen</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" {...register("isDualCitizen")} className="w-4 h-4 text-[#592c68] rounded" />
                  <span className="text-sm">Dual Citizen</span>
                </label>
              </div>
            </div>
          </section>

          {/* 2. Candidacy Details */}
          <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">2. Candidacy Details</h3>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" value="Party" {...register("candidacyType")} />
                <span>Recognized Political Party</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" value="Independent" {...register("candidacyType")} />
                <span>Independent</span>
              </label>
            </div>

            {candidacyType === 'Party' ? (
              
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
        <label className="block text-sm font-medium mb-1">
            Party Name
        </label>
        <input
            placeholder="Party Name"
            {...register("partyAffiliation.partyName")}
            className="p-2 border rounded bg-white w-full"
        />
    </div>

    <div>
        <label className="block text-sm font-medium mb-1">
            Party Colour
        </label>
        <input
            type="color"
            {...register("partyAffiliation.partyColor")}
            className="w-full h-10 border rounded cursor-pointer"
        />
    </div>
</div>

            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register("legislativeHistory.isExMP")} />
                  <span className="text-sm">Is Ex-Member of Parliament?</span>
                </label>
                <input placeholder="Certificate URL" {...register("legislativeHistory.certificateUrl")} className="p-2 border rounded bg-white" />
              </div>
            )}
          </section>

          {/* 3. Ballot Details & Symbol Upload */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 flex items-center justify-between">
              <span>3. Ballot Details & Party Symbol</span>
              <span className="text-xs font-normal text-gray-400">Section B</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Name on Ballot Paper *</label>
                <input placeholder="Ballot Paper Display Name" {...register("ballotDetails.ballotName", { required: true })} className="p-2 border rounded outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Symbol Name *</label>
                <input placeholder="e.g. Lotus, Elephant, Swan" {...register("ballotDetails.symbolName", { required: true })} className="p-2 border rounded outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
            </div>

            {/* Party Symbol Uploader */}
            <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80">
              <ImageUploader
                label="Party / Ballot Symbol Graphic"
                sublabel="Official logo or symbol icon (PNG, JPG, SVG, WEBP - Max 5MB). Will be stored in Supabase."
                iconType="symbol"
                file={partySymbolFile}
                previewUrl={partySymbolPreview}
                onFileSelect={(file, preview) => {
                  setPartySymbolFile(file);
                  setPartySymbolPreview(preview);
                }}
                onRemove={() => {
                  setPartySymbolFile(null);
                  setPartySymbolPreview(null);
                }}
              />
            </div>
          </section>

          {/* 4. Support Data (Proposer & Seconder) */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">4. Support Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-3 border rounded bg-blue-50/30">
                <p className="text-xs font-bold mb-2 text-blue-900">PROPOSER</p>
                <input placeholder="Full Name" {...register("supportData.proposer.name")} className="w-full p-2 border rounded mb-2 bg-white" />
                <input placeholder="Voter Reg No" {...register("supportData.proposer.voterRegistrationNumber")} className="w-full p-2 border rounded bg-white" />
              </div>
              <div className="p-3 border rounded bg-blue-50/30">
                <p className="text-xs font-bold mb-2 text-blue-900">SECONDER</p>
                <input placeholder="Full Name" {...register("supportData.seconder.name")} className="w-full p-2 border rounded mb-2 bg-white" />
                <input placeholder="Voter Reg No" {...register("supportData.seconder.voterRegistrationNumber")} className="w-full p-2 border rounded bg-white" />
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
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("declarations.hasBeenElectedTwice")} className="rounded text-[#592c68]" />
                <span className="text-sm">Has been elected twice as President</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("declarations.isOfSoundMind")} className="rounded text-[#592c68]" />
                <span className="text-sm">Is of sound mind</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("declarations.hasCriminalConviction")} className="rounded text-[#592c68]" />
                <span className="text-sm">Has any criminal convictions</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register("declarations.hasSignedConsent")} className="rounded text-[#592c68]" />
                <span className="text-sm">Has signed the official consent form</span>
              </label>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
            {uploadProgressText ? (
              <div className="flex items-center gap-2 text-sm text-[#592c68] font-semibold animate-pulse">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#592c68]"></span>
                {uploadProgressText}
              </div>
            ) : (
              <p className="text-xs text-gray-400">All information and uploaded assets will be verified by the Election Officer.</p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#592c68] text-white px-12 py-3 rounded-lg font-bold hover:bg-[#462153] transition-colors shadow-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (uploadProgressText || "Processing...") : "REGISTER CANDIDATE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
