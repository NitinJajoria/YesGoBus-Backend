import destinationModel from "../modals/destination.modal.js";
import packageModel from "../modals/packages.modal.js";
import wishlistModel from "../modals/wishlist.modal.js";

export const add_destination = async (req, res) => {
  try {
    const response = await destinationModel.create({
      destination: req.body.destination,
      image: req.body.image,
      rating: req.body.rating,
      duration: req.body.duration,
      startingPrice: req.body.startingPrice,
    });
    return res.status(201).send({
      status: true,
      data: { response },
      message: "destination created successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const add_packages = async (req, res) => {
  try {
    const { name, price, duration, destinationID, totalDuration, image } =
      req.body;

    const destinationData = await destinationModel.findOne({
      _id: destinationID,
    });
    const packageData = await packageModel.create({
      name,
      image,
      duration,
      witheFlitePrice: price,
      withoutFlitePrice: price * 0.8,
      destination: destinationData.destination,
      destinationID,
      totalDuration,
    });
    return res.status(201).send({
      status: true,
      data: { packageData },
      message: "destination created successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
export const get_packages = async (req, res) => {
  try {
    const destination = await destinationModel.find(
      {},
      {
        _id: 1,
        destination: 1,
        duration: 1,
        startingPrice: 1,
        image: 1,
        rating: 1,
      }
    );
    return res.status(201).send({
      status: true,
      data: { destination: destination },
      message: "destination fetch successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const popular_destinations = async (req, res) => {
  try {
    const packages = await packageModel.find({
      destination: req.body.destination.toUpperCase(),
    });
    const wishlist = await wishlistModel.find({ userId: req.user });
    const updatedData = packages.map((item) => {
      const { _doc } = item; // Destructure _doc
      const isWishlisted = wishlist.some((wish) => {
        if (wish?.packageId?.toString() === _doc?._id?.toString()) {
          return true;
        } else false;
      });
      return { ..._doc, isWishlisted }; // Combine _doc with other properties and add isWishlisted
    });
    return res.status(200).send({
      status: true,
      data: { packages: updatedData },
      message: "packages fetch successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const add_to_wishlist = async (req, res) => {
  try {
    const wishlistData = await wishlistModel.findOne({
      packageId: req.body.packageId,
      userId: req.user,
    });
    if (!wishlistData) {
      const wishlist = await wishlistModel.create({
        userId: req.user,
        packageId: req.body.packageId,
        isWishlisted: req.body.isWishlisted,
      });
      return res.status(200).send({
        status: true,
        data: { wishlist },
        message: "Package added to wishlist successfully",
      });
    } else {
      const wishlist = await wishlistModel.findOneAndUpdate(
        { packageId: req.body.packageId, userId: req.user },
        { isWishlisted: req.body.isWishlisted },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        data: { wishlist },
        message: "Package added to wishlist successfully",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

export const get_user_wishlist = async (req, res) => {
  try {
    const wishlist = await wishlistModel
      .find({ userId: req.user, isWishlisted: true })
      .populate({
        path: "packageId",
      });
      const modifiedData = wishlist.map((item) => {
        if (item.packageId) {
          return {
            _id: item.packageId._id,
            name: item.packageId.name,
            destinationID: item.packageId.destinationID,
            destination: item.packageId.destination,
            image: item.packageId.image,
            duration: item.packageId.duration,
            witheFlitePrice: item.packageId.witheFlitePrice,
            withoutFlitePrice: item.packageId.withoutFlitePrice,
            totalDuration: item.packageId.totalDuration,
            hotelId: item.packageId.hotelId ? item.packageId.hotelId : "",
            isWishlisted: item.isWishlisted,
            userId: item.userId,
          };
        } else {
          // Handle case when packageId is missing
          return {
            _id: "",
            name: "",
            destinationID: "",
            destination: "",
            image: "",
            duration: "",
            witheFlitePrice: 0,
            withoutFlitePrice: 0,
            totalDuration: "",
            hotelId: "",
            isWishlisted: item.isWishlisted,
            userId: item.userId,
          };
        }
      });
      
    return res.status(200).send({
      status: true,
      data: { packages: modifiedData },
      message: "wishlist data fetch successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
