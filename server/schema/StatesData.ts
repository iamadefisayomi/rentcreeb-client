import mongoose, {Schema} from "mongoose";

interface IWard {
  name: string;
  latitude: number;
  longitude: number;
}

interface ILga {
  name: string;
  wards: IWard[];
}

export interface IStateData extends Document {
  state: string;
  lgas: ILga[];
}

const WardSchema = new Schema<IWard>({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const LgaSchema = new Schema<ILga>({
  name: { type: String, required: true },
  wards: { type: [WardSchema], required: true },
});

const StateSchema = new Schema<IStateData>({
  state: { type: String, required: true },
  lgas: { type: [LgaSchema], required: true },
});

export const NigeriaStatesLgaCity = mongoose.models.NigeriaStatesLgaCity ||
  mongoose.model<IStateData>("NigeriaStatesLgaCity", StateSchema);
