import Head from "next/head";
import { useRouter } from "next/router";
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit, { IPlan } from "../../utils/PecundangPlanKit";
import { getStNdRdTh, month, twoDigits } from "../../utils/Functions";
import PlanCard from "../../components/PlanCard";
import Link from "next/link";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/init";
import ReviewList from "../../components/ReviewList";

export default function Plans() {

    const [ reviewContent, setReviewContent ] = useState<string>('');
    const [ reloadComment, setReloadComment ] = useState<boolean>(false);


    const router = useRouter();
    const { user } = useAuth();
    const Plans = new PecundangPlanKit();

    let query = router.query;

    function eventIsPast(event: any): boolean {
        return event && event.datetime < new Date() && event.datetime.getTime()!=0
    }

    function handleSubmitReview() {
        if(reviewContent !== '') {
            const collRef = collection(firestore, "ny-events/review", thisEvent?thisEvent.id:"")
            const payload = {
                author: user?.uid,
                text: reviewContent,
                created_at: serverTimestamp()
            }
            addDoc(collRef, payload)
            .then(e=> {
                setReviewContent('');
                setReloadComment(!reloadComment)
            })
            .catch(console.error)
        }
    }


    let thisEvent = Plans.getEvent(query.id)
    let evtStatusClass = eventIsPast(thisEvent) ? "text-green-300 border-green-300" : "text-white border-white"
    

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
            <div className="absolute top-0 left-0 z-0 h-[70vh] w-screen filter brightness-[60%]" style={{backgroundImage: `url(/media/images/${thisEvent? thisEvent.bgImg : "gray.jpg"})`, backgroundSize: `cover`, backgroundPosition: `center`, backgroundRepeat: `no-repeat`}}></div>
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
                                    eventIsPast(thisEvent) ? "Event selesai" : "Wacana"
                                }
                            </h2>
                            {
                                <div className="flex flex-col gap-2 mt-2 lg:mt-0 text-white">
                                    <h3 className="text-4xl lg:text-9xl font-medium tracking-wide uppercase">{thisEvent?.name}</h3>
                                    <p> 
                                        {
                                            thisEvent?.datetime.getTime() != 0 ?
                                                `${month[thisEvent?.datetime.getMonth() ? thisEvent.datetime.getMonth():0]} ${thisEvent?.datetime.getDate()}${getStNdRdTh(thisEvent?.datetime.getDate())}${" "}
                                                ${thisEvent?.datetime.getFullYear()} at
                                                `
                                            : ""
                                        }
                                        <a href={"https://www.google.com/maps/place/"+thisEvent?.location.data} target={"_blank"} rel="noreferrer">{thisEvent?.location.string}</a>
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
                                Plans.plans.map((e, _index) => {
                                    if(thisEvent?.id !== e.id) {
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
                        <div>
                            <h2 className="text-xl lg:text-xl font-semibold">Review</h2>
                            <div className="flex flex-col lg:flex-row gap-3">
                                <div className="lg:sticky mt-3">
                                    <textarea value={reviewContent} name="reviewin" id="reviewin" className="min-h-[5rem] w-[100%] lg:min-h-[5rem] lg:min-w-[32rem] resize-none rounded-lg px-3 py-2 outline-none focus:shadow-lg focus:shadow-blue-500/30 hover:shadow-blue-500/40" placeholder="Tulis review..." onChange={e=>{setReviewContent(e.currentTarget.value)}} />
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
                                
                                <ReviewList eventId={thisEvent?thisEvent.id:""} reload={reloadComment} />

                                
                            </div>
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