import zod from "zod";
import uploadOnCloudinary from "../utils/cloudinary.js";
import RescueAdoptionSchema from "../models/RescueAndAdoption.js";

const descriptionParser = zod.string().min(5);
const typeParser = zod.enum(['Rescue', 'Adoption']);
const RescueAdoption = async (req,res) =>{
    // Extract both 'type' and 'typeOfHelp' to handle both frontend variations
    const {description, type, typeOfHelp} = req.body;
    const finalType = typeOfHelp || type; // Use typeOfHelp if provided, otherwise use type
    
    const isDescription = descriptionParser.safeParse(description);
    const isType = typeParser.safeParse(finalType);
    if(!isDescription.success || !isType.success){
        return res.status(400).json({
            message: "Invalid Description or Type",
            errors: {
                description: !isDescription.success ? isDescription.error.issues : null,
                type: !isType.success ? isType.error.issues : null
            }
        });
    }
    if(!req.file){
        return res.status(400).json({
            message: "No Image Uploaded",
        });
    }
    const uploadedFile = await uploadOnCloudinary(req.file.path);
    if(!uploadedFile){
        return res.status(500).json({
            message: "Failed to Upload Image on Cloudinary",
        });
    }
    const rescueAdoption = new RescueAdoptionSchema({
        typeOfHelp: finalType,
        picUrl: uploadedFile.url,
        description: description,
    });
    await rescueAdoption.save();

    return res.status(201).json({
        message: "Rescue or Adoption Request Created Successfully",
        rescueAdoption,
    }); 
}
export default RescueAdoption;