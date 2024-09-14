import schedule from 'node-schedule';
import { sendMessage } from './helper.js';
import BusBooking from "../modals/busBooking.modal.js";
import { checkPaymentStatus, refundPayment } from '../service/payment.service.js';

const sendReminderMessages = async () => {
  try {
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    const allBookings = await BusBooking.find({
      sentBookingRemainer: "false",
      bookingStatus: "paid",
    });
    const templateId = process.env.BOOKING_REMAINDER_TEMPLATE_ID;
    for (const booking of allBookings) {
      const combinedTime = new Date(booking.doj);
      const timeComponents = booking.pickUpTime.split(' ');
      let [hours, minutes] = timeComponents[0].split(':');
      const isPM = timeComponents[1] === 'PM';
      if (isPM && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      }
      combinedTime.setHours(hours, minutes);
      const reminderTime = new Date(combinedTime.getTime() - 60 * 60 * 1000);
      if (reminderTime <= oneHourFromNow) {
        const opPNR = booking.opPNR;
        const doj = combinedTime.toISOString().split('T')[0];
        const contactNumbers = booking.driverNumber.split(' ');
        const selectedContacts = contactNumbers.slice(0, 2).join(' ');

        const message = `Dear ${booking.customerName} Your PNR: ${opPNR} Date: ${doj} Journey: ${booking.sourceCity} to ${booking.destinationCity} Seat: ${booking.selectedSeats} Pickup: ${booking.boardingPoint} ${booking.pickUpTime} Drop: ${booking.droppingPoint} ${booking.reachTime} Operator: ${selectedContacts} Happy comfortable and safe journey. Thank You, Shine Gobus`;
        await sendMessage(message, booking.customerPhone, templateId);
        await BusBooking.findByIdAndUpdate(booking._id, {
          sentBookingRemainer: "true",
        });
        console.log(`Reminder messages sent successfully to . ${booking.customerName}`);
      }
    }
  } catch (error) {
    console.error('Error sending reminder messages:', error);
  }
}

const checkPaymentAndRefund = async () => {
  try {
    const bookings = await BusBooking.find({
      bookingStatus: 'pending',
    });
    for (const booking of bookings) {
      const requestData = {
        merchantTransactionId: booking.merchantTransactionId,
      }
      const paymentStatus = await checkPaymentStatus(requestData);
      if (paymentStatus.success) {
        await BusBooking.findByIdAndUpdate(booking._id, {
          bookingStatus: 'failed',
        });
        const refundData = {
          amount: booking.totalAmount,
          merchantTransactionId: booking.merchantTransactionId,
        }
        await refundPayment(refundData);
        console.log("Refunded");
      }
    }
  } catch (error) {
    console.error('Error checking payment status and refunding:', error);
  }
}

const sendMessageAfterJourney = async () => {
  try {
    const feedbackFormUrl = "https://forms.gle/jVtxJei9GA6Gk6Ds5";
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    const allBookings = await BusBooking.find({
      getJourneyFeedback: "false",
      bookingStatus: "paid",
    });
    const templateId = process.env.JOURNEY_FEEDBACK_TEMPLATE_ID;
    for (const booking of allBookings) {
      const combinedTime = new Date(booking.doj);
      const timeComponents = booking.reachTime.split(' ');
      let [hours, minutes] = timeComponents[0].split(':');
      const isPM = timeComponents[1] === 'PM';
      if (isPM && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      }
      combinedTime.setHours(hours, minutes);
      // const reminderTime = new Date(combinedTime.getTime() - 60 * 60 * 1000);
      if (oneHourFromNow > combinedTime) {
        const message = `Thank you for choosing YesGoBus We hope you enjoyed safe Journey Please fill the feedback form so that we can serve you better in the future: ${feedbackFormUrl} Thank you once again, Shine GoBus Pvt Ltd`;
        await sendMessage(message, booking.customerPhone, templateId);
        await BusBooking.findByIdAndUpdate(booking._id, {
          getJourneyFeedback: "true",
        });
        console.log(`Feedback sent successfully to ${booking.customerName}`);
      }
    }
  } catch (error) {
    console.error('Error sending feedback messages:', error);
  }
}

const sendReminderJob = schedule.scheduleJob('*/10 * * * *', function () {
  sendReminderMessages();
});

const checkPaymentJob = schedule.scheduleJob('*/10 * * * *', function () {
  checkPaymentAndRefund();
});

// const sendMessageAfterJourneyJob = schedule.scheduleJob('0 12 * * *', function () {
//   sendMessageAfterJourney();
// });

const sendMessageAfterJourneyJob = schedule.scheduleJob('* * * * *', function () {
  sendMessageAfterJourney();
});


export { sendReminderJob, checkPaymentJob, sendMessageAfterJourneyJob };