"use client";

import { CallApi,UploadDocument } from "@/api";
import constant from "@/env";
import { showSuccess, showError }  from "@/layouts/toaster";

export default async function validateKycStep(
  step1Form,
  kycType,
  values,
  proofs,
  setKycVerified,
  kycVerified,
  setIsPanVerified,
  setVerifiedData
) {
  if (kycVerified) return true;
  if (!kycType) return showError("Please select a KYC type."), false;

  try {
    let payload, res;

    // PAN Verification
    if (kycType === "PAN Card") {
      const { customerpancardno, customerpancardDob } = values;
      console.log(customerpancardno, customerpancardDob, values);
      if (!customerpancardno || !customerpancardDob)
        return showError("PAN Number and DOB are required."), false;

      if (
        !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(customerpancardno.trim().toUpperCase())
      )
        return showError("Invalid PAN number (e.g., ABCDE1234F)."), false;

      payload = {
        customerpancardno,
        customerpancardDob,
      };

      res = await CallApi(constant.API.HEALTH.PANVERIFY, "POST", payload);
      console.log("PAN API Response:", res);

      if (res?.status && res?.kyc === "1") {
        showSuccess("PAN verified");
        setKycVerified(true);
        setIsPanVerified?.(true);

        const pd =
          res?.pandata?.getCkycEkycInputIO?.kycDetails?.personalIdentifiableData
            ?.personalDetails;
        if (pd) {
          console.log("Auto-filling from KYC data:", pd);
          setVerifiedData(pd);
        } else {
          console.warn("No personal details found in PAN KYC response.");
        }
        return true;
      }

      showError(res?.responseData?.message || "PAN verification failed");
    }

    // Aadhar Verification
    else if (kycType === "Aadhar ( Last 4 Digits )") {
      const {
        customerAadharGender,
        customerAadharno,
        customerAadharName,
        customerAadharDob,
      } = values;

      if (
        !customerAadharGender ||
        !customerAadharno ||
        !customerAadharName ||
        !customerAadharDob
      )
        return showError("All Aadhar fields are required."), false;

      if (!/^\d{4}$/.test(customerAadharno))
        return showError("Aadhar must be 4 digits."), false;

      if (!/^[A-Za-z\s]+$/.test(customerAadharName))
        return showError("Name must contain only letters."), false;

      payload = {
        customerAadharGender,
        customerAadharno,
        customerAadharName,
        customerAadharDob,
      };

      res = await CallApi(constant.API.HEALTH.AADHARVERIFY, "POST", payload);
      if (res?.status) {
        showSuccess("Aadhar verified");
        setKycVerified(true);
        return true;
      }

      showError(
        res?.responseData?.message ||
          res?.message ||
          "Aadhar verification failed"
      );
    }

    // Others Verification
     else if (kycType === "Others") {
    console.log("Ram");

    const { identity, address } = proofs;

    const identityFile = document.getElementById(`identity-${identity}`)?.files?.[0];
    const addressFile = document.getElementById(`address-${address}`)?.files?.[0];

    console.log(identityFile, addressFile, identity, address);

    if (!identity || !address) {
      showError("Select both proof types.");
      return false;
    }

    if (!identityFile || !addressFile) {
      showError("Upload both documents.");
      return false;
    }

    const formData = new FormData();


    formData.append("identityfront", identityFile);
    formData.append("addressfront", addressFile);

    // // (Optional) Also append type if needed
    // formData.append("identityType", identity);
    // formData.append("addressType", address);

    console.log(formData);

    try {
      const res = await UploadDocument(constant.API.HEALTH.UPLOADDOCUMENT, "POST", formData);
      console.log(res);

      if (res?.status) {
        showSuccess("Documents verified");
        setKycVerified(true); 
        setIsPanVerified?.(true);
        return true;
      }

      showError(res?.message || "Document verification failed");
    } catch (err) {
      console.error("Upload error:", err);
      showError("Something went wrong during upload");
    }
  }

    setKycVerified(false);
    return false;
  } catch (error) {
    console.error(`${kycType} verification error:`, error);
    showError(`Server error during ${kycType} verification`);
    setKycVerified(false);
    return false;
  }
}
