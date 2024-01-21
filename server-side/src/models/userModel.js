const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: { type: String, trim: true },
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: function (value) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
						value
					);
				},
				message: "Given Email is not valid",
			},
		},
		password: { type: String, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
