import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { 
        type: String,
        required: [true, 'Please provide a title for the document'],
        trim: true
    },  
    filename: {
        type: String,
        required: [true, 'Please provide a filename for the document']
    },
    filePath: {
        type: String,
        required: [true, 'Please provide a file path for the document'] 
    },
    fileSize: {
        type: Number,
        required: [true, 'Please provide the file size for the document']
    },
    ExtractedText: {
        type: String,
        default: '' 

    },
    chunks: [{
        content: {
            type: String,
            required: true
        },
        pageNumber: {
            type: Number,
            required: true  
        },
        chunkIndex: {
            type: Number,
            required: true
        }
    }],
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['processing', 'ready', 'failed'],
        default: 'processing'
    }
},{
    timestamps:true }
);
//index for faster queries
documentSchema.index({ userId: 1, uploadDate: -1 });
const Document = mongoose.model('Document', documentSchema);
export default Document;