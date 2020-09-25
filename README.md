# Carsome Inspection Service

This is a full stack web application created with express & vue to provide inspection appointment service for Carsome customers. 

## Demo
[Carsome Inspection Service](https://carsome-inspection-service.herokuapp.com/) (hosted by Heroku)

## Installation

```bash
# in root directory
npm run dev # start nodemon

# navigate to client directory
cd client
npm run serve # fire up vue client server
```

## Assumptions
- One customer can make multiple appointments.
- Customer is unable to make any appointment after office hour (9-6pm).
- Customer is unable to make any appointment before current hour.
- A confirmation email will be sent to the customer after appointment is scheduled and confirmed. 
- Code to send a confirmation email is not within the scope of this project.
- Customer cannot make any booking without filing in every fields the appointment form.
- User authentication is not needed to create/update/delete inspection appointment.

## Features
- All fields are validated.
- Appointment availability is updated real-time based on branch, date, and time selected. 
- Once appointment is scheduled and confirmed, the customer can download the ics file to add into the calendar of choice. 
- Rescheduling/Cancellation of inspection appointment is allowed.

## Tech Stacks
- Backend: Node.js with Express
- Frontend: Vue
- Database: MongoDB (Mongo Atlas Cloud DB)
- Deployment: Heroku

