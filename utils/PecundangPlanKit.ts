export interface EventMembers {
    id: number,
    name: string,
}

type LocationData = {
    data: Array<string>,
    string: string
}

export interface IPlan {
    id: string,
    name: string,
    bgImg: string,
    bgImgThemeColor: string,
    location: LocationData,
    datetime: Date,
    members: Array<Number>
}

export default class PecundangPlanKit {

    members = [
        {
            id: 12158,
            name: 'Ernia Dwi Anjani',
        },
        {
            id: 12160,
            name: 'Faisal Hanif',
        },
        {
            id: 12164,
            name: 'Muhammad Fahrizal'
        },
        {
            id: 12167,
            name: 'Nyalita Wulandari'
        }
    ]
    
    plans: Array<IPlan> = [
        {
            id: 'P002',
            name: 'Lumajang',
            bgImg: 'lumajang2_cover2.jpg',
            bgImgThemeColor: 'a9b593',
            location: {
                data: ["-8.230067", "112.920134"],
                string: "Pronojiwo"
            },
            datetime: new Date('2021-11-06 05:00:00'),
            members: [
                12158, 12160, 12164, 12167
            ]
        },
        {
            id: 'P003',
            name: 'Jogja',
            bgImg: 'jogjax_cover.jpg',
            bgImgThemeColor: '89a5c9',
            location: {
                data: ["-7.796687", "110.369152"],
                string: 'Yogyakarta'
            },
            datetime: new Date('2022-01-03 14:00:00'),
            members: [
                12158, 12160, 12164, 12167
            ],
        },
        {
            id: 'W001',
            name: 'Lumajang Part 2',
            bgImg: 'lumajang_cover.jpg',
            bgImgThemeColor: 'a9b593',
            location: {
                data: ["-8.230067", "112.920134"],
                string: "Lumajang"
            },
            datetime: new Date(0),
            members: [
                12158, 12160, 12164, 12167
            ],
        }
    ]
    
    getCurrent(now? : Date) {
        if(!now) now = new Date();
        let i : number = 0;
        let targetIdx: number = -1;
        let targetIdxLock : boolean = false;
        this.plans.forEach((e) => {
            if(now && new Date(e.datetime.getTime()+1000000000) > now && targetIdxLock === false) {
                targetIdx = i;
                targetIdxLock = true;
            }
            i++;
        })

        return this.plans[targetIdx];
    }

    getEventMembers(eventid: string | any) : Array<EventMembers> {

        let i = this.plans.findIndex(e=>e.id === eventid);

        let result: Array<EventMembers> = [];
        
        for(let j:number = 0; j < this.plans[i].members.length; ++j ) {
            for(let k:number = 0; k < this.members.length; ++k) {
                if(this.plans[i].members[j] === this.members[k].id) {
                    result.push(this.members[k])
                }
            }
        }

        return result;
    }

    getEvent(eventid: string | any): IPlan | undefined {
        for(let i = 0; i < this.plans.length; i++) {
            if(this.plans[i].id === eventid) return this.plans[i];
        };
        // return {
        //     id: '',
        //     name: '',
        //     bgImg: '',
        //     bgImgThemeColor: '',
        //     location: {data:[], string:''},
        //     datetime: new Date(),
        //     members: []
        // }
    }
}