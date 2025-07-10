import { showSuccess, showError }  from "@/layouts/toaster";

export const calculateAgeFromDOB = (dobString) => {
  const [dd, mm, yyyy] = dobString.split("-");
  const dob = new Date(`${yyyy}-${mm}-${dd}`);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const validateStepTwoData = (values, steponedata) => {
  const selfMember = steponedata?.members?.find((m) => m.name?.toLowerCase() === "self");
  const selfDob = values.proposerdob2;

  if (!selfDob) {
    showError("Please enter Self's DOB");
    markInvalid("proposerdob2");
    return false;
  }

  if (selfMember?.age) {
    const actual = calculateAgeFromDOB(selfDob);
    const expected = parseInt(selfMember.age);
    if (actual !== expected) {
      // showError(`Self DOB mismatch: ${actual} vs ${expected}`);
      showError(` Invalid Age for Self. Expected ${expected} year.`);
      markInvalid("proposerdob2");
      return false;
    }
  }
  // Invalid Age for ${memberId}. Expected ${calculatedDobYear} year.

  if (values.nomineedob && steponedata?.nominee?.age) {
    const actual = calculateAgeFromDOB(values.nomineedob);
    const expected = parseInt(steponedata.nominee.age);
    if (actual !== expected) {
      // showError(`Nominee DOB mismatch: ${actual} vs ${expected}`);
      showError(` Invalid Age for Nominee. Expected ${expected} year.`);
      markInvalid("nomineedob");
      return false;
    }
  }

  let childIndex = 1;
  for (const member of steponedata?.members || []) {
    const name = member.name?.toLowerCase();
    if (name === "self") continue;

    let key = "";
    if (name === "wife" || name === "husband") key = "spousedob";
    else if (name === "father") key = "fatherdob";
    else if (name === "mother") key = "motherdob";
    else if (name === "son" || name === "daughter") key = `childdob${childIndex++}`;
    else continue;

    const dob = values[key];
    if (!dob) {
      showError(`Please enter DOB for ${member.name}`);
      markInvalid(key);
      return false;
    }

    const actual = calculateAgeFromDOB(dob);
    const expected = parseInt(member.age);
    if (actual !== expected) {
      // showError(`${member.name} DOB mismatch: ${actual} vs ${expected}`);
      showError(` Invalid Age for ${member.name}. Expected ${expected} year.`);
      markInvalid(key);
      return false;
    }
  }

  return true;
};

const markInvalid = (fieldName) => {
  const el = document.querySelector(`[name="${fieldName}"]`);
  if (el) {
    el.classList.add("border-red-500");
    el.focus();
    setTimeout(() => el.classList.remove("border-red-500"), 2500);
  }
};
