import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client';

const link = createHttpLink({
    uri: 'http://localhost:3001/graphql',
    fetchOptions: {method: "POST"}

})

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
    
})

const GET_REFERENCE = gql`
    query Reference{
        allReferenceData {
            author
            article_title
            journal_title
            citation
            year
            published
            report_type
            v_data

        }
        
    }
`;

export const ADD_REFERENCE = gql`
    mutation AddReference{
        add_reference{
            author
            article_title
            journal_title
            citation
            year
            published
            report_type
            v_data

        }
    }

`;