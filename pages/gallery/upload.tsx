import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { BsChevronLeft } from "react-icons/bs";
import UserDrop from "../../components/userDrop";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore, storage } from "../../firebase/init";
import { ref, uploadBytesResumable } from "firebase/storage";
import AOS from 'aos';
import "aos/dist/aos.css";

export default function UploadToGallery() {
    const { user } = useAuth();
    const router = useRouter();

    const [ eventId, setEventId ] = useState<string>('');
    const [ image, setImage ] = useState<any>();

    useEffect(() => {
        AOS.init({
            easing: "ease-in-out-cubic",
            duration: 300
        })
    }, [])

    function validateInput(): boolean {
        if(user != null && eventId.length > 1 && image) {
            return true;
        } else return false;
    }
    
    function handleUploadImages() {
        if(validateInput() === false) return;
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
                <h1 className="font-bold text-6xl">Upload Memories</h1>
            </div>
            <div className="mt-10 flex flex-col gap-3" data-aos="fade-up">
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eid" className="basis-1/12">Event ID</label>
                    <input type="text" name="eid" id="eid" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" onChange={(e)=>setEventId(e.currentTarget.value)} />
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-5 lg:items-center">
                    <label htmlFor="eimg" className="basis-1/12">Images</label>
                    <input type="file" name="eimg" id="eimg" className="basis-3/6 lg:basis-1/6 px-2 py-1 rounded" multiple={true} accept="image/jpg, image/jpeg, image/raw, image/dng" onChange={(e)=>setImage(e.currentTarget.files?e.currentTarget.files:undefined)} />
                </div>
            </div>
        </div>
    )
}