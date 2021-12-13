import Head from "next/head";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import UserDrop from "../../components/userDrop";
import { useAuth } from "../../contexts/AuthContext";
import PecundangPlanKit from "../../utils/PecundangPlanKit";
import PlanCard from "../../components/PlanCard";

export default function All() {

    let { user } = useAuth()
    let router = useRouter()
    const Plans = new PecundangPlanKit()

    return (
        <div className="px-8 lg:px-20 py-10 bg-gray-200 min-h-screen">
            <Head>
                <title>Semua Acara</title>
            </Head>
            <div className="mb-5 flex justify-between">
                <button onClick={_e=>router.back()} className="flex items-center"><BsChevronLeft className="mr-2" />Back</button>
                {user !== null ? 
                <div className="absolute right-0 lg:right-20 lg:-mx-8">
                    <UserDrop user={user} faceColorClass="text-black" />
                </div> : false}
            </div>
            <div>
                <h1 className="text-6xl font-bold"><span className="font-thin">All</span> Plans</h1>
            </div>
            {
                user !== null ?
                <div className="flex flex-col gap-5 mt-6 lg:mt-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl uppercase">Wacana</h2>
                        <div className="flex flex-row gap-3 overflow-x-auto pt-1 pb-3">
                            {
                                Plans.plans.map((e, i) => {
                                    if(e.datetime.getTime() == 0 || e.datetime > new Date()) {
                                        return (
                                            <PlanCard key={i} pecundangInstance={Plans} data={e} additionalClass="lg:min-w-[40%]" />
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl uppercase">Selesai</h2>
                        <div className="flex flex-row gap-3 overflow-x-auto pt-1 pb-3">
                            {
                                Plans.plans.map((e, i) => {
                                    if(e.datetime.getTime() != 0 && e.datetime < new Date()) {
                                        return (
                                            <PlanCard key={i} pecundangInstance={Plans} data={e} additionalClass="lg:min-w-[40%]" />
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                : false
            }
        </div>
    )
}