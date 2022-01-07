import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { BsChevronLeft } from "react-icons/bs";
import UserDrop from "../../components/userDrop";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore, storage } from "../../firebase/init";
import { ref, uploadBytes } from "firebase/storage";
import AOS from 'aos';
import "aos/dist/aos.css";

export default function CreateEvent() {

    const router = useRouter();
    const { user } = useAuth();
    const [ bgColor, setBgColor ] = useState<any>();
    const [ eventName, setEventName ] = useState<string>('');
    const [ eventDate, setEventDate ] = useState<any>();
    const [ eventLocationString, setEventLocationString ] = useState<string>('');
    const [ eventLat, setEventLat ] = useState<string>('');
    const [ eventLon, setEventLon ] = useState<string>('');
    const [ eventId, setEventId ] = useState<string>('');
    const [ image, setImage ] = useState<any>();
    // const [ imageUrl, setImageUrl ] = useState<string>();
    const [ uploadStage, setUploadStage ] = useState<Number>(0);

    useEffect(() => {
        AOS.init({
            easing: "ease-in-out-cubic",
            duration: 300
        })
    }, [])

    function validateInput(): boolean {
        if(user != null && eventId.length > 1 && bgColor && eventName.length > 2 && eventDate && eventLocationString.length > 2 && eventLat.length > 1 && eventLon.length > 1) {
            return true
        }
        return false
    }

    function submitEvent() {
        if(validateInput() !== true) return;
        const imageName = `${new Date().getTime()}_${image?.name}`
        const colRef = collection(firestore, "ny-events")
        const storeRef = ref(storage, `ny-events/${eventId.toUpperCase()}/${imageName}`)
        setUploadStage(1);
        
        addDoc(colRef, {
            eid: eventId.toUpperCase(),
            name: eventName,
            date: eventDate,
            location: {
                data: [eventLat, eventLon],
                string: eventLocationString
            },
            bgImg : imageName,
            bgImgThemeColor: bgColor,
            members: [user?.uid],
            review: [],
            added_by: user?.uid
        }).then((e) => {
            uploadBytes(storeRef, image)
            .then((f) => {
                setUploadStage(2);
                router.push("/plans")
            })
        })


    }

    return (
        <div className="px-8 lg:px-20 py-10 bg-gray-200 min-h-screen">
            <Head>
                <title>Buat Acara Pecundang</title>
            </Head>
            <div className="mb-5 flex justify-between">
                <button onClick={_e=>router.back()} className="flex items-center z-10 text-black"><BsChevronLeft className="mr-2" />Back</button>
                {user !== null ? 
                <div className="absolute right-0 lg:right-20 lg:-mx-8 z-50">
                    <UserDrop user={user} faceColorClass="text-black" />
                </div> : false}
            </div>
            <div className="">
                <h1 className="font-bold text-6xl">Create Event</h1>
            </div>
            <div className="mt-10 flex flex-col gap-3" data-aos="fade-up">
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eid" className="basis-1/12">Event ID</label>
                    <input type="text" name="eid" id="eid" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" onChange={(e)=>setEventId(e.currentTarget.value)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="ename" className="basis-1/12">Event name</label>
                    <input type="text" name="ename" id="ename" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" onChange={(e)=>setEventName(e.currentTarget.value)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="edate" className="basis-1/12">Date</label>
                    <input type="date" name="edate" id="edate" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" onChange={(e)=>setEventDate(e.currentTarget.valueAsDate)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eloc-str" className="basis-1/12">Event location</label>
                    <input type="text" name="eloc-str" id="eloc-str" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" onChange={(e)=>setEventLocationString(e.currentTarget.value)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eloc-coord-ns" className="basis-1/12">Latitude</label>
                    <input type="text" name="eloc-coord-ns" id="eloc-coord-ns" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" onChange={(e)=>setEventLat(e.currentTarget.value)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eloc-coord-ew" className="basis-1/12">Longitude</label>
                    <input type="text" name="eloc-coord-ew" id="eloc-coord-ns" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" onChange={(e)=>setEventLon(e.currentTarget.value)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eimg" className="basis-1/12">Image</label>
                    <input type="file" name="eimg" id="eimg" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" multiple={false} accept="image/jpg, image/jpeg" onChange={(e)=>setImage(e.currentTarget.files?e.currentTarget.files[0]:undefined)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eimg" className="basis-1/12">Theme color</label>
                    <input type="color" name="ecolor" id="ecolor" className="w-12 h-6 rounded-full border-0 cursor-pointer px-1 py-1" style={{backgroundColor: `${bgColor}`}} onChange={(e)=>setBgColor(e.currentTarget.value)} />
                </div>
            </div>
            <div className="flex mt-10">
                {
                    uploadStage === 0 ?
                    <button className="acrylic px-3 py-1 rounded hover:shadow hover:bg-green-300" onClick={submitEvent}>Save</button>
                    : uploadStage === 1 ?
                    <button className="acrylic px-3 py-1 rounded hover:shadow hover:bg-green-300">Uploading...</button>
                    : <button className="px-3 py-1 rounded hover:shadow bg-green-300">Event added</button>
                }
            </div>
        </div>
    )
}