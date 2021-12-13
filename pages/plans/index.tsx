import Head from "next/head";
import { useRouter } from "next/router";
import { BsCalendar2Event, BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit from "../../utils/PecundangPlanKit";
import { getStNdRdTh, month, twoDigits } from "../../utils/Functions";
import axios from "axios";
import PlanCard from "../../components/PlanCard";
import Link from "next/link";

export default function Plans() {

    const router = useRouter();
    const { user } = useAuth();
    const Plans = new PecundangPlanKit();

    const current = Plans.getCurrent();
    const cdt = current.datetime;

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
                <div className="flex flex-col gap-3 mt-6 lg:mt-8">
                    <div className="h-96 relative">
                        
                        <div className="">
                            <h2 className="text-xl lg:text-2xl font-thin uppercase">Wacana</h2>
                            {
                                <div className="flex flex-col gap-2 h-80 justify-between">
                                    <div>
                                        <h3 className="text-4xl lg:text-9xl font-medium tracking-wide uppercase">{Plans.getCurrent()?.name}</h3>
                                        <p> 
                                            {month[cdt?.getMonth()? cdt?.getMonth():0]} {current.datetime.getDate()}{getStNdRdTh(current.datetime.getDate())}{" "}
                                            {current.datetime.getFullYear()} at <a href={"https://www.google.com/maps/place/"+Plans.getCurrent().location.data} target={"_blank"} rel="noreferrer">{Plans.getCurrent().location.string}</a>
                                        </p>
                                    </div>
                                    {
                                        cdt.getTime() != 0 ?
                                        <div>
                                            <button 
                                            className="px-3 py-1 flex flex-row gap-1 items-center acrylic rounded-lg text-sm" 
                                            onClick={() => {
                                                window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${current.name}&dates=${current.datetime.getFullYear()}${twoDigits(current.datetime, 'month')}${twoDigits(current.datetime, 'date')}/${current.datetime.getFullYear()}${twoDigits(current.datetime, 'month')}${twoDigits(current.datetime, 'date')}&details=Hari%20H&location=${current.location.string}&trp=true`, '_blank')
                                            }}>
                                                <BsCalendar2Event /> Ingatkan saya
                                            </button>
                                        </div> : false
                                    }
                                </div>
                            }
                            {/*<div className="absolute z-0 -mx-8 lg:-mx-20 h-48 w-screen" style={{background: `linear-gradient(to bottom, rgb(229,231,235), #00000000 , #00000000, rgb(229,231,235)), url(/media/images/${Plans.getCurrent().bgImg}), no-repeat center`}}></div>*/}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl lg:text-2xl font-thin uppercase">Realisasi</h2>
                            <Link href="/plans/all">
                                <a className="px-3 py-1 acrylic rounded-lg flex flex-row gap-1 w-fit items-center text-sm">Lihat semua acara <BsChevronRight /></a>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3 mt-3">
                        {
                            Plans.plans.map((e, index) => {
                                if(Plans.plans[index].datetime < new Date() && Plans.plans[index].datetime.getTime() != 0) {
                                    return (
                                        <PlanCard key={e.id} data={e} pecundangInstance={Plans} additionalClass="mx-0 min-w-[50%]" bgSize="cover" />
                                    )
                                }
                            })
                        }
                        </div>
                    </div>
                    <div className="mt-5">
                        
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