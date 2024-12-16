import mongoose, { Document, Schema } from 'mongoose';
import { Hospital } from '@/types';

export interface HospitalDocument extends Omit<Hospital, '_id'>, Document {}

const HospitalSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
    index: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  beds: {
    type: Number,
    required: [true, 'Total beds is required'],
    min: [0, 'Total beds cannot be negative'],
    default: 0
  },
  availableBeds: {
    type: Number,
    required: [true, 'Available beds is required'],
    min: [0, 'Available beds cannot be negative'],
    validate: {
      validator: function(v: number) {
        return v <= (this as any).beds;
      },
      message: 'Available beds cannot exceed total beds'
    },
    default: 0
  },
  emergency: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  openNow: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  specialties: [{
    type: String,
    enum: {
      values: ['Cardiology', 'Emergency', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery'],
      message: '{VALUE} is not a valid specialty'
    }
  }],
  waitTime: {
    type: String,
    required: true,
    default: '0 mins'
  },
  distance: {
    type: Number,
    required: true,
    min: [0, 'Distance cannot be negative'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validation middleware
HospitalSchema.pre('save', function(next) {
  if (this.isNew) {
    if (this.openNow === undefined) this.openNow = true;
    if (this.emergency === undefined) this.emergency = false;
    if (this.specialties === undefined) this.specialties = [];
  }
  next();
});

// Compound indexes
HospitalSchema.index({ openNow: 1, emergency: 1 });
HospitalSchema.index({ name: 1, address: 1 }, { unique: true });

export default mongoose.models.Hospital || mongoose.model<HospitalDocument>('Hospital', HospitalSchema);