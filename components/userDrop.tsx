import TextLoop from "react-text-loop";
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/router";
//import useDetectClickOut from '../hooks/DetectClickOut'

export default function UserDrop(props: {user: any, faceColorClass?: string, greetings?:boolean}) {

    const [ isExpanded, setIsExpanded ] = useState<boolean>(false);
    const [ cls, setCls ] = useState<string>('acrylic');

    let router = useRouter();

    let greetings = props.greetings ? props.greetings : false;

    //const { show, nodeRef, triggerRef } = useDetectClickOut(false);

    function expand() {
        setIsExpanded(!isExpanded);
        if(isExpanded === false) setCls('bg-white text-gray-800');
        else setCls('acrylic');
    }

    type RType = {
        title: string,
        route: string
    }

    const routes : Array<RType> = [
        {
            title: "Home",
            route: "/"
        },
        {
            title: "Plans",
            route: "/plans"
        },
        {
            title: "Gallery",
            route: "/gallery"
        },
    ]

    return (
        <div className="text-white flex justify-end mx-5 lg:mx-8 select-none">
            
            {props.user !== null ? 
            <div className={"px-3 py-1 items-end rounded-lg flex flex-col h-full w-fit" + cls}  onClick={_e=>expand()}>
                {/* <TextLoop interval={[500, 0]} className={"cursor-pointer "+props.faceColorClass}> */}
                    {/* {greetings ? <div className={" "+props.faceColorClass}>Selamat datang!</div> :" "} */}
                    <div className="flex flex-row flex-nowrap items-center min-w-[8rem] cursor-pointer">
                        <img src={props.user.photoURL!==null?props.user.photoURL:undefined} alt="photo" className="h-6 w-6 mr-2 rounded-full" />
                        <span className={""+props.faceColorClass}>{props.user.displayName}</span>
                    </div>
                {/* </TextLoop> */}
                
                    <div className={`py-1 px-1 my-3 gap-1 bg-white rounded-md shadow-xl min-w-[8rem] flex-col flex text-gray-800 transform transition-all ${isExpanded ? "-translate-y-0" : "-translate-y-[250px]"}`} >
                        {
                            routes.map((e,index)=> {
                                return (
                                    <Link href={e.route} key={index}>
                                        <a className="w-full hover:bg-black hover:font-semibold hover:bg-opacity-5 px-3 rounded py-1 cursor-pointer transition-all duration-300 ease-in-out">
                                            {e.title}
                                        </a>
                                    </Link>
                                )
                            })
                        }
                        <div className="border-t border-gray-200"></div>
                        <div className="w-full hover:bg-red-600/10 hover:font-semibold px-3 rounded py-1 cursor-pointer text-red-500" onClick={_e=>router.push('/')}>
                            <Link href="/logout">Logout</Link>
                        </div>
                    </div>
                    
                
            </div>:
            <div className={"acrylic px-3 py-1 rounded-lg "+props.faceColorClass}>
                <Link href="/login">Login</Link>
            </div>
            }
        </div>
    )
}
