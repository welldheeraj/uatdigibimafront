import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "./component/layout";
import constant from "@/env";
import { CallApi } from "@/api";
import { showSuccess } from "@/layouts/toaster";


export function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium text-blue-800">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="border border-gray-400 rounded px-3 py-2"
      />
    </div>
  );
}

// pages/profile.js

const Profile = ({ usersData }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    let response = await CallApi(constant.API.USER.PROFILEUPDATE, "POST", data);
    showSuccess(response.message);
  };

  useEffect(() => {
    reset({
      name: usersData?.name || "",
      email: usersData?.email || "",
      gender: usersData?.gender || "",
      mobile: usersData?.mobile || "",
      city: usersData?.city || "",
      incom: usersData?.income || "",
      marital_status: usersData?.martial_status || "",
      dob: usersData?.email || "",
    });
    //console.log("udata", usersData);
  }, [usersData]);

  return (
    <Layout >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto space-y-4 bg-[#f4f4fa] "
      >

        <div className="flex items-center justify-center ">
       <div className="bg-white p-4 mt-4 w-[85%] rounded-xl shadow-md">
 {/* Profile Card */}
        <div className="flex items-center gap-3 p-4 bg-[#f8f9fd] rounded-xl shadow-sm w-fit mt-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <img src="" alt="icon" className="w-6 h-6" />
          </div>
          <span className="text-gray-800 font-semibold text-md">
            Personal details
          </span>
        </div>

        {/* Gender Selector */}
        <div className="flex gap-6 rounded-md mt-4">
          <label className="cursor-pointer">
            <input
              type="radio"
              value="male"
              {...register("gender")}
              name="gender"
              className="hidden peer"
            />
            <div className="flex items-center gap-2 px-4 py-1 rounded bg-white text-gray-500 border border-gray-400 peer-checked:bg-gradient-to-b peer-checked:from-[#426D98] peer-checked:to-[#28A7E4] peer-checked:text-white transition-colors duration-200">
              Male
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              value="female"
              {...register("gender")}
              name="gender"
              className="hidden peer"
            />
            <div className="flex items-center gap-2 px-4 py-1 rounded bg-white text-gray-500 border border-gray-400 peer-checked:bg-gradient-to-b peer-checked:from-[#426D98] peer-checked:to-[#28A7E4] peer-checked:text-white transition-colors duration-200">
              Female
            </div>
          </label>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter Full Name"
            register={register}
           
          />
          <Input
            label="Mobile Number"
            name="mobile"
            placeholder="Enter Mobile Number"
            register={register}
          />
          <Input
            label="Email ID"
            name="email"
            placeholder="Enter Email ID"
            register={register}
          />
          <Input
            label="Date of Birth"
            name="dob"
            placeholder="Enter Date of Birth"
            register={register}
          />
          <Input
            label="Annual Income"
            name="incom"
            placeholder=""
            register={register}
          />
          <Input
            label="Marital Status"
            name="marital_status"
            placeholder=""
            register={register}
          />
          <Input label="City" name="city" placeholder="" register={register} />
        </div>

        <div className="flex items-center justify-center mt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
       </div>
</div>
      </form>
    </Layout>
  );
};

export default Profile;
