"use client";
import { showSuccess, showError } from "../../layouts/toaster";
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
export const isAlphaNumeric = (e, setValue, fieldName) => {
  const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  setValue(fieldName,cleaned);
};


export const validateFields = async (form, excluded = [], only = null) => {
  const allKeys = only || Object.keys(form.getValues());

 for (const key of allKeys) {
  const value = form.getValues(key);

  if (!value || value.trim?.() === "") {
   

    const el = document.querySelector(`[name="${key}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" }); 
      el.style.border = "2px solid red";
    }

    showError(`${key.replace(/([A-Z])/g, " $1")} is required`);
    return false;
  }
}


  return true;
};

