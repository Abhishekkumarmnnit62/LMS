import Documents from '../models/Document.js';
import Flashcards from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

//@desc Generate flashcards based on document content
//@route POST /api/ai/generate-flashcard
//@access Private
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body;
        if(!documentId) {
            return res.status(404).json({
                success: false,
                error: 'Please provide DocumentId',
                statusCode: 400
            });
        }


        const document = await Documents.findOne({
            _id: documentId,
            userId: req.user.id,
            status:'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        );

        const flashcard = await Flashcards.create({
            userId: req.user.id,
            documentId: document._id,

            cards:cards.map(card=>(

                {
                    question:card.question,
                    answer:card.answer,
                    difficulty:card.difficulty,
                    reviewCount:0,
                    isStarred:false

            }))

        });

        res.status(201).json({
            success: true,
            data: flashcard,
            message:"Flashcard generated successfully"
        });
    } catch (error) {
        next(error);
    }
};

// @desc Generate quiz based on document content
// @route POST /api/ai/generate-quiz
// @access Private
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5, title} = req.body;
        if(!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide DocumentId',
                statusCode: 400
            });
        }

        const document = await Documents.findOne({
            _id: documentId,
            userId: req.user.id,
            status:'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        const questions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        const quiz = await Quiz.create({
            userId: req.user.id,
            documentId:documentId,
            title: title||`${document.title} -Quiz`,
            questions:questions,
            totalQuestions: questions.length,
            userAnswers:[],
            score:0

        });

        res.status(201).json({
            success: true,
            data: quiz,
            message:"Quiz generated successfully"
        });
    } catch (error) {
        next(error);
    }
};

// @desc Generate summary based on document content
// @route POST /api/ai/generate-summary
// @access Private
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;
        if(!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide DocumentId',
                statusCode: 400
            });
        }

        const document = await Documents.findOne({
            _id: documentId,
            userId: req.user.id,
            status:"ready"
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        const summary = await geminiService.generateSummary(
            document.extractedText
        );

        res.status(200).json({
            success: true,
            data: {
                documentId:document._id,
                title: document.title,
                summary
            },
            message:'Summary generated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc Chat with AI based on document content
// @route POST /api/ai/chat
// @access Private
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body;
        if(!documentId|| !question) {
            return res.status(400).json({
                success: false,
                error: 'Please provide DocumentId and Questions',
                statusCode: 400
            });
        }

        const document = await Documents.findOne({
            _id: documentId,
            userId: req.user.id,
            status:"ready"
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            });
        }

        const relevantChunks = findRelevantChunks(document.chunks, question, 3);
        const chunkIndices=relevantChunks.map(c=>c.chunkIndex);
            
        
        let chatHistory = await ChatHistory.findOne({
            userId: req.user.id,
            documentId: document._id
        });

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user.id,
                documentId:document._id,
                messages: []
            });
        }  
        const answer=await geminiService.chatwithContext(question, relevantChunks);

        chatHistory.messages.push({
            role: 'user',
            content: question,
            timestamp: new Date(),
            relevantChunks: []
        });

        chatHistory.messages.push({
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
            relevantChunks: chunkIndices
        });

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunks:chunkIndices,
                chatHistoryId: chatHistory._id
            },
            message:"Response Generated Successfully"
        });
    } catch (error) {
        next(error);
    }
};

// @desc Explain concept based on document content
// @route POST /api/ai/explain-concept
// @access Private
export const explainConcept=async(
    req,
    res,
    next
)=>{
    try{

        const {
            documentId,
            concept
        }=req.body;

        if(!documentId || !concept){

            return res.status(400).json({
                success:false,
                error:
                    'Please provide documentId and concept',
                statusCode:400
            });
        }

        const document=
            await Documents.findOne({
                _id:documentId,
                userId:req.user.id,
                status:'ready'
            });

        if(!document){

            return res.status(404).json({
                success:false,
                error:'Document not found',
                statusCode:404
            });
        }

        // Find relevant chunks
        const relevantChunks=
            findRelevantChunks(
                document.chunks,
                concept,
                3
            );

        // Build context
        const context=
            relevantChunks
                .map(c=>c.content)
                .join('\n\n');

        // Generate explanation
        const explanation=
            await geminiService
                .explainConcept(
                    concept,
                    context
                );

        res.status(200).json({
            success:true,

            data:{
                concept,
                explanation,

                relevantChunks:
                    relevantChunks.map(
                        c=>c.chunkIndex
                    )
            },

            message:
                'Explanation generated successfully'
        });

    }catch(error){

        console.error(
            'EXPLAIN CONCEPT ERROR:',
            error
        );

        next(error);
    }
};

// @desc Get chat history for a document 
// @route GET /api/ai/chat-history/:documentId 
// @access Private
export const getChatHistory=async(
    req,
    res,
    next
)=>{
    try{

        const {documentId}=req.params;

        if(!documentId){

            return res.status(400).json({
                success:false,
                error:'Please provide documentId',
                statusCode:400
            });
        }

        const chatHistory=
            await ChatHistory.findOne({
                userId:req.user.id,
                documentId
            }).select('messages');

        if(!chatHistory){

            return res.status(200).json({
                success:true,
                data:[],
                message:
                    'No chat history found for this document'
            });
        }

        res.status(200).json({
            success:true,
            data:chatHistory.messages,
            message:
                'Chat history retrieved successfully'
        });

    }catch(error){

        console.error(
            'GET CHAT HISTORY ERROR:',
            error
        );

        next(error);
    }
};