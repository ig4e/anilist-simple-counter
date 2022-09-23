require("dotenv").config();
const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const mongoose = require("mongoose");
const linkModel = mongoose.model(
	"links",
	new mongoose.Schema({
		id: String,
		count: { type: Number, default: 0 },
	}),
);

const app = express();
app.get("/", (req, res) => {
	res.send("OK");
});

async function main() {
	const link = await linkModel.findOne({ id: "anilist-miyukkiie" });
	const canvas = createCanvas(400, 100);
	const ctx = canvas.getContext("2d");

	app.get("/counters/anilist/miyukkiie.png", async (req, res) => {
		try {
			let { image, topColor, countColor } = req.query;
			link.count++;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			//roundedImage(50, 5, 90, 90, 40);
			ctx.drawImage(
				await loadImage(
					image
						? image
						: "./rdjhb3p.png",
				),
				50,
				5,
				90,
				90,
			);
			ctx.font = "30px Arial";
			ctx.fillStyle = topColor ? topColor : "#AF2D2D";
			ctx.fillText("Profile Views", 60 + 90, 45);

			ctx.font = "25px Arial";
			ctx.fillStyle = countColor ? countColor : "#FFFF2C";
			ctx.fillText(link.count, 60 + 90, 75);

			res.type("webp");
			res.send(canvas.toBuffer());

			await link.save().catch();
		} catch {}
	});
}

main();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("[SEKAI-COUNTER]: Server Started Port " + PORT);
});
mongoose.connect(process.env.db);
