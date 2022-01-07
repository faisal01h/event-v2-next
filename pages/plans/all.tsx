import Head from "next/head";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit, { IPlan2 } from "../../utils/PecundangPlanKit";
import PlanCard from "../../components/PlanCard";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { firestore, storage } from "../../firebase/init";
import { getDownloadURL, ref } from "firebase/storage";

export default function All() {

    let { user } = useAuth()
    let router = useRouter()
    const Plans = new PecundangPlanKit()
    const [ plans, setPlans ] = useState<Array<IPlan2>>([]);
    const [ wacana, setWacana ] = useState<Array<IPlan2>>([]);
    const [ selesai, setSelesai ] = useState<Array<IPlan2>>([]);
    const [ loadStage, setLoadStage ] = useState<Number>(0);

    function getPlans() {
        const colRef = collection(firestore, "ny-events")
        let data: Array<IPlan2>  = []
        setLoadStage(0);

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
            setLoadStage(1);
        })
        .catch(console.error)
    }

    useEffect(() => {
        getPlans()
        
    }, [])
    useEffect(() => {
        if(plans.length > 0) {
            plans.forEach((e, i) => {
                if(e.date.seconds == 0 || new Date(e.date.seconds*1000) > new Date()) {
                    setWacana(wacana.concat([e]))
                } else if(e.date.seconds != 0 && new Date(e.date.seconds*1000) < new Date()) {
                    setSelesai(selesai.concat([e]))
                }
            })
        }
    }, [plans])

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
                <div className="flex flex-col gap-5 mt-6 lg:mt-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl uppercase">Wacana</h2>
                        <div className="flex flex-row gap-3 overflow-x-auto pt-1 pb-3">
                            {
                                wacana.length > 0 ? wacana.map((e, i) => {
                                    
                                    return (
                                        <PlanCard key={i} pecundangInstance={Plans} data={e} additionalClass="min-w-[95%] lg:min-w-[40%]" />
                                    )
                                    
                                }) : loadStage === 0 ? "Loading" : "Tidak ada wacana."
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl uppercase">Selesai</h2>
                        <div className="flex flex-row gap-3 overflow-x-auto pt-1 pb-3">
                            {
                                selesai.length > 0 ? selesai.map((e, i) => {
                                    
                                        return (
                                            <PlanCard key={i} pecundangInstance={Plans} data={e} additionalClass="min-w-[95%] lg:min-w-[40%]" />
                                        )
                                    
                                }) : loadStage === 0 ? "Loading" : "Tidak ada event selesai."
                            }
                        </div>
                    </div>
                </div>
                : false
            }
        </div>
    )
}