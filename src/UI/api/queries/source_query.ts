import { gql } from "@apollo/client";

export const GET_REFERENCE = gql`
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

