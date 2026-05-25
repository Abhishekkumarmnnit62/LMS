import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

if(!process.env.GOOGLE_API_KEY){
    console.warn(
        'WARNING: GOOGLE_API_KEY is missing'
    );
}

const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY
});

/**
 * Safely extract text from Gemini response
 */
const getResponseText=(response)=>{

    if(
        !response ||
        !response.candidates ||
        !response.candidates.length
    ){
        throw new Error('No response from Gemini');
    }

    return response.candidates[0]
        .content.parts[0].text;
};

/**
 * Generate flashcards
 * @param {string} text
 * @param {number} count
 * @returns {Promise<Array>}
 */
export const generateFlashcards=async(
    text,
    count=10
)=>{

    const prompt=`
Generate exactly ${count} educational flashcards.

Format each flashcard exactly like:

Q: [question]
A: [answer]
D: [easy, medium, or hard]

Separate each flashcard with "---"

Text:
${text.substring(0,15000)}
`;

    try{

        const response=
            await ai.models.generateContent({
                model:'gemini-2.5-flash',
                contents:prompt
            });

        const generatedText=
            getResponseText(response);

        const flashcards=[];

        const cards=generatedText
            .split('---')
            .filter(card=>card.trim());

        for(const card of cards){

            const lines=card
                .trim()
                .split('\n');

            let question='';
            let answer='';
            let difficulty='medium';

            for(const line of lines){

                const trimmed=line.trim();

                if(trimmed.startsWith('Q:')){

                    question=trimmed
                        .substring(2)
                        .trim();

                }else if(trimmed.startsWith('A:')){

                    answer=trimmed
                        .substring(2)
                        .trim();

                }else if(trimmed.startsWith('D:')){

                    const diff=trimmed
                        .substring(2)
                        .trim()
                        .toLowerCase();

                    if(
                        ['easy','medium','hard']
                        .includes(diff)
                    ){
                        difficulty=diff;
                    }
                }
            }

            if(question && answer){

                flashcards.push({
                    question,
                    answer,
                    difficulty
                });
            }
        }

        return flashcards.slice(0,count);

    }catch(error){

        console.error(
            'FLASHCARD GEMINI ERROR:',
            error
        );

        throw new Error(
            'Failed to generate flashcards'
        );
    }
};

/**
 * Generate quiz questions
 * @param {string} text
 * @param {number} numQuestions
 * @returns {Promise<Array>}
 */
export const generateQuiz=async(
    text,
    numQuestions=10
)=>{

    const prompt=`
Generate exactly ${numQuestions} multiple choice quiz questions.

Format each question exactly like:

Q: [question]
O1: [option 1]
O2: [option 2]
O3: [option 3]
O4: [option 4]
C: [correct answer exactly]
E: [short explanation]
D: [easy, medium, or hard]

Separate each question with "---"

Text:
${text.substring(0,15000)}
`;

    try{

        const response=
            await ai.models.generateContent({
                model:'gemini-2.5-flash',
                contents:prompt
            });

        const generatedText=
            getResponseText(response);

        const questions=[];

        const blocks=generatedText
            .split('---')
            .filter(q=>q.trim());

        for(const block of blocks){

            const lines=block
                .trim()
                .split('\n');

            let question='';
            let options=[];
            let correctAnswer='';
            let explanation='';
            let difficulty='medium';

            for(const line of lines){

                const trimmed=line.trim();

                if(trimmed.startsWith('Q:')){

                    question=trimmed
                        .substring(2)
                        .trim();

                }else if(
                    trimmed.match(/^O\d:/)
                ){

                    options.push(
                        trimmed.substring(3).trim()
                    );

                }else if(trimmed.startsWith('C:')){

                    correctAnswer=trimmed
                        .substring(2)
                        .trim();

                }else if(trimmed.startsWith('E:')){

                    explanation=trimmed
                        .substring(2)
                        .trim();

                }else if(trimmed.startsWith('D:')){

                    const diff=trimmed
                        .substring(2)
                        .trim()
                        .toLowerCase();

                    if(
                        ['easy','medium','hard']
                        .includes(diff)
                    ){
                        difficulty=diff;
                    }
                }
            }

            if(
                question &&
                options.length===4 &&
                correctAnswer
            ){

                questions.push({
                    question,
                    options,
                    correctAnswer,
                    explanation,
                    difficulty
                });
            }
        }

        return questions.slice(0,numQuestions);

    }catch(error){

        console.error(
            'QUIZ GEMINI ERROR:',
            error
        );

        throw new Error(
            'Failed to generate quiz'
        );
    }
};

/**
 * Generate summary
 * @param {string} text
 * @returns {Promise<string>}
 */
export const generateSummary=async(text)=>{

    const prompt=`
Provide a concise summary of the following text.

Highlight:
- key concepts
- important ideas
- major takeaways

Keep the summary clear and structured.

Text:
${text.substring(0,20000)}
`;

    try{

        const response=
            await ai.models.generateContent({
                model:'gemini-2.5-flash',
                contents:prompt
            });

        return getResponseText(response);

    }catch(error){

        console.error(
            'SUMMARY GEMINI ERROR:',
            error
        );

        throw new Error(
            'Failed to generate summary'
        );
    }
};

/**
 * Chat with AI using context
 * @param {string} question
 * @param {Array<Object>} chunks
 * @returns {Promise<string>}
 */
export const chatwithContext=async(
    question,
    chunks
)=>{

    const context=chunks
        .map(
            (c,i)=>
            `[Chunk ${i+1}]\n${c.content}`
        )
        .join('\n\n');

    const prompt=`
Based on the following context from the document,
analyze the context and answer the user's question.

If the answer is not present in the context,
say so clearly.

Context:
${context}

Question:
${question}

Answer:
`;

    try{

        const response=
            await ai.models.generateContent({
                model:'gemini-2.5-flash',
                contents:prompt
            });

        return getResponseText(response);

    }catch(error){

        console.error(
            'CHAT GEMINI ERROR:',
            error
        );

        throw new Error(
            'Failed to generate chat response'
        );
    }
};

/**
 * Explain concept
 * @param {string} concept
 * @param {string} context
 * @returns {Promise<string>}
 */
export const explainConcept=async(
    concept,
    context
)=>{

    const prompt=`
Explain the concept "${concept}"
based on the following context.

Provide:
- simple explanation
- examples if relevant
- educational clarity

Context:
${context.substring(0,15000)}
`;

    try{

        const response=
            await ai.models.generateContent({
                model:'gemini-2.5-flash',
                contents:prompt
            });

        return getResponseText(response);

    }catch(error){

        console.error(
            'EXPLAIN GEMINI ERROR:',
            error
        );

        throw new Error(
            'Failed to explain concept'
        );
    }
};