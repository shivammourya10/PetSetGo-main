// import zod from "zod";
// import uploadOnCloudinary from "../../utils/cloudinary.js";
// import Pet from "../../models/pet/PetSchema.js";
// import User from "../../models/User/UserSchema.js";

// // Define validators using zod
// const nameParser = zod.string();
// const typeParser = zod.enum(['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Rodent', 'Other']);
// const breedParser = zod.string();
// const ageParser = zod.number().min(0).max(99, { message: "Age must be 99 or below." });
// const weightParser = zod.number();
// const genderParser = zod.enum(['Male', 'Female']);
// const availableForBreedingParser = zod.boolean();

// const petController = async (req, res) => {
//     const { name, type, breed, age, weight, gender, availableForBreeding } = req.body;
//     const { userId } = req.params;

//     // Parse and validate fields
//     const isName = nameParser.safeParse(name);
//     const isType = typeParser.safeParse(type);
//     const isBreed = breedParser.safeParse(breed);
//     const isAge = ageParser.safeParse(Number(age)); // Convert to number for validation
//     const isWeight = weightParser.safeParse(Number(weight)); // Convert to number for validation
//     const isGender = genderParser.safeParse(gender);
//     const isAvailableForBreeding = availableForBreedingParser.safeParse(availableForBreeding);

//     if (!userId){
//         return res.status(401).json({ message: "User ID is required" });
//     }

//     // Check if all fields are valid and send specific errors
//     if (!isName.success) {
//         return res.status(400).json({ field: "name", msg: "Invalid name" });
//     }
//     if (!isType.success) {
//         return res.status(400).json({ field: "type", msg: "Invalid type. Must be one of: 'Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Rodent', 'Other'" });
//     }
//     if (!isBreed.success) {
//         return res.status(400).json({ field: "breed", msg: "Invalid breed" });
//     }
//     if (!isAge.success) {
//         return res.status(400).json({ field: "age", msg: isAge.error.issues[0].message });
//     }
//     if (!isWeight.success) {
//         return res.status(400).json({ field: "weight", msg: "Invalid weight" });
//     }
//     if (!isGender.success) {
//         return res.status(400).json({ field: "gender", msg: "Invalid gender. Must be 'Male' or 'Female'" });
//     }

//     if(!availableForBreeding.success){
//         return res.status(400).json({ field: "availableForBreeding", msg: "Invalid value for availableForBreeding. Must be true or false" });
//     }
//     // Check for uploaded file
//     if (!req.file) {
//         return res.status(400).json({ message: "No image uploaded" });
//     }

//     try {
//         // Upload the pet's picture to Cloudinary
//         const uploadedFile = await uploadOnCloudinary(req.file.path);
//         if (!uploadedFile) {
//             return res.status(500).json({ message: "Failed to upload image on Cloudinary" });
//         }
//         // Create new pet entry
//         const newPet = new Pet({
//             PetName: name,
//             PetType: type,
//             Breed: breed,
//             Age: age,
//             Weight: weight,
//             PicUrl: uploadedFile.url,
//             Gender: gender,
//         });
//         // Save new pet to the database
//         await newPet.save();
//         // Find the user by ID and associate the pet with the user
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         // Add the newly created pet to the user's list of pets
//         user.Pets.push(newPet._id);
//         await user.save();
//         return res.status(201).json({ message: "Pet created successfully", pet: newPet });
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
// export default petController;

import zod from "zod";
import uploadOnCloudinary from "../../utils/cloudinary.js";
import Pet from "../../models/pet/PetSchema.js";
import User from "../../models/User/UserSchema.js";

// Define validators using zod
const nameParser = zod.string();
const typeParser = zod.enum(['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Rodent', 'Other']);
const breedParser = zod.string();
const ageParser = zod.number().min(0).max(99, { message: "Age must be 99 or below." });
const weightParser = zod.number();
const genderParser = zod.enum(['Male', 'Female']);
// const availableForBreedingParser = zod.boolean().transform(val => 
//     typeof val === 'string' ? val === 'true' : val
// ); // Better boolean handling


const availableForBreedingParser = zod
  .union([zod.string(), zod.boolean()])
  .transform((val) => {
    if (typeof val === 'string') {
      return val.trim().toLowerCase() === 'true';
    }
    return Boolean(val);
  });

