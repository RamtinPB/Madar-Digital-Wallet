id like you to help me plan the UI for @/front/pages/business.tsx and write the markdown plan in @/front/plans
initially the code should check if the user is indeed of type BUSINESS (usertype=BUSINESS)if not redirect to "/".
in this page the user will create services
i simply want a cards that allows the user to simulate a purchase.
you can fill it with placeholder data to make it seem like a real product/service.
once the purchase button is clicked a purchase modal should appear (modals go here @/front/src/modals and components go here @/front/src/components/business ).
the purchase model should display a summary of what the user is purchasing, along with the relevant financial data (cost and what not). and then below it should be a form to input the users phonenumber, then under that an input to enter a verification OTP with a fetch OTP button next to it (the OTP input and fetch buttons should be in the same row as each other), and lastly at the bottom a button to confirm the purchase transaction.

now regarding where the purchase cards come from. since this is for simulation and not real, you need to check for any users with usertype=BUSINESS and then create a card for each of them (make sure if the user them selves is a BUSINESS type and dont show them their own purchase card).
regarding the purchase transaction, the payer will be the current user obviously, and the reciever will be the specific user with the usertype=BUSINESS that the card was based on
