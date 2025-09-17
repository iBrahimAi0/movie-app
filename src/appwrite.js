import {Client ,Databases,ID,Query} from 'appwrite'
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;    
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT


// connection between the app and the appwrite backend
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);


const database = new Databases(client);

export const updateSearchCount = async (searchInput,movie) => {

    try{
        //search for if the movie was searched before

        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[Query.equal('searchInput',searchInput)])

        //conditions => if the movie was searched before we will incremet the count value

        if(result.documents.length > 0){
            const doc = result.documents[0];
            
            await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
                count : doc.count + 1,
            })
        }
        // else means this is the first time , we will create a new doc
        else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                searchInput,
                title : movie.title,
                count: 1,
                movie_id: movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }

    }catch(error){
        console.error(error)
        return [];
    }
}

export const getTrendingMovies = async () => {
    try{
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents
    }
    catch(error){
        console.error(error)
        return [];
    }
}
