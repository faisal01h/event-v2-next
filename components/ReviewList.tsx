import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react";
import { BsXCircle } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase/init"
import { month, twoDigits } from "../utils/Functions"
import { ReviewFormat } from "../utils/Types"

export default function ReviewList(props: {eventId: string, reload: boolean}) {
    let { user } = useAuth()
    const [ reviews, setReviews ] = useState<Array<ReviewFormat>>([]);
    function getReview() {
        
        const collRef = collection(firestore, "ny-events/review", props.eventId)
        //const docRef = doc(firestore, "reviews", thisEvent?thisEvent.id:"")
        let rev: Array<ReviewFormat> = [] //
        onSnapshot(collRef, (e) => {
            console.log(e.docs.map((doc) => {
                let data = doc.data()
                if(data) {
                    
                    rev.push({
                        id: data.id,
                        author: data.author,
                        text: data.text,
                        created_at: data.created_at
                    })
                    
                    
                    // console.log(rev.length)
                }
                
            }))
            setReviews(rev)
        })
        
        
    }

    function deleteReview(reviewObject : ReviewFormat) {
        const docRef = doc(firestore, "reviews", props.eventId, reviewObject.id)
        deleteDoc(docRef)
    }

    useEffect(() => {
        getReview()
        return setReviews([])
    }, [props.eventId, props.reload])

    return (
        <div className="flex flex-col gap-3 lg:mt-3 lg:w-full">
            
            {
                reviews.length > 0 ? reviews.map((e, i) => {
                    const date = new Date(e.created_at)
                    return (
                        <div key={i} className="acrylic px-3 py-2 flex flex-col gap-0 rounded-lg">
                            {
                                user ?
                                <div className="absolute right-3 self-center text-red-500 cursor-pointer" onClick={()=>{deleteReview(e)}}>
                                    <BsXCircle />
                                </div>:false
                            }
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                                <h3 className="font-semibold">{e.author}</h3>
                            </div>
                            <div className="ml-7">
                                <div>
                                    <p>{e.text}</p>
                                </div>
                                <span className="text-xs">
                                    {`${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()} pukul ${date.getHours()}:${twoDigits(date, 'minutes')}`}
                                </span>
                            </div>
                        </div>
                    )
                }) : 
                <div className="self-center items-center">
                    <p>Tidak ada review</p>
                </div>
            }
        </div>
    )
}