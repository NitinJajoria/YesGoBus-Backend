import couponModel from "../modals/coupon.modal.js";
import bookingModel from "../modals/booking.modal.js";

export const add_coupon = async (req, res) => {
  try {
    //   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //   let couponCode = "";
    //   for (let i = 0; i < 6; i++) {
    //     const randomIndex = Math.floor(Math.random() * characters.length);
    //     couponCode += characters.charAt(randomIndex);
    //   }
    const couponData = await couponModel.create({
      couponFor: req.body.couponFor,
      title: req.body.title,
      couponDetail: req.body.couponDetail,
      couponCode: req.body.couponCode,
      discountValue: req.body.discountValue,
    });
    return res.status(201).send({
      status: true,
      data: { couponData },
      message: "Coupon code created successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const apply_coupon_discount = async (req, res) => {
  try {
    const { bookingId, coupon } = req.body;

    const couponData = await couponModel.findOne({ couponCode: coupon });
    const bookingData = await bookingModel.findOne({ _id: bookingId });
    if (!bookingData) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "Invalid Booking id" });
    }
    const discount = bookingData.totalBasicCost - couponData.discountValue;

    const booking = await bookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        couponDiscount: couponData.discountValue,
        feesTexes: discount,
        totalPackagePrice: discount,
      },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      data: { bookingData: booking },
      message: "Discount added",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const get_coupon_code = async (req, res) => {
  try {
    const couponData = await couponModel.find(
      { couponFor: req.params.couponFor },
      { title: 1, couponDetail: 1, couponCode: 1, discountValue: 1,image:1,validTill:1 }
    );
    return res.status(200).send({
      status: true,
      data: { couponData },
      message: "coupon data fetched successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
