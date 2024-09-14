import offerModel from "../modals/offers.modal.js";

export const add_offer = async (req, res) => {
  try {
    const offer = await offerModel.create({
      destination: req.body.destination,
      destinationId: req.body.destinationId,
      offerFor: req.body.offerFor,
      image: req.body.image,
      validTill: req.body.validTill,
      offer: req.body.offer,
    });
    return res.status(200).send({
      status: true,
      data: { offer },
      message: "Offer added successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const get_offer = async (req, res) => {
  try {
    const offers = await offerModel.find(
      {},
      {
        _id: 1,
        destination: 1,
        destinationId: 1,
        offerFor: 1,
        image: 1,
        validTill: 1,
        offer: 1,
      }
    );
    return res.status(200).send({
        status: true,
        data: { offers },
        message: "Offer added successfully",
      });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
