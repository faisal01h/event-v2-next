import PecundangPlanKit, { IPlan } from "../utils/PecundangPlanKit";
import { getStNdRdTh, month } from "../utils/Functions";
import MembersLoop from "./membersLoop";
import { useRouter } from "next/router";

export default function PlanCard(props: {data: IPlan, pecundangInstance: PecundangPlanKit, additionalClass?: string, bgSize? : string}) {

    let router = useRouter()

    let bgsize = props.bgSize ? props.bgSize : '100%';

    return(
        
        <div className={"px-5 py-3 select-none shadow rounded-lg flex flex-col gap-1 cursor-pointer "+props.additionalClass} style={{background: `linear-gradient(to right, #${props.data.bgImgThemeColor}, rgba(0,0,0,0)), url(/media/images/${props.data.bgImg}) no-repeat center`, backgroundSize: bgsize}} onClick={_e=>router.push("/plans/"+props.data.id)}>
            <h3 className="text-3xl font-medium tracking-wide">{props.data.name}</h3>
            {
                props.data.datetime.getTime() != 0 ?
                <p>{month[props.data.datetime.getMonth()? props.data.datetime.getMonth():0]} {props.data.datetime.getDate()}{getStNdRdTh(props.data.datetime.getDate())} {props.data.datetime.getFullYear()} at <a href={"https://www.google.com/maps/place/"+props.data.location.data} target={"_blank"} rel="noreferrer">{props.data.location.string}</a></p>
                : <a href={"https://www.google.com/maps/place/"+props.data.location.data} target={"_blank"} rel="noreferrer">{props.data.location.string}</a>
            }
            <MembersLoop pecundangInstance={props.pecundangInstance} pecundangEventId={props.data.id} interval={1000} innerClass="w-56" outerClass="w-64 h-11" />
        </div>
        
    )
}