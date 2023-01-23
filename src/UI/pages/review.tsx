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


function componentDidUpdate(prevProps: any) {
    const { pathname, query } = this.props.router
    // verify props have changed to avoid an infinite loop
    if (query.counter !== prevProps.router.query.counter) {
      // fetch data based on the new query
    }
}

export default Review