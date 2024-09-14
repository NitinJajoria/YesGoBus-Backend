import axios from "axios";
import Cabdriver from "../modals/cabdriver.modal.js";
import JWT from "jsonwebtoken";
import { uploadToS3 } from "../aws/aws.js";

function normalizeName(name) {
  console.log(name.toLowerCase().replace(/[^a-z\s]/g, '').trim())
  return name?.toLowerCase().replace(/[^a-z\s]/g, '').trim();
}

function matchNames(name1, name2) {
console.log(normalizeName(name1))
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  return normalized1.includes(normalized2) || normalized2.includes(normalized1);
}
export const user_signup = async (req, res) => {
  try {
    const { firstName, email, lastName, mobileNumber } = await req.body;
    const reqUser = await Cabdriver.findOne({
      mobileNumber: mobileNumber,
    });
    if (
      email !== "" &&
      !/\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/.test(email.trim())
    ) {
      console.log(/\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/.test(email));
      return res
        .status(200)
        .send({ status: false, data: {}, message: "Invalid email id" });
    }
    if (reqUser) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "User already exists" });
    }
    const user = await Cabdriver.create({
      firstName,
      lastName,
      email,
      mobileNumber,
    });
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/send",
      {
        phoneNumber: mobileNumber,
        otpLength: 6,
        channel: "SMS",
        expiry: 600,
      },
      {
        headers: {
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).send({
      status: true,
      data: response.data,
      message: "Signup Successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
export const resend_otp = async (req, res) => {
  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/resend",
      {
        orderId: req.body.orderId,
      },
      {
        headers: {
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).send({
      status: true,
      data: response.data,
      message: "OTP send Successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
export const verify_otp = async (req, res) => {
  try {
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/verify",
      {
        orderId: req.body.orderId,
        otp: req.body.otp,
        phoneNumber: req.body.mobileNumber,
      },
      {
        headers: {
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.isOTPVerified) {
      const user = await Cabdriver.findOne({
        mobileNumber: req.body.mobileNumber,
      });
      if (user) {
        const payload = {
          userId: user._id,
          mobileNumber: req.body.mobileNumber,
        };

        const generatedToken = JWT.sign(payload, process.env.JWT_KEY);
        return res.status(200).send({
          status: true,
          data: { token: generatedToken, user: user },
          message: "OTP verified",
        });
      }
    }
    return res.status(200).send({
      status: false,
      data: response.data,
      message: response.data.reason,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
export const user_login = async (req, res) => {
  try {
    const user = await Cabdriver.findOne({
      mobileNumber: req.body.mobileNumber,
    });

    if (!user) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "user dose not exist" });
    }
    const response = await axios.post(
      "https://auth.otpless.app/auth/otp/v1/send",
      {
        phoneNumber: req.body.mobileNumber,
        otpLength: 6,
        channel: "SMS",
        expiry: 600,
      },
      {
        headers: {
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).send({
      status: true,
      data: response.data,
      message: "Signup Successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const send_otp_to_aadhaar = async (req, res) => {
  try {
    const { aadhaar_number } = req.body;
    if (aadhaar_number.length !== 12) {
      return res
        .status(200)
        .status({ status: false, data: {}, message: "Invalid aadhaar number" });
    }
    const response = await axios.post(
      "https://api.idcentral.io/idc/v2/aadhaar/okyc/generate-otp",
      { aadhaar_number: Number(aadhaar_number) },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY, // Replace 'YOUR_API_KEY' with your actual API key
        },
      }
    );
    const data = response.data;
    res.status(200).send({
      status: response.data?.data?.valid_aadhaar ? true : false,
      data,
      message: response?.data?.data?.valid_aadhaar
        ? "OTP send successfully"
        : "Invalid aadhaar number",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const verify_aadhaar = async (req, res) => {
  try {
    const user = await Cabdriver.findOne({ _id: req.user });
    const { otp } = req.body;
    const { client_id } = req.body;
    const response = await axios.post(
      "https://api.idcentral.io/idc/v2/aadhaar/okyc/submit-otp",
      { otp: Number(otp), client_id }, // Include client_id in the request body
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY, // Replace 'YOUR_API_KEY' with your actual API key
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data?.data !== null && response?.data?.status === "success") {
      if (user.fullName !== response.data.data.full_name) {
        return res.status(401).send({
          status: false,
          data: {},
          message: "User name did not match withe addhaar name",
        });
      }
      await Cabdriver.findOneAndUpdate(
        { _id: req.user },
        { aadhaar_number: Number(req.body.aadhaar_number) }
      );
      res
        .status(200)
        .json({ status: true, data: {}, message: "Verification successful" });
    } else {
      res
        .status(400)
        .json({ status: false, data: {}, message: response.data.message });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "Invalid OTP",
    });
  }
};

export const validate_pan = async (req, res) => {
  try {
    const user = await Cabdriver.findOne({ _id: req.user });
    if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(req.body.pan_number)) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "Invalid PAN Number" });
    }
    const { pan_number, dob, full_name } = req.body;
    const response = await axios.post(
      "https://api.idcentral.io/idc/v2/pan/pan-verify",
      {
        id_number: pan_number,
        dob,
        full_name,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.error === null) {
      if (user.fullName !== response.data.data.full_name.toLowercase()) {
        return res.status(401).send({
          status: false,
          data: {},
          message: "User name did not match withe PAN Card name",
        });
      }
      await Cabdriver.findOneAndUpdate(
        { _id: req.user },
        { pane_card_number: req.body.pan_number }
      );
      return res.status(200).send({
        status: true,
        data: response.data,
        message:
          response.data.error !== null
            ? response.data.error
            : "Pan Card validation successful",
      });
    } else {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "Invalid PAN Detail" });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const validate_driving_license = async (req, res) => {
  try {
    const user = await Cabdriver.findOne({ _id: req.user });
    const { license_number, dob } = req.body;
    const response = await axios.post(
      "https://api.idcentral.io/idc/driving-license",
      {
        id_number: license_number,
        dob,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const isMatch = matchNames(response.data.data.name, user?.fullName);
    console.log(isMatch);
    if (response.data.response_code === 1) {
      if (!isMatch) {
        return res.status(401).send({
          status: false,
          data: {},
          message: "User name did not match withe Driving license",
        });
      }
      const data = await Cabdriver.findOneAndUpdate(
        { _id: req.user },
        { driving_license: req.body.license_Number }
      );
      return res.status(200).send({
        status: response.data.response_code === 1 ? true : false,
        data: response.data,
        message: response.data.message,
      });
    } else {
      return res
        .status(200)
        .send({ status: false, data: {}, message: response.data.message });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
export const validate_rc = async (req, res) => {
  try {
    const user = await Cabdriver.findOne({ _id: req.user });
    const response = await axios.post(
      "https://api.idcentral.io/idc/v2/rc/verify",
      {
        rc_number: req.body.rc_number,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(user);
    if (response.data.response_code === 1) {
      if (user.fullName !== response.data.data.full_name) {
        return res.status(401).send({
          status: false,
          data: {},
          message: "User name did not match withe rc detail",
        });
      }
      await Cabdriver.findOneAndUpdate(
        { _id: req.user },
        { rc_number: req.body.rc_number }
      );
      return res.status(200).send({
        status: response.data.response_code === 1 ? true : false,
        data: response.data,
        message: response.data.message,
      });
    } else {
      return res
        .status(200)
        .send({ status: false, data: {}, message: response.data.message });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
export const add_bank_detail = async (req, res) => {
  try {
    const user = await Cabdriver.findOne({ _id: req.user });
    console.log(user);
    if (!/^\d{9,18}$/.test(req.body.account_number)) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "Invalid account number" });
    }
    if (!/^[A-Za-z]{4}\d{7}$/) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "Invalid IFSC number" });
    }
    const response = await axios.post(
      "https://api.idcentral.io/idc/v2/bank/verify-bank",
      {
        account_number: req.body.account_number,
        ifsc: req.body.ifsc_code,
        extended_data: true,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    if (response.data.response_code === 1) {
      // if (user.fullName !== response.data.data.full_name) {
      //   return res.status(401).send({
      //     status: false,
      //     data: {},
      //     message: "User name did not match withe Bank Account holder name",
      //   });
      // }
      const data = await Cabdriver.findOneAndUpdate(
        { _id: req.user },
        {
          bank_account_detail: {
            account_type: req.body.account_type,
            account_holder_name: req.body.account_holder_name,
            account_number: req.body.account_number,
            ifsc_code: req.body.ifsc_code,
          },
        }
      );
      return res.status(200).send({
        status: true,
        data,
        message: "Bank detail updated successfully",
      });
    } else {
      return res
        .status(200)
        .send({ status: false, data: {}, message: response.data.message });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const update_user_detail = async (req, res) => {
  try {
    if (req.body.fullName && req.body.email && req.body.mobileNumber) {
      const data = await Cabdriver.findOneAndUpdate(
        { _id: req.user },
        {
          fullName: req.body.fullName,
          email: req.body.email,
          mobileNumber: req.body.mobileNumber,
        }
      );
      return res.status(200).send({
        status: true,
        data,
        message: "User detail updated successfully",
      });
    }
    if (
      !req.body.dl_img ||
      req.body.dl_img === "" ||
      !req.body.vehicle_reg_img ||
      req.body.vehicle_reg_img === "" ||
      !req.body.vehicle_image ||
      req.body.vehicle_image === "" ||
      !req.body.profile_img ||
      req.body.profile_img === "" ||
      !req.body.aadhaar_img ||
      req.body.aadhaar_img === ""
    ) {
      return res.status(400).send({
        status: false,
        data: {},
        message: "All document required",
      });
    }
    if (
      req.body.total_experience &&
      req.body.vehicle_model &&
      req.body.vehicle_category &&
      req.body.vehicle_number &&
      req.body.year_of_registration &&
      req.body.fullName &&
      req.body.email &&
      req.body.mobileNumber &&
      req.body.alternateNumber &&
      req.body.bloodGroup &&
      req.body.pincode &&
      req.body.address &&
      req.body.dob &&
      req.body.user_type
    ) {
      // const data = await Cabdriver.findOneAndUpdate(
      //   { _id: req.user },
      //   {
      //     dl_img: await uploadToS3(req.body.dl_img),
      //     vehicle_reg_img: await uploadToS3(req.body.vehicle_reg_img),
      //     vehicle_image: await uploadToS3(req.body.vehicle_image),
      //     profile_img: await uploadToS3(req.body.profile_img),
      //     aadhaar_img: await uploadToS3(req.body.aadhaar_img),
      //     total_experience: req.body.total_experience,
      //     vehicle_model: req.body.vehicle_model,
      //     vehicle_category: req.body.vehicle_category,
      //     vehicle_number: req.body.vehicle_number,
      //     year_of_registration: req.body.year_of_registration,
      //     fullName: req.body.fullName,
      //     email: req.body.email,
      //     mobileNumber: req.body.mobileNumber,
      //     alternateNumber: req.body.alternateNumber,
      //     bloodGroup: req.body.bloodGroup,
      //     pincode: req.body.pincode,
      //     address: req.body.address,
      //     dob: req.body.dob,
      //     user_type:req.body.user_type
      //   }
      // );
      return res.status(200).send({
        status: true,
        data: {},
        message: "User detail updated successfully",
      });
    }

    return res
      .status(200)
      .send({ status: true, data: {}, message: "No data updated" });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
