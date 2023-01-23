import Container from "@mui/material/Container"
import { useRouter } from "next/router"
import { useEffect } from "react"
import SectionPanel from "../components/layout/sectionPanel"
import ReviewForm from "../components/review/ReviewForm"
import AuthWrapper from "../components/shared/AuthWrapper"

function Review(){
    const router = useRouter()
    const { dataset_id } = router.query

    return(
        <div>
            <Container>
                <SectionPanel title="Review dataset ">
                    {/* <AuthWrapper role=""> */}
                    <ReviewForm dataset_id={dataset_id}/>
                    {/* </AuthWrapper> */}
                </SectionPanel>
            </Container>
        </div>
    )
}


export default Review