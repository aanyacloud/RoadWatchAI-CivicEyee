import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function UserHome() {

  const navigate = useNavigate()

  const [language, setLanguage] =
    useState('en')

  useEffect(() => {

    const savedLanguage =
      localStorage.getItem('language') ||
      'en'

    setLanguage(savedLanguage)

  }, [])

  return (

    <div className="h-screen bg-slate-950 text-white p-8 overflow-hidden">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-4xl font-bold text-cyan-400">

          {language === 'hi'
            ? 'नागरिक पोर्टल'
            : 'Citizen Portal'}

        </h1>

        <p className="text-slate-400 mt-2 text-base">

          {language === 'hi'
            ? 'शिकायत सेवाओं और सड़क निगरानी उपकरणों तक पहुँचें'
            : 'Access your complaint services and road monitoring tools'}

        </p>

      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-2 gap-6">

        {/* REPORT ISSUE */}
        <div
          onClick={() => navigate('/report')}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 cursor-pointer hover:border-green-500 hover:scale-105 transition shadow-2xl h-[250px] flex flex-col justify-between"
        >

          <div>

            <div className="text-4xl text-center mb-3">
              📸
            </div>

            <h2 className="text-2xl font-bold text-green-400 text-center">

              {language === 'hi'
                ? 'समस्या रिपोर्ट करें'
                : 'Report Issue'}

            </h2>

            <p className="text-slate-400 mt-4 text-base leading-7 text-center">

              {language === 'hi'
                ? 'गड्ढों की तस्वीरें अपलोड करें और क्षतिग्रस्त सड़कों की रिपोर्ट करें।'
                : 'Upload pothole images and report damaged roads instantly.'}

            </p>

          </div>

          <div className="flex justify-center">

            <button
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-bold"
            >

              {language === 'hi'
                ? 'खोलें'
                : 'Open'}

            </button>

          </div>

        </div>

        {/* MY COMPLAINTS */}
        <div
          onClick={() => navigate('/my-complaints')}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 cursor-pointer hover:border-cyan-500 hover:scale-105 transition shadow-2xl h-[250px] flex flex-col justify-between"
        >

          <div>

            <div className="text-4xl text-center mb-3">
              📋
            </div>

            <h2 className="text-2xl font-bold text-cyan-400 text-center">

              {language === 'hi'
                ? 'मेरी शिकायतें'
                : 'My Complaints'}

            </h2>

            <p className="text-slate-400 mt-4 text-base leading-7 text-center">

              {language === 'hi'
                ? 'शिकायत की प्रगति और लाइव स्थिति अपडेट देखें।'
                : 'Track complaint progress and view live status updates.'}

            </p>

          </div>

          <div className="flex justify-center">

            <button
              className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-2xl font-bold"
            >

              {language === 'hi'
                ? 'खोलें'
                : 'Open'}

            </button>

          </div>

        </div>

        {/* LIVE ROAD MAP */}
        <div
          onClick={() => navigate('/road-map')}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 cursor-pointer hover:border-yellow-500 hover:scale-105 transition shadow-2xl h-[250px] flex flex-col justify-between"
        >

          <div>

            <div className="text-4xl text-center mb-3">
              🗺️
            </div>

            <h2 className="text-2xl font-bold text-yellow-400 text-center">

              {language === 'hi'
                ? 'सड़क मानचित्र'
                : 'Live Road Map'}

            </h2>

            <p className="text-slate-400 mt-4 text-base leading-7 text-center">

              {language === 'hi'
                ? 'निकटवर्ती सड़क शिकायतों और खतरनाक क्षेत्रों की निगरानी करें।'
                : 'Monitor nearby road complaints and danger zones in realtime.'}

            </p>

          </div>

          <div className="flex justify-center">

            <button
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-2xl font-bold text-black"
            >

              {language === 'hi'
                ? 'खोलें'
                : 'Open'}

            </button>

          </div>

        </div>

        {/* CONTRACTOR DETAILS */}
        <div
          onClick={() => navigate('/contractors')}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 cursor-pointer hover:border-purple-500 hover:scale-105 transition shadow-2xl h-[250px] flex flex-col justify-between"
        >

          <div>

            <div className="text-4xl text-center mb-3">
              🏗️
            </div>

            <h2 className="text-2xl font-bold text-purple-400 text-center">

              {language === 'hi'
                ? 'ठेकेदार विवरण'
                : 'Contractor Details'}

            </h2>

            <p className="text-slate-400 mt-4 text-base leading-7 text-center">

              {language === 'hi'
                ? 'ठेकेदार विवरण, बजट पारदर्शिता, मरम्मत इतिहास और परियोजना प्रगति देखें।'
                : 'View contractor details, budget transparency, repair history and project progress.'}

            </p>

          </div>

          <div className="flex justify-center">

            <button
              className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-2xl font-bold"
            >

              {language === 'hi'
                ? 'खोलें'
                : 'Open'}

            </button>

          </div>

        </div>

      </div>

    </div>

  )

}