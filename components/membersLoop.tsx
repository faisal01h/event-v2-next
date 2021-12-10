import React from "react";
import PecundangPlanKit, { EventMembers } from "../utils/PecundangPlanKit";
import TextLoop from "react-text-loop";

export default function MembersLoop(props: {pecundangInstance: PecundangPlanKit, pecundangEventId: string, interval: number, outerClass?: string, innerClass?: string}) {

    return (
        <div className={"px-3 py-2 acrylic rounded-lg "+props.outerClass}>
            <TextLoop interval={props.interval}>
            {
              props.pecundangInstance.getEventMembers(props.pecundangEventId).map((e) => {
                return (
                  <div key={e.id} className={"flex flex-row flex-nowrap justify-between items-center "+props.innerClass}>
                    <div className="flex flex-row flex-nowrap items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-cover" style={{backgroundImage: `url('/media/images/pp/${e.id}.jpg')`}}></div>
                      <span>{e.name}</span> 
                    </div>
                    <span className="text-gray-400 hidden">{e.id}</span>
                  </div>
                )
              })
            }
            </TextLoop>
        </div>
    )
}