const petController = async (req, res) => {
    // Set CORS headers immediately to address potential cross-origin issues
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Add connection diagnostic headers
    res.header('X-API-Status', 'available');
    res.header('X-API-Time', new Date().toISOString());
    
    console.log('Pet creation request received:', {
        body: req.body ? 'Present' : 'Missing',
        file: req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file',
        params: req.params
    });
    
    const { name, type, breed, age, weight, gender, availableForBreeding } = req.body;
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        return res.status(401).json({ 
            message: "User ID is required",
            connectionInfo: {
                serverTime: new Date().toISOString(),
                serverAvailable: true
            }
        });
    }

    // Parse and validate fields
    const validations = {
        name: nameParser.safeParse(name),
        type: typeParser.safeParse(type),
        breed: breedParser.safeParse(breed),
        age: ageParser.safeParse(Number(age)), // Convert to number for validation
        weight: weightParser.safeParse(Number(weight)), // Convert to number for validation
        gender: genderParser.safeParse(gender),
        availableForBreeding: availableForBreedingParser.safeParse(availableForBreeding)
        //
    };

    // Check if all fields are valid and send specific errors
    if (!validations.name.success) {
        return res.status(400).json({ field: "name", msg: validations.name.error.issues[0].message });
    }
    if (!validations.type.success) {
        return res.status(400).json({ field: "type", msg: validations.type.error.issues[0].message });
    }
    if (!validations.breed.success) {
        return res.status(400).json({ field: "breed", msg: validations.breed.error.issues[0].message });
    }
    if (!validations.age.success) {
        return res.status(400).json({ field: "age", msg: validations.age.error.issues[0].message });
    }
    if (!validations.weight.success) {
        return res.status(400).json({ field: "weight", msg: validations.weight.error.issues[0].message });
    }
    if (!validations.gender.success) {
        return res.status(400).json({ field: "gender", msg: validations.gender.error.issues[0].message });
    }
    if (!validations.availableForBreeding.success) {
        return res.status(400).json({ field: "availableForBreeding", msg: validations.availableForBreeding.error.issues[0].message });
    }

    // Check for uploaded file with detailed response for debugging
    if (!req.file) {
        console.error('File upload failed - req.file is missing');
        return res.status(400).json({ 
            message: "No image uploaded", 
            details: "The file was not received by the server",
            connectionInfo: {
                headers: req.headers['content-type'] || 'No content-type header',
                bodySize: req.headers['content-length'] || 'Unknown size',
                serverTime: new Date().toISOString(),
                formDataReceived: !!req.body,
                requestType: req.method
            }
        });
    }
    
    // Validate the file format
    if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ 
            message: "Invalid file type", 
            details: `Received file of type ${req.file.mimetype}, but an image is required`
        });
    }

    try {
        // Set a timeout for the Cloudinary upload to prevent long-hanging requests
        const uploadPromise = uploadOnCloudinary(req.file.path);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Upload timed out after 15 seconds')), 15000)
        );
        
        // Upload the pet's picture to Cloudinary with timeout
        const uploadedFile = await Promise.race([uploadPromise, timeoutPromise]);
        
        if (!uploadedFile) {
            return res.status(500).json({ 
                message: "Failed to upload image on Cloudinary",
                details: "The upload service may be unavailable"
            });
        }

        // Create new pet entry
        const newPet = new Pet({
            PetName: name,
            PetType: type,
            Breed: breed,
            Age: Number(age), // Ensure it's a number
            Weight: Number(weight), // Ensure it's a number
            PicUrl: uploadedFile.url,
            Gender: gender,
            AvailableForBreeding: validations.availableForBreeding.data
        });

        // Save new pet to the database
        await newPet.save();

        // Find the user by ID and associate the pet with the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add the newly created pet to the user's list of pets
        user.Pets.push(newPet._id);
        await user.save();

        // Send CORS headers to ensure frontend can receive the response
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return res.status(201).json({ 
            message: "Pet created successfully", 
            pet: newPet,
            serverTime: new Date().toISOString() // Add server time for diagnosing time-related issues
        });
    } catch (error) {
        console.error('Error creating pet:', error);
        
        // Categorize different types of errors for better client-side handling
        let statusCode = 500;
        let errorMessage = "Server error";
        let errorDetails = error.message;
        
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            statusCode = 503;
            errorMessage = "Database connection error";
            errorDetails = "Cannot connect to the database. Please try again later.";
        } else if (error.message.includes('timed out')) {
            statusCode = 504;
            errorMessage = "Request timed out";
            errorDetails = "The upload process took too long. Please check your network connection and try again.";
        } else if (error.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = "Validation error";
            errorDetails = Object.values(error.errors).map(e => e.message).join(', ');
        }
        
        // Send CORS headers to ensure frontend can receive the error
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return res.status(statusCode).json({ 
            message: errorMessage, 
            error: errorDetails,
            connectionInfo: {
                serverTime: new Date().toISOString(),
                serverAvailable: true
            }
        });
    }
};

export default petController;