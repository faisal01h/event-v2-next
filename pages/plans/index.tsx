import Head from "next/head";
import { useRouter } from "next/router";
import { BsCalendar2Event, BsChevronLeft, BsChevronRight, BsPlusCircle } from 'react-icons/bs'
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit, { IPlan2 } from "../../utils/PecundangPlanKit";
import { getStNdRdTh, month, twoDigits } from "../../utils/Functions";
import axios from "axios";
import PlanCard from "../../components/PlanCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { firestore, storage } from "../../firebase/init";

export default function Plans() {

    const router = useRouter();
    const { user } = useAuth();
    const Plans = new PecundangPlanKit();
    const [ plans, setPlans ] = useState<Array<IPlan2>>([]);
    const [ current, setCurrent ] = useState<IPlan2>();

    // const current = Plans.getCurrent();
    // const cdt = current.datetime.getTime();

    function getPlans() {
        const colRef = collection(firestore, "ny-events")
        let data: Array<IPlan2>  = []

        getDocs(query(colRef))
        .then((e) => {
            
            e.docs.forEach((el) => {
                getDownloadURL(ref(storage, `ny-events/${el.data().eid}/${el.data().bgImg}`))
                .then((f) => {
                    let temp = {
                        id: el.id,
                        eid: el.data().eid,
                        bgImg: f.toString(),
                        bgImgThemeColor: el.data().bgImgThemeColor,
                        date: el.data().date,
                        location: el.data().location,
                        members: el.data().members,
                        name: el.data().name,
                        review: el.data().review,
                        added_by: el.data().added_by
                    }
                    data.push(temp)
                    setPlans(data)
                    // setPlans(plans.concat([temp]))

                }).catch(console.error)
                
            })
            
            
            
        })
        .then((_e) => {
            // setPlans(data)
            // console.log(plans, `len: ${plans.length}`)
        })
        .catch(console.error)
    }

    function getCurrent(plans: Array<IPlan2>, now? : Date) {
        if(!now) now = new Date();
        let i : number = 0;
        let targetIdx: number = -1;
        let targetIdxLock : boolean = false;
        plans.forEach((e) => {
            if(now && new Date((e.date.seconds*1000)+1000000000) > now && targetIdxLock === false) {
                targetIdx = i;
                targetIdxLock = true;
            }
            i++;
        })

        return plans[targetIdx];
    }

    function getGPlaceLocationData(query: string) {
        axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+query+'&key='+process.env.NEXT_PUBLIC_G_API_KEY)
        .then(e => {
            console.log(e)
        })
        .catch(console.error)
    }

    useEffect(() => {
        getPlans();
    }, [])

    useEffect(() => {
        if(plans.length > 0) setCurrent(getCurrent(plans));
        // console.log(plans, current)
    }, [plans])

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
            <div className="flex flex-col lg:flex-row justify-between items-baseline z-0">
                <h1 className="text-6xl font-bold">Plans</h1>
                {
                    user != null && 
                    (   user.email?.includes('faisal') || 
                        user.email?.includes('ernia') || 
                        user.email?.includes('fahrizal') || 
                        user.email?.includes('ny')
                    ) ?
                    <div className="acrylic w-fit h-fit rounded-lg">
                        <Link href="/plans/create">
                            <a className="flex items-center gap-2 px-2 py-1"><BsPlusCircle /> Tambah wacana</a>
                        </Link>
                    </div> : false
                }
            </div>
            {
                user !== null ?
                <div className="flex flex-col gap-3 mt-6 lg:mt-8">
                    <div className="h-96 relative">
                        
                        {
                            current ?
                            <div className="">
                                <h2 className="text-xl lg:text-2xl font-thin uppercase">Wacana</h2>
                                {
                                    <div className="flex flex-col gap-2 h-80 justify-between">
                                        <div>
                                            <h3 className="text-4xl lg:text-9xl font-medium tracking-wide uppercase">{current?.name}</h3>
                                            <p> 
                                                {month[new Date(current?.date.seconds*1000).getMonth()? new Date(current?.date.seconds*1000).getMonth():0]} {new Date(current?.date.seconds*1000).getDate()}{getStNdRdTh(new Date(current?.date.seconds*1000).getDate())}{" "}
                                                {new Date(current?.date.seconds*1000).getFullYear()} at <a href={"https://www.google.com/maps/place/"+Plans.getCurrent().location.data} target={"_blank"} rel="noreferrer">{current?.location.string}</a>
                                            </p>
                                        </div>
                                        {
                                            current?.date.seconds != 0 ?
                                            <div>
                                                <button 
                                                className="px-3 py-1 flex flex-row gap-1 items-center acrylic rounded-lg text-sm" 
                                                onClick={() => {
                                                    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${current?.name}&dates=${new Date(current?.date.seconds*1000).getFullYear()}${twoDigits(new Date(current?.date.seconds*1000), 'month')}${twoDigits(new Date(current?.date.seconds*1000), 'date')}/${new Date(current?.date.seconds*1000).getFullYear()}${twoDigits(new Date(current?.date.seconds*1000), 'month')}${twoDigits(new Date(current?.date.seconds*1000), 'date')}&details=Hari%20H&location=${current?.location.string}&trp=true`, '_blank')
                                                }}>
                                                    <BsCalendar2Event /> Ingatkan saya
                                                </button>
                                            </div> : false
                                        }
                                    </div>
                                }
                                {/*<div className="absolute z-0 -mx-8 lg:-mx-20 h-48 w-screen" style={{background: `linear-gradient(to bottom, rgb(229,231,235), #00000000 , #00000000, rgb(229,231,235)), url(/media/images/${Plans.getCurrent().bgImg}), no-repeat center`}}></div>*/}
                            </div>
                        : "Loading..."
                        }
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
                            plans.map((e, index) => {
                                if(e.date.seconds*1000 < new Date().getTime() && e.date.seconds != 0) {
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