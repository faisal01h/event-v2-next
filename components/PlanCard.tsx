import PecundangPlanKit, { IPlan2 } from "../utils/PecundangPlanKit";
import { getStNdRdTh, month } from "../utils/Functions";
import MembersLoop from "./membersLoop";
import { useRouter } from "next/router";

export default function PlanCard(props: {data: IPlan2, pecundangInstance: PecundangPlanKit, additionalClass?: string, bgSize? : string}) {

    let router = useRouter()

    let bgsize = props.bgSize ? props.bgSize : '100%';
    let date = new Date(props.data.date.seconds*1000)
    
    return(
        
        <div className={"px-5 py-3 select-none shadow rounded-lg flex flex-col gap-1 cursor-pointer min-h-[125px] "+props.additionalClass} style={{background: `linear-gradient(to right, ${props.data.bgImgThemeColor}, rgba(0,0,0,0)), url('${props.data.bgImg}') no-repeat center`, backgroundSize: bgsize}} onClick={_e=>router.push("/plans/"+props.data.id)}>
            <h3 className="text-3xl font-medium tracking-wide">{props.data.name}</h3>
            {
                props.data.date.seconds != 0 ?
                <p>{month[date.getMonth()? date.getMonth():0]} {date.getDate()}{getStNdRdTh(date.getDate())} {date.getFullYear()} at {props.data.location.string}</p>
                // : <a href={"https://www.google.com/maps/place/"+props.data.location.data} target={"_blank"} rel="noreferrer">{props.data.location.string}</a>
                : <p>{props.data.location.string}</p>
            }
            {/* <MembersLoop pecundangInstance={props.pecundangInstance} pecundangEventId={props.data.id} interval={1000} innerClass="w-56" outerClass="w-64 h-11" /> */}
        </div>
        
    )
}