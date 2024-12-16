export interface Hospital {
  _id: string;
  name: string;
  address: string;
  phone: string;
  beds: number;
  availableBeds: number;
  emergency: boolean;
  openNow: boolean;
  rating: number;
  specialties: string[];
  waitTime: string;
  distance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormData {
  name: string;
  address: string;
  phone: string;
  beds: string;
  availableBeds: string;
  emergency: boolean;
  openNow: boolean;
  rating: string;
  specialties: string[];
  waitTime: string;
  distance: string;
}

export interface HospitalInput {
  name: string;
  address: string;
  phone: string;
  beds: number;
  availableBeds: number;
  emergency: boolean;
  openNow: boolean;
  rating: number;
  specialties: string[];
  waitTime: string;
  distance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type HospitalApiResponse = ApiResponse<Hospital>;
export type HospitalsApiResponse = ApiResponse<Hospital[]>;
