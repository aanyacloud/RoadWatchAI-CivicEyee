import { useEffect, useState } from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet'

import L from 'leaflet'

import { FaGlobe } from 'react-icons/fa'

import { db } from '../firebase'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

// AUTO RECENTER MAP
function RecenterMap({ location }) {

  const map = useMap()

  useEffect(() => {

    map.setView(location, 13)

  }, [location, map])

  return null

}

// FIX LEAFLET ICONS
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

})

// SEVERITY ICONS
const greenIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

const yellowIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

const orangeIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

const redIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41]

})

export default function Home() {

  const navigate = useNavigate()

  const [complaints, setComplaints] =
    useState([])

  const [userLocation, setUserLocation] =
    useState([22.5726, 88.3639])

  const [isOnline, setIsOnline] =
    useState(navigator.onLine)

  const [language, setLanguage] =
    useState(
      localStorage.getItem('language') ||
      'en'
    )

  const [showLanguageMenu, setShowLanguageMenu] =
    useState(false)

  // SAVE LANGUAGE
  useEffect(() => {

    localStorage.setItem(
      'language',
      language
    )

  }, [language])

  // ONLINE OFFLINE
  useEffect(() => {

    const handleOnline = () =>
      setIsOnline(true)

    const handleOffline = () =>
      setIsOnline(false)

    window.addEventListener(
      'online',
      handleOnline
    )

    window.addEventListener(
      'offline',
      handleOffline
    )

    return () => {

      window.removeEventListener(
        'online',
        handleOnline
      )

      window.removeEventListener(
        'offline',
        handleOffline
      )

    }

  }, [])

  // TRANSLATIONS
const translations = {

  en: {

    title:
      'AI-Powered Road Transparency & Monitoring Platform',

    subtitle:
      'Monitor roads, report potholes, track complaints, and improve infrastructure accountability using AI.',

    citizen:
      'Citizen Portal',

    authority:
      'Authority Portal',

    citizenDesc:
      'Report road issues, monitor nearby road conditions, and track complaint progress in real time.',

    authorityDesc:
      'Monitor complaints, analyze severity, and resolve road infrastructure issues efficiently.',

    enterPortal:
      'Enter Portal',

    authorityAccess:
      'Authority Access',

    map:
      'Live Road Monitoring Map',

    total:
      'Total Complaints',

    online:
      'Online',

    offline:
      'Offline',

    report:
      'Report Issue'

  },

  hi: {

    title:
      'एआई आधारित सड़क पारदर्शिता और निगरानी प्लेटफॉर्म',

    subtitle:
      'सड़कों की निगरानी करें, गड्ढों की रिपोर्ट करें और शिकायतों को ट्रैक करें।',

    citizen:
      'नागरिक पोर्टल',

    authority:
      'प्राधिकरण पोर्टल',

    citizenDesc:
      'सड़क समस्याओं की रिपोर्ट करें, आसपास की सड़क स्थिति देखें और शिकायतों की प्रगति को ट्रैक करें।',

    authorityDesc:
      'शिकायतों की निगरानी करें, गंभीरता का विश्लेषण करें और सड़क अवसंरचना समस्याओं का समाधान करें।',

    enterPortal:
      'पोर्टल खोलें',

    authorityAccess:
      'प्राधिकरण प्रवेश',

    map:
      'लाइव रोड मॉनिटरिंग मैप',

    total:
      'कुल शिकायतें',

    online:
      'ऑनलाइन',

    offline:
      'ऑफलाइन',

    report:
      'रिपोर्ट करें'

  }

}
  const t = translations[language]

  // FIREBASE REALTIME
  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, 'complaints'),

      (snapshot) => {

        const complaintData =
          snapshot.docs.map((doc) => ({

            id: doc.id,

            ...doc.data()

          }))

        setComplaints(
          complaintData
        )

      }

    )

    return () => unsubscribe()

  }, [])

  // GEOLOCATION
  useEffect(() => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          setUserLocation([

            position.coords.latitude,

            position.coords.longitude

          ])

        }

      )

    }

  }, [])

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-green-400">

          RoadWatch

        </h1>

        <div className="flex items-center gap-4 relative">

          {/* ONLINE OFFLINE */}
          <div
            className={`px-4 py-2 rounded-full font-bold border ${
              isOnline
                ? 'bg-green-500/20 text-green-400 border-green-500'
                : 'bg-red-500/20 text-red-400 border-red-500'
            }`}
          >

            {isOnline
              ? `🟢 ${t.online}`
              : `🔴 ${t.offline}`}

          </div>

          {/* LANGUAGE BUTTON */}
          <button
            onClick={() =>
              setShowLanguageMenu(
                !showLanguageMenu
              )
            }
            className="bg-slate-800 hover:bg-slate-700 p-3 rounded-full transition"
          >

            <FaGlobe size={20} />

          </button>

          {/* LANGUAGE MENU */}
          {showLanguageMenu && (

            <div className="absolute top-16 right-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-[9999] min-w-[140px]">

              <button
                onClick={() => {

                  setLanguage('en')

                  setShowLanguageMenu(false)

                }}
                className="block px-6 py-3 hover:bg-slate-800 w-full text-left"
              >

                English

              </button>

              <button
                onClick={() => {

                  setLanguage('hi')

                  setShowLanguageMenu(false)

                }}
                className="block px-6 py-3 hover:bg-slate-800 w-full text-left"
              >

                हिंदी

              </button>

            </div>

          )}

          {/* REPORT BUTTON */}
          <Link to="/report">

            <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold transition">

              {t.report}

            </button>

          </Link>

        </div>

      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6">

        <h2 className="text-6xl font-bold max-w-5xl mx-auto leading-tight">

          {t.title}

        </h2>

        <p className="text-slate-300 text-lg mt-6 max-w-2xl mx-auto">

          {t.subtitle}

        </p>

      </section>

      {/* PORTAL CARDS */}
      <section className="px-8 pb-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* CITIZEN */}
          <div
            onClick={() =>
              navigate('/user-home')
            }
            className="bg-slate-900 border border-slate-800 rounded-3xl p-10 cursor-pointer hover:border-cyan-500 hover:scale-105 transition shadow-2xl"
          >

            <div className="text-7xl mb-8">

              👤

            </div>

            <h2 className="text-4xl font-bold text-cyan-400">

              {t.citizen}

            </h2>

            <p className="text-slate-400 mt-6 leading-8 text-lg">

  {t.citizenDesc}

