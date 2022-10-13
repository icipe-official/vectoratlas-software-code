import { useQuery } from '@apollo/client';
import SourceCard from '../components/sources/sourceCard';
import {GET_REFERENCE} from "/home/shishi/VECTOR_ATLAS/vectoratlas-software-code/src/UI/api/queries/source_query"
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSourceInfo } from '../state/sourceSlice';
import store, { AppDispatch } from '../state/store';
import { useAppSelector } from '../state/hooks';
import { useDispatch } from 'react-redux';

export const SourceView = () => {
    const reference = useSelector((state:any) => state.reference)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(getSourceInfo())

    }, [])

    return(
        <>
        <div>
            <h2>LIST OF SOURCES</h2>
            {reference.loading && <div>Loading...</div>}
            {!reference.loading && reference.error ? <div>Error: {reference.error}</div> : null }
            {!reference.loading && reference.references.length ? (
                <ul>
                    {
                        reference.references.map((reference:any) => (
                            <li key = {reference.id}>{reference.author}</li>
                        ))
                    }
                </ul>
            ) : null }
        </div>
        </>
    )
}














/* function GetSource(){
    const reference = useAppSelector((state => state.source.reference));
    console.log(reference)
   
    useEffect(() => {
        store.dispatch(getSourceInfo());
      }, []);

   return(
        <>
        <div>
        <h2>LIST OF SOURCES</h2>
        
            <p>Author: {reference.author} </p>
            <p>Article Title: {reference.article_title} </p>
            <p>Journal Title: {reference.journal_title} </p>
            <p>Citation: {reference.citation} </p>
            <p>Year: {reference.year} </p>
            <p>Published: {reference.published} </p>
            <p>Report Type: {reference.report_type} </p>
            <p>V_data: {reference.v_data} </p>
        
        
        </div>
        
        </>
    ) 
} */ 
export default SourceView;





























































































/* export const getStaticProps =async () => {

    const res = await fetch('http://localhost:3001/graphql/uploadSources');
    const data = await res.json;

    return{
        props: {references : data}
    }
    
}

const Sources = ({ references }) => {
    return(
        <>
        <div>
        <h2>LIST OF SOURCES</h2>
        {references.map(reference => (
           <div key = {reference.id}>
            <a >
                <h3>{reference.author}</h3>
            </a>


           </div> 
        ))}

        </div>
        </>
    )
    
} */

/* function DisplayPage(){
    const {loading, error, data} = useQuery(GET_REFERENCE);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    console.log(data);

   return(
    <>
    <div>
        <h2>LIST OF SOURCES</h2>

  
    {data.allReferenceData.map((allReferenceData: any) => (
        <SourceCard allReferenceData={allReferenceData}/>

    
    ))}
    </div>
    </>


    ) 
} */

