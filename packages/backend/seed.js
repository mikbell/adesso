import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Category from "./models/categoryModel.js"; // Assicurati che il percorso al tuo modello sia corretto
import slugify from "slugify";

// Carica le variabili d'ambiente (DB_URL, CLOUD_NAME, etc.)
dotenv.config();

// Configura Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Array delle categorie da creare
const categoriesToSeed = [
	{ name: "Elettronica", imagePath: "./seed_images/elettronica.jpg" },
	{ name: "Casa e Cucina", imagePath: "./seed_images/casa-e-cucina.jpg" },
	{
		name: "Abbigliamento Uomo",
		imagePath: "./seed_images/abbigliamento-uomo.jpg",
	},
	{ name: "Borse", imagePath: "./seed_images/borse.jpg" },
	{ name: "Auto e Moto", imagePath: "./seed_images/auto-e-moto.jpg" },
	{ name: "Arte", imagePath: "./seed_images/arte.jpg" },
	{ name: "Fai da te", imagePath: "./seed_images/fai-da-te.jpg" },
	{ name: "Cancelleria", imagePath: "./seed_images/cancelleria.jpg" },
	{ name: "Bambini", imagePath: "./seed_images/bambini.jpg" },
	{
		name: "Animali Domestici",
		imagePath: "./seed_images/animali-domestici.jpg",
	},
];

const seedDatabase = async () => {
	try {
		// Connettiti al database
		await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
		});
		console.log("Connessione al database stabilita.");

		// Opzionale: pulisce le categorie esistenti per evitare duplicati
		// await Category.deleteMany({});
		// console.log('Categorie esistenti eliminate.');

		for (const cat of categoriesToSeed) {
			console.log(`Processing categoria: ${cat.name}...`);

			// Carica l'immagine su Cloudinary
			const result = await cloudinary.uploader.upload(cat.imagePath, {
				folder: "adesso/categorie", // Cartella su Cloudinary
			});

			// Crea la nuova categoria nel database
			await Category.create({
				name: cat.name,
				slug: slugify(cat.name, { lower: true, strict: true }),
				image: result.secure_url,
				public_id: result.public_id,
			});

			console.log(`✅ Categoria '${cat.name}' creata con successo!`);
		}

		console.log("\nOperazione di seeding completata con successo!");
	} catch (error) {
		console.error("\n❌ Errore durante il processo di seeding:", error);
	} finally {
		// Chiudi la connessione al database
		await mongoose.connection.close();
		console.log("Connessione al database chiusa.");
	}
};

// Esegui la funzione di seeding
seedDatabase();
