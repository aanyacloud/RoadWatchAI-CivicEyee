const language =
  localStorage.getItem("language") || "en";
import { useEffect, useState } from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap
} from 'react-leaflet'

import L from 'leaflet'

import { db } from '../firebase'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

// FIX LEAFLET DEFAULT ICONS
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

})

// AUTO RECENTER MAP
function RecenterMap({ location }) {

  const map = useMap()

  useEffect(() => {

    map.setView(location, 13)

  }, [location, map])

  return null

}

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

export default function RoadMap() {

  const [complaints, setComplaints] =
    useState([])

  const [userLocation, setUserLocation] =
    useState([22.0797, 82.1409])

  // GET USER LOCATION
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

          console.log(error)

        }

      )

    }

  }, [])

  // FIREBASE REALTIME
  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, 'complaints'),

      (snapshot) => {

        const data =
          snapshot.docs.map((doc) => ({

            id: doc.id,
            ...doc.data()

          }))

        setComplaints(data)

      },

      (error) => {

        console.log(error)

      }

    )

    return () => unsubscribe()

  }, [])

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <div className="px-8 pt-10 pb-6">

        <h1 className="text-5xl font-bold text-yellow-400">

  {language === "hi"
    ? "लाइव सड़क निगरानी मानचित्र"
    : "Live Road Monitoring Map"}

</h1>

<p className="text-slate-400 mt-4 text-lg">

  {language === "hi"
    ? "अपने आसपास की शिकायतों, गड्ढों और खतरनाक सड़क स्थितियों की वास्तविक समय में निगरानी करें।"
    : "Monitor nearby complaints, potholes, and dangerous road conditions in realtime."}

</p>

      </div>

      {/* STATS */}
      <div className="px-8 pb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold text-cyan-400">

  {language === "hi"
    ? "निकटवर्ती शिकायतें"
    : "Nearby Complaints"}

</h2>

            <p className="text-4xl font-bold mt-3">

              {complaints.length}

            </p>

          </div>

          <div className="text-right">

            <h2 className="text-2xl font-bold text-green-400">

  {language === "hi"
    ? "लाइव निगरानी सक्रिय"
    : "Live Monitoring Active"}

</h2>

<p className="text-slate-400 mt-3">

  {language === "hi"
    ? "आपके स्थान के आसपास सड़क स्थितियों की निगरानी की जा रही है"
    : "Tracking road conditions near your location"}

</p>

          </div>

        </div>

      </div>

      {/* MAP */}
      <div className="px-8 pb-16">

        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">

          <MapContainer
            center={userLocation}
            zoom={13}
            style={{
              height: '700px',
              width: '100%'
            }}
          >

            {/* TILE */}
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* RECENTER */}
            <RecenterMap
              location={userLocation}
            />

            {/* USER LOCATION */}
            <Marker position={userLocation}>

  <Tooltip permanent>

    {language === "hi"
      ? "आप यहाँ हैं"
      : "You are here"}

  </Tooltip>

  <Popup>

    📍 {language === "hi"
      ? "आप यहाँ हैं"
      : "You are here"}

  </Popup>

</Marker>

            {/* COMPLAINT MARKERS */}
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

                  <div className="w-72">

  {complaint.imageUrl && (

    <img
      src={complaint.imageUrl}
      alt="Road Complaint"
      className="w-full h-44 object-cover rounded-xl mb-4"
    />

  )}

  <h2 className="text-2xl font-bold mb-3">

    {language === "hi"

      ? complaint.severity === "Low"
        ? "कम गंभीरता"
        : complaint.severity === "Moderate"
        ? "मध्यम गंभीरता"
        : complaint.severity === "High"
        ? "उच्च गंभीरता"
        : "अज्ञात"

      : `${complaint.severity || "Unknown"} Severity`}

  </h2>

  <p className="text-sm mb-3">

    {complaint.description ||

      (language === "hi"
        ? "कोई विवरण उपलब्ध नहीं"
        : "No Description")}

  </p>

  <p className="text-sm text-gray-600 mb-2">

    📍 {complaint.location ||

      (language === "hi"
        ? "अज्ञात"
        : "Unknown")}

  </p>

  <p className="font-bold">

    {language === "hi"
      ? "स्थिति:"
      : "Status:"}

    <span className="ml-2 text-green-600">

      {language === "hi"

        ? complaint.status === "Resolved"
          ? "समाधान हो गया"
          : complaint.status === "In Progress"
          ? "कार्य प्रगति पर है"
          : complaint.status === "Pending"
          ? "लंबित"
          : complaint.status || "लंबित"

        : complaint.status || "Pending"}

    </span>

  </p>

</div>

                </Popup>

              </Marker>

            ))}

          </MapContainer>

        </div>

      </div>

    </div>

  )

}