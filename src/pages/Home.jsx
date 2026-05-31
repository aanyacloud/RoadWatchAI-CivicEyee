import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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

// Auto Recenter Map
function RecenterMap({ location }) {

  const map = useMap()

  useEffect(() => {

    map.setView(location, 13)

  }, [location, map])

  return null
}

// Severity Icons

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

  const [complaints, setComplaints] = useState([])

  // Persistent Language
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  )

  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  // Save Language
  useEffect(() => {

    localStorage.setItem('language', language)

  }, [language])

  // User Location
  const [userLocation, setUserLocation] = useState([
    22.0797,
    82.1409
  ])

  // Translations
  const translations = {

    en: {
      title: 'AI-Powered Road Transparency & Monitoring Platform',
      subtitle:
        'Monitor roads, report potholes, track public spending, and improve infrastructure accountability using AI.',
      report: 'Report Issue',
      map: 'Live Road Monitoring Map',
      total: 'Total Complaints'
    },

    hi: {
      title: 'एआई आधारित सड़क पारदर्शिता और निगरानी प्लेटफॉर्म',
      subtitle:
        'सड़कों की निगरानी करें, गड्ढों की रिपोर्ट करें और सार्वजनिक खर्च को ट्रैक करें।',
      report: 'समस्या दर्ज करें',
      map: 'लाइव रोड मॉनिटरिंग मैप',
      total: 'कुल शिकायतें'
    }

  }

  const t = translations[language]

  // REALTIME Firebase Complaints
  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, 'complaints'),

      (snapshot) => {

        const complaintData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setComplaints(complaintData)

      },

      (error) => {

        console.error(error)

      }

    )

    return () => unsubscribe()

  }, [])

  // Detect User Location
  useEffect(() => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          setUserLocation([
            position.coords.latitude,
            position.coords.longitude
          ])

        },

        (error) => {

          console.error(error)

        }

      )

    }

  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-green-400">
          RoadWatch
        </h1>

        <div className="flex items-center gap-4 relative">

          {/* Language Button */}
          <button
            onClick={() =>
              setShowLanguageMenu(!showLanguageMenu)
            }
            className="bg-slate-800 hover:bg-slate-700 p-3 rounded-full transition"
          >
            <FaGlobe size={20} />
          </button>

          {/* Language Dropdown */}
          {showLanguageMenu && (

            <div className="absolute top-16 right-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-[9999] min-w-[140px]">

              <button
                onClick={() => {

                  localStorage.setItem('language', 'en')
                  setLanguage('en')

                  setShowLanguageMenu(false)

                }}
                className="block px-6 py-3 hover:bg-slate-800 w-full text-left"
              >
                English
              </button>

              <button
                onClick={() => {

                  localStorage.setItem('language', 'hi')
                  setLanguage('hi')

                  setShowLanguageMenu(false)

                }}
                className="block px-6 py-3 hover:bg-slate-800 w-full text-left"
              >
                हिंदी
              </button>

            </div>

          )}

          {/* Report Button */}
          <Link to="/report">

            <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold transition">
              {t.report}
            </button>

          </Link>

        </div>

      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6">

        <h2 className="text-6xl font-bold max-w-5xl mx-auto leading-tight">
          {t.title}
        </h2>

        <p className="text-slate-300 text-lg mt-6 max-w-2xl mx-auto">
          {t.subtitle}
        </p>

      </section>

      {/* Map Section */}
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
            style={{ height: '600px', width: '100%' }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Auto Recenter */}
            <RecenterMap location={userLocation} />

            {/* Complaint Markers */}
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
                  complaint.latitude || userLocation[0],
                  complaint.longitude || userLocation[1]
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