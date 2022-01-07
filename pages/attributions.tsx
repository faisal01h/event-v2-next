import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsChevronLeft } from 'react-icons/bs'
import { GiScales } from 'react-icons/gi'
import AOS from 'aos';
import "aos/dist/aos.css";

export default function Attributions() {

    const router = useRouter();

    useEffect(() => {
        AOS.init({
            easing: "ease-in-out-cubic",
            duration: 300
        })
    }, [])

    return (
        <div className="px-8 lg:px-20 py-10 bg-gray-200 min-h-screen">
            <Head>
                <title>Pecundang Attributions</title>
            </Head>
            <div className="mb-5">
                <button onClick={_e=>router.back()} className="flex items-center"><BsChevronLeft className="mr-2" />Back</button>
            </div>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-0" data-aos="slide-up">
                    <div>
                        <h1 className="text-6xl font-semibold">Attributions</h1>
                    </div>
                    <div className="flex flex-col space-y-3 mt-6 lg:mt-8">
                        <div>
                            <h2 className="font-semibold">Vercel</h2>
                            <p>
                                I thank Vercel for providing us with a wonderful React SSR framework like Next.js. Be sure to check them out at{" "}
                                <a className="font-medium" href="https://vercel.com">vercel.com</a> and <a className="font-medium" href="https://nextjs.org/">NextJS.org</a>!
                            </p>
                        </div>
                        <div>
                            <h2 className="font-semibold">OpenWeatherMap</h2>
                            <p>
                                All weather data provided on this website is provided by OpenWeatherMap API. You can also use them at{" "}
                                <a className="font-medium" href="https://openweathermap.org">openweathermap.org</a>.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-semibold">Google</h2>
                            <p>
                                Google has provided the authentication API for this project through Firebase Auth. 
                                Check out Firebase at <a className="font-medium" href="https://firebase.google.com">firebase.google.com</a>.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-semibold">Facebook</h2>
                            <p>
                                React. Nuff said.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-semibold">TailwindCSS</h2>
                            <p>
                                CSS is hard.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-0" data-aos="slide-up">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-6xl font-semibold">License</h1>
                        <div>
                            <div className="flex flex-row gap-1 items-baseline"><GiScales /> MIT</div>
                        </div>
                        <div>
                            <pre className="whitespace-pre-wrap">
                            Copyright © 2021 Faisal Hanif
                            {"\n\n"}
                            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                            {"\n\n"}
                            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                            {"\n\n"}
                            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}