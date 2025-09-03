import { ProfessionalDetailType } from '@/sections/dashboard/formSchemas';
import { Schema, model, models, Document } from 'mongoose';

interface ProfessionalProps extends Omit<ProfessionalDetailType, ''> {
  userId: string;
  }

const professionSchema = new Schema<ProfessionalProps>(
  {
    address: {type: String},
    agency: {type: String},
    bio: {type: String},
    experience: {type: String},
    license: {type: String},
    specialization: {type: String},
    userId: {type: String, unique: true, required: true, ref: 'User'}
  },
  {
    timestamps: true,
  }
);

const ProfessionalDetail = models.ProfessionalDetail || model('ProfessionalDetail', professionSchema);

export default ProfessionalDetail;
