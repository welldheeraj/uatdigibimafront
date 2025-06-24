import React, { useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "./component/layout";
import constant from "@/env";
import { CallApi } from "@/api";
export function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="border border-black rounded px-3 py-2"
      />
    </div>
  );
}

// pages/profile.js

const Profile = ({ usersData }) => {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data) => {
    //console.log("Form Data:", data,constant.API.USER.PROFILEUPDATE);
    let response = await CallApi(
      constant.API.USER.PROFILEUPDATE,
      "POST",
      data
    );
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
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)} className="m-auto space-y-4">
        <p className="w-fit border-b text-lg font-semibold">Personal Details</p>

        <div className="flex gap-6 border border-red-600 rounded-md p-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="male"
              {...register("gender")}
              className="accent-red-600"
            />{" "}
            Male
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="female"
              {...register("gender")}
              className="accent-red-600"
            />{" "}
            Female
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default Profile;
