
# Introduction

A healthcare patient management app built with Next.js that enables patients to register, book, and manage appointments with doctors, featuring admin tools for scheduling, confirming, and canceling appointments, plus SMS notifications.




## Demo
https://care-take.vercel.app/


## Tech Stack

- Next.js
- Appwrite
- Typescript
- TailwindCSS
- ShadCN
- Twilio


## Features

 Patient Features:

- Registration & Profile Management: Simple sign-up process allowing patients to manage their personal details.
- Appointment Booking: Patients can browse available time slots and book appointments with their preferred doctors.
- Appointment Management: Easy-to-use interface to view, reschedule, or cancel appointments.
- SMS Notifications: Automated SMS reminders and updates for upcoming appointments.

Admin & Doctor Features:

- Scheduling Tools: Administrative staff and doctors can view, update, or block time slots to manage their availability.
- Appointment Confirmation: Tools for confirming, approving, or declining patient appointments.
- Appointment Cancellation: Admins can cancel or reschedule appointments, notifying patients via SMS.


## Installation


**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
  git clone https://github.com/UniverseVG/care-take.git
  cd care-take
```

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
#APPWRITE
NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1
PROJECT_ID=
API_KEY=
DATABASE_ID=
PATIENT_COLLECTION_ID=
APPOINTMENT_COLLECTION_ID=
NEXT_PUBLIC_BUCKET_ID=

NEXT_PUBLIC_ADMIN_PASSKEY=111111
```

Replace the placeholder values with your actual Appwrite credentials. You can obtain these credentials by signing up on the [Appwrite website](https://appwrite.io/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.
## Deployment

This project is deployed on vercel


## Contributing

Contributions are always welcome!



