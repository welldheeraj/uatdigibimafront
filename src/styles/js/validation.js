"use client";
import { showSuccess, showError } from "../../styles/js/toaster";
export const isNumber = (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
};
export const isAlpha = (e, setValue, fieldName, allowSpace = true) => {
  const cleaned = e.target.value.replace(
    allowSpace ? /[^A-Za-z\s]/g : /[^A-Za-z]/g,
    ""
  );
  setValue(fieldName, cleaned);
}


export const validateFields = async (form, excluded = [], only = null) => {
  const allKeys = only || Object.keys(form.getValues());

  for (const key of allKeys) {
    if (excluded.includes(key)) continue;

    const el = document.querySelector(`[name="${key}"]`);

    if (!el || el.offsetParent === null) continue;

    const value = form.getValues(key);

    // Check if the field is empty
    if (!value || (typeof value === "string" && !value.trim())) {
      showError(`${key.replace(/([A-Z])/g, " $1")} is required`);
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add red border to the field with the error
      el.style.border = "2px solid red";

      // Focus on the field with the error
      // el.focus();
      return false;
    }

    const isValid = await form.trigger(key);

    if (!isValid) {
      showError(`Invalid ${key.replace(/([A-Z])/g, " $1")}`);
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add red border to the invalid field
      el.style.border = "2px solid red";

      // Focus on the invalid field
      // el.focus();
      return false;
    }

    // Remove the red border if the field is valid
    el.style.border = ""; // Reset the border when valid
  }

  return true;
};

