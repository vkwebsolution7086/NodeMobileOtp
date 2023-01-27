import { Response, Request } from "express";
const otpGenerator = require('otp-generator');
var springedge = require('springedge');
const { validationResult } = require('express-validator');
import Otp, {IOtp} from "../model/Otp"; 
require('dotenv').config();

const sendOtpController = {
    /**
     * Request a mobile from user return response.
     * @param req
     * @param res
     * @returns {*}
     */
    sendOtp: async function sendOtp(req: Request, res: Response) {
        const errors = validationResult(req).array();
        if (errors && errors.length) {
            return res.status(400).json(errors);
        } else {
            let otp: number = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false, digits: true });
            let params: object = {
                'apikey': process.env.SPRING_EDGE_API_KEY, // API Key 
                'sender': process.env.SPRING_EDGE_SENDER, // Sender Name 
                'to': [
                    req.body.mobile  //Moblie Number 
                ],
                'message': 'Hello ' + otp +', This is a test message from spring edge',
                'format': 'json'
            };
            springedge.messages.send(params, 3000, function (err: any, response: any) {
                if (err) {
                    console.log(err);
                    return res.json(err);
                } else {
                    let otps: IOtp = new Otp({
                        otp: otp,
                        expiration_time: new Date(new Date().getTime() + 3 * 60000),
                        verified: false
                    });
                    otps.save();
                    return res.status(201).json(response);
                }
            });
        }
    },

    /**
     * Request a otp from user and verify and return response.
     * @param req
     * @param res
     * @returns {*}
     */
    verify: async function verify(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        } else {
            var otp: number = req.body.otp;
            var notExpire: IOtp = await Otp.findOne({ otp: otp, verified: false, expiration_time: { $gt: new Date() } });
            if (notExpire) {
                await Otp.updateOne(
                    { otp: otp },
                    { verified: true }
                );
                res.status(200).json("your otp verified successfully");
            } else {
                res.status(403).json("your otp expired");
            }
        }
    }
};

export default sendOtpController;
