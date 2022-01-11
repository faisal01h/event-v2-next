import Head from "next/head";
import { useRouter } from "next/router";
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit, { IPlan2 } from "../../utils/PecundangPlanKit";
import { getStNdRdTh, month, twoDigits } from "../../utils/Functions";
import PlanCard from "../../components/PlanCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, query as fquery } from "firebase/firestore";
import { firestore, storage } from "../../firebase/init";
import ReviewList from "../../components/ReviewList";
import { getDownloadURL, ref } from "firebase/storage";

export default function Plans() {

    const [ reviewContent, setReviewContent ] = useState<string>('');
    const [ reloadComment, setReloadComment ] = useState<boolean>(false);
    const [ data, setData ] = useState<IPlan2>();
    const [ plans, setPlans ] = useState<Array<IPlan2>>([]);
    const [ evtStatusClass, setEvtStatusClass ] = useState<string>("text-white border-white")


    const router = useRouter();
    const { user } = useAuth();
    const Plans = new PecundangPlanKit();

    let query = router.query;

    function getPlans() {
        const colRef = collection(firestore, "ny-events")
        let data: Array<IPlan2>  = []

        getDocs(fquery(colRef))
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

    function fetchPlan() {
        const colRef = collection(firestore, "ny-events");
        const docRef = doc(colRef, `${query.id}`)
        getDoc(docRef)
        .then((e) => {
            if(e.exists()) {
                getDownloadURL(ref(storage, `ny-events/${e.data().eid}/${e.data().bgImg}`))
                .then((f) => {
                    setData({
                        id: e.id,
                        eid: e.data().eid,
                        bgImg: f.toString(),
                        bgImgThemeColor: e.data().bgImgThemeColor,
                        date: e.data().date,
                        location: e.data().location,
                        members: e.data().members,
                        name: e.data().name,
                        review: e.data().review,
                        added_by: e.data().added_by
                    })
                    
                    return
                })
                .catch(console.error)
            } else console.error(404)
        }).catch(console.error)
    }

    function eventIsPast(event: IPlan2): boolean {
        return event && event.date.seconds*1000 < new Date().getTime() && event.date.seconds !=0
    }

    function handleSubmitReview() {
        if(reviewContent !== '') {
            const collRef = collection(firestore, "ny-events/review", data?data.id:"")
            const payload = {
                author: user?.uid,
                text: reviewContent,
                created_at: serverTimestamp()
            }
            addDoc(collRef, payload)
            .then(e=> {
                setReviewContent('');
                // setReloadComment(!reloadComment)
            })
            .catch(console.error)
        }
    }

    useEffect(() => {
        if(query.id) {
            fetchPlan()
            getPlans()
        }

        return setData(undefined);
    }, [query.id])

    useEffect(() => {
        if(data) setEvtStatusClass(data && eventIsPast(data) ? "text-green-300 border-green-300" : "text-white border-white")
    }, [data])
    
    

    return (
        <div className="px-8 lg:px-20 py-10 bg-gray-200 min-h-screen">
            <Head>
                <title>Acara Pecundang</title>
            </Head>
            <div className="mb-5 flex justify-between">
                <button onClick={_e=>router.back()} className="flex items-center z-10 text-white"><BsChevronLeft className="mr-2" />Back</button>
                {user !== null ? 
                <div className="absolute right-0 lg:right-20 lg:-mx-8 z-50">
                    <UserDrop user={user} faceColorClass="text-white" />
                </div> : false}
            </div>
            <div className="absolute top-0 left-0 z-0 h-[70vh] w-screen filter brightness-[60%]" style={{backgroundImage: `url(${data? data.bgImg : "gray.jpg"})`, backgroundSize: `cover`, backgroundPosition: `center`, backgroundRepeat: `no-repeat`}}></div>
            <div className="absolute top-0 left-0 z-0 w-screen h-[95vh]" style={{background: `linear-gradient(to bottom, transparent, transparent, rgb(156, 163, 176), rgb(229, 231, 235))`}}></div>
            <div className="relative z-10">
                <h1 className="text-6xl font-bold text-white">Event</h1>
            </div>
            {
                user !== null ?
                <div className="relative z-10">
                    <div className="flex flex-col gap-5 mt-6 lg:mt-8">
                        <div className="h-96 lg:h-[26rem]">
                            <h2 className={"text-xs lg:text-lg font-regular uppercase p-1 border w-fit "+evtStatusClass}>
                                {
                                    data && eventIsPast(data) ? "Event selesai" : "Wacana"
                                }
                            </h2>
                            {
                                <div className="flex flex-col gap-2 mt-2 lg:mt-0 text-white">
                                    <h3 className="text-4xl lg:text-9xl font-medium tracking-wide uppercase">{data?.name}</h3>
                                    <p> 
                                        {
                                            data && new Date(data.date.seconds*1000).getTime() != 0 ?
                                                `${month[data.date ? new Date(data.date.seconds*1000).getMonth():0]} ${new Date(data.date.seconds*1000).getDate()}${getStNdRdTh(new Date(data.date.seconds*1000).getDate())}${" "}
                                                ${new Date(data.date.seconds*1000).getFullYear()} at
                                                `
                                            : ""
                                        }
                                        <a href={"https://www.google.com/maps/place/"+data?.location.data} target={"_blank"} rel="noreferrer">{data?.location.string}</a>
                                    </p>
                                </div>
                            }
                        </div>
                        <div>
                            <h2 className="text-xl lg:text-xl font-semibold">Galeri</h2>
                        </div>
                        <div>
                            <h2 className="text-xl lg:text-xl font-semibold">Event lainnya</h2>
                            <div className="flex flex-row gap-3 mt-3 overflow-x-auto pt-1 pb-3 pr-3">
                            {
                                plans.map((e, _index) => {
                                    if(data?.id !== e.id) {
                                        return (
                                            <PlanCard key={e.id} data={e} pecundangInstance={Plans} additionalClass="min-w-[100%] lg:min-w-[40%]" />
                                        )
                                    }
                                })
                            }
                                <div className={"px-5 py-3 select-none shadow rounded-lg flex flex-col gap-1 cursor-pointer justify-center lg:min-w-[40%] min-w-[100%] bg-gradient-to-r from-gray-300 to-gray-100"} onClick={_e=>{router.push("/plans/all")}}>
                                    <div className="flex flex-row justify-between items-center">
                                        <h3 className="text-3xl font-medium tracking-wide">Lihat event lainnya</h3>
                                        <div className="p-3 bg-black text-white rounded-full">
                                            <BsChevronRight />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* <div>
                            <h2 className="text-xl lg:text-xl font-semibold">Review</h2>
                            <div className="flex flex-col lg:flex-row gap-3">
                                <div className="lg:sticky mt-3">
                                    <textarea disabled value={reviewContent} name="reviewin" id="reviewin" className="min-h-[5rem] w-[100%] lg:min-h-[5rem] lg:min-w-[32rem] resize-none rounded-lg px-3 py-2 outline-none focus:shadow-lg focus:shadow-blue-500/30 hover:shadow-blue-500/40" placeholder="Tulis review..." onChange={e=>{setReviewContent(e.currentTarget.value)}} />
                                    <div className="flex flex-col lg:flex-row lg:gap-3 lg:justify-between">
                                        <div>
                                            <span className="flex flex-row items-start gap-1">
                                                <img src={user.photoURL?user.photoURL:undefined} className="w-4 h-4 mt-1 rounded-full" />
                                                <span className="flex flex-row lg:flex-col items-center lg:items-start">
                                                    {user.displayName}
                                                    <div className="text-xs ml-2 lg:ml-0"><Link href={"/logout"}>Logout?</Link></div>
                                                </span>
                                                
                                            </span>
                                        </div>
                                        <button 
                                        type="submit" 
                                        className="bg-green-500 text-white rounded-lg px-3 py-1 shadow-xl hover:shadow-green-500/30" 
                                        onClick={() => {
                                            handleSubmitReview()
                                        }}>
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                                
                                <ReviewList eventId={data?data.id:""} reload={reloadComment} />

                                
                            </div>
                        </div> */}
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