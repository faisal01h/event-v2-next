import Head from "next/head";
import { useRouter } from "next/router";
import { BsChevronLeft } from 'react-icons/bs'
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit from "../../utils/PecundangPlanKit";
import { getStNdRdTh, month } from "../../utils/Functions";
import axios from "axios";
import PlanCard from "../../components/PlanCard";

export default function Plans() {

    const router = useRouter();
    const { user } = useAuth();
    const Plans = new PecundangPlanKit();

    const cdt = Plans.getCurrent()?.datetime;

    function getGPlaceLocationData(query: string) {
        axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+query+'&key='+process.env.NEXT_PUBLIC_G_API_KEY)
        .then(e => {
            console.log(e)
        })
        .catch(console.error)
    }

    //getGPlaceLocationData(Plans.getCurrent().location.string)

    return (
        <div className="px-8 lg:px-20 py-10 bg-gray-200 min-h-screen">
            <Head>
                <title>Wacana Pecundang</title>
            </Head>
            <div className="mb-5 flex justify-between">
                <button onClick={_e=>router.back()} className="flex items-center"><BsChevronLeft className="mr-2" />Back</button>
                {user !== null ? 
                <div className="absolute right-0 lg:right-20 lg:-mx-8">
                    <UserDrop user={user} faceColorClass="text-black" />
                </div> : false}
            </div>
            <div>
                <h1 className="text-6xl font-bold">Plans</h1>
            </div>
            {
                user !== null ?
                <div className="flex flex-col space-y-3 mt-6 lg:mt-8">
                    <div className="h-96 relative">
                        
                        <div className="">
                            <h2 className="text-xl lg:text-2xl font-thin uppercase">Wacana</h2>
                            {
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-4xl lg:text-9xl font-medium tracking-wide uppercase">{Plans.getCurrent()?.name}</h3>
                                    <p> 
                                        {month[cdt?.getMonth()? cdt?.getMonth():0]} {Plans.getCurrent()?.datetime.getDate()}{getStNdRdTh(Plans.getCurrent()?.datetime.getDate())}{" "}
                                        {Plans.getCurrent()?.datetime.getFullYear()} at <a href={"https://www.google.com/maps/place/"+Plans.getCurrent().location.data} target={"_blank"} rel="noreferrer">{Plans.getCurrent().location.string}</a>
                                    </p>
                                </div>
                            }
                            {/*<div className="absolute z-0 -mx-8 lg:-mx-20 h-48 w-screen" style={{background: `linear-gradient(to bottom, rgb(229,231,235), #00000000 , #00000000, rgb(229,231,235)), url(/media/images/${Plans.getCurrent().bgImg}), no-repeat center`}}></div>*/}
                        </div>
                    </div>
                    <div>
                    <h2 className="text-xl lg:text-2xl font-thin uppercase">Realisasi</h2>
                        <div className="flex flex-col gap-3 mt-3">
                        {
                            Plans.plans.map((e, index) => {
                                if(index < Plans.plans.length-1) {
                                    return (
                                        <PlanCard key={e.id} data={e} pecundangInstance={Plans} additionalClass="mx-2 min-w-[50%]" />
                                    )
                                }
                            })
                        }
                        </div>
                    </div>
                </div>    
                :
                <div className="flex flex-col space-y-3 mt-6 lg:mt-8 text-red-500">
                    &times; Unauthorized
                </div>    
            }
        </div>
    )
}