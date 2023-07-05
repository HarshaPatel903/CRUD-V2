const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        // PET_ID: {
        //     type: String,
        //     required: true
        // },
        PET_NAME: {
            type: String,
            required: [true, "Please enter a pet name"]
            
        },
        PET_BREED: {
            type: String,
            required: true,
        },
        PET_TYPE: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)


const Product = mongoose.model('Product', productSchema);

module.exports = Product;