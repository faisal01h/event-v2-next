import Head from "next/head";
import { useRouter } from "next/router";
import { BsChevronLeft } from 'react-icons/bs'
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import { day, month } from "../../utils/Functions";
import PecundangPlanKit from "../../utils/PecundangPlanKit";

export default function Gallery() {

    const router = useRouter();
    const { user } = useAuth();

    const Plans = new PecundangPlanKit()

    return (
        <div className="px-8 lg:px-20 py-10 bg-gray-200 min-h-screen">
            <Head>
                <title>Galeri Pecundang</title>
            </Head>
            <div className="mb-5 flex justify-between">
                <button onClick={_e=>router.back()} className="flex items-center"><BsChevronLeft className="mr-2" />Back</button>
                {user !== null ? 
                <div className="absolute right-0 lg:right-20 lg:-mx-8 z-50">
                    <UserDrop user={user} faceColorClass="text-black" />
                </div> : false}
            </div>
            <div className="">
                <h1 className="text-6xl font-bold">Gallery</h1>
            </div>
            {
                user !== null ?
                <div className="flex flex-col gap-5 mt-6 lg:mt-8">
                    {
                        Plans.plans.map((e, i) => {
                            if(e.datetime.getTime() != 0) {
                                return (
                                    <div key={i} className="flex flex-col gap-2 acrylic px-3 py-2 rounded-lg">
                                        <div className="inline-flex gap-2">
                                            <h3 className="font-medium tracking-wide uppercase">{e.name} </h3>
                                            <span className="[font-weight:400] text-gray-500">{`${day["en"][e.datetime.getDay()].substring(0,3)}, ${e.datetime.getDate()} ${month[e.datetime.getMonth()]} ${e.datetime.getFullYear()}`}</span>
                                            {/*<a className="text-gray-500" href={"https://www.google.com/maps/place/"+e.location.data} target={"_blank"}>{e.location.string}</a>*/}
                                        </div>
                                        
                                        <div className="min-h-[100px]">
    
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>    
                :
                <div className="flex flex-col space-y-3 mt-6 lg:mt-8 text-red-500">
                    &times; Unauthorized
                </div>    
            }
        </div>
    )
}