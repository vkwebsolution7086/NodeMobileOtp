import { Document, Model, model, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the Otp Schema for TypeScript.
 * @param otp:number
 * @param expiration_time: Date
 * @param verified:boolean
 */

export interface IOtp extends Document {
  otp: number;
  expiration_time: Date;
  verified: boolean
}

const otpSchema: Schema = new Schema({
    otp: { type: Number },
    expiration_time: { type: Date},
    verified: { type: Boolean}
});

const Otp = mongoose.model<IOtp>("Otp", otpSchema);

export default Otp;
