export default function validateKycStep(kycType, values, proofs) {
  if (!kycType) return "Please select a KYC type.";

  if (kycType === "PAN Card") {
    if (!values.panNumber || !values.dob) return "PAN Number and DOB are required.";
  } else if (kycType === "Aadhar ( Last 4 Digits )") {
    if (!values.aadharLast4 || !values.aadharName || !values.aadharDob) {
      return "Please fill all Aadhar details.";
    }
  } else if (kycType === "Others") {
    const identity = proofs.identity;
    const address = proofs.address;
    const identityFile = document.getElementById(`identity-${identity}`)?.files?.[0];
    const addressFile = document.getElementById(`address-${address}`)?.files?.[0];

    if (!identity || !address) return "Select both identity and address proof types.";
    if (!identityFile || !addressFile) return "Upload both identity and address proof files.";
  }

  return true;
}
