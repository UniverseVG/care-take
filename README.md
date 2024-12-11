
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

### 👥 Patient Features

- **Registration & Profile Management**
  - Simple sign-up process for patients.
  - Manage personal details such as name, contact info, and health history.

- **Login System**
  - Secure login for patients to access their dashboard.

- **Patient Dashboard**
  - View a list of upcoming and past appointments.
  - Options to schedule appointments, edit profiles, and log out.

- **Appointment Booking**
  - Browse available time slots.
  - Book appointments with preferred doctors.

- **Appointment Management**
  - View, reschedule, or cancel appointments via an easy-to-use interface.

- **SMS Notifications**
  - Receive automated SMS reminders and updates for upcoming appointments.

### 🛠️ Admin Features

- **Login System**
  - Secure login for administrative access.

- **Admin Dashboard**
  - **Real-Time Updates**: Instant updates on patient appointments (new bookings, reschedules, cancellations).

- **Manage Doctors**
  - **List Doctors**: View all registered doctors.
  - **Add Doctor**: Only admins can add new doctors.
  - **Edit Doctor**: Modify doctor information.
  - **Doctor Appointments**: View and manage appointments specific to each doctor.

- **Manage Patients**
  - **List Patients**: View all registered patients.
  - **Patient Appointments**: View and manage appointments associated with each patient.

- **Appointment Management**
  - Confirm, approve, or decline appointments.
  - Cancel or reschedule appointments with SMS notifications sent to patients.
  - Manage appointment scheduling and editing for both patients and doctors.

- **Filter & Sort**
  - Filter and sort lists of doctors, patients, and appointments.

## ⚡ Real-Time Updates

- **Real-Time Admin Dashboard**: Receive live updates when:
  - A patient books, cancels, or reschedules an appointment.
  - Another admin modifies an appointment.



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



