const router = require('express').Router();
const jwt = require('../../middlewares/jwt');
const { body, validationResult } = require('express-validator');
const bcrypt = require('../../middlewares/bcrypt');
const UserModel = require("../../models/userModel");

router.get("/", async (req, res) => {
	try {
        const {email} = req.query;
        if(!email)throw new Error("Please enter valid email");
        const user = await UserModel.findOne({email});
        res.status(200).send({user});
	} catch (e) {
		return res.status(500).send({
            message: "Something went wrong",
            error: e.message
        });
	}
});

router.get("/all", async (req, res) => {
	try {
        const allUsers = await UserModel.find({});
        res.status(200).send({allUsers});
	} catch (e) {
		return res.status(500).send({
            message: "Something went wrong",
            error: e.message
        });
	}
});

router.put("/", 
    body('firstName', 'First Name is required').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('mobile', 'Invalid mobile number').isLength({min: 10, max: 10}),
    body('password', 'Password should contain at least 8 characters').isLength({min: 8}), 
async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({
                title: errors.errors[0].msg,
                errors: errors
            });
        }

        const {firstName, lastName, email, mobile, password} = req.body;
		const foundUser = await UserModel.findOne({email});
		if(!foundUser)return res.status(401).send({ message: "User Does Not Exists" });

        const hashedPass = await bcrypt.encrypt(password);
        console.log(hashedPass)
		const update = {
            firstName,
            lastName: lastName || "",
            mobile,
            password: hashedPass
        };
		await UserModel.findOneAndUpdate({email}, update)
		return res.status(200).send({ message: "User Updated Successfully" });
	} catch (e) {
		return res.status(500).send({
            message: "Something went wrong",
            error: e.message
        });
	}
});

router.post("/", 
    body('firstName', 'First Name is required').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('mobile', 'Invalid mobile number').isLength({min: 10, max: 10}),
    body('password', 'Password should contain at least 8 characters').isLength({min: 8}), 
async (req, res) => {
	try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({
                title: errors.errors[0].msg,
                errors: errors
            });
        }

        const {firstName, lastName, email, mobile, password} = req.body;
		const foundUser = await UserModel.findOne({email});
		if(foundUser)return res.status(401).send({ message: "User Already Exists" });

        const hashedPass = await bcrypt.encrypt(password);
		const newUser = new UserModel({
            firstName,
            lastName: lastName || "",
            email,
            mobile,
            password: hashedPass
        })
		await newUser.save();
		return res.status(200).send({ message: "User Created Successfully" });
	} catch (e) {
		return res.status(500).send({
            message: "Something went wrong",
            error: e.message
        });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const foundUser = await UserModel.findOne({ email });
		if (!foundUser) return res.status(401).send({ message: "Unauthorised" });
		
        const isVerified = await bcrypt.verify(password, foundUser.password);
		if (!isVerified) return res.status(401).send({ message: "Unauthorised" });

		const payload = {
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			mobile: foundUser.mobile,
		};
		const signOptions = { issuer: "Ganesh" };
		const token = jwt.sign(payload, signOptions);

		return res.status(200).send({ token });
	} catch (e) {
		return res.status(500).send({
            message: "Something went wrong",
            error: e.message
        });
	}
});

router.delete("/", async (req, res) => {
	const email = req.query.email;
	try {
        if(!email) throw new Error("Please enter email to delete")
		await UserModel.deleteOne({ email });
		return res.status(200).send({ message: "User Deleted Successfully" });
	} catch (e) {
		return res.status(500).send({
            message: "Something went wrong",
            error: e.message
        });
	}
});

module.exports = router;