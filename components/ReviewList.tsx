import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import { BsXCircle } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "../firebase/init"
import { month, twoDigits } from "../utils/Functions"
import { ReviewFormat } from "../utils/Types"
import ReactMarkdown from "react-markdown";

export default function ReviewList(props: {eventId: string, reload: boolean}) {
    let { user } = useAuth()
    const [ reviews, setReviews ] = useState<Array<ReviewFormat>>([]);
    
    function getReview() {
        
        const collRef = collection(firestore, "ny-events/review", props.eventId)
        //const q = query(collRef, orderBy("timestamp"))
        //const docRef = doc(firestore, "reviews", thisEvent?thisEvent.id:"")
        let rev: Array<ReviewFormat> = [] //
        setReviews([])
        onSnapshot(collRef, (e) => {
            
            e.docs.map((doc) => {
                let data = doc.data()
                if(data) {
                    const q = query(collection(firestore, "users"), where("uid", "==", data.author))
                    onSnapshot(q, (ex) => {
                        ex.docs.map((el) => {
                            rev.push({
                                id: doc.id,
                                author: el.data().displayName,
                                photoURL: el.data().photoURL,
                                text: data.text,
                                created_at: data.created_at
                            })
                            setReviews(reviews.concat(rev))
                            // console.log(el.data())
                        })
                        
                    })
                    
                    
                    
                    
                }
                
                
            })
            
        })
        
        
        
    }

    function deleteReview(reviewObject : ReviewFormat) {
        const docRef = doc(firestore, "ny-events/review", props.eventId, reviewObject.id)
        deleteDoc(docRef)
        .then(e=> {
            getReview()
        })
        .catch(console.error)
    }

    useEffect(() => {
        getReview()
        return setReviews([])
    }, [props.eventId, props.reload])

    return (
        <div className="flex flex-col gap-3 lg:mt-3 lg:w-full">
            
            {
                reviews.length > 0 ? reviews.map((e, i) => {
                    const date = new Date(e.created_at?.seconds*1000)
                    return (
                        <div key={i} className="acrylic px-3 py-2 flex flex-col gap-0 rounded-lg">
                            {
                                user ?
                                <div className="absolute right-3 self-center text-red-500 cursor-pointer" onClick={()=>{deleteReview(e)}}>
                                    <BsXCircle />
                                </div>:false
                            }
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-5 h-5 bg-gray-400 rounded-full">
                                    <img src={e.photoURL} alt="" className="rounded-full" />
                                </div>
                                <h3 className="font-semibold">{e.author}</h3>
                            </div>
                            <div className="ml-7">
                                <div>
                                    <ReactMarkdown>
                                        {e.text}
                                    </ReactMarkdown>
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