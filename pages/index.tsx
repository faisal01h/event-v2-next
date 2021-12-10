import type { NextPage } from 'next'
import Head from 'next/head'
import PecundangPlanKit from '../utils/PecundangPlanKit'
import TextLoop from 'react-text-loop'
import React from 'react'
import MembersLoop from '../components/membersLoop'
import axios from 'axios'
import ReactLoading from 'react-loading'
import Footer from '../components/footer'
import { WeatherData } from '../utils/Types'
import { useAuth } from '../contexts/AuthContext'
import UserDrop from '../components/userDrop'
import { twoDigits, getStNdRdTh, month } from '../utils/Functions'

const Home: NextPage = () => {

  const Pecundang = new PecundangPlanKit();
  
  const [ date, setDate ] = React.useState(Pecundang.getCurrent()?.datetime);
  const [ destination, setDestination ] = React.useState(Pecundang.getCurrent()?.name);
  const [ timeLeft, setTimeLeft ] = React.useState(['', '']);
  const [ weather, setWeather ] = React.useState<WeatherData>();

  const { user } = useAuth();
  //const [ initializingAuth, user ] = useAuthState(getAuth())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(Pecundang.getCurrent()?.datetime);
      setDestination(Pecundang.getCurrent()?.name);
      initialize();
    }, 10000) // every 10 secs

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    initialize();
  }, [])

  function initialize() {
    let td = getTimeDistance(new Date().getTime(), date?date.getTime():0);
    setTimeLeft([td.distance, td.unit]);

    getWeatherInfo(Pecundang.getCurrent()?.location.data);
  }

  function getWeatherInfo(location: any) {
    console.log('[FETCH]', new Date().getTime(), 'Refreshing weather data...');
    const host: string = "https://api.openweathermap.org/data/2.5/";
    const key = process.env.NEXT_PUBLIC_OWM_API_KEY;

    const locParam = typeof location === 'string' ? "q="+location : "lat="+location[0]+"&lon="+location[1];

    axios.get(`${host}weather/?${locParam}&appId=${key}`) // GET Current data
    .then(e => {
      axios.get(`${host}forecast/?${locParam}&appId=${key}`) // GET Forecast data
      .then(el => {
        console.log('[OK]', 'Weather data refreshed!')
        //console.log(e, el)
        setWeather({
          current: e.data,
          forecast: el.data
        })
      })
      .catch(console.error)
    })
    .catch(console.error)
  }

  function getTimeDistance(now: number, target: number): {unit:string, distance:string} {
    let unit, distance;
    let byHour = Math.ceil((target-now)/1000/60/60)

    if(byHour > 0) {
        if(byHour > 24) {
            unit = 'days'
            distance = Math.ceil((target-now)/1000/60/60/24)
        } else if(byHour < 24 && byHour >= 2) {
            unit = 'hours'
            distance = byHour
        } else {
            unit = 'minutes'
            distance = Math.ceil((target-now)/1000/60)
        }
        return {
            distance: distance.toString(),
            unit: unit
        }
    } else return {
      unit: '',
      distance: ''
    }
  }

  return (
    <div style={{background: '#'+Pecundang.getCurrent().bgImgThemeColor}}>
      <Head>
        <title>Pecundang</title>
        <meta name="description" content="Events by Faisal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute top-0 h-screen w-screen z-0 bg-no-repeat bg-cover" style={{background: `url('/media/images/${Pecundang.getCurrent()?.bgImg}') center`}}>
      </div>

      <div className="absolute top-7 w-screen">
        <UserDrop user={user} greetings={true} faceColorClass="text-white" />
      </div>

      <div className="flex flex-col mx-8 lg:mx-20 justify-center min-h-screen z-10 text-white space-y-5">
        <h1 className="text-5xl lg:text-7xl font-bold text-white z-10">Pecundang {" "}
          <TextLoop interval={[1000, 0]}>
            <span>goes to</span>
            <span>{destination}</span>
          </TextLoop>
        </h1>
        <span className="z-10">
          {
            parseInt(timeLeft[0]) > -1 ?
            <div>
              Coming soon {" "}
              <TextLoop interval={5000}>
                <span>{"in " + timeLeft[0] + " " + timeLeft[1]}</span>
                <span>{"at " + month[date?.getMonth()?date.getMonth():0] + " " + date?.getDate() +getStNdRdTh(date?.getDate())}</span>
              </TextLoop> 
            </div>: 
            <div> {month[date?.getMonth()?date.getMonth():0] + " " + date?.getDate() +getStNdRdTh(date?.getDate()) + " " + date?.getFullYear()} </div>
          }
        </span>

        <div className="absolute bottom-3 flex flex-row">
          <div className="mr-3">
            <h3 className="font-semibold">Dihadiri oleh</h3>
            <MembersLoop interval={1500} pecundangInstance={Pecundang} pecundangEventId={Pecundang.getCurrent().id} innerClass="w-56" outerClass="w-64 h-11" />
          </div>
        </div>
      </div> 
      <div className={`px-8 lg:px-20 py-12`}>
        <div>
            <h3 className="font-semibold">Informasi cuaca di {Pecundang.getCurrent()?.location.string}</h3>
            <div className="rounded-lg acrylic px-3 py-2 mt-3">
              Cuaca saat ini
              {
                weather?.hasOwnProperty('current')?
                <div className="flex items-center flex-row px-3 select-none">
                  <img src={"https://openweathermap.org/img/wn/"+weather.current.weather[0].icon+"@4x.png"} width="100"  alt="weather icon" />
                  <div>
                    <div className="mr-3 font-semibold text-2xl">
                      {(weather.current.main.temp-272.15).toFixed(0)}&deg;C
                    </div>
                    <div>
                      {weather.current.weather[0].main}
                    </div>
                  </div>
                </div>
                :
                <div className="mx-5 my-3">
                  <ReactLoading type='bubbles' color='#000' />
                </div>
              }
            </div>
            <div className="rounded-lg acrylic px-3 py-2 mt-3">
              Prakiraan cuaca
              {
                weather?.hasOwnProperty('current')?
                <div className="flex items-baseline">
                  <div className="flex flex-row space-x-3 overflow-x-auto pl-5">
                    {weather.forecast.list.map((e:any) => {
                      let wfDate = new Date(e.dt_txt)
                      
                      return (
                        <div key={e.dt} className="flex flex-col acrylic my-5 p-3 rounded-lg select-none">
                          
                          <img src={"https://openweathermap.org/img/wn/"+e.weather[0].icon+"@4x.png"} width="100" className="self-center" alt="weather icon" />
                          
                          <span className="font-bold text-2xl">{(e.main.temp-272.15).toFixed(0)}&deg;C</span>
                          <span className="mb-3">{e.weather[0].main}</span>

                          <span className="w-full text-sm">{twoDigits(wfDate, 'hours')}:{twoDigits(wfDate, 'minutes')}</span>
                          <span className="w-36 text-sm uppercase font-black text-gray-400">{wfDate.getDate()} {month[wfDate.getMonth()].slice(0, 3)} {wfDate.getFullYear()}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                : 
                <div className="mx-5 my-3">
                  <ReactLoading type='bubbles' color='#000' />
                </div>
              }
            </div>
          </div>
      </div>
      <Footer color={''} bgColor={Pecundang.getCurrent().bgImgThemeColor}/>
    </div>
  )
}

export default Home
