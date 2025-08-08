import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { CallApi } from "@/api";
import constant from "@/env";
import { showSuccess, showError } from "@/layouts/toaster";
const VendorEditForm = forwardRef(({ selectedVendor, closeModal, refreshData }, ref) => {
  const [formValues, setFormValues] = useState({ id: "", vendorname: "" });
  console.log("selectedVendor", selectedVendor);
  useEffect(() => {
    if (selectedVendor && (selectedVendor.vendorName || selectedVendor.name)) {
      setFormValues({
        id: selectedVendor.id?.toString() || "0",
        vendorname: selectedVendor.vendorName || selectedVendor.name || "",
      });
    }
  }, [selectedVendor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        // id: formValues.id || "0",
        vendorname: formValues.vendorname, 
        prevendor: selectedVendor?.vendorName || selectedVendor?.name || "",
      };
      console.log(payload);
      // return false;
      const res = await CallApi(constant.API.ADMIN.EDITVENDOR, "POST", payload);

      if (res?.status) {
        showSuccess("Vendor updated successfully");
        if (refreshData) refreshData();
        closeModal();
      } else {
        showError("Failed to update vendor");
      }
    } catch (error) {
      console.error("Update failed", error);
      showError("Error while saving");
    }
  };
   useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="vendorname"
        value={formValues.vendorname}
        onChange={handleInputChange}
        placeholder="Vendor Name"
        className="inputcls"
      />

      {/* Add more fields here as needed */}

      {/* <div className="flex justify-start gap-3">
        <button onClick={closeModal} className="px-4 py-2 thmbtn">
          Cancel
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 thmbtn">
          Save
        </button>
      </div> */}
    </div>
  );
});

export default VendorEditForm;