</p>

<button
  className="mt-8 bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-2xl font-bold text-lg"
>

  {t.enterPortal}

</button>

          </div>

          {/* AUTHORITY */}
          <div
            onClick={() =>
              navigate('/authority-login')
            }
            className="bg-slate-900 border border-slate-800 rounded-3xl p-10 cursor-pointer hover:border-yellow-500 hover:scale-105 transition shadow-2xl"
          >

            <div className="text-7xl mb-8">

              🏛️

            </div>

            <h2 className="text-4xl font-bold text-yellow-400">

              {t.authority}

            </h2>

            <p className="text-slate-400 mt-6 leading-8 text-lg">

  {t.authorityDesc}

</p>

<button
  className="mt-8 bg-yellow-500 hover:bg-yellow-600 transition px-6 py-3 rounded-2xl font-bold text-lg text-black"
>

  {t.authorityAccess}

</button>

          </div>

        </div>

      </section>

      {/* MAP */}
      <section className="px-8 pb-20">

        <div className="flex justify-between items-center mb-8">

          <h3 className="text-4xl font-bold">

            {t.map}

          </h3>

          <div className="text-slate-300">

            {t.total}: {complaints.length}

          </div>

        </div>

        <div className="rounded-3xl overflow-hidden border border-slate-800">

          <MapContainer
            center={userLocation}
            zoom={13}
            style={{
              height: '600px',
              width: '100%'
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap
              location={userLocation}
            />

            {complaints.map((complaint) => (

              <Marker
                key={complaint.id}

                icon={
                  complaint.severity === 'Low'
                    ? greenIcon
                    : complaint.severity === 'Moderate'
                    ? yellowIcon
                    : complaint.severity === 'High'
                    ? orangeIcon
                    : redIcon
                }

                position={[
                  complaint.latitude ||
                    userLocation[0],

                  complaint.longitude ||
                    userLocation[1]
                ]}
              >

                <Popup>

                  <div className="w-64">

                    <img
                      src={complaint.imageUrl}
                      alt="Complaint"
                      className="w-full max-h-52 object-contain rounded-lg mb-3 bg-slate-100"
                    />

                    <h3 className="font-bold text-lg mb-2">

                      {complaint.severity} Severity

                    </h3>

                    <p className="text-sm mb-2">

                      {complaint.description}

                    </p>

                    <p className="text-xs text-gray-600">

                      📍 {complaint.location}

                    </p>

                  </div>

                </Popup>

              </Marker>

            ))}

          </MapContainer>

        </div>

      </section>

    </div>

  )

}