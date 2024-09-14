import hotelModel from "../modals/hotels.modal.js";

export const add_hotel = async (req, res) => {
  try {
    const { hotelName, rating, address, fullAddress,image } = req.body;
    const hotelData = await hotelModel.create({
      hotelName,
      rating,
      address,
      fullAddress,
      image
    });
    return res.status(201).send({
      status: true,
      data: { hotelData },
      message: "Hotel added successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
