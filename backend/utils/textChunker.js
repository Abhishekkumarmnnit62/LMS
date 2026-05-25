/**
 * Split text into chunks for better AI processing
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlap
 * @returns {Array<{content:string,chunkIndex:number,pageNumber:number}>}
 */

export const chunkText=(
    text,
    chunkSize=1000,
    overlap=200
)=>{

    if(!text || text.trim().length===0){
        return [];
    }

    // Clean text
    const cleanedText=text
        .replace(/\r\n/g,'\n')
        .replace(/\s+/g,' ')
        .replace(/\n /g,'\n')
        .replace(/ \n/g,'\n')
        .trim();

    // Split into paragraphs
    const paragraphs=cleanedText
        .split('\n\n')
        .filter(
            p=>p.trim().length>0
        );

    const chunks=[];

    let currentChunk=[];
    let currentWordCount=0;
    let chunkIndex=0;

    for(const paragraph of paragraphs){

        const paragraphWords=
            paragraph.trim().split(/\s+/);

        const paragraphWordCount=
            paragraphWords.length;

        // If paragraph itself exceeds chunk size
        if(paragraphWordCount>chunkSize){

            // Save existing chunk
            if(currentChunk.length>0){

                chunks.push({
                    content:
                        currentChunk.join('\n\n'),

                    chunkIndex:
                        chunkIndex++,

                    pageNumber:0
                });

                currentChunk=[];
                currentWordCount=0;
            }

            // Split large paragraph
            for(
                let i=0;
                i<paragraphWords.length;
                i+=(chunkSize-overlap)
            ){

                const chunkWords=
                    paragraphWords.slice(
                        i,
                        i+chunkSize
                    );

                chunks.push({
                    content:
                        chunkWords.join(' '),

                    chunkIndex:
                        chunkIndex++,

                    pageNumber:0
                });

                if(
                    i+chunkSize>=
                    paragraphWords.length
                ){
                    break;
                }
            }

            continue;
        }

        // If chunk limit exceeded
        if(
            currentWordCount+
            paragraphWordCount>
            chunkSize &&
            currentChunk.length>0
        ){

            chunks.push({
                content:
                    currentChunk.join('\n\n'),

                chunkIndex:
                    chunkIndex++,

                pageNumber:0
            });

            // Create overlap
            const prevWords=
                currentChunk
                    .join(' ')
                    .split(/\s+/);

            const overlapWords=
                prevWords
                    .slice(
                        -Math.min(
                            overlap,
                            prevWords.length
                        )
                    )
                    .join(' ');

            currentChunk=[
                overlapWords,
                paragraph.trim()
            ];

            currentWordCount=
                overlapWords
                    .split(/\s+/).length +
                paragraphWordCount;

        }else{

            currentChunk.push(
                paragraph.trim()
            );

            currentWordCount+=
                paragraphWordCount;
        }
    }

    // Push remaining chunk
    if(currentChunk.length>0){

        chunks.push({
            content:
                currentChunk.join('\n\n'),

            chunkIndex:
                chunkIndex++,

            pageNumber:0
        });
    }

    // Fallback
    if(
        chunks.length===0 &&
        cleanedText.length>0
    ){

        const allWords=
            cleanedText.split(/\s+/);

        for(
            let i=0;
            i<allWords.length;
            i+=(chunkSize-overlap)
        ){

            const chunkWords=
                allWords.slice(
                    i,
                    i+chunkSize
                );

            chunks.push({
                content:
                    chunkWords.join(' '),

                chunkIndex:
                    chunkIndex++,

                pageNumber:0
            });

            if(
                i+chunkSize>=
                allWords.length
            ){
                break;
            }
        }
    }

    return chunks;
};

/**
 * Escape regex special characters
 */
const escapeRegex=(str)=>{
    return str.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
    );
};

/**
 * Find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks
 * @param {string} query
 * @param {number} maxChunks
 * @returns {Array<Object>}
 */

export const findRelevantChunks=(
    chunks,
    query,
    maxChunks=3
)=>{

    if(
        !chunks ||
        chunks.length===0 ||
        !query
    ){
        return [];
    }

    // Common stop words
    const stopWords=new Set([
        'the','is','in','and','to',
        'of','a','that','it','with',
        'as','for','was','on','are',
        'by','this','be','or','from',
        'at','which','an'
    ]);

    // Extract keywords
    const queryKeywords=query
        .toLowerCase()
        .split(/\s+/)
        .filter(
            w=>
                w.length>2 &&
                !stopWords.has(w)
        );

    // If no valid keywords
    if(queryKeywords.length===0){

        return chunks
            .slice(0,maxChunks)
            .map(c=>({
                content:c.content,
                chunkIndex:c.chunkIndex,
                pageNumber:c.pageNumber,
                _id:c._id
            }));
    }

    const scoredChunks=
        chunks.map((chunk,index)=>{

            const content=
                chunk.content.toLowerCase();

            const contentWords=
                content.split(/\s+/).length;

            let score=0;

            // Score keywords
            for(const word of queryKeywords){

                const escapedWord=
                    escapeRegex(word);

                // Exact match
                const exactMatches=
                    (
                        content.match(
                            new RegExp(
                                `\\b${escapedWord}\\b`,
                                'g'
                            )
                        ) || []
                    ).length;

                score+=exactMatches*3;

                // Partial match
                const partialMatches=
                    (
                        content.match(
                            new RegExp(
                                escapedWord,
                                'g'
                            )
                        ) || []
                    ).length;

                score+=
                    Math.max(
                        0,
                        partialMatches-
                        exactMatches
                    )*1.5;
            }

            // Unique matched words
            const uniqueQueryWords=
                queryKeywords.filter(
                    word=>
                        content.includes(word)
                ).length;

            if(uniqueQueryWords>1){
                score+=uniqueQueryWords*2;
            }

            // Normalize score
            const normalizedScore=
                score/
                Math.sqrt(contentWords);

            // Position bonus
            const positionBonus=
                1-
                (
                    index/
                    chunks.length
                )*0.1;

            return{

                content:
                    chunk.content,

                chunkIndex:
                    chunk.chunkIndex,

                pageNumber:
                    chunk.pageNumber,

                _id:
                    chunk._id,

                score:
                    normalizedScore*
                    positionBonus,

                rawScore:
                    score,

                matchedWords:
                    uniqueQueryWords
            };
        });

    // Return top relevant chunks
    return scoredChunks
        .filter(c=>c.score>0)
        .sort((a,b)=>{

            if(b.score!==a.score){
                return b.score-a.score;
            }

            if(
                b.matchedWords!==
                a.matchedWords
            ){
                return (
                    b.matchedWords-
                    a.matchedWords
                );
            }

            return (
                a.chunkIndex-
                b.chunkIndex
            );
        })
        .slice(0,maxChunks);
};