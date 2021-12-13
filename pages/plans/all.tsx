import Head from "next/head";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit from "../../utils/PecundangPlanKit";
import { getStNdRdTh, month } from "../../utils/Functions";

export default function All() {

    let { user } = useAuth()
    let router = useRouter()
    const Plans = new PecundangPlanKit()

    return (
        <div className="px-8 lg:px-20 py-10 bg-gray-200 min-h-screen">
            <Head>
                <title>Semua Acara</title>
            </Head>
            <div className="mb-5 flex justify-between">
                <button onClick={_e=>router.back()} className="flex items-center"><BsChevronLeft className="mr-2" />Back</button>
                {user !== null ? 
                <div className="absolute right-0 lg:right-20 lg:-mx-8">
                    <UserDrop user={user} faceColorClass="text-black" />
                </div> : false}
            </div>
            <div>
                <h1 className="text-6xl font-bold"><span className="font-thin">All</span> Plans</h1>
            </div>
            {
                user !== null ?
                <div className="flex flex-col space-y-3 mt-6 lg:mt-8">
                    <div className="h-96 relative">
                        
                        
                    </div>
                </div>
                : false
            }
        </div>
    )
}