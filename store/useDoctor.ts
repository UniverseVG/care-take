import { Doctor } from "@/types/appwrite.types";
import { create } from "zustand";

interface Appointment {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
}
interface DoctorStore {
  doctors: Doctor[];
  appointments: Appointment;
  setDoctorsStore: (doctors: Doctor[]) => void;
  setAppointmentsStore: (appointments: Appointment) => void;
  addDoctorToStore: (doctor: Doctor) => void;
  updateDoctorInStore: (updatedDoctor: Doctor) => void;
  deleteDoctorInStore: (doctorId: string) => void;
}

const useDoctorStore = create<DoctorStore>((set) => ({
  doctors: [],
  appointments: {
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
  },

  setDoctorsStore: (doctors: Doctor[]) => {
    set({ doctors });
  },

  setAppointmentsStore: (appointments: Appointment) => {
    set({ appointments });
  },

  addDoctorToStore: (doctor: Doctor) => {
    set((state) => ({
      doctors: [...state.doctors, doctor],
    }));
  },

  updateDoctorInStore: (updatedDoctor: Doctor) => {
    set((state) => ({
      doctors: state.doctors.map((doctor) =>
        doctor.$id === updatedDoctor.$id ? updatedDoctor : doctor
      ),
    }));
  },
  deleteDoctorInStore: (doctorId: string) => {
    set((state) => ({
      doctors: state.doctors.filter((doctor) => doctor.$id !== doctorId),
    }));
  },
}));

export default useDoctorStore;
