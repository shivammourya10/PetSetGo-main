// import zod from 'zod';
// import Pet from '../../models/pet/PetSchema.js';
// import uploadOnCloudinary from '../../utils/cloudinary.js';

// // Define Zod schemas for validation
// const genderParser = zod.enum(['Male', 'Female']);
// const weightParser = zod.number().max(99);
// const StringParser = zod.string();
// const NumberParser = zod.number().min(0).max(99); // Updated to include min and max for age
// const petTypeParser = zod.enum(['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Rodent', 'Other']);

// const updatePet = async (req, res) => {
//     const { name, type, age, weight, breed, gender } = req.body;
//     console.log(age, weight,type)
//     const { petId } = req.params;
//     const intage = parseInt(req.body.age); 
//     const intWeight = parseInt(req.body.weight);
//     // Validate inputs
//     const isName = StringParser.safeParse(name);
//     const isPetId = StringParser.safeParse(petId);
//     const isAge = NumberParser.safeParse(intage);
//     const isWeight = weightParser.safeParse(intWeight);
//     const isBreed = StringParser.safeParse(breed);
//     const isGender = genderParser.safeParse(gender);
//     const isType = petTypeParser.safeParse(type);

 
//     // Check for validation errors
//     if (!isName.success || !isType.success) {
//         return res.status(400).json({ message: 'Invalid name or pet type' });
//     }
//     if (!isPetId.success) {
//         return res.status(400).json({ message: 'Invalid pet ID' });
//     }
//     if (!isAge.success) {
//         return res.status(400).json({ message: 'Invalid age' });
//     }
//     if (!isWeight.success) {
//         return res.status(400).json({ message: 'Invalid weight' });
//     }
//     if (!isBreed.success) {
//         return res.status(400).json({ message: 'Invalid breed' });
//     }
//     if (!isGender.success) {
//         return res.status(400).json({ message: 'Invalid gender' });
//     }

//     // Check if user is authenticated
//     if (!req.file) {
//         return res.status(401).json({message: 'file not found'});
//     }

//     // Check if a file was uploaded
//     let picUrl;
//     if (req.file) {
//         const uploadFile = await uploadOnCloudinary(req.file.path);
//         if (!uploadFile) {
//             return res.status(500).json({ message: 'Failed to upload image on Cloudinary' });
//         }
//         picUrl = uploadFile.url; // Store the URL from the upload response
//     }

//     // Update the pet in the database
//     const updatedPet = await Pet.findByIdAndUpdate(petId, {
//         PetName: name,
//         PetType: type,
//         Age: intage,
//         Breed: breed,
//         Weight: intWeight,
//         Gender: gender,
//         PicUrl: picUrl, // Use picUrl only if a file was uploaded
//     }, { new: true }); // Return the updated document

//     // Check if the update was successful
//     if (!updatedPet) {
//         return res.status(404).json({ message: 'Pet update failed or pet not found' });
//     }

//     return res.status(200).json({
//         message: "Updated pet successfully",
//         updatedPet,
//     });
// };

// export default updatePet;
import zod from 'zod';
import Pet from '../../models/pet/PetSchema.js';
import uploadOnCloudinary from '../../utils/cloudinary.js';

// Define Zod parsers
const genderParser = zod.enum(['Male', 'Female']).optional();
const weightParser = zod.number().max(99).optional();
const StringParser = zod.string().optional();
const NumberParser = zod.number().min(0).max(99).optional(); // Age validation
const petTypeParser = zod.enum(['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Rodent', 'Other']).optional();

// Helper to check if any data is being updated
function hasUpdateData(data, file) {
    return Object.keys(data).length > 0 || !!file;
}

const updatePet = async (req, res) => {
    const { name, type, age, weight, breed, gender } = req.body;
    const { petId } = req.params;

    try {
        // Find current pet
        const currentPet = await Pet.findById(petId);
        if (!currentPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Parse incoming data if present
        const intage = age !== undefined ? parseInt(age, 10) : undefined;
        const intWeight = weight !== undefined ? parseInt(weight, 10) : undefined;

        const isName = name !== undefined ? StringParser.safeParse(name) : { success: true };
        const isType = type !== undefined ? petTypeParser.safeParse(type) : { success: true };
        const isAge = age !== undefined ? NumberParser.safeParse(intage) : { success: true };
        const isWeight = weight !== undefined ? weightParser.safeParse(intWeight) : { success: true };
        const isBreed = breed !== undefined ? StringParser.safeParse(breed) : { success: true };
        const isGender = gender !== undefined ? genderParser.safeParse(gender) : { success: true };

        // Collect validation errors
        const validationErrors = [];

        if (!isName.success) validationErrors.push({ field: 'name', msg: 'Name must be a string' });
        if (!isType.success) validationErrors.push({ field: 'type', msg: 'Invalid pet type' });
        if (!isAge.success) validationErrors.push({ field: 'age', msg: 'Age must be a number between 0 and 99' });
        if (!isWeight.success) validationErrors.push({ field: 'weight', msg: 'Weight must be a number and less than or equal to 99' });
        if (!isBreed.success) validationErrors.push({ field: 'breed', msg: 'Breed must be a string' });
        if (!isGender.success) validationErrors.push({ field: 'gender', msg: 'Gender must be Male or Female' });

        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        // Prepare update object dynamically
        const updateData = {};

        if (name !== undefined) updateData.PetName = isName.data;
        if (type !== undefined) updateData.PetType = isType.data;
        if (age !== undefined) updateData.Age = isAge.data;
        if (weight !== undefined) updateData.Weight = isWeight.data;
        if (breed !== undefined) updateData.Breed = isBreed.data;
        if (gender !== undefined) updateData.Gender = isGender.data;

        // Handle image upload if file is provided
        if (req.file) {
            const uploadFile = await uploadOnCloudinary(req.file.path);
            if (!uploadFile) {
                return res.status(500).json({ message: 'Failed to upload image on Cloudinary' });
            }
            updateData.PicUrl = uploadFile.url;
        }

        // Check if at least one field or image is provided
        if (!hasUpdateData(updateData, req.file)) {
            return res.status(400).json({
                message: "No data provided to update",
                errors: ["At least one field or image must be provided for update"]
            });
        }

        // Update the pet
        const updatedPet = await Pet.findByIdAndUpdate(petId, updateData, { new: true });

        return res.status(200).json({
            message: 'Pet updated successfully',
            updatedPet,
        });

    } catch (error) {
        console.error('Error updating pet:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export default updatePet